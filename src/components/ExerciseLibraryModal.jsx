import React, { useState } from 'react';
import { BookOpen, Search, Plus, ExternalLink, Info, Check, Video, Youtube } from 'lucide-react';
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
    const matchSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (ex.muscle || '').toLowerCase().includes(searchQuery.toLowerCase());
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
      <div className="pro-card p-6 border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-fitrex-lime" /> Exercise Library & Form Guides
            </h2>
            <p className="text-xs text-slate-400">Search {exercises.length} movements with demonstration videos, posture cues & setup notes</p>
          </div>

          <button
            onClick={() => setIsCreatingCustom(true)}
            className="btn-pro-primary text-xs py-2 px-4 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" /> Create Custom Movement
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search exercises by name or muscle (e.g. Bench press, Squat, Lat pulldown)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full input-pro pl-10 text-xs py-3"
          />
        </div>

        {/* Muscle Filter Tabs including ALL */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedMuscle('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
              selectedMuscle === 'all'
                ? 'bg-fitrex-lime text-slate-950 shadow-glow-lime'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All Movements ({exercises.length})
          </button>

          {MUSCLE_GROUPS.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedMuscle(m.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedMuscle === m.id
                  ? 'bg-fitrex-lime text-slate-950 shadow-glow-lime'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises Visual Grid with Photos & Videos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filtered.map(ex => (
          <div
            key={ex.id}
            className="pro-card p-4 border-slate-800 flex flex-col justify-between hover:border-fitrex-lime/40 transition-all group shadow-lg"
          >
            <div>
              {/* Photo & Muscle Badge */}
              <div className="relative h-44 rounded-2xl overflow-hidden mb-3 bg-slate-950 border border-slate-800">
                <img
                  src={ex.photoUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80'}
                  alt={ex.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-fitrex-lime border border-fitrex-lime/40">
                    {ex.muscle}
                  </span>
                  {ex.isCustom && (
                    <span className="text-[10px] bg-purple-500/80 text-white px-2 py-0.5 rounded-full font-bold">
                      Custom
                    </span>
                  )}
                </div>

                {ex.youtubeUrl && (
                  <button
                    onClick={() => setViewExercise(ex)}
                    className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md text-fitrex-lime text-[11px] font-bold flex items-center gap-1.5 border border-fitrex-lime/40 hover:bg-fitrex-lime hover:text-slate-950 transition-colors"
                  >
                    <Video className="w-3.5 h-3.5" /> Watch Video
                  </button>
                )}
              </div>

              <h3 className="text-base font-extrabold text-white group-hover:text-fitrex-lime transition-colors">
                {ex.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                {ex.cues?.[0] || 'View form guide for full posture cues and video tutorial.'}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pt-3.5 mt-3 border-t border-slate-800/80">
              <button
                onClick={() => setViewExercise(ex)}
                className="btn-pro-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <Info className="w-3.5 h-3.5 text-fitrex-lime" /> Form Checkpoints
              </button>

              {onAddExerciseToWorkout && (
                <button
                  onClick={() => onAddExerciseToWorkout(ex)}
                  className="btn-pro-primary text-xs py-1.5 px-3.5"
                >
                  Log Set +
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Custom Exercise Modal */}
      {isCreatingCustom && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md pro-card p-6 border-slate-700 shadow-2xl relative">
            <h3 className="text-lg font-black text-white mb-4">Create Custom Exercise</h3>
            <form onSubmit={handleCreateCustom} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Exercise Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Incline Smith Machine Press"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  className="w-full input-pro text-xs py-2.5"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Target Muscle *</label>
                <select
                  value={customMuscle}
                  onChange={e => setCustomMuscle(e.target.value)}
                  className="w-full input-pro text-xs py-2.5 bg-slate-900"
                >
                  {MUSCLE_GROUPS.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">YouTube Video Link (Optional)</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={customVideo}
                  onChange={e => setCustomVideo(e.target.value)}
                  className="w-full input-pro text-xs py-2.5"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Photo / Thumbnail URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={customPhoto}
                  onChange={e => setCustomPhoto(e.target.value)}
                  className="w-full input-pro text-xs py-2.5"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Key Posture Cue (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Retract shoulder blades, 2s pause at bottom..."
                  value={customCue}
                  onChange={e => setCustomCue(e.target.value)}
                  className="w-full input-pro text-xs py-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingCustom(false)}
                  className="btn-pro-secondary text-xs py-2 px-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-pro-primary text-xs py-2 px-3.5"
                >
                  Save Movement
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
