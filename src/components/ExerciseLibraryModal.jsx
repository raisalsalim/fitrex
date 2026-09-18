import React, { useState } from 'react';
import { BookOpen, Search, Plus, Info, Video, Dumbbell } from 'lucide-react';
import { MUSCLE_GROUPS, EQUIPMENT_LIST } from '../data/defaultExercises';
import { getAllExercises, saveCustomExercise } from '../services/storage';
import PostureModal from './PostureModal';

export default function ExerciseLibraryModal({ onAddExerciseToWorkout }) {
  const [exercises, setExercises] = useState(getAllExercises());
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewExercise, setViewExercise] = useState(null);
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);

  const [customName, setCustomName] = useState('');
  const [customMuscle, setCustomMuscle] = useState('chest');
  const [customVideo, setCustomVideo] = useState('');
  const [customPhoto, setCustomPhoto] = useState('');
  const [customCue, setCustomCue] = useState('');

  const filtered = exercises.filter(ex => {
    const matchMuscle = selectedMuscle === 'all' || ex.muscle === selectedMuscle;
    const matchEquipment = selectedEquipment === 'all' || ex.equipment === selectedEquipment;
    const matchSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (ex.muscle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (ex.equipment || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchMuscle && matchEquipment && matchSearch;
  });

  const handleCreateCustom = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;

    saveCustomExercise({
      name: customName.trim(),
      muscle: customMuscle,
      equipment: 'dumbbell',
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
      
      {/* Search & Actions Bar with Sticky-safe layout */}
      <div className="pro-card p-5 sm:p-6 border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-fitrex-red" /> Exercise Library & Form Guides
            </h2>
            <p className="text-xs text-slate-400">Search {exercises.length} gym movements with posture cues, pictures & videos</p>
          </div>

          <button
            onClick={() => setIsCreatingCustom(true)}
            className="btn-pro-primary text-xs py-2 px-4 w-full sm:w-auto shadow-glow-red"
          >
            <Plus className="w-4 h-4" /> Create Custom Exercise
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search all 100+ exercises (Shoulder press, Squat, Lat pulldown, Curls, Pushups)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full input-pro pl-10 text-xs py-3"
          />
        </div>

        {/* MUSCLE FILTER TABS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-1 no-scrollbar scroll-smooth">
          <button
            onClick={() => setSelectedMuscle('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap shrink-0 transition-all ${
              selectedMuscle === 'all'
                ? 'bg-fitrex-red text-white shadow-glow-red'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            All Movements ({exercises.length})
          </button>

          {MUSCLE_GROUPS.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedMuscle(m.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                selectedMuscle === m.id
                  ? 'bg-fitrex-red text-white shadow-glow-red'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* EQUIPMENT FILTER TABS */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
          {EQUIPMENT_LIST.map(eq => (
            <button
              key={eq.id}
              onClick={() => setSelectedEquipment(eq.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap shrink-0 transition-all ${
                selectedEquipment === eq.id
                  ? 'bg-slate-700 text-white border border-slate-500'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {eq.name}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises Visual Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filtered.map(ex => (
          <div
            key={ex.id}
            className="pro-card p-4 border-slate-800 flex flex-col justify-between hover:border-fitrex-red/40 transition-all group shadow-lg"
          >
            <div>
              <div className="relative h-44 rounded-2xl overflow-hidden mb-3 bg-slate-950 border border-slate-800">
                <img
                  src={ex.photoUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80'}
                  alt={ex.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-fitrex-red border border-fitrex-red/40">
                    {ex.muscle}
                  </span>
                  {ex.equipment && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-slate-300 border border-slate-700">
                      {ex.equipment}
                    </span>
                  )}
                  {ex.defaultUnit === 'blocks' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/80 text-black">
                      Blocks
                    </span>
                  )}
                  {ex.isCustom && (
                    <span className="text-[10px] bg-purple-500/80 text-white px-2 py-0.5 rounded-full font-bold">
                      Custom
                    </span>
                  )}
                </div>

                {ex.youtubeUrl && (
                  <button
                    onClick={() => setViewExercise(ex)}
                    className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-black/85 backdrop-blur-md text-fitrex-red text-[11px] font-bold flex items-center gap-1.5 border border-fitrex-red/40 hover:bg-fitrex-red hover:text-white transition-colors"
                  >
                    <Video className="w-3.5 h-3.5" /> Watch Video
                  </button>
                )}
              </div>

              <h3 className="text-base font-extrabold text-white group-hover:text-fitrex-red transition-colors">
                {ex.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                {ex.cues?.[0] || 'View form checkpoints and video tutorial.'}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pt-3.5 mt-3 border-t border-slate-800/80">
              <button
                onClick={() => setViewExercise(ex)}
                className="btn-pro-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <Info className="w-3.5 h-3.5 text-fitrex-red" /> Form Cues
              </button>

              {onAddExerciseToWorkout && (
                <button
                  onClick={() => onAddExerciseToWorkout(ex)}
                  className="btn-pro-primary text-xs py-1.5 px-3.5 shadow-glow-red"
                >
                  Add to Workout +
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

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