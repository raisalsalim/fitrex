import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Check, Trash2, Calendar, Play, Pause, Video, Dumbbell, 
  ChevronLeft, ChevronRight, Search, X, Flame, ShieldAlert, SlidersHorizontal, Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MUSCLE_GROUPS, EQUIPMENT_LIST } from '../data/defaultExercises';
import { 
  getWorkouts, saveWorkout, getPreviousPerformance, 
  getAllExercises, getSettings, getPersonalRecords, getActiveProfileId 
} from '../services/storage';
import PostureModal from './PostureModal';
import WorkoutHero from './WorkoutHero';

export default function WorkoutLogger({ onTriggerTimer, activeProfileId }) {
  const settings = getSettings();
  const unit = settings.unit || 'kg';

  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [selectedMuscles, setSelectedMuscles] = useState(['chest']);
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerFilter, setPickerFilter] = useState('all');
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [pickerSearch, setPickerSearch] = useState('');
  const [personalRecords, setPersonalRecords] = useState({});

  // Local ticker to re-render set timers every second
  const [, setTick] = useState(0);

  // Sync / Load workout when date or profile changes
  useEffect(() => {
    const workouts = getWorkouts(activeProfileId);
    let todayWorkout = workouts.find(w => w.date === selectedDate);
    
    if (!todayWorkout) {
      todayWorkout = {
        id: 'workout_' + selectedDate + '_' + (activeProfileId || 'def'),
        date: selectedDate,
        targetMuscles: ['chest'],
        exercises: [],
        notes: '',
        isCompleted: false,
        durationMinutes: 0
      };
    }
    setCurrentWorkout(todayWorkout);
    setSelectedMuscles(todayWorkout.targetMuscles || ['chest']);
    setPersonalRecords(getPersonalRecords(activeProfileId));
  }, [selectedDate, activeProfileId]);

  // Interval ticker that keeps UI timers accurate and handles phone wakeup
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        setTick(t => t + 1);
      }
    };
    window.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);

    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, []);

  const changeDate = (offsetDays) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offsetDays);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const getDayName = (dateStr) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date(dateStr + 'T12:00:00');
    return days[d.getDay()];
  };

  const toggleMuscle = (muscleId) => {
    let next;
    if (selectedMuscles.includes(muscleId)) {
      if (selectedMuscles.length === 1) return;
      next = selectedMuscles.filter(m => m !== muscleId);
    } else {
      next = [...selectedMuscles, muscleId];
    }
    setSelectedMuscles(next);
    if (currentWorkout) {
      const updated = { ...currentWorkout, targetMuscles: next };
      setCurrentWorkout(updated);
      saveWorkout(updated, activeProfileId);
    }
  };

  const handleAddExercise = (exerciseTemplate) => {
    if (!currentWorkout) return;
    const prev = getPreviousPerformance(exerciseTemplate.name, currentWorkout.id, activeProfileId);

    // Default weight unit: machine/cable default to 'blocks' or user unit 'kg'
    const defaultWeightUnit = exerciseTemplate.defaultUnit === 'blocks' ? 'blocks' : (prev?.weightUnit || unit);
    const initialWeight = prev?.weight || (defaultWeightUnit === 'blocks' ? 8 : 40);

    const newExerciseLog = {
      id: 'ex_' + Date.now(),
      exerciseId: exerciseTemplate.id,
      name: exerciseTemplate.name,
      muscle: exerciseTemplate.muscle,
      equipment: exerciseTemplate.equipment || 'dumbbell',
      weightUnit: defaultWeightUnit,
      youtubeUrl: exerciseTemplate.youtubeUrl || '',
      photoUrl: exerciseTemplate.photoUrl || '',
      cues: exerciseTemplate.cues || [],
      sets: [
        {
          id: 'set_' + Date.now() + '_1',
          setNum: 1,
          weight: initialWeight,
          weightUnit: defaultWeightUnit,
          reps: prev?.reps || 10,
          durationSeconds: 0,
          timerRunning: false,
          timerStartTime: null,
          completed: false,
          previous: prev ? `${prev.weight} ${prev.weightUnit || defaultWeightUnit} × ${prev.reps}` : null
        }
      ]
    };

    const updated = { ...currentWorkout, exercises: [...(currentWorkout.exercises || []), newExerciseLog] };
    setCurrentWorkout(updated);
    saveWorkout(updated, activeProfileId);
    setShowPicker(false);
  };

  const handleRemoveExercise = (exId) => {
    const updated = { ...currentWorkout, exercises: currentWorkout.exercises.filter(e => e.id !== exId) };
    setCurrentWorkout(updated);
    saveWorkout(updated, activeProfileId);
  };

  const handleAddSet = (exId) => {
    const updatedExercises = currentWorkout.exercises.map(ex => {
      if (ex.id !== exId) return ex;
      const sets = ex.sets || [];
      const last = sets[sets.length - 1];
      const currentUnit = last?.weightUnit || ex.weightUnit || unit;
      const newSet = {
        id: 'set_' + Date.now(),
        setNum: sets.length + 1,
        weight: last ? last.weight : (currentUnit === 'blocks' ? 8 : 40),
        weightUnit: currentUnit,
        reps: last ? last.reps : 10,
        durationSeconds: 0,
        timerRunning: false,
        timerStartTime: null,
        completed: false,
        previous: last?.previous || null
      };
      return { ...ex, sets: [...sets, newSet] };
    });

    const updated = { ...currentWorkout, exercises: updatedExercises };
    setCurrentWorkout(updated);
    saveWorkout(updated, activeProfileId);
  };

  const handleRemoveSet = (exId, setId) => {
    const updatedExercises = currentWorkout.exercises.map(ex => {
      if (ex.id !== exId) return ex;
      const filtered = ex.sets.filter(s => s.id !== setId);
      const renumbered = filtered.map((s, idx) => ({ ...s, setNum: idx + 1 }));
      return { ...ex, sets: renumbered };
    });

    const updated = { ...currentWorkout, exercises: updatedExercises };
    setCurrentWorkout(updated);
    saveWorkout(updated, activeProfileId);
  };

  const handleSetChange = (exId, setId, field, value) => {
    const updatedExercises = currentWorkout.exercises.map(ex => {
      if (ex.id !== exId) return ex;
      return {
        ...ex,
        sets: ex.sets.map(set => {
          if (set.id !== setId) return set;
          return { ...set, [field]: value };
        })
      };
    });

    const updated = { ...currentWorkout, exercises: updatedExercises };
    setCurrentWorkout(updated);
    saveWorkout(updated, activeProfileId);
  };

  // Toggle Weight Unit for entire exercise (KG vs BLOCKS)
  const handleToggleExWeightUnit = (exId, newUnit) => {
    const updatedExercises = currentWorkout.exercises.map(ex => {
      if (ex.id !== exId) return ex;
      return {
        ...ex,
        weightUnit: newUnit,
        sets: ex.sets.map(s => ({ ...s, weightUnit: newUnit }))
      };
    });

    const updated = { ...currentWorkout, exercises: updatedExercises };
    setCurrentWorkout(updated);
    saveWorkout(updated, activeProfileId);
  };

  // Toggle Weight Unit for a single set
  const handleToggleSetWeightUnit = (exId, setId) => {
    const updatedExercises = currentWorkout.exercises.map(ex => {
      if (ex.id !== exId) return ex;
      return {
        ...ex,
        sets: ex.sets.map(s => {
          if (s.id !== setId) return s;
          const cur = s.weightUnit || ex.weightUnit || unit;
          const nextUnit = cur === 'blocks' ? 'kg' : 'blocks';
          return { ...s, weightUnit: nextUnit };
        })
      };
    });

    const updated = { ...currentWorkout, exercises: updatedExercises };
    setCurrentWorkout(updated);
    saveWorkout(updated, activeProfileId);
  };

  // Persistent Set Timer toggle
  const handleToggleSetTimer = (exId, set) => {
    const now = Date.now();
    const isCurrentlyRunning = Boolean(set.timerRunning);
    let newRunning = !isCurrentlyRunning;
    let newDuration = Number(set.durationSeconds) || 0;
    let newStartTime = null;

    if (isCurrentlyRunning) {
      if (set.timerStartTime) {
        newDuration += Math.floor((now - set.timerStartTime) / 1000);
      }
      newStartTime = null;
    } else {
      newStartTime = now;
    }

    const updatedExercises = currentWorkout.exercises.map(ex => {
      if (ex.id !== exId) return ex;
      return {
        ...ex,
        sets: ex.sets.map(s => {
          if (s.id !== set.id) return s;
          return {
            ...s,
            timerRunning: newRunning,
            durationSeconds: newDuration,
            timerStartTime: newStartTime
          };
        })
      };
    });

    const updated = { ...currentWorkout, exercises: updatedExercises };
    setCurrentWorkout(updated);
    saveWorkout(updated, activeProfileId);
  };

  const getLiveSetSeconds = (set) => {
    let sec = Number(set.durationSeconds) || 0;
    if (set.timerRunning && set.timerStartTime) {
      sec += Math.floor((Date.now() - set.timerStartTime) / 1000);
    }
    return sec;
  };

  const handleToggleComplete = (exerciseLog, set) => {
    const isNowDone = !set.completed;
    const now = Date.now();

    let finalDuration = Number(set.durationSeconds) || 0;
    if (set.timerRunning && set.timerStartTime) {
      finalDuration += Math.floor((now - set.timerStartTime) / 1000);
    }

    const currentUnit = set.weightUnit || exerciseLog.weightUnit || unit;

    const updatedExercises = currentWorkout.exercises.map(ex => {
      if (ex.id !== exerciseLog.id) return ex;
      return {
        ...ex,
        sets: ex.sets.map(s => {
          if (s.id !== set.id) return s;
          return {
            ...s,
            completed: isNowDone,
            durationSeconds: finalDuration,
            timerRunning: false,
            timerStartTime: null,
            weightUnit: currentUnit
          };
        })
      };
    });

    const updated = { ...currentWorkout, exercises: updatedExercises };
    setCurrentWorkout(updated);
    saveWorkout(updated, activeProfileId);

    if (isNowDone) {
      const w = Number(set.weight) || 0;
      const pr = personalRecords[exerciseLog.name]?.maxWeight || 0;
      if (w > pr && pr > 0) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
      if (settings.autoTimerOnComplete !== false && onTriggerTimer) {
        onTriggerTimer(settings.restSeconds || 90);
      }
    }
  };

  const formatSetTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const allExercisesList = getAllExercises();
  const filteredPicker = allExercisesList.filter(ex => {
    const matchMuscle = pickerFilter === 'all' || ex.muscle === pickerFilter;
    const matchEquipment = equipmentFilter === 'all' || ex.equipment === equipmentFilter;
    const matchSearch = ex.name.toLowerCase().includes(pickerSearch.toLowerCase()) || 
                        (ex.muscle || '').toLowerCase().includes(pickerSearch.toLowerCase()) ||
                        (ex.equipment || '').toLowerCase().includes(pickerSearch.toLowerCase());
    return matchMuscle && matchEquipment && matchSearch;
  });

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto">
      
      {/* 1. Hero with Persistent Session Stopwatch */}
      <WorkoutHero 
        currentWorkout={currentWorkout} 
        unit={unit} 
        activeProfileId={activeProfileId}
        selectedDate={selectedDate}
      />

      {/* 2. Date Switcher */}
      <div className="flex items-center justify-between bg-slate-900/70 p-3 rounded-2xl border border-slate-800 shadow-sm">
        <button
          onClick={() => changeDate(-1)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Previous Day"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <span className="text-base font-black text-white flex items-center justify-center gap-1.5">
            <Calendar className="w-4 h-4 text-fitrex-red" />
            {getDayName(selectedDate)}
          </span>
          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="text-[11px] text-fitrex-red hover:underline font-bold"
          >
            {selectedDate === new Date().toISOString().split('T')[0] ? '● Today' : 'Jump to Today'}
          </button>
        </div>

        <button
          onClick={() => changeDate(1)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Next Day"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 3. Target Muscles Selection */}
      <div className="pro-card p-4 sm:p-5 border-slate-800">
        <span className="text-xs font-black uppercase text-slate-300 block mb-3">
          1. Choose Muscles to Train Today
        </span>
        <div className="flex flex-wrap gap-2">
          {MUSCLE_GROUPS.map(m => {
            const isSelected = selectedMuscles.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleMuscle(m.id)}
                className={`text-xs font-bold py-1.5 px-3 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-fitrex-red text-white font-black shadow-glow-red scale-105'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {m.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Logged Exercises Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-slate-300">
            2. Exercises & Sets ({currentWorkout?.exercises?.length || 0})
          </span>

          <button
            onClick={() => { setPickerSearch(''); setShowPicker(true); }}
            className="btn-pro-primary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-glow-red"
          >
            <Plus className="w-4 h-4" /> Add Exercise
          </button>
        </div>

        {(!currentWorkout?.exercises || currentWorkout.exercises.length === 0) ? (
          <div className="pro-card p-8 border-dashed border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-fitrex-red/10 border border-fitrex-red/30 flex items-center justify-center mx-auto text-fitrex-red">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">No exercises logged for this day</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tap "Add Exercise" above to pick from 100+ movements including machines, dumbbells, cables, and barbells.
            </p>
            <button
              onClick={() => { setPickerSearch(''); setShowPicker(true); }}
              className="btn-pro-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Browse 100+ Exercises
            </button>
          </div>
        ) : (
          currentWorkout.exercises.map((exLog) => {
            const exUnit = exLog.weightUnit || unit;
            return (
              <div key={exLog.id} className="pro-card p-4 sm:p-5 border-slate-800 space-y-4">
                
                {/* Exercise Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-fitrex-red/15 border border-fitrex-red/40 flex items-center justify-center text-fitrex-red shrink-0">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                        {exLog.name}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase">
                          {exLog.muscle}
                        </span>
                      </h4>
                      {personalRecords[exLog.name]?.maxWeight > 0 && (
                        <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                          <Flame className="w-3 h-3 fill-current" /> All-Time PR: {personalRecords[exLog.name].maxWeight} {personalRecords[exLog.name].unit || unit}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    
                    {/* Weight Unit Selector: KG vs BLOCKS */}
                    <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800" title="Switch weight unit between KG and Number of Blocks / Pin Stack">
                      <button
                        type="button"
                        onClick={() => handleToggleExWeightUnit(exLog.id, 'kg')}
                        className={`px-2 py-1 rounded text-[10px] font-black transition-all ${
                          exUnit === 'kg'
                            ? 'bg-fitrex-red text-white shadow-glow-red'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        KG
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleExWeightUnit(exLog.id, 'blocks')}
                        className={`px-2 py-1 rounded text-[10px] font-black transition-all ${
                          exUnit === 'blocks'
                            ? 'bg-fitrex-red text-white shadow-glow-red'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        BLOCKS
                      </button>
                    </div>

                    {/* Guide Modal Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedExerciseForModal(exLog)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-fitrex-red hover:text-white hover:border-fitrex-red transition-colors"
                      title="Posture & Video Guide"
                    >
                      <Video className="w-4 h-4" />
                    </button>

                    {/* Delete Exercise */}
                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(exLog.id)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove Exercise"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sets Table */}
                <div className="space-y-2.5">
                  {(exLog.sets || []).map((set) => {
                    const liveSeconds = getLiveSetSeconds(set);
                    const isRunning = Boolean(set.timerRunning);
                    const setUnit = set.weightUnit || exLog.weightUnit || unit;
                    const isBlocks = setUnit === 'blocks';

                    return (
                      <div
                        key={set.id}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-2 sm:gap-4 transition-all ${
                          set.completed
                            ? 'bg-fitrex-red/[0.08] border-fitrex-red/40'
                            : isRunning
                            ? 'bg-amber-500/[0.08] border-amber-500/40'
                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Set # */}
                        <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 text-xs font-black flex items-center justify-center shrink-0">
                          {set.setNum}
                        </div>

                        {/* Weight (kg or Blocks) */}
                        <div className="flex-1 min-w-[85px] sm:min-w-[110px]">
                          <div className="flex items-center justify-between mb-0.5">
                            <label className="text-[10px] text-slate-400 font-bold uppercase block">
                              {isBlocks ? 'Blocks / Pin' : `Weight (${unit})`}
                            </label>
                            <button
                              type="button"
                              onClick={() => handleToggleSetWeightUnit(exLog.id, set.id)}
                              className="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-fitrex-red border border-slate-700 leading-none"
                              title="Click to switch between kg and weight blocks"
                            >
                              {isBlocks ? 'Blocks' : 'kg'}
                            </button>
                          </div>
                          
                          <input
                            type="number"
                            step={isBlocks ? '1' : '0.5'}
                            value={set.weight}
                            onChange={e => handleSetChange(exLog.id, set.id, 'weight', e.target.value)}
                            placeholder={isBlocks ? 'e.g. 8' : '40'}
                            className="w-full input-pro py-1 px-2 text-center text-sm font-black mono-num"
                          />
                          {set.previous && (
                            <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                              Last: {set.previous}
                            </span>
                          )}
                        </div>

                        {/* Reps */}
                        <div className="flex-1 min-w-[65px] sm:min-w-[80px]">
                          <label className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
                            Reps
                          </label>
                          <input
                            type="number"
                            value={set.reps}
                            onChange={e => handleSetChange(exLog.id, set.id, 'reps', e.target.value)}
                            className="w-full input-pro py-1 px-2 text-center text-sm font-black mono-num"
                          />
                        </div>

                        {/* Set Timer (Persistent across mobile lock/refresh) */}
                        <div className="text-center shrink-0">
                          <label className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
                            Time
                          </label>
                          <button
                            type="button"
                            onClick={() => handleToggleSetTimer(exLog.id, set)}
                            className={`px-2.5 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1 transition-all ${
                              isRunning
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 animate-pulse'
                                : liveSeconds > 0
                                ? 'bg-slate-800 text-fitrex-red border-slate-700'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                            title="Start / Stop set timer (survives phone lock and refresh)"
                          >
                            {isRunning ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                            <span className="mono-num">{formatSetTime(liveSeconds)}</span>
                          </button>
                        </div>

                        {/* Complete Checkmark */}
                        <div className="shrink-0 pl-1">
                          <button
                            type="button"
                            onClick={() => handleToggleComplete(exLog, set)}
                            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                              set.completed
                                ? 'bg-fitrex-red border-fitrex-red text-white shadow-glow-red scale-105'
                                : 'bg-slate-900 border-slate-700 text-slate-600 hover:border-fitrex-red/50'
                            }`}
                            title={set.completed ? 'Completed!' : 'Mark done'}
                          >
                            <Check className={`w-5 h-5 font-black ${set.completed ? 'stroke-[3.5]' : 'opacity-0'}`} />
                          </button>
                        </div>

                        {/* Remove Set */}
                        {exLog.sets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSet(exLog.id, set.id)}
                            className="text-slate-600 hover:text-rose-400 p-1"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Add Set Button */}
                <button
                  type="button"
                  onClick={() => handleAddSet(exLog.id)}
                  className="w-full py-2.5 rounded-xl bg-slate-900/60 border border-dashed border-slate-800 hover:border-fitrex-red/40 text-xs font-bold text-slate-300 hover:text-fitrex-red flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Another Set
                </button>

              </div>
            );
          })
        )}
      </div>

      {/* 5. FIXED EXERCISE PICKER MODAL (Filter bar is strictly sticky and never hidden) */}
      {showPicker && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-2xl pro-card border-slate-700 max-h-[90vh] flex flex-col shadow-2xl overflow-hidden bg-[#090e1a]">
            
            {/* FIXED TOP HEADER & STICKY FILTER BAR */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#090e1a] shrink-0 space-y-3 z-30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-fitrex-red" /> Exercise Library ({filteredPicker.length})
                  </h3>
                  <p className="text-xs text-slate-400">Tap any movement to add to your workout ({allExercisesList.length} total available)</p>
                </div>
                <button
                  onClick={() => setShowPicker(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search 100+ exercises (shoulder press, squat, lat pull, hammer curl, pushups)..."
                  value={pickerSearch}
                  onChange={e => setPickerSearch(e.target.value)}
                  className="w-full input-pro pl-10 text-xs py-2.5"
                  autoFocus
                />
              </div>

              {/* STICKY HORIZONTAL MUSCLE FILTER BAR */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar scroll-smooth">
                <button
                  onClick={() => setPickerFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap shrink-0 transition-all ${
                    pickerFilter === 'all'
                      ? 'bg-fitrex-red text-white shadow-glow-red'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  All Muscles ({allExercisesList.length})
                </button>

                {MUSCLE_GROUPS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setPickerFilter(m.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                      pickerFilter === m.id
                        ? 'bg-fitrex-red text-white shadow-glow-red'
                        : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>

              {/* EQUIPMENT FILTER BAR */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                {EQUIPMENT_LIST.map(eq => (
                  <button
                    key={eq.id}
                    onClick={() => setEquipmentFilter(eq.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap shrink-0 transition-all ${
                      equipmentFilter === eq.id
                        ? 'bg-slate-700 text-white border border-slate-500'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {eq.name}
                  </button>
                ))}
              </div>
            </div>

            {/* SCROLLABLE EXERCISE LIST */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 flex-1 divide-y divide-slate-800/60">
              {filteredPicker.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No movements found matching "{pickerSearch}". Try another muscle or search keyword.
                </div>
              ) : (
                filteredPicker.map((ex) => (
                  <div
                    key={ex.id}
                    onClick={() => handleAddExercise(ex)}
                    className="pt-2.5 first:pt-0 flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/40 cursor-pointer border border-transparent hover:border-slate-800 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-slate-800 group-hover:border-fitrex-red/40 transition-colors">
                        <img
                          src={ex.photoUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop&q=80'}
                          alt={ex.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-fitrex-red transition-colors flex items-center gap-2">
                          {ex.name}
                          {ex.defaultUnit === 'blocks' && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              Blocks / Stack
                            </span>
                          )}
                        </h4>
                        <span className="text-[11px] text-slate-400 uppercase font-semibold">
                          {ex.muscle} • {ex.equipment || 'Gym'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-fitrex-red/10 group-hover:bg-fitrex-red text-fitrex-red group-hover:text-white border border-fitrex-red/30 text-xs font-black transition-all shadow-sm"
                    >
                      Select +
                    </button>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* 6. Posture Guide Modal */}
      <PostureModal
        exercise={selectedExerciseForModal}
        isOpen={!!selectedExerciseForModal}
        onClose={() => setSelectedExerciseForModal(null)}
        onUpdateExercise={(updated) => {
          setSelectedExerciseForModal(updated);
        }}
      />

    </div>
  );
}