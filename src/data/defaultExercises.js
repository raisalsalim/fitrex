// Curated database of exercises with posture guides, form cues & demonstration videos
export const MUSCLE_GROUPS = [
  { id: 'chest', name: 'Chest', icon: 'Shield', color: '#38bdf8' },
  { id: 'back', name: 'Back', icon: 'Compass', color: '#10b981' },
  { id: 'shoulders', name: 'Shoulders', icon: 'Target', color: '#f59e0b' },
  { id: 'biceps', name: 'Biceps', icon: 'Flame', color: '#ec4899' },
  { id: 'triceps', name: 'Triceps', icon: 'Zap', color: '#8b5cf6' },
  { id: 'quads', name: 'Quads', icon: 'Activity', color: '#14b8a6' },
  { id: 'hamstrings', name: 'Hamstrings', icon: 'Anchor', color: '#f97316' },
  { id: 'glutes', name: 'Glutes', icon: 'Sparkles', color: '#fb7185' },
  { id: 'calves', name: 'Calves', icon: 'TrendingUp', color: '#84cc16' },
  { id: 'core', name: 'Abs & Core', icon: 'Crosshair', color: '#a855f7' },
  { id: 'forearms', name: 'Forearms', icon: 'Maximize2', color: '#06b6d4' },
  { id: 'cardio', name: 'Cardio / Full', icon: 'Heart', color: '#ef4444' }
];

