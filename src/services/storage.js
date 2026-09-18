// Fitrex Storage Service - Local-First + Multi-Profile + GitHub Gist Sync + PIN Protection
import { DEFAULT_EXERCISES } from '../data/defaultExercises';

const STORAGE_KEYS = {
  PROFILES: 'fitrex_profiles',
  ACTIVE_PROFILE: 'fitrex_active_profile',
  AUTH_SESSION: 'fitrex_auth_session',     // Profile ID that is currently authenticated
  IS_LOCKED: 'fitrex_is_locked',           // 'true' when user manually clicks lock
  PIN_CONFIG: 'fitrex_pin_config',
  GIST_CONFIG: 'fitrex_gist_config',
  SETTINGS: 'fitrex_settings',
  CUSTOM_EXERCISES: 'fitrex_custom_exercises',
  WORKOUTS_PREFIX: 'fitrex_workouts_',
  BODY_PREFIX: 'fitrex_body_'
};

// Safe JSON parser
function safeParse(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

// Simple deterministic hash for PIN
export function hashPin(pin) {
  if (!pin) return '';
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'fx_' + Math.abs(hash).toString(36);
}

// ----------------- PROFILES & AUTHENTICATED SESSIONS -----------------
// Returns only user-created profiles (NO hardcoded fake names)
export function getProfiles() {
  return safeParse(STORAGE_KEYS.PROFILES, []);
}

export function saveProfiles(profiles) {
  safeSet(STORAGE_KEYS.PROFILES, profiles);
}

export function getActiveProfileId() {
  const active = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE);
  if (active) return active;
  const profiles = getProfiles();
  if (profiles.length > 0) {
    const def = profiles[0].id;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE, def);
    return def;
  }
  return null;
}

export function setActiveProfileId(id) {
  if (id) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE, id);
  } else {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_PROFILE);
  }
}

export function getActiveProfile() {
  const id = getActiveProfileId();
  const profiles = getProfiles();
  if (!id && profiles.length > 0) return profiles[0];
  return profiles.find(p => p.id === id) || null;
}

export function getProfileById(id) {
  const profiles = getProfiles();
  return profiles.find(p => p.id === id) || null;
}

// Session authentication persistence across mobile screen lock & browser refreshes
export function getAuthenticatedProfileId() {
  const auth = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
  if (auth) return auth;
  const profiles = getProfiles();
  if (profiles.length > 0) {
    const active = getActiveProfileId() || profiles[0].id;
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, active);
    return active;
  }
  return null;
}

export function isAppLocked() {
  const profiles = getProfiles();
  // If no profiles exist at all, prompt for initial onboarding/creation
  if (profiles.length === 0) return true;
  // If user explicitly clicked the Lock button in navbar
  return localStorage.getItem(STORAGE_KEYS.IS_LOCKED) === 'true';
}

export function unlockSession(profileId) {
  if (profileId) {
    setActiveProfileId(profileId);
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, profileId);
  }
  localStorage.setItem(STORAGE_KEYS.IS_LOCKED, 'false');
}

export function lockSession() {
  localStorage.setItem(STORAGE_KEYS.IS_LOCKED, 'true');
}

// Register or Login Profile with User-specified Name & PIN
export function loginOrRegisterProfile({ name, pin, color = '#ef4444' }) {
  const profiles = getProfiles();
  const trimmedName = (name || '').trim();
  const pinHash = pin ? hashPin(pin) : '';

  let target = profiles.find(p => p.name.toLowerCase() === trimmedName.toLowerCase());
  let updatedProfiles = [...profiles];

  if (target) {
    // Update existing profile PIN if entered
    if (pinHash) {
      target = { ...target, pinHash };
      updatedProfiles = updatedProfiles.map(p => p.id === target.id ? target : p);
    }
  } else {
    // Create new profile with user's specific name
    target = {
      id: 'profile_' + Date.now(),
      name: trimmedName,
      pinHash,
      color,
      avatar: trimmedName.charAt(0).toUpperCase(),
      isDefault: profiles.length === 0,
      createdAt: Date.now()
    };
    updatedProfiles.push(target);
  }

  saveProfiles(updatedProfiles);
  if (pinHash) {
    savePinConfig({
      enabled: true,
      pinHash,
      recoveryPhrase: 'fitrex',
      timeoutMinutes: 15
    });
  }

  unlockSession(target.id);
  triggerAutoGistSync();
  return target;
}

