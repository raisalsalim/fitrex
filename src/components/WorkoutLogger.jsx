import React, { useState, useEffect } from 'react';
import { 
  Calendar, ChevronLeft, ChevronRight, Plus, Trash2, Check, Copy, 
  Dumbbell, Flame, Trophy, Info, Sparkles, MessageSquare, Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MUSCLE_GROUPS, DEFAULT_EXERCISES } from '../data/defaultExercises';
import { 
  getWorkouts, saveWorkout, getPreviousPerformance, 
  getAllExercises, getSettings, getPersonalRecords, getActiveProfileId 
} from '../services/storage';
import PostureModal from './PostureModal';

export default function WorkoutLogger({ onTriggerTimer, activeProfileId }) {
  const settings = getSettings();
  const unit = settings.unit || 'kg';

  // Current Date State
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [selectedMuscles, setSelectedMuscles] = useState(['chest']);
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState(null);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [pickerMuscle, setPickerMuscle] = useState('chest');
  const [personalRecords, setPersonalRecords] = useState({});

  // Compute Day of Week
  const getDayName = (dateStr) => {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Load or initialize workout for current date
  useEffect(() => {
    const workouts = getWorkouts(activeProfileId);
    const existing = workouts.find(w => w.date === selectedDate);

    if (existing) {
      setCurrentWorkout(existing);
      setSelectedMuscles(existing.muscles || ['chest']);
    } else {
      // Create blank draft session
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

  const changeDate = (days) => {
    const d = new Date(selectedDate + 'T12:00:00');
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const toggleMuscle = (muscleId) => {
    let next;
    if (selectedMuscles.includes(muscleId)) {
      if (selectedMuscles.length === 1) return; // Keep at least one
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

  // Add exercise to current workout
  const handleAddExercise = (exerciseTemplate) => {
    if (!currentWorkout) return;

    // Look up previous performance for this exercise
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
          id: 'set_1',
          setNum: 1,
          type: 'N', // 'N' = Normal, 'W' = Warmup, 'D' = Drop Set, 'F' = Failure
          weight: prev?.weight || (unit === 'kg' ? 60 : 135),
          reps: prev?.reps || 10,
          completed: false,
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

  // Sets Management
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
        completed: false,
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

  const handleToggleComplete = (exerciseLog, set) => {
    const isNowComplete = !set.completed;
    handleSetChange(exerciseLog.id, set.id, 'completed', isNowComplete);

    if (isNowComplete) {
      // 1. Check for Personal Record (PR)
      const currentWeight = Number(set.weight) || 0;
      const currentReps = Number(set.reps) || 0;
      const existingPR = personalRecords[exerciseLog.name]?.maxWeight || 0;

      if (currentWeight > 0 && currentWeight > existingPR && existingPR > 0) {
        // Trigger celebratory PR confetti!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      // 2. Trigger floating rest timer
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

  const allExercisesList = getAllExercises();

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      
      {/* Date Header & Quick Switcher */}
      <div className="glass-card p-4 sm:p-5 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
              <Calendar className="w-5 h-5 text-emerald-400" />
              {getDayName(selectedDate)}
            </h2>
            <p className="text-xs text-slate-400">
              {selectedDate === new Date().toISOString().split('T')[0] ? (
                <span className="text-emerald-400 font-semibold">Today's Session</span>
              ) : (
                'Workout Log'
              )}
            </p>
          </div>

          <button
            onClick={() => changeDate(1)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="btn-secondary text-xs py-1.5 px-3"
          >
            Today
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="input-field text-xs py-1.5 px-2.5 cursor-pointer"
          />
        </div>
      </div>

      {/* Muscle Group Chips (Select 1, 2, 3+) */}
      <div className="glass-card p-4 sm:p-5 border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-emerald-400" /> Target Muscles (Pick 1, 2, or 3+)
          </h3>
          <span className="text-[11px] text-slate-400">
            {selectedMuscles.length} selected
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {MUSCLE_GROUPS.map(m => {
            const isSelected = selectedMuscles.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleMuscle(m.id)}
                className={`badge-muscle text-xs py-2 px-3.5 transition-all ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/10 scale-105'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {m.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Exercises Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-emerald-400" /> Logged Exercises
          </h3>
          
          <button
            onClick={() => {
              setPickerMuscle(selectedMuscles[0] || 'chest');
              setShowExercisePicker(true);
            }}
            className="btn-primary text-xs py-2 px-3.5"
          >
            <Plus className="w-4 h-4" /> Add Exercise
          </button>
        </div>

        {/* Exercises List */}
        {(!currentWorkout?.exercises || currentWorkout.exercises.length === 0) ? (
          <div className="glass-card p-10 text-center border-dashed border-slate-800 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-500 mb-3">
              <Dumbbell className="w-7 h-7 -rotate-45" />
            </div>
            <h4 className="text-base font-semibold text-white mb-1">No exercises logged yet for this date</h4>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              Select your target muscles above and tap "Add Exercise" to record your sets, weights, and reps.
            </p>
            <button
              onClick={() => {
                setPickerMuscle(selectedMuscles[0] || 'chest');
                setShowExercisePicker(true);
              }}
              className="btn-primary text-xs py-2.5 px-4"
            >
              <Plus className="w-4 h-4" /> Browse & Add Exercise
            </button>
          </div>
        ) : (
          currentWorkout.exercises.map((exLog, exIdx) => {
            const pr = personalRecords[exLog.name];
            return (
              <div key={exLog.id} className="glass-card p-4 sm:p-5 border-slate-800 space-y-4">
                
                {/* Exercise Header */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-bold flex items-center justify-center">
                      {exIdx + 1}
                    </span>
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        {exLog.name}
                        {pr && pr.maxWeight > 0 && (
                          <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                            <Trophy className="w-3 h-3" /> PR: {pr.maxWeight}{unit}
                          </span>
                        )}
                      </h4>
                      <span className="text-[11px] text-emerald-400/80 uppercase font-semibold">
                        {exLog.muscle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedExerciseForModal(exLog)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                      title="Posture & Form Guide (YouTube & Photos)"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveExercise(exLog.id)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                      title="Delete Exercise"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sets Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                        <th className="py-2 px-1 text-center w-10">Set</th>
                        <th className="py-2 px-1 text-center w-12" title="Click to cycle: Normal, Warmup, Drop, Failure">Type</th>
                        <th className="py-2 px-2 text-center">Previous</th>
                        <th className="py-2 px-2 text-center">{unit.toUpperCase()}</th>
                        <th className="py-2 px-2 text-center">Reps</th>
                        <th className="py-2 px-1 text-center w-12">Done</th>
                        <th className="py-2 px-1 w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {(exLog.sets || []).map((set) => (
                        <tr
                          key={set.id}
                          className={`transition-colors ${
                            set.completed ? 'bg-emerald-500/5 text-emerald-200' : 'hover:bg-slate-900/30'
                          }`}
                        >
                          {/* Set Number */}
                          <td className="py-2.5 px-1 text-center font-bold text-xs mono-num text-slate-400">
                            {set.setNum}
                          </td>

                          {/* Set Type */}
                          <td className="py-2.5 px-1 text-center">
                            <button
                              type="button"
                              onClick={() => cycleSetType(exLog.id, set.id, set.type || 'N')}
                              className={`w-6 h-6 rounded-md font-bold text-[10px] uppercase transition-colors inline-flex items-center justify-center ${
                                set.type === 'W'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : set.type === 'D'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                  : set.type === 'F'
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                              title="Click to toggle Warmup (W), Drop Set (D), Failure (F), or Normal (1)"
                            >
                              {set.type || 'N'}
                            </button>
                          </td>

                          {/* Previous */}
                          <td className="py-2.5 px-2 text-center text-xs text-slate-500 mono-num">
                            {set.previous || '-'}
                          </td>

                          {/* Weight */}
                          <td className="py-2.5 px-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <input
                                type="number"
                                step="0.5"
                                value={set.weight}
                                onChange={e => handleSetChange(exLog.id, set.id, 'weight', e.target.value)}
                                className={`w-16 input-field py-1 px-1.5 text-center text-xs font-bold mono-num ${
                                  set.completed ? 'border-emerald-500/40 text-emerald-300' : ''
                                }`}
                              />
                            </div>
                          </td>

                          {/* Reps */}
                          <td className="py-2.5 px-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <input
                                type="number"
                                value={set.reps}
                                onChange={e => handleSetChange(exLog.id, set.id, 'reps', e.target.value)}
                                className={`w-14 input-field py-1 px-1.5 text-center text-xs font-bold mono-num ${
                                  set.completed ? 'border-emerald-500/40 text-emerald-300' : ''
                                }`}
                              />
                            </div>
                          </td>

                          {/* Completed Checkbox */}
                          <td className="py-2.5 px-1 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleComplete(exLog, set)}
                              className={`w-7 h-7 rounded-lg border flex items-center justify-center mx-auto transition-all ${
                                set.completed
                                  ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30'
                                  : 'bg-slate-900 border-slate-700 text-slate-600 hover:border-emerald-500/40'
                              }`}
                              title={set.completed ? 'Completed (Click to unmark)' : 'Mark Set Completed'}
                            >
                              <Check className={`w-4 h-4 font-bold ${set.completed ? 'scale-110' : 'opacity-0'}`} />
                            </button>
                          </td>

                          {/* Delete Set */}
                          <td className="py-2.5 px-1 text-center">
                            {exLog.sets.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSet(exLog.id, set.id)}
                                className="p-1 text-slate-600 hover:text-rose-400 rounded transition-colors"
                                title="Remove Set"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add Set Button */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => handleAddSet(exLog.id)}
                    className="btn-secondary text-xs py-1.5 px-3 border-dashed border-slate-700 hover:border-emerald-500/40"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Set
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
                          completed: false,
                          previous: last.previous
                        };
                        const updated = currentWorkout.exercises.map(e => e.id === exLog.id ? { ...e, sets: [...sets, newSet] } : e);
                        const updatedWo = { ...currentWorkout, exercises: updated };
                        setCurrentWorkout(updatedWo);
                        saveWorkout(updatedWo, activeProfileId);
                      }
                    }}
                    className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-3 h-3" /> Duplicate Set
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Workout Session Notes */}
      {currentWorkout?.exercises?.length > 0 && (
        <div className="glass-card p-4 sm:p-5 border-slate-800 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> Workout Reflection & Notes
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Great chest pump today, energy was 9/10, improved bench press form..."
            value={currentWorkout.notes || ''}
            onChange={e => {
              const updated = { ...currentWorkout, notes: e.target.value };
              setCurrentWorkout(updated);
              saveWorkout(updated, activeProfileId);
            }}
            className="w-full input-field text-xs"
          />
        </div>
      )}

      {/* Exercise Picker Modal */}
      {showExercisePicker && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-card p-5 border-slate-700 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-emerald-400" /> Choose Exercise
              </h3>
              <button
                onClick={() => setShowExercisePicker(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Muscle Filter Tabs in Picker */}
            <div className="flex gap-1.5 overflow-x-auto py-3 border-b border-slate-800/80 no-scrollbar">
              {MUSCLE_GROUPS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setPickerMuscle(m.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    pickerMuscle === m.id
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>

            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1">
              {allExercisesList
                .filter(ex => ex.muscle === pickerMuscle)
                .map(ex => (
                  <div
                    key={ex.id}
                    onClick={() => handleAddExercise(ex)}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850 cursor-pointer flex items-center justify-between transition-all group"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {ex.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {ex.cues?.[0] || 'Proper gym posture guide'}
                      </p>
                    </div>
                    <span className="btn-secondary text-[11px] py-1 px-2.5 group-hover:bg-emerald-500 group-hover:text-slate-950 group-hover:border-emerald-500 transition-all">
                      Add +
                    </span>
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
          // Also update in current workout exercises
          if (currentWorkout) {
            const updatedList = currentWorkout.exercises.map(e => e.id === updated.id ? { ...e, ...updated } : e);
            const wo = { ...currentWorkout, exercises: updatedList };
            setCurrentWorkout(wo);
            saveWorkout(wo, activeProfileId);
          }
        }}
      />

    </div>
  );
}