export const DEFAULT_EXERCISES = [
  // CHEST
  {
    id: 'bench-press-barbell',
    name: 'Barbell Bench Press',
    muscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    youtubeUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    photoUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Retract and depress shoulder blades into the bench',
      'Maintain 5 points of contact: head, upper back, glutes, both feet flat on floor',
      'Lower bar with control to lower sternum; tuck elbows at ~45-60 degrees',
      'Press explosively driving through feet and chest'
    ],
    mistakes: ['Flaring elbows out at 90 degrees', 'Bouncing bar off ribcage', 'Lifting hips off bench']
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    muscle: 'chest',
    secondaryMuscles: ['shoulders', 'triceps'],
    youtubeUrl: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
    photoUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Set bench angle to 30° - 45°',
      'Keep wrist neutral and aligned directly over elbows',
      'Descend until dumbbells are slightly below chest level for deep stretch',
      'Press up in a gentle arc without clanking dumbbells together'
    ],
    mistakes: ['Setting bench angle too high (>45° becomes shoulder press)', 'Arching lower back excessively']
  },
  {
    id: 'cable-chest-flye',
    name: 'Cable Chest Flyes',
    muscle: 'chest',
    secondaryMuscles: ['shoulders'],
    youtubeUrl: 'https://www.youtube.com/watch?v=taI4XduLpBe',
    photoUrl: '',
    cues: [
      'Slight forward lean with staggered stance for stability',
      'Maintain slight, fixed bend in elbows throughout movement',
      'Squeeze pecs together at the center as if hugging a large tree',
      'Resist cable on eccentric for a 3-second stretch'
    ],
    mistakes: ['Turning flye into a pressing motion', 'Allowing shoulders to roll forward']
  },
  {
    id: 'chest-dips',
    name: 'Parallel Bar Dips',
    muscle: 'chest',
    secondaryMuscles: ['triceps', 'shoulders'],
    youtubeUrl: 'https://www.youtube.com/watch?v=2z8JmcrW-As',
    photoUrl: '',
    cues: [
      'Lean torso slightly forward to bias chest over triceps',
      'Lower until elbows reach a 90-degree angle',
      'Keep core braced and prevent swinging',
      'Push through palms to lockout'
    ],
    mistakes: ['Going excessively deep stressing shoulder capsule', 'Remaining fully upright (shifts focus to triceps)']
  },

  // BACK
  {
    id: 'deadlift-barbell',
    name: 'Conventional Barbell Deadlift',
    muscle: 'back',
    secondaryMuscles: ['hamstrings', 'glutes', 'forearms'],
    youtubeUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    photoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Barbell positioned over mid-foot with shins 1 inch away',
      'Hinge hips back, grip bar, pull slack out of the bar before lift-off',
      'Engage lats by squeezing armpits shut; brace core 360°',
      'Drive floor away through mid-foot and stand tall without hyperextending'
    ],
    mistakes: ['Rounding lumbar spine', 'Letting bar drift away from shins/thighs', 'Jerking bar off ground']
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    muscle: 'back',
    secondaryMuscles: ['biceps'],
    youtubeUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    photoUrl: '',
    cues: [
      'Grip slightly wider than shoulder width',
      'Slight lean back (~10-15°), drive elbows down toward your back pockets',
      'Touch bar to upper chest and squeeze lats for 1 second',
      'Slowly allow arms to fully extend up for full lat stretch'
    ],
    mistakes: ['Swinging torso excessively for momentum', 'Pulling bar behind neck']
  },
  {
    id: 'barbell-bent-row',
    name: 'Bent-Over Barbell Row',
    muscle: 'back',
    secondaryMuscles: ['biceps', 'shoulders'],
    youtubeUrl: 'https://www.youtube.com/watch?v=FWJR5Ve8gkQ',
    photoUrl: '',
    cues: [
      'Hinge at hips to ~45° or parallel, neutral spine',
      'Pull bar towards lower abdomen/belly button',
      'Drive elbows up and back, squeezing shoulder blades together',
      'Control the descent without dropping weight'
    ],
    mistakes: ['Standing too upright', 'Using leg drive to heave weight up']
  },
  {
    id: 'pull-ups',
    name: 'Pull-Ups / Chin-Ups',
    muscle: 'back',
    secondaryMuscles: ['biceps', 'core'],
    youtubeUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    photoUrl: '',
    cues: [
      'Start from a dead hang with lats engaged',
      'Drive elbows down to ribs until chin clears bar',
      'Keep core braced and legs slightly in front',
      'Lower under control to full dead hang'
    ],
    mistakes: ['Kicking legs or kipping', 'Cutting range of motion at bottom']
  },

  // SHOULDERS
  {
    id: 'overhead-press-barbell',
    name: 'Standing Overhead Press (OHP)',
    muscle: 'shoulders',
    secondaryMuscles: ['triceps', 'core'],
    youtubeUrl: 'https://www.youtube.com/watch?v=2yjwXTZQDDI',
    photoUrl: '',
    cues: [
      'Grip bar just outside shoulders, resting bar on front delts/collarbone',
      'Squeeze glutes and quads tight to create rigid base',
      'Tilt head back slightly to clear chin, press bar straight up vertically',
      'Once bar clears head, push head through and lock out with shrug at top'
    ],
    mistakes: ['Arching lower back into standing bench press', 'Pressing bar forward in an arc']
  },
  {
    id: 'dumbbell-lateral-raise',
    name: 'Dumbbell Lateral Raise',
    muscle: 'shoulders',
    secondaryMuscles: [],
    youtubeUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    photoUrl: '',
    cues: [
      'Slight forward torso lean (~10°)',
      'Raise dumbbells out in the scapular plane (~30° forward of body)',
      'Lead with elbows, keeping hands level or slightly lower than elbows',
      'Pause at shoulder height and lower slowly'
    ],
    mistakes: ['Shrugging traps up to ears', 'Swinging hips to lift heavy dumbbells']
  },
  {
    id: 'face-pull',
    name: 'Cable Face Pull',
    muscle: 'shoulders',
    secondaryMuscles: ['back'],
    youtubeUrl: 'https://www.youtube.com/watch?v=rep-qVOkqgk',
    photoUrl: '',
    cues: [
      'Attach rope at eye level; grip with thumbs pointed backward',
      'Pull rope towards nose/forehead while externally rotating shoulders',
      'End position should look like a double bicep pose with elbows high and back',
      'Hold 1 second to strengthen rear delts and rotator cuff'
    ],
    mistakes: ['Pulling downwards like a row', 'Using too heavy weight with poor rotation']
  },

  // BICEPS
  {
    id: 'barbell-bicep-curl',
    name: 'Barbell Bicep Curl',
    muscle: 'biceps',
    secondaryMuscles: ['forearms'],
    youtubeUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    photoUrl: '',
    cues: [
      'Stand upright, shoulder-width grip on bar',
      'Pin elbows to ribs; only forearms should move',
      'Curl bar up focusing on peak bicep contraction at top',
      'Lower smoothly through full extension'
    ],
    mistakes: ['Swinging torso back and forth', 'Letting elbows drift forward excessively']
  },
  {
    id: 'dumbbell-hammer-curl',
    name: 'Dumbbell Hammer Curl',
    muscle: 'biceps',
    secondaryMuscles: ['forearms'],
    youtubeUrl: 'https://www.youtube.com/watch?v=zC3nLlEvin4',
    photoUrl: '',
    cues: [
      'Hold dumbbells with neutral grip (palms facing each other)',
      'Curl dumbbells up while keeping wrists locked neutral',
      'Squeeze brachialis and forearm at peak',
      'Lower controlled for 2-3 seconds'
    ],
    mistakes: ['Rotating wrists into supination mid-movement']
  },

  // TRICEPS
  {
    id: 'tricep-rope-pushdown',
    name: 'Tricep Rope Pushdown',
    muscle: 'triceps',
    secondaryMuscles: [],
    youtubeUrl: 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
    photoUrl: '',
    cues: [
      'Hips hinged slightly back, elbows tucked close to sides',
      'Push down extending arms completely',
      'Spread rope handles apart at bottom for peak contraction',
      'Control return allowing forearms to come just past 90 degrees'
    ],
    mistakes: ['Allowing elbows to flare outward or swing forward']
  },
  {
    id: 'skull-crushers',
    name: 'Lying Triceps Extension (Skull Crushers)',
    muscle: 'triceps',
    secondaryMuscles: [],
    youtubeUrl: 'https://www.youtube.com/watch?v=d_KZxkY_0cM',
    photoUrl: '',
    cues: [
      'Lie on bench holding EZ-curl bar with arms angled back ~10°',
      'Bend at elbows lowering bar towards forehead or crown of head',
      'Keep upper arms stationary throughout',
      'Extend forearms back up to starting position'
    ],
    mistakes: ['Moving upper arms back and forth turning it into a pullover']
  },

  // QUADS
  {
    id: 'barbell-back-squat',
    name: 'Barbell Back Squat',
    muscle: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings', 'core'],
    youtubeUrl: 'https://www.youtube.com/watch?v=bEv6CCg2BC8',
    photoUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
    cues: [
      'Rest bar securely on traps (high bar) or rear delts (low bar)',
      'Feet shoulder-width apart, toes angled out 15-30 degrees',
      'Brace core, descend by breaking at hips and knees simultaneously',
      'Squat to parallel or below while keeping knees tracking over toes',
      'Drive through whole foot to stand back up'
    ],
    mistakes: ['Knees caving inward (valgus collapse)', 'Heels lifting off ground', 'Lumbar rounding (butt wink)']
  },
  {
    id: 'leg-press-machine',
    name: 'Leg Press',
    muscle: 'quads',
    secondaryMuscles: ['glutes'],
    youtubeUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    photoUrl: '',
    cues: [
      'Sit fully with back and glutes pressed firmly against seat pads',
      'Feet placed shoulder-width in center of platform',
      'Lower sled until knees reach 90 degrees without lower back curling',
      'Press sled up without forcefully hyperextending/locking knees'
    ],
    mistakes: ['Locking knees abruptly at top', 'Letting lower back lift off backrest']
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    muscle: 'quads',
    secondaryMuscles: ['glutes', 'hamstrings'],
    youtubeUrl: 'https://www.youtube.com/watch?v=2C-uNgKwPLE',
    photoUrl: '',
    cues: [
      'Rear foot elevated on bench behind you',
      'Front foot positioned so front shin is roughly vertical at bottom',
      'Descend straight down until back knee hovers just above ground',
      'Drive through front heel and mid-foot to stand up'
    ],
    mistakes: ['Front foot placed too close to bench jamming knee forward']
  },

  // HAMSTRINGS
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift (RDL)',
    muscle: 'hamstrings',
    secondaryMuscles: ['glutes', 'back'],
    youtubeUrl: 'https://www.youtube.com/watch?v=JCXUYuzwNrM',
    photoUrl: '',
    cues: [
      'Feet hip-width apart, soft bend in knees (knees stay fixed in this angle)',
      'Push hips straight backward towards wall behind you',
      'Keep bar skimming down thighs and shins with tight lats',
      'Lower until deep hamstring stretch is felt, then squeeze glutes to stand'
    ],
    mistakes: ['Bending knees like a squat', 'Rounding lower back to reach floor']
  },
  {
    id: 'lying-leg-curl',
    name: 'Lying Leg Curl',
    muscle: 'hamstrings',
    secondaryMuscles: ['calves'],
    youtubeUrl: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs',
    photoUrl: '',
    cues: [
      'Pad rests just below calves on lower Achilles tendon',
      'Keep hips pressed flat into bench throughout movement',
      'Curl heels toward glutes and hold peak contraction 1 second',
      'Slow eccentric descent under control'
    ],
    mistakes: ['Arching back and lifting hips off bench to cheat weight up']
  },

  // GLUTES
  {
    id: 'barbell-hip-thrust',
    name: 'Barbell Hip Thrust',
    muscle: 'glutes',
    secondaryMuscles: ['hamstrings'],
    youtubeUrl: 'https://www.youtube.com/watch?v=xDmFkJxPzeM',
    photoUrl: '',
    cues: [
      'Upper back braced securely across bench at scapula level',
      'Barbell cushioned over hip crease with feet flat on floor',
      'Drive through heels, extending hips until thighs and torso form straight line',
      'Keep chin tucked looking forward to prevent hyperextending lower back'
    ],
    mistakes: ['Looking up at ceiling hyperextending lumbar spine', 'Feet placed too far out (shifts to hamstrings)']
  },

  // CALVES
  {
    id: 'standing-calf-raise',
    name: 'Standing Calf Raise',
    muscle: 'calves',
    secondaryMuscles: [],
    youtubeUrl: 'https://www.youtube.com/watch?v=-M4-G8p8fmc',
    photoUrl: '',
    cues: [
      'Balls of feet on edge of platform, heels hanging off',
      'Lower heels for a deep 2-second stretch at bottom',
      'Explode onto big toes and hold top contraction for 1 second',
      'Maintain straight knees without bending at knees to bounce'
    ],
    mistakes: ['Bouncing fast without pausing at stretch and contraction']
  },

  // CORE / ABS
  {
    id: 'hanging-leg-raise',
    name: 'Hanging Leg / Knee Raise',
    muscle: 'core',
    secondaryMuscles: ['forearms'],
    youtubeUrl: 'https://www.youtube.com/watch?v=Pr1ieGZ5atk',
    photoUrl: '',
    cues: [
      'Hang from bar with active shoulders',
      'Curl pelvis up toward chest rather than just swinging legs',
      'Pause for half-second at top of repetition',
      'Lower legs slowly without creating swinging pendulum momentum'
    ],
    mistakes: ['Swinging torso and legs with momentum']
  },
  {
    id: 'ab-wheel-rollout',
    name: 'Ab Wheel Rollout',
    muscle: 'core',
    secondaryMuscles: ['shoulders', 'back'],
    youtubeUrl: 'https://www.youtube.com/watch?v=rqiTPdK1cWg',
    photoUrl: '',
    cues: [
      'Kneel on mat with wheel directly beneath shoulders',
      'Round upper back slightly and tuck pelvis in posterior pelvic tilt',
      'Roll wheel forward while keeping core braced rigid',
      'Pull back through abs to return to starting position'
    ],
    mistakes: ['Letting hips sag down and arching lower back']
  },

  // FOREARMS
  {
    id: 'wrist-curl-seated',
    name: 'Seated Barbell Wrist Curl',
    muscle: 'forearms',
    secondaryMuscles: [],
    youtubeUrl: 'https://www.youtube.com/watch?v=3VkWz_h_JOU',
    photoUrl: '',
    cues: [
      'Forearms resting flat on thighs or bench with wrists hanging off edge',
      'Lower bar slowly allowing it to roll into fingers for full extension',
      'Curl bar up using wrists and squeeze forearms at top'
    ],
    mistakes: ['Lifting forearms off legs']
  },

  // CARDIO / FULL BODY
  {
    id: 'treadmill-incline-walk',
    name: 'Incline Treadmill Walk',
    muscle: 'cardio',
    secondaryMuscles: ['calves', 'glutes'],
    youtubeUrl: 'https://www.youtube.com/watch?v=F3-9rR3yT78',
    photoUrl: '',
    cues: [
      'Set incline to 10% - 15% and speed to 4.5 - 5.5 km/h',
      'Walk without holding onto handrails for maximum caloric burn & core engagement',
      'Maintain upright posture, driving through feet'
    ],
    mistakes: ['Holding onto top handles and leaning back (cancels the incline angle)']
  }
];
