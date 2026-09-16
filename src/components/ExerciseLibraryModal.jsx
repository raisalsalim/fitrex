import React, { useState } from 'react';
import { BookOpen, Search, Plus, ExternalLink, Info, Check } from 'lucide-react';
import { MUSCLE_GROUPS, DEFAULT_EXERCISES } from '../data/defaultExercises';
import { getAllExercises, saveCustomExercise } from '../services/storage';
import PostureModal from './PostureModal';

export default function ExerciseLibraryModal({ onAddExerciseToWorkout }) {
  const [exercises, setExercises] = useState(getAllExercises());
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewExercise, setViewExercise] = useState(null);
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);

  // New Custom Exercise State
  const [customName, setCustomName] = useState('');
  const [customMuscle, setCustomMuscle] = useState('chest');
  const [customVideo, setCustomVideo] = useState('');
  const [customPhoto, setCustomPhoto] = useState('');
  const [customCue, setCustomCue] = useState('');

  const filtered = exercises.filter(ex => {
    const matchMuscle = selectedMuscle === 'all' || ex.muscle === selectedMuscle;
    const matchSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchMuscle && matchSearch;
  });

  const handleCreateCustom = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newEx = saveCustomExercise({
      name: customName.trim(),
      muscle: customMuscle,
      youtubeUrl: customVideo.trim(),
      photoUrl: customPhoto.trim(),
      cues: customCue ? [customCue.trim()] : ['Focus on proper posture and controlled tempo.'],
      mistakes: ['Swinging with momentum']
    });

    setExercises(getAllExercises());
    setIsCreatingCustom(false);
    setCustomName('');
    setCustomVideo('');
    setCustomPhoto('');
    setCustomCue('');
  };

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      
      {/* Search & Actions Bar */}
      <div className="glass-card p-5 border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" /> Exercise Library & Form Guides
            </h2>
            <p className="text-xs text-slate-400">Search 40+ exercises with video tutorials, posture cues & setup notes</p>
          </div>

          <button
            onClick={() => setIsCreatingCustom(true)}
            className="btn-primary text-xs py-2 px-3.5 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" /> Create Custom Exercise
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search exercises (e.g. Bench press, Squat, Lat pulldown)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full input-field pl-10 text-xs py-2.5"
          />
        </div>

        {/* Muscle Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedMuscle('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedMuscle === 'all'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All Muscles ({exercises.length})
          </button>
          {MUSCLE_GROUPS.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedMuscle(m.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedMuscle === m.id
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(ex => (
          <div
            key={ex.id}
            className="glass-card p-4 border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="badge-muscle bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                  {ex.muscle}
                </span>
                {ex.isCustom && (
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-semibold">
                    Custom
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                {ex.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                {ex.cues?.[0] || 'View form guide for posture cues and video tutorial.'}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pt-4 mt-3 border-t border-slate-800/80">
              <button
                onClick={() => setViewExercise(ex)}
                className="btn-secondary text-xs py-1 px-3 flex items-center gap-1.5"
              >
                <Info className="w-3.5 h-3.5 text-emerald-400" /> View Form Guide
              </button>

              {onAddExerciseToWorkout && (
                <button
                  onClick={() => onAddExerciseToWorkout(ex)}
                  className="btn-primary text-xs py-1 px-3"
                >
                  Add to Workout
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Custom Exercise Modal */}
      {isCreatingCustom && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-card p-6 border-slate-700 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-4">Create Custom Exercise</h3>
            <form onSubmit={handleCreateCustom} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Exercise Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Incline Smith Machine Press"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  className="w-full input-field text-xs py-2"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Target Muscle *</label>
                <select
                  value={customMuscle}
                  onChange={e => setCustomMuscle(e.target.value)}
                  className="w-full input-field text-xs py-2 bg-slate-900"
                >
                  {MUSCLE_GROUPS.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">YouTube Tutorial Link (Optional)</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={customVideo}
                  onChange={e => setCustomVideo(e.target.value)}
                  className="w-full input-field text-xs py-2"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Posture Cue (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Retract shoulder blades, pause at bottom..."
                  value={customCue}
                  onChange={e => setCustomCue(e.target.value)}
                  className="w-full input-field text-xs py-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingCustom(false)}
                  className="btn-secondary text-xs py-2 px-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-3"
                >
                  Save Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posture Guide Modal */}
      <PostureModal
        exercise={viewExercise}
        isOpen={!!viewExercise}
        onClose={() => setViewExercise(null)}
        onUpdateExercise={(updated) => {
          setViewExercise(updated);
          setExercises(getAllExercises());
        }}
      />

    </div>
  );
}
