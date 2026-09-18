import React, { useState, useEffect } from 'react';
import { 
  Calendar, ChevronLeft, ChevronRight, Plus, Trash2, Check, 
  Dumbbell, Flame, Video, Play, Pause, Search, RotateCcw, Trophy, X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MUSCLE_GROUPS } from '../data/defaultExercises';
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
  const [pickerSearch, setPickerSearch] = useState('');
  const [personalRecords, setPersonalRecords] = useState({});

  // Local ticker to re-render set timers every second
  const [, setTick] = useState(0);

  const getDayName = (dateStr) => {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    const workouts = getWorkouts(activeProfileId);
    const existing = workouts.find(w => w.date === selectedDate);

    if (existing) {
      setCurrentWorkout(existing);
      setSelectedMuscles(existing.muscles || ['chest']);
    } else {
      const newWorkout = {
        id: 'wo_' + selectedDate + '_' + activeProfileId,
        date: selectedDate,
        dayOfWeek: new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' }),
        muscles: ['chest'],
        exercises: [],
        notes: ''
      };
      setCurrentWorkout(newWorkout);
      setSelectedMuscles(['chest']);
    }

    setPersonalRecords(getPersonalRecords(activeProfileId));
  }, [selectedDate, activeProfileId]);

  // Timer interval & screen lock/unlock sync for individual sets
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);

    const onVisibilityChange = () => {
      setTick(t => t + 1);
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', onVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', onVisibilityChange);
    };
  }, []);

  const changeDate = (days) => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
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
      const updated = { ...currentWorkout, muscles: next };
      setCurrentWorkout(updated);
      saveWorkout(updated, activeProfileId);
    }
  };

  const handleAddExercise = (exerciseTemplate) => {
    if (!currentWorkout) return;
    const prev = getPreviousPerformance(exerciseTemplate.name, currentWorkout.id, activeProfileId);

    const newExerciseLog = {
      id: 'ex_' + Date.now(),
      exerciseId: exerciseTemplate.id,
      name: exerciseTemplate.name,
      muscle: exerciseTemplate.muscle,
      youtubeUrl: exerciseTemplate.youtubeUrl || '',
      photoUrl: exerciseTemplate.photoUrl || '',
      cues: exerciseTemplate.cues || [],
      sets: [
        {
          id: 'set_' + Date.now() + '_1',
          setNum: 1,
          weight: prev?.weight || 40,
          reps: prev?.reps || 10,
          durationSeconds: 0,
          timerRunning: false,
          timerStartTime: null,
          completed: false,
          previous: prev ? `${prev.weight} ${unit} × ${prev.reps}` : null
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
      const newSet = {
        id: 'set_' + Date.now(),
        setNum: sets.length + 1,
        weight: last ? last.weight : 40,
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
      const sets = ex.sets.filter(s => s.id !== setId).map((s, idx) => ({ ...s, setNum: idx + 1 }));
      return { ...ex, sets };
    });

    const updated = { ...currentWorkout, exercises: updatedExercises };
    setCurrentWorkout(updated);
    saveWorkout(updated, activeProfileId);
  };

  const handleSetChange = (exId, setId, field, val) => {
    const updatedExercises = currentWorkout.exercises.map(ex => {
      if (ex.id !== exId) return ex;
      const sets = ex.sets.map(s => s.id === setId ? { ...s, [field]: val } : s);
      return { ...ex, sets };
    });

    const updated = { ...currentWorkout, exercises: updatedExercises };
    setCurrentWorkout(updated);
    saveWorkout(updated, activeProfileId);
  };

  // Persistent Set Timer (Timestamp based - survives refresh & mobile lock)
  const handleToggleSetTimer = (exId, set) => {
    const isCurrentlyRunning = Boolean(set.timerRunning);
    let updatedDuration = set.durationSeconds || 0;
    let newRunning = false;
    let newStartTime = null;

    if (isCurrentlyRunning) {
      // Pause: commit elapsed seconds since timerStartTime
      if (set.timerStartTime) {
        const delta = Math.floor((Date.now() - set.timerStartTime) / 1000);
        updatedDuration += Math.max(0, delta);
      }
      newRunning = false;
      newStartTime = null;
    } else {
      // Start: record current timestamp
      newRunning = true;
      newStartTime = Date.now();
    }

    const updatedExercises = currentWorkout.exercises.map(ex => {
      if (ex.id !== exId) return ex;
      const sets = ex.sets.map(s => {
        if (s.id === set.id) {
          return {
            ...s,
            durationSeconds: updatedDuration,
            timerRunning: newRunning,
            timerStartTime: newStartTime
          };
        }
        return s;
      });
      return { ...ex, sets };
    });

    const updated = { ...currentWorkout, exercises: updatedExercises };
    setCurrentWorkout(updated);
    saveWorkout(updated, activeProfileId);
  };

  const handleResetSetTimer = (exId, setId) => {
    const updatedExercises = currentWorkout.exercises.map(ex => {
      if (ex.id !== exId) return ex;
      const sets = ex.sets.map(s => {
        if (s.id === setId) {
          return { ...s, durationSeconds: 0, timerRunning: false, timerStartTime: null };
        }
        return s;
      });
      return { ...ex, sets };
    });

    const updated = { ...currentWorkout, exercises: updatedExercises };
    setCurrentWorkout(updated);
    saveWorkout(updated, activeProfileId);
  };

  const handleToggleComplete = (exerciseLog, set) => {
    const isNowDone = !set.completed;
    
    // Stop set timer if running and calculate final duration
    let finalDuration = set.durationSeconds || 0;
    if (set.timerRunning && set.timerStartTime) {
      finalDuration += Math.max(0, Math.floor((Date.now() - set.timerStartTime) / 1000));
    }

    const updatedExercises = currentWorkout.exercises.map(ex => {
      if (ex.id !== exerciseLog.id) return ex;
      const sets = ex.sets.map(s => {
        if (s.id === set.id) {
          return {
            ...s,
            completed: isNowDone,
            durationSeconds: finalDuration,
            timerRunning: false,
            timerStartTime: null
          };
        }
        return s;
      });
      return { ...ex, sets };
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

  // Get current live duration of set including real-time delta
  const getLiveSetSeconds = (set) => {
    let sec = set.durationSeconds || 0;
    if (set.timerRunning && set.timerStartTime) {
      sec += Math.max(0, Math.floor((Date.now() - set.timerStartTime) / 1000));
    }
    return sec;
  };

  const formatSetTime = (sec = 0) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const allExercisesList = getAllExercises();
  const filteredPicker = allExercisesList.filter(ex => {
    const matchMuscle = pickerFilter === 'all' || ex.muscle === pickerFilter;
    const matchSearch = ex.name.toLowerCase().includes(pickerSearch.toLowerCase()) || 
                        (ex.muscle || '').toLowerCase().includes(pickerSearch.toLowerCase());
    return matchMuscle && matchSearch;
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

      {/* 4. Workout Exercises Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-slate-300">
            2. Log Sets & Exercises
          </span>

          <button
            onClick={() => {
              setPickerFilter('all');
              setPickerSearch('');
              setShowPicker(true);
            }}
            className="btn-pro-primary text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Exercise
          </button>
        </div>

        {(!currentWorkout?.exercises || currentWorkout.exercises.length === 0) ? (
          <div className="pro-card p-10 text-center border-dashed border-slate-800 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 mx-auto flex items-center justify-center text-slate-600">
              <Dumbbell className="w-7 h-7 -rotate-45" />
            </div>
            <h3 className="text-base font-bold text-white">No exercises added yet</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Tap the button below to browse all exercises with videos and photos.
            </p>
            <button
              onClick={() => {
                setPickerFilter('all');
                setPickerSearch('');
                setShowPicker(true);
              }}
              className="btn-pro-primary text-xs py-2 px-4"
            >
              <Plus className="w-4 h-4" /> Browse Exercises
            </button>
          </div>
        ) : (
          currentWorkout.exercises.map((exLog, exIdx) => {
            const pr = personalRecords[exLog.name];
            return (
              <div key={exLog.id} className="pro-card p-4 sm:p-5 border-slate-800 space-y-3 shadow-lg">
                
                {/* Exercise Header */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3 min-w-0">
                    {exLog.photoUrl && (
                      <img
                        src={exLog.photoUrl}
                        alt={exLog.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <h4 className="text-base font-black text-white truncate flex items-center gap-1.5">
                        {exLog.name}
                        {pr && pr.maxWeight > 0 && (
                          <span className="text-[10px] bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                            PR: {pr.maxWeight} {unit}
                          </span>
                        )}
                      </h4>
                      <span className="text-[11px] font-bold text-fitrex-red uppercase">
                        {exLog.muscle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setSelectedExerciseForModal(exLog)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-fitrex-red text-xs font-bold flex items-center gap-1 hover:bg-slate-800 transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" /> Watch Form
                    </button>
                    <button
                      onClick={() => handleRemoveExercise(exLog.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 rounded-xl transition-colors"
                      title="Remove exercise"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sets List with Timestamp-based Persistent Set Timers */}
                <div className="space-y-2 pt-1">
                  {(exLog.sets || []).map((set) => {
                    const liveSeconds = getLiveSetSeconds(set);
                    const isRunning = Boolean(set.timerRunning);
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

                        {/* Weight */}
                        <div className="flex-1 min-w-[75px] sm:min-w-[100px]">
                          <label className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">
                            Weight ({unit})
                          </label>
                          <input
                            type="number"
                            step="0.5"
                            value={set.weight}
                            onChange={e => handleSetChange(exLog.id, set.id, 'weight', e.target.value)}
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
            
            {/* FIXED TOP HEADER & FILTER BAR */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#090e1a] shrink-0 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-fitrex-red" /> Exercise Library ({filteredPicker.length})
                  </h3>
                  <p className="text-xs text-slate-400">Tap any movement to add to your workout</p>
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
                  placeholder="Search shoulder press, squat, lat pull, hammer curl..."
                  value={pickerSearch}
                  onChange={e => setPickerSearch(e.target.value)}
                  className="w-full input-pro pl-10 text-xs py-2.5"
                  autoFocus
                />
              </div>

              {/* STICKY HORIZONTAL FILTER BAR - NEVER CLIPPED */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar scroll-smooth">
                <button
                  onClick={() => setPickerFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap shrink-0 transition-all ${
                    pickerFilter === 'all'
                      ? 'bg-fitrex-red text-white shadow-glow-red'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  All ({allExercisesList.length})
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
            </div>

            {/* SCROLLABLE EXERCISES LIST */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {filteredPicker.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No exercises matched your search. Try another keyword.
                </div>
              ) : (
                filteredPicker.map(ex => (
                  <div
                    key={ex.id}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-fitrex-red/50 flex items-center justify-between gap-3 group transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={ex.photoUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop&q=80'}
                        alt={ex.name}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase text-fitrex-red">
                          {ex.muscle}
                        </span>
                        <h4 className="text-sm font-black text-white group-hover:text-fitrex-red truncate">
                          {ex.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {ex.cues?.[0] || 'Standard exercise with posture guidance'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedExerciseForModal(ex)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-fitrex-red transition-colors"
                        title="Watch demonstration video"
                      >
                        <Video className="w-4 h-4 text-fitrex-red" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddExercise(ex)}
                        className="btn-pro-primary text-xs py-2 px-3.5"
                      >
                        Add +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* Posture Video Modal */}
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