// Verify PIN for a specific profile
export function verifyProfilePin(profileId, enteredPin) {
  const profile = getProfileById(profileId);
  const globalConfig = getPinConfig();
  const expectedHash = profile?.pinHash || globalConfig.pinHash;

  if (!expectedHash) {
    unlockSession(profileId);
    return true;
  }

  if (hashPin(enteredPin) === expectedHash) {
    unlockSession(profileId);
    return true;
  }
  return false;
}

// ----------------- WORKOUTS -----------------
export function getWorkouts(profileId = getActiveProfileId()) {
  if (!profileId) return [];
  return safeParse(`${STORAGE_KEYS.WORKOUTS_PREFIX}${profileId}`, []);
}

export function saveWorkout(workout, profileId = getActiveProfileId()) {
  if (!profileId) return [];
  const workouts = getWorkouts(profileId);
  const existingIdx = workouts.findIndex(w => w.id === workout.id);
  
  if (existingIdx >= 0) {
    workouts[existingIdx] = { ...workout, updatedAt: Date.now() };
  } else {
    workouts.unshift({ ...workout, createdAt: Date.now(), updatedAt: Date.now() });
  }
  
  safeSet(`${STORAGE_KEYS.WORKOUTS_PREFIX}${profileId}`, workouts);
  triggerAutoGistSync();
  return workouts;
}

export function deleteWorkout(workoutId, profileId = getActiveProfileId()) {
  if (!profileId) return [];
  let workouts = getWorkouts(profileId);
  workouts = workouts.filter(w => w.id !== workoutId);
  safeSet(`${STORAGE_KEYS.WORKOUTS_PREFIX}${profileId}`, workouts);
  triggerAutoGistSync();
  return workouts;
}

// Calculate previous performance for an exercise
export function getPreviousPerformance(exerciseName, currentWorkoutId = null, profileId = getActiveProfileId()) {
  if (!profileId) return null;
  const workouts = getWorkouts(profileId);
  for (const workout of workouts) {
    if (workout.id === currentWorkoutId) continue;
    const match = workout.exercises?.find(e => e.name.toLowerCase() === exerciseName.toLowerCase());
    if (match && match.sets && match.sets.length > 0) {
      const completedSets = match.sets.filter(s => s.completed);
      if (completedSets.length > 0) {
        const best = completedSets.reduce((max, s) => (Number(s.weight) > Number(max.weight) ? s : max), completedSets[0]);
        return {
          weight: best.weight,
          reps: best.reps,
          weightUnit: best.weightUnit || match.weightUnit || 'kg',
          date: workout.date
        };
      }
    }
  }
  return null;
}

// Calculate PRs for a profile
export function getPersonalRecords(profileId = getActiveProfileId()) {
  if (!profileId) return {};
  const workouts = getWorkouts(profileId);
  const prMap = {};

  workouts.forEach(workout => {
    (workout.exercises || []).forEach(ex => {
      const name = ex.name;
      if (!prMap[name]) {
        prMap[name] = { maxWeight: 0, maxVolume: 0, best1RM: 0, date: workout.date, unit: ex.weightUnit || 'kg' };
      }
      (ex.sets || []).forEach(set => {
        if (!set.completed) return;
        const w = Number(set.weight) || 0;
        const r = Number(set.reps) || 0;
        const setUnit = set.weightUnit || ex.weightUnit || 'kg';
        if (w <= 0 || r <= 0) return;

        const est1RM = Math.round(w * (1 + r / 30));
        const volume = w * r;

        if (w > prMap[name].maxWeight) {
          prMap[name].maxWeight = w;
          prMap[name].date = workout.date;
          prMap[name].unit = setUnit;
        }
        if (est1RM > prMap[name].best1RM) {
          prMap[name].best1RM = est1RM;
        }
        if (volume > prMap[name].maxVolume) {
          prMap[name].maxVolume = volume;
        }
      });
    });
  });

  return prMap;
}

// ----------------- BODY METRICS -----------------
export function getBodyMetrics(profileId = getActiveProfileId()) {
  if (!profileId) return [];
  return safeParse(`${STORAGE_KEYS.BODY_PREFIX}${profileId}`, []);
}

export function saveBodyMetric(metric, profileId = getActiveProfileId()) {
  if (!profileId) return [];
  const metrics = getBodyMetrics(profileId);
  const existingIdx = metrics.findIndex(m => m.id === metric.id);
  
  if (existingIdx >= 0) {
    metrics[existingIdx] = { ...metric, updatedAt: Date.now() };
  } else {
    metrics.push({ ...metric, id: metric.id || 'bm_' + Date.now(), createdAt: Date.now(), updatedAt: Date.now() });
  }
  
  safeSet(`${STORAGE_KEYS.BODY_PREFIX}${profileId}`, metrics);
  triggerAutoGistSync();
  return metrics;
}

export function deleteBodyMetric(metricId, profileId = getActiveProfileId()) {
  if (!profileId) return [];
  let metrics = getBodyMetrics(profileId);
  metrics = metrics.filter(m => m.id !== metricId);
  safeSet(`${STORAGE_KEYS.BODY_PREFIX}${profileId}`, metrics);
  triggerAutoGistSync();
  return metrics;
}

// ----------------- CUSTOM EXERCISES -----------------
export function getCustomExercises() {
  return safeParse(STORAGE_KEYS.CUSTOM_EXERCISES, []);
}

export function saveCustomExercise(exercise) {
  const customs = getCustomExercises();
  const id = exercise.id || 'custom_' + Date.now();
  const newEx = { ...exercise, id, isCustom: true };
  customs.push(newEx);
  safeSet(STORAGE_KEYS.CUSTOM_EXERCISES, customs);
  triggerAutoGistSync();
  return newEx;
}

export function getAllExercises() {
  const customs = getCustomExercises();
  return [...DEFAULT_EXERCISES, ...customs];
}

// ----------------- SECURITY PIN -----------------
export function getPinConfig() {
  return safeParse(STORAGE_KEYS.PIN_CONFIG, {
    enabled: false,
    pinHash: '',
    recoveryPhrase: 'fitrex',
    timeoutMinutes: 15
  });
}

export function savePinConfig(config) {
  safeSet(STORAGE_KEYS.PIN_CONFIG, config);
}

// ----------------- SETTINGS -----------------
export function getSettings() {
  return safeParse(STORAGE_KEYS.SETTINGS, {
    unit: 'kg',
    restSeconds: 90,
    soundEnabled: true,
    vibrateEnabled: true,
    autoTimerOnComplete: true
  });
}

export function saveSettings(settings) {
  safeSet(STORAGE_KEYS.SETTINGS, settings);
}

// ----------------- GITHUB GIST SYNC (100% Free) -----------------
export function getGistConfig() {
  return safeParse(STORAGE_KEYS.GIST_CONFIG, {
    token: '',
    gistId: '',
    autoSync: true,
    lastSyncedAt: null,
    syncStatus: 'idle'
  });
}

export function saveGistConfig(config) {
  safeSet(STORAGE_KEYS.GIST_CONFIG, config);
}

// Prepare export package of all local data
export function exportAllDataPackage() {
  const profiles = getProfiles();
  const allData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    profiles,
    activeProfileId: getActiveProfileId(),
    settings: getSettings(),
    customExercises: getCustomExercises(),
    workoutsByProfile: {},
    bodyMetricsByProfile: {}
  };

  profiles.forEach(p => {
    allData.workoutsByProfile[p.id] = getWorkouts(p.id);
    allData.bodyMetricsByProfile[p.id] = getBodyMetrics(p.id);
  });

  return allData;
}

