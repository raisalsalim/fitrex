import React, { useState, useEffect } from 'react';
import { 
  Calendar, ChevronLeft, ChevronRight, Plus, Trash2, Check, Copy, 
  Dumbbell, Flame, Trophy, Info, Sparkles, MessageSquare, Clock, 
  Calculator, ArrowUpRight, CheckCircle2, SlidersHorizontal, Play, Pause, RotateCcw,
  Youtube, Search, Video, Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MUSCLE_GROUPS, DEFAULT_EXERCISES } from '../data/defaultExercises';
import { 
  getWorkouts, saveWorkout, getPreviousPerformance, 
  getAllExercises, getSettings, getPersonalRecords, getActiveProfileId 
} from '../services/storage';
import PostureModal from './PostureModal';
import PlateCalculatorModal from './PlateCalculatorModal';
import WorkoutHero from './WorkoutHero';

export default function WorkoutLogger({ onTriggerTimer, activeProfileId, onOpenAnalytics }) {
  const settings = getSettings();
  const unit = settings.unit || 'kg';

  // Date State
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [selectedMuscles, setSelectedMuscles] = useState(['chest']);
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState(null);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [pickerMuscle, setPickerMuscle] = useState('all'); // 'all' by default to list everything!
  const [pickerSearch, setPickerSearch] = useState('');
  const [personalRecords, setPersonalRecords] = useState({});
  const [plateCalcWeight, setPlateCalcWeight] = useState(null);

  // Active running set timer track: { [setId]: true }
  const [activeSetTimers, setActiveSetTimers] = useState({});

  const getDayName = (dateStr) => {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
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
        notes: '',
        durationMinutes: 0
      };
      setCurrentWorkout(newWorkout);
      setSelectedMuscles(['chest']);
    }

    setPersonalRecords(getPersonalRecords(activeProfileId));
  }, [selectedDate, activeProfileId]);

  // Interval ticker for active set timers
  useEffect(() => {
    const runningKeys = Object.keys(activeSetTimers).filter(k => activeSetTimers[k]);
    if (runningKeys.length === 0) return;

    const interval = setInterval(() => {
      setCurrentWorkout(prev => {
        if (!prev) return prev;
        let modified = false;
        const updatedExercises = (prev.exercises || []).map(ex => {
          const sets = (ex.sets || []).map(s => {
            if (activeSetTimers[s.id]) {
              modified = true;
              return { ...s, durationSeconds: (s.durationSeconds || 0) + 1 };
            }
            return s;
          });
          return { ...ex, sets };
        });

        if (!modified) return prev;
        const next = { ...prev, exercises: updatedExercises };
        saveWorkout(next, activeProfileId);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSetTimers, activeProfileId]);

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
      id: 'ex_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      exerciseId: exerciseTemplate.id,
      name: exerciseTemplate.name,
      muscle: exerciseTemplate.muscle,
      youtubeUrl: exerciseTemplate.youtubeUrl || '',
      photoUrl: exerciseTemplate.photoUrl || '',
      cues: exerciseTemplate.cues || [],
      notes: '',
      sets: [
        {
          id: 'set_' + Date.now() + '_1',
          setNum: 1,
          type: 'N',
          weight: prev?.weight || (unit === 'kg' ? 60 : 135),
          reps: prev?.reps || 10,
          durationSeconds: 0,
          completed: false,
          rpe: 8,
          previous: prev ? `${prev.weight}${unit} × ${prev.reps}` : '-'
        }
      ]
    };

    const updatedExercises = [...(currentWorkout.exercises || []), newExerciseLog];
    const updatedWorkout = { ...currentWorkout, exercises: updatedExercises };
    setCurrentWorkout(updatedWorkout);
    saveWorkout(updatedWorkout, activeProfileId);
    setShowExercisePicker(false);
  };

  const handleRemoveExercise = (exerciseLogId) => {
    if (!currentWorkout) return;
    const filtered = currentWorkout.exercises.filter(e => e.id !== exerciseLogId);
    const updated = { ...currentWorkout, exercises: filtered };
    setCurrentWorkout(updated);
    saveWorkout(updated, activeProfileId);
  };

  const handleAddSet = (exerciseLogId) => {
    if (!currentWorkout) return;
    const updatedExercises = currentWorkout.exercises.map(ex => {
      if (ex.id !== exerciseLogId) return ex;
      const sets = ex.sets || [];
      const lastSet = sets[sets.length - 1];
      const newSet = {
        id: 'set_' + Date.now(),
        setNum: sets.length + 1,
        type: 'N',
        weight: lastSet ? lastSet.weight : (unit === 'kg' ? 60 : 135),
        reps: lastSet ? lastSet.reps : 10,
        durationSeconds: 0,
        completed: false,
        rpe: lastSet?.rpe || 8,
        previous: lastSet?.previous || '-'
      };
      return { ...ex, sets: [...sets, newSet] };
    });

    const updatedWorkout = { ...currentWorkout, exercises: updatedExercises };
    setCurrentWorkout(updatedWorkout);
    saveWorkout(updatedWorkout, activeProfileId);
  };

  const handleRemoveSet = (exerciseLogId, setId) => {
    if (!currentWorkout) return;
    const updatedExercises = currentWorkout.exercises.map(ex => {
      if (ex.id !== exerciseLogId) return ex;
      const filteredSets = ex.sets.filter(s => s.id !== setId).map((s, idx) => ({ ...s, setNum: idx + 1 }));
      return { ...ex, sets: filteredSets };
    });

    const updatedWorkout = { ...currentWorkout, exercises: updatedExercises };
    setCurrentWorkout(updatedWorkout);
    saveWorkout(updatedWorkout, activeProfileId);
  };

  const handleSetChange = (exerciseLogId, setId, field, value) => {
    if (!currentWorkout) return;
    const updatedExercises = currentWorkout.exercises.map(ex => {
      if (ex.id !== exerciseLogId) return ex;
      const updatedSets = ex.sets.map(s => {
        if (s.id !== setId) return s;
        return { ...s, [field]: value };
      });
      return { ...ex, sets: updatedSets };
    });

    const updatedWorkout = { ...currentWorkout, exercises: updatedExercises };
    setCurrentWorkout(updatedWorkout);
    saveWorkout(updatedWorkout, activeProfileId);
  };

  // Toggle individual set timer Start / Stop
  const handleToggleSetTimer = (setId) => {
    setActiveSetTimers(prev => ({
      ...prev,
      [setId]: !prev[setId]
    }));
  };

  const handleResetSetTimer = (exerciseLogId, setId) => {
    setActiveSetTimers(prev => ({ ...prev, [setId]: false }));
    handleSetChange(exerciseLogId, setId, 'durationSeconds', 0);
  };

  const handleAdjustWeight = (exerciseLogId, setId, currentWeight, delta) => {
    const nextWeight = Math.max(0, (parseFloat(currentWeight) || 0) + delta);
    handleSetChange(exerciseLogId, setId, 'weight', nextWeight);
  };

  const handleAdjustReps = (exerciseLogId, setId, currentReps, delta) => {
    const nextReps = Math.max(1, (parseInt(currentReps) || 0) + delta);
    handleSetChange(exerciseLogId, setId, 'reps', nextReps);
  };

  const handleToggleComplete = (exerciseLog, set) => {
    const isNowComplete = !set.completed;
    handleSetChange(exerciseLog.id, set.id, 'completed', isNowComplete);

    // Stop set timer if running
    if (activeSetTimers[set.id]) {
      setActiveSetTimers(prev => ({ ...prev, [set.id]: false }));
    }

    if (isNowComplete) {
      const currentWeight = Number(set.weight) || 0;
      const existingPR = personalRecords[exerciseLog.name]?.maxWeight || 0;

      if (currentWeight > 0 && currentWeight > existingPR && existingPR > 0) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      }

      if (settings.autoTimerOnComplete !== false && onTriggerTimer) {
        onTriggerTimer(settings.restSeconds || 90);
      }
    }
  };

  const cycleSetType = (exerciseLogId, setId, currentType) => {
    const types = ['N', 'W', 'D', 'F'];
    const nextType = types[(types.indexOf(currentType) + 1) % types.length];
    handleSetChange(exerciseLogId, setId, 'type', nextType);
  };

  const formatSetTime = (sec = 0) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const allExercisesList = getAllExercises();
  const filteredPickerExercises = allExercisesList.filter(ex => {
    const matchMuscle = pickerMuscle === 'all' || ex.muscle === pickerMuscle;
    const matchSearch = ex.name.toLowerCase().includes(pickerSearch.toLowerCase()) || 
                        (ex.muscle || '').toLowerCase().includes(pickerSearch.toLowerCase());
    return matchMuscle && matchSearch;
  });

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      
      {/* 1. Workout Hero Command Center with manual Start/Pause Duration */}
      <WorkoutHero
        currentWorkout={currentWorkout}
        unit={unit}
        onOpenPlateCalc={() => setPlateCalcWeight(80)}
        onOpenAnalytics={onOpenAnalytics}
      />

      {/* 2. Date Navigation Bar */}
      <div className="pro-card p-4 sm:p-5 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeDate(-1)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2 justify-center sm:justify-start">
              <Calendar className="w-5 h-5 text-fitrex-lime" />
              {getDayName(selectedDate)}
            </h2>
            <p className="text-xs text-slate-400">
              {selectedDate === new Date().toISOString().split('T')[0] ? (
                <span className="text-fitrex-lime font-bold">● Today's Active Session</span>
              ) : (
                'Workout Log Archive'
              )}
            </p>
          </div>

          <button
            onClick={() => changeDate(1)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="btn-pro-secondary text-xs py-2 px-3.5"
          >
            Jump to Today
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="input-pro text-xs py-2 px-3 cursor-pointer"
          />
        </div>
      </div>

      {/* 3. Target Muscles Selector (Multi-select) */}
      <div className="pro-card p-5 border-slate-800">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Flame className="w-4 h-4 text-fitrex-lime" /> Target Muscle Groups
          </h3>
          <span className="text-xs font-bold text-fitrex-lime bg-fitrex-lime/10 px-2.5 py-0.5 rounded-full border border-fitrex-lime/30">
            {selectedMuscles.length} Active
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {MUSCLE_GROUPS.map(m => {
            const isSelected = selectedMuscles.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleMuscle(m.id)}
                className={`text-xs font-bold py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-fitrex-lime text-slate-950 font-black shadow-glow-lime scale-105 ring-2 ring-fitrex-lime/40'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span>{m.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Exercises Logging Area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-fitrex-lime" /> Logged Exercises
          </h3>
          
          <button
            onClick={() => {
              setPickerMuscle('all');
              setPickerSearch('');
              setShowExercisePicker(true);
            }}
            className="btn-pro-primary text-xs py-2.5 px-4"
          >
            <Plus className="w-4 h-4" /> Add Exercise
          </button>
        </div>

        {(!currentWorkout?.exercises || currentWorkout.exercises.length === 0) ? (
          <div className="pro-card p-12 text-center border-dashed border-slate-800 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-600 mb-4 shadow-inner">
              <Dumbbell className="w-8 h-8 -rotate-45" />
            </div>
            <h4 className="text-lg font-bold text-white mb-1">Workout Session is Ready</h4>
            <p className="text-xs text-slate-400 max-w-sm mb-5">
              Select your target muscles above and tap "Add Exercise" to log sets, weights, reps, and set timers.
            </p>
            <button
              onClick={() => {
                setPickerMuscle('all');
                setPickerSearch('');
                setShowExercisePicker(true);
              }}
              className="btn-pro-primary text-xs py-2.5 px-5"
            >
              <Plus className="w-4 h-4" /> Browse Full Exercise Library
            </button>
          </div>
        ) : (
          currentWorkout.exercises.map((exLog, exIdx) => {
            const pr = personalRecords[exLog.name];
            return (
              <div key={exLog.id} className="pro-card p-5 border-slate-800 space-y-4 shadow-xl">
                
                {/* Exercise Header */}
                <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    {/* Thumbnail Image */}
                    {exLog.photoUrl ? (
                      <img
                        src={exLog.photoUrl}
                        alt={exLog.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-sm"
                      />
                    ) : (
                      <span className="w-10 h-10 rounded-xl bg-fitrex-lime/15 text-fitrex-lime text-xs font-black flex items-center justify-center border border-fitrex-lime/30">
                        {exIdx + 1}
                      </span>
                    )}

                    <div>
                      <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                        {exLog.name}
                        {pr && pr.maxWeight > 0 && (
                          <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <Trophy className="w-3 h-3" /> PR: {pr.maxWeight}{unit}
                          </span>
                        )}
                      </h4>
                      <span className="text-[11px] font-bold text-fitrex-lime uppercase tracking-wider">
                        {exLog.muscle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedExerciseForModal(exLog)}
                      className="btn-pro-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 hover:text-fitrex-lime hover:border-fitrex-lime/40"
                      title="Posture & Video Guide"
                    >
                      <Video className="w-3.5 h-3.5 text-fitrex-lime" />
                      <span className="hidden sm:inline">Form Video</span>
                    </button>
                    <button
                      onClick={() => handleRemoveExercise(exLog.id)}
                      className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                      title="Delete Movement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sets Table with Individual Set Timers */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[580px]">
                    <thead>
                      <tr className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                        <th className="py-2.5 px-2 text-center w-10">Set</th>
                        <th className="py-2.5 px-2 text-center w-14" title="Normal, Warmup, Drop, Failure">Type</th>
                        <th className="py-2.5 px-2 text-center">Previous</th>
                        <th className="py-2.5 px-2 text-center">{unit.toUpperCase()}</th>
                        <th className="py-2.5 px-2 text-center">Reps</th>
                        <th className="py-2.5 px-3 text-center">Set Time (⏱️)</th>
                        <th className="py-2.5 px-2 text-center w-14">RPE</th>
                        <th className="py-2.5 px-2 text-center w-16">Done</th>
                        <th className="py-2.5 px-1 w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {(exLog.sets || []).map((set) => {
                        const isSetTimerRunning = Boolean(activeSetTimers[set.id]);
                        return (
                          <tr
                            key={set.id}
                            className={`transition-all ${
                              set.completed 
                                ? 'bg-fitrex-lime/[0.07] text-slate-100' 
                                : isSetTimerRunning 
                                ? 'bg-fitrex-cyan/[0.08] text-slate-100'
                                : 'hover:bg-slate-900/40'
                            }`}
                          >
                            {/* Set Number */}
                            <td className="py-3 px-2 text-center font-extrabold text-xs mono-num text-slate-400">
                              {set.setNum}
                            </td>

                            {/* Set Type Badge */}
                            <td className="py-3 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => cycleSetType(exLog.id, set.id, set.type || 'N')}
                                className={`w-7 h-7 rounded-lg font-black text-xs uppercase transition-all inline-flex items-center justify-center ${
                                  set.type === 'W'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                    : set.type === 'D'
                                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                                    : set.type === 'F'
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                                }`}
                                title="Toggle Set Type"
                              >
                                {set.type || 'N'}
                              </button>
                            </td>

                            {/* Previous Performance */}
                            <td className="py-3 px-2 text-center text-xs text-slate-400 mono-num font-semibold">
                              {set.previous || '-'}
                            </td>

                            {/* Weight with Steppers */}
                            <td className="py-3 px-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleAdjustWeight(exLog.id, set.id, set.weight, -2.5)}
                                  className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold flex items-center justify-center"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  step="0.5"
                                  value={set.weight}
                                  onChange={e => handleSetChange(exLog.id, set.id, 'weight', e.target.value)}
                                  className={`w-14 input-pro py-1 px-1 text-center text-xs font-black mono-num ${
                                    set.completed ? 'border-fitrex-lime/50 text-fitrex-lime bg-slate-900' : ''
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAdjustWeight(exLog.id, set.id, set.weight, 2.5)}
                                  className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold flex items-center justify-center"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            {/* Reps with Steppers */}
                            <td className="py-3 px-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleAdjustReps(exLog.id, set.id, set.reps, -1)}
                                  className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold flex items-center justify-center"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  value={set.reps}
                                  onChange={e => handleSetChange(exLog.id, set.id, 'reps', e.target.value)}
                                  className={`w-12 input-pro py-1 px-1 text-center text-xs font-black mono-num ${
                                    set.completed ? 'border-fitrex-lime/50 text-fitrex-lime bg-slate-900' : ''
                                  }`}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAdjustReps(exLog.id, set.id, set.reps, 1)}
                                  className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold flex items-center justify-center"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            {/* INDIVIDUAL SET TIMER (Play / Pause / Reset button & Seconds) */}
                            <td className="py-3 px-3 text-center">
                              <div className="flex items-center justify-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded-xl border border-slate-800">
                                <button
                                  type="button"
                                  onClick={() => handleToggleSetTimer(set.id)}
                                  className={`p-1 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                                    isSetTimerRunning
                                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                                      : 'bg-fitrex-cyan/20 text-fitrex-cyan border border-fitrex-cyan/40 hover:bg-fitrex-cyan/30'
                                  }`}
                                  title={isSetTimerRunning ? 'Stop Set Timer' : 'Start Set Timer'}
                                >
                                  {isSetTimerRunning ? (
                                    <Pause className="w-3 h-3 fill-current" />
                                  ) : (
                                    <Play className="w-3 h-3 fill-current ml-0.5" />
                                  )}
                                </button>

                                <span className={`text-xs font-black mono-num ${
                                  isSetTimerRunning ? 'text-fitrex-cyan animate-pulse' : 'text-slate-300'
                                }`}>
                                  {formatSetTime(set.durationSeconds || 0)}
                                </span>

                                {(set.durationSeconds || 0) > 0 && !isSetTimerRunning && (
                                  <button
                                    type="button"
                                    onClick={() => handleResetSetTimer(exLog.id, set.id)}
                                    className="text-slate-500 hover:text-white p-0.5"
                                    title="Reset Set Time"
                                  >
                                    <RotateCcw className="w-2.5 h-2.5" />
                                  </button>
                                )}
                              </div>
                            </td>

                            {/* RPE Selector */}
                            <td className="py-3 px-2 text-center">
                              <select
                                value={set.rpe || 8}
                                onChange={e => handleSetChange(exLog.id, set.id, 'rpe', parseInt(e.target.value))}
                                className="input-pro py-1 px-1 text-center text-[11px] font-bold mono-num bg-slate-900 cursor-pointer"
                              >
                                <option value={10}>10</option>
                                <option value={9}>9</option>
                                <option value={8}>8</option>
                                <option value={7}>7</option>
                                <option value={6}>6</option>
                              </select>
                            </td>

                            {/* Done Checkbox */}
                            <td className="py-3 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleComplete(exLog, set)}
                                className={`w-8 h-8 rounded-xl border flex items-center justify-center mx-auto transition-all ${
                                  set.completed
                                    ? 'bg-fitrex-lime border-fitrex-lime text-slate-950 shadow-glow-lime scale-105'
                                    : 'bg-slate-900 border-slate-700 text-slate-600 hover:border-fitrex-lime/50'
                                }`}
                                title={set.completed ? 'Completed' : 'Mark Completed'}
                              >
                                <Check className={`w-5 h-5 font-black ${set.completed ? 'stroke-[3]' : 'opacity-0'}`} />
                              </button>
                            </td>

                            {/* Delete Set */}
                            <td className="py-3 px-1 text-center">
                              {exLog.sets.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSet(exLog.id, set.id)}
                                  className="p-1.5 text-slate-600 hover:text-rose-400 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Set Actions: Add Set, Duplicate, Plate Calc */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddSet(exLog.id)}
                      className="btn-pro-secondary text-xs py-1.5 px-3 border-dashed border-slate-700 hover:border-fitrex-lime/50"
                    >
                      <Plus className="w-3.5 h-3.5 text-fitrex-lime" /> Add Set
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const sets = exLog.sets || [];
                        if (sets.length > 0) {
                          const last = sets[sets.length - 1];
                          const newSet = {
                            id: 'set_' + Date.now(),
                            setNum: sets.length + 1,
                            type: last.type || 'N',
                            weight: last.weight,
                            reps: last.reps,
                            durationSeconds: 0,
                            rpe: last.rpe || 8,
                            completed: false,
                            previous: last.previous
                          };
                          const updated = currentWorkout.exercises.map(e => e.id === exLog.id ? { ...e, sets: [...sets, newSet] } : e);
                          const updatedWo = { ...currentWorkout, exercises: updated };
                          setCurrentWorkout(updatedWo);
                          saveWorkout(updatedWo, activeProfileId);
                        }
                      }}
                      className="btn-pro-secondary text-xs py-1.5 px-3 text-slate-400 hover:text-white"
                    >
                      <Copy className="w-3.5 h-3.5" /> Duplicate Last Set
                    </button>
                  </div>

                  {exLog.sets?.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setPlateCalcWeight(exLog.sets[exLog.sets.length - 1]?.weight || 60)}
                      className="text-xs text-slate-400 hover:text-fitrex-lime flex items-center gap-1 transition-colors"
                    >
                      <Calculator className="w-3.5 h-3.5" /> Calculate Barbell Plates
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Workout Notes */}
      {currentWorkout?.exercises?.length > 0 && (
        <div className="pro-card p-5 border-slate-800 space-y-3">
          <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-fitrex-lime" /> Workout Reflection & Notes
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Chest felt explosive, added 2.5kg to bench press, took 90s rest..."
            value={currentWorkout.notes || ''}
            onChange={e => {
              const updated = { ...currentWorkout, notes: e.target.value };
              setCurrentWorkout(updated);
              saveWorkout(updated, activeProfileId);
            }}
            className="w-full input-pro text-xs"
          />
        </div>
      )}

      {/* REDESIGNED EXERCISE PICKER MODAL WITH FULL LIST, PHOTOS & VIDEOS */}
      {showExercisePicker && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-2xl pro-card p-5 sm:p-6 border-slate-700 max-h-[88vh] flex flex-col shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-fitrex-lime" /> Exercise Library ({filteredPickerExercises.length} Movements)
                </h3>
                <p className="text-xs text-slate-400">Select any exercise with video form guide and thumbnail photo</p>
              </div>
              <button
                onClick={() => setShowExercisePicker(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative my-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search all 40+ exercises (e.g. Bench, Squat, Lat Pulldown, Curls)..."
                value={pickerSearch}
                onChange={e => setPickerSearch(e.target.value)}
                className="w-full input-pro pl-10 text-xs py-2.5"
                autoFocus
              />
            </div>

            {/* Category Filter Chips including 'ALL' */}
            <div className="flex gap-1.5 overflow-x-auto pb-3 border-b border-slate-800/80 no-scrollbar">
              <button
                onClick={() => setPickerMuscle('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                  pickerMuscle === 'all'
                    ? 'bg-fitrex-lime text-slate-950 shadow-glow-lime'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                All Exercises ({allExercisesList.length})
              </button>

              {MUSCLE_GROUPS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setPickerMuscle(m.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    pickerMuscle === m.id
                      ? 'bg-fitrex-lime text-slate-950 shadow-glow-lime'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>

            {/* Exercises Visual Grid with Photos & Videos */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
              {filteredPickerExercises.map(ex => (
                <div
                  key={ex.id}
                  className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-fitrex-lime/50 hover:bg-slate-850 transition-all flex items-center justify-between gap-3 group"
                >
                  {/* Photo Thumbnail */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={ex.photoUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&auto=format&fit=crop&q=80'}
                      alt={ex.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-700/80 shrink-0 shadow-md group-hover:scale-105 transition-transform"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-fitrex-lime/10 text-fitrex-lime border border-fitrex-lime/30">
                          {ex.muscle}
                        </span>
                        {ex.secondaryMuscles?.length > 0 && (
                          <span className="text-[10px] text-slate-400 hidden sm:inline">
                            + {ex.secondaryMuscles.join(', ')}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-extrabold text-white group-hover:text-fitrex-lime transition-colors truncate mt-0.5">
                        {ex.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {ex.cues?.[0] || 'Proper posture guide with form checkpoints'}
                      </p>
                    </div>
                  </div>

                  {/* Actions: View Video / Add */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedExerciseForModal(ex)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-fitrex-lime transition-colors"
                      title="Watch Form Demonstration Video"
                    >
                      <Video className="w-4 h-4 text-fitrex-lime" />
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
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Posture & Form Guide Modal */}
      <PostureModal
        exercise={selectedExerciseForModal}
        isOpen={!!selectedExerciseForModal}
        onClose={() => setSelectedExerciseForModal(null)}
        onUpdateExercise={(updated) => {
          setSelectedExerciseForModal(updated);
          if (currentWorkout) {
            const updatedList = currentWorkout.exercises.map(e => e.id === updated.id ? { ...e, ...updated } : e);
            const wo = { ...currentWorkout, exercises: updatedList };
            setCurrentWorkout(wo);
            saveWorkout(wo, activeProfileId);
          }
        }}
      />

      {/* Plate Calculator Modal */}
      <PlateCalculatorModal
        isOpen={plateCalcWeight !== null}
        onClose={() => setPlateCalcWeight(null)}
        initialWeight={plateCalcWeight || 60}
      />

    </div>
  );
}