// Import data package and merge
export function importDataPackage(pkg) {
  if (!pkg) {
    throw new Error('Invalid Fitrex backup format');
  }

  // Smartly merge profiles so local user profiles are NEVER overwritten by empty cloud backups
  const existingProfiles = getProfiles();
  const incomingProfiles = Array.isArray(pkg.profiles) ? pkg.profiles : [];
  const mergedProfilesMap = new Map();

  existingProfiles.forEach(p => {
    if (p && p.id) mergedProfilesMap.set(p.id, p);
  });

  incomingProfiles.forEach(p => {
    if (p && p.id) {
      const current = mergedProfilesMap.get(p.id);
      if (!current) {
        mergedProfilesMap.set(p.id, p);
      } else {
        mergedProfilesMap.set(p.id, {
          ...p,
          pinHash: p.pinHash || current.pinHash,
          name: p.name || current.name
        });
      }
    }
  });

  const finalProfiles = Array.from(mergedProfilesMap.values());
  if (finalProfiles.length > 0) {
    saveProfiles(finalProfiles);
  }
  if (pkg.activeProfileId) setActiveProfileId(pkg.activeProfileId);
  if (pkg.settings) saveSettings(pkg.settings);
  if (pkg.customExercises) safeSet(STORAGE_KEYS.CUSTOM_EXERCISES, pkg.customExercises);

  Object.keys(pkg.workoutsByProfile || {}).forEach(pid => {
    const existing = getWorkouts(pid);
    const incoming = pkg.workoutsByProfile[pid] || [];
    const mergedMap = new Map();
    existing.forEach(w => mergedMap.set(w.id, w));
    incoming.forEach(w => {
      const current = mergedMap.get(w.id);
      if (!current || (w.updatedAt || 0) >= (current.updatedAt || 0)) {
        mergedMap.set(w.id, w);
      }
    });
    safeSet(`${STORAGE_KEYS.WORKOUTS_PREFIX}${pid}`, Array.from(mergedMap.values()));
  });

  Object.keys(pkg.bodyMetricsByProfile || {}).forEach(pid => {
    const existing = getBodyMetrics(pid);
    const incoming = pkg.bodyMetricsByProfile[pid] || [];
    const mergedMap = new Map();
    existing.forEach(m => mergedMap.set(m.id, m));
    incoming.forEach(m => {
      const current = mergedMap.get(m.id);
      if (!current || (m.updatedAt || 0) >= (current.updatedAt || 0)) {
        mergedMap.set(m.id, m);
      }
    });
    safeSet(`${STORAGE_KEYS.BODY_PREFIX}${pid}`, Array.from(mergedMap.values()));
  });

  return true;
}

// Sync with GitHub Gist
export async function syncWithGist(forcePush = false) {
  const config = getGistConfig();
  if (!config.token) {
    return { success: false, message: 'No GitHub Personal Access Token configured' };
  }

  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `Bearer ${config.token}`,
      'Content-Type': 'application/json'
    };

    let gistId = config.gistId;

    if (!gistId) {
      const listRes = await fetch('https://api.github.com/gists', { headers });
      if (!listRes.ok) {
        throw new Error(`GitHub auth failed (${listRes.status}): verify token has 'gist' scope`);
      }
      const gists = await listRes.json();
      const existingFitrexGist = gists.find(g => g.files && g.files['fitrex_data.json']);

      if (existingFitrexGist) {
        gistId = existingFitrexGist.id;
      } else {
        const localData = exportAllDataPackage();
        const createRes = await fetch('https://api.github.com/gists', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            description: 'Fitrex Workout & Progress Data (Private Sync)',
            public: false,
            files: {
              'fitrex_data.json': {
                content: JSON.stringify(localData, null, 2)
              }
            }
          })
        });

        if (!createRes.ok) throw new Error(`Could not create Gist: ${createRes.status}`);
        const createdGist = await createRes.json();
        gistId = createdGist.id;
      }

      config.gistId = gistId;
      saveGistConfig(config);
    }

    const getRes = await fetch(`https://api.github.com/gists/${gistId}`, { headers });
    if (!getRes.ok) throw new Error(`Failed to read Gist: ${getRes.status}`);
    const gist = await getRes.json();
    const file = gist.files && gist.files['fitrex_data.json'];

    if (file && file.content && !forcePush) {
      try {
        const remoteData = JSON.parse(file.content);
        importDataPackage(remoteData);
      } catch (err) {
        console.warn('Gist file content parse issue:', err);
      }
    }

    const updatedLocalData = exportAllDataPackage();
    const patchRes = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        description: 'Fitrex Workout & Progress Data (Private Sync)',
        files: {
          'fitrex_data.json': {
            content: JSON.stringify(updatedLocalData, null, 2)
          }
        }
      })
    });

    if (!patchRes.ok) throw new Error(`Failed to push to Gist: ${patchRes.status}`);

    config.lastSyncedAt = Date.now();
    config.syncStatus = 'success';
    saveGistConfig(config);

    return { success: true, gistId, syncedAt: config.lastSyncedAt };
  } catch (err) {
    console.error('Gist sync error:', err);
    config.syncStatus = 'error';
    saveGistConfig(config);
    return { success: false, message: err.message };
  }
}

let syncDebounceTimer = null;
export function triggerAutoGistSync() {
  const config = getGistConfig();
  if (!config.token || !config.autoSync) return;

  if (syncDebounceTimer) clearTimeout(syncDebounceTimer);
  syncDebounceTimer = setTimeout(() => {
    syncWithGist().catch(e => console.log('Auto sync error:', e));
  }, 3000);
}

// ----------------- WORKOUT TEMPLATES -----------------
export const DEFAULT_TEMPLATES = [
  {
    id: 'tpl_shoulder',
    name: 'Shoulder',
    muscleCategory: 'shoulders',
    icon: 'Target',
    exercises: [
      'Shoulder Press (Dumbbell Overhead)',
      'Lateral Rise (Raise)',
      'Reverse Flys (Rear Delts)',
      'Shrugs (Dumbbell or Barbell)'
    ]
  },
  {
    id: 'tpl_leg',
    name: 'Leg',
    muscleCategory: 'legs',
    icon: 'Activity',
    exercises: [
      'Normal Squat with Dumbbell (Goblet Squat)',
      'Leg Extension (Machine)',
      'Lunges (Walking or Stationary DB)',
      'Calves Rise (Standing or Seated)'
    ]
  },
  {
    id: 'tpl_wings',
    name: 'Wings',
    muscleCategory: 'wings',
    icon: 'Compass',
    exercises: [
      'Lat Pull Down',
      'Seated Row (Cable)',
      'RDL (Romanian Deadlift)',
      'Barbell Row (Bent-over)'
    ]
  },
  {
    id: 'tpl_biceps',
    name: 'Biceps',
    muscleCategory: 'biceps',
    icon: 'Flame',
    exercises: [
      'Stick Biceps Curl (Straight Bar)',
      'Alternate Hammer Curl - DB',
      'Wide Grip Z-Bar Curl'
    ]
  },
  {
    id: 'tpl_chest',
    name: 'Chest',
    muscleCategory: 'chest',
    icon: 'Shield',
    exercises: [
      'Flat Dumbbell Press',
      'Incline DB Press',
      'Pec Fly Machine'
    ]
  },
  {
    id: 'tpl_triceps',
    name: 'Triceps',
    muscleCategory: 'triceps',
    icon: 'Zap',
    exercises: [
      'Rope Push Down',
      'Over Head DB Extension (Single Hand)',
      'Db Kick Back'
    ]
  },
  {
    id: 'tpl_chest_triceps_cardio',
    name: 'Chest & Triceps Cardio',
    muscleCategory: 'cardio',
    icon: 'Sparkles',
    exercises: [
      'Pushups (Normal or Knee)'
    ]
  }
];

export function getWorkoutTemplates() {
  const saved = safeParse('fitrex_workout_templates', null);
  if (saved && Array.isArray(saved) && saved.length > 0) {
    // Update tpl_chest_triceps_cardio if it still has multiple exercises or wrong category
    const idx = saved.findIndex(t => t.id === 'tpl_chest_triceps_cardio');
    if (idx >= 0 && (saved[idx].exercises.length > 1 || saved[idx].muscleCategory !== 'cardio')) {
      saved[idx] = {
        ...saved[idx],
        muscleCategory: 'cardio',
        exercises: ['Pushups (Normal or Knee)']
      };
      safeSet('fitrex_workout_templates', saved);
    }
    return saved;
  }
  // Default seed
  safeSet('fitrex_workout_templates', DEFAULT_TEMPLATES);
  return DEFAULT_TEMPLATES;
}

export function saveWorkoutTemplates(templates) {
  safeSet('fitrex_workout_templates', templates);
  triggerAutoGistSync();
}

export function saveWorkoutTemplate(template) {
  const templates = getWorkoutTemplates();
  const existingIdx = templates.findIndex(t => t.id === template.id);
  let updated;
  if (existingIdx >= 0) {
    updated = [...templates];
    updated[existingIdx] = { ...template, updatedAt: Date.now() };
  } else {
    const newTpl = {
      ...template,
      id: template.id || 'tpl_' + Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    updated = [...templates, newTpl];
  }
  saveWorkoutTemplates(updated);
  return updated;
}

export function deleteWorkoutTemplate(templateId) {
  const templates = getWorkoutTemplates();
  const filtered = templates.filter(t => t.id !== templateId);
  saveWorkoutTemplates(filtered);
  return filtered;
}

export function resetWorkoutTemplatesToDefault() {
  saveWorkoutTemplates(DEFAULT_TEMPLATES);
  return DEFAULT_TEMPLATES;
}
