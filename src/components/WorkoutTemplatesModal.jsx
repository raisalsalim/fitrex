import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, Dumbbell, Plus, Trash2, Edit3, Check, RotateCcw, 
  ChevronRight, Bookmark, Play, Layers
} from 'lucide-react';
import { 
  getWorkoutTemplates, saveWorkoutTemplate, deleteWorkoutTemplate, 
  resetWorkoutTemplatesToDefault, getAllExercises 
} from '../services/storage';

export default function WorkoutTemplatesModal({ 
  isOpen, 
  onClose, 
  onLoadTemplate, 
  currentDayExercises = [] 
}) {
  const [templates, setTemplates] = useState([]);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form State for edit / new
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('chest');
  const [editExercises, setEditExercises] = useState([]);
  const [searchAddExercise, setSearchAddExercise] = useState('');

  const allExercises = getAllExercises();

  useEffect(() => {
    if (isOpen) {
      const tpls = getWorkoutTemplates();
      setTemplates(tpls);
      if (tpls.length > 0 && !activeTemplate) {
        setActiveTemplate(tpls[0]);
      }
      setIsEditing(false);
      setIsCreatingNew(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartEdit = (tpl) => {
    setActiveTemplate(tpl);
    setEditName(tpl.name);
    setEditCategory(tpl.muscleCategory || 'chest');
    setEditExercises([...tpl.exercises]);
    setIsEditing(true);
    setIsCreatingNew(false);
  };

  const handleStartCreateNew = () => {
    setEditName('');
    setEditCategory('chest');
    setEditExercises([]);
    setIsCreatingNew(true);
    setIsEditing(true);
  };

  const handleSaveCurrentDayAsTemplate = () => {
    if (!currentDayExercises || currentDayExercises.length === 0) {
      alert('No exercises logged in today\'s workout to save!');
      return;
    }
    const names = currentDayExercises.map(e => e.name);
    setEditName('Custom ' + (currentDayExercises[0]?.muscle || 'Workout') + ' Routine');
    setEditCategory(currentDayExercises[0]?.muscle || 'chest');
    setEditExercises(names);
    setIsCreatingNew(true);
    setIsEditing(true);
  };

  const handleRemoveExerciseFromEdit = (index) => {
    setEditExercises(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleAddExerciseToEdit = (exName) => {
    if (!editExercises.includes(exName)) {
      setEditExercises(prev => [...prev, exName]);
    }
    setSearchAddExercise('');
  };

  const handleSaveTemplateSubmit = (e) => {
    e?.preventDefault();
    if (!editName.trim()) {
      alert('Please enter a template name');
      return;
    }
    if (editExercises.length === 0) {
      alert('Please include at least one exercise in the template');
      return;
    }

    const tplData = {
      id: isCreatingNew ? 'tpl_' + Date.now() : activeTemplate.id,
      name: editName.trim(),
      muscleCategory: editCategory,
      icon: 'Sparkles',
      exercises: editExercises
    };

    const updated = saveWorkoutTemplate(tplData);
    setTemplates(updated);
    setActiveTemplate(tplData);
    setIsEditing(false);
    setIsCreatingNew(false);
  };

  const handleDeleteTemplate = (tplId, e) => {
    e?.stopPropagation();
    if (templates.length <= 1) {
      alert('You must have at least one template.');
      return;
    }
    if (!confirm('Delete this template?')) return;
    const updated = deleteWorkoutTemplate(tplId);
    setTemplates(updated);
    setActiveTemplate(updated[0] || null);
  };

  const handleResetDefaults = () => {
    if (!confirm('Reset all templates back to default Shoulder, Leg, Wings, Biceps, Chest, Triceps templates?')) return;
    const defs = resetWorkoutTemplatesToDefault();
    setTemplates(defs);
    setActiveTemplate(defs[0]);
    setIsEditing(false);
  };

  const filteredSearchExercises = allExercises.filter(ex => 
    ex.name.toLowerCase().includes(searchAddExercise.toLowerCase()) ||
    (ex.muscle || '').toLowerCase().includes(searchAddExercise.toLowerCase())
  ).slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-3xl pro-card border-slate-700 max-h-[90vh] flex flex-col shadow-2xl overflow-hidden bg-[#080c16]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#080c16] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-fitrex-red/15 border border-fitrex-red/40 flex items-center justify-center text-fitrex-red">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                Saved Workout Templates
              </h3>
              <p className="text-xs text-slate-400">Load preset routines or customize your exercise lists</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
              title="Reset default templates"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 pb-2 border-b border-slate-800/80">
            <button
              onClick={handleStartCreateNew}
              className="btn-pro-primary text-xs py-2 px-3 flex items-center gap-1.5 shadow-glow-red"
            >
              <Plus className="w-4 h-4" /> New Custom Template
            </button>

            {currentDayExercises?.length > 0 && (
              <button
                onClick={handleSaveCurrentDayAsTemplate}
                className="btn-pro-secondary text-xs py-2 px-3 flex items-center gap-1.5 border-dashed border-slate-700 text-fitrex-red hover:text-white"
              >
                <Bookmark className="w-3.5 h-3.5" /> Save Today's Exercises as Template
              </button>
            )}
          </div>

          {isEditing ? (
            /* ================= EDIT / CREATE TEMPLATE VIEW ================= */
            <form onSubmit={handleSaveTemplateSubmit} className="space-y-4 bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  {isCreatingNew ? 'Create New Template' : `Edit ${activeTemplate?.name}`}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="e.g. Chest & Triceps, Leg Day"
                    className="w-full input-pro text-xs py-2.5"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Primary Muscle Group
                  </label>
                  <select
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value)}
                    className="w-full input-pro text-xs py-2.5 bg-slate-900"
                  >
                    <option value="chest">Chest</option>
                    <option value="wings">Wings (Back)</option>
                    <option value="shoulders">Shoulders</option>
                    <option value="biceps">Biceps</option>
                    <option value="triceps">Triceps</option>
                    <option value="legs">Legs</option>
                    <option value="core">Abs & Core</option>
                    <option value="cardio">Cardio / Full</option>
                  </select>
                </div>
              </div>

              {/* Exercises in Template List */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  Exercises in this Template ({editExercises.length})
                </label>
                
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {editExercises.map((exName, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] mono-num">
                          {idx + 1}
                        </span>
                        {exName}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExerciseFromEdit(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Remove from template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Exercise to Template */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-300 block">
                  + Add More Exercises to Template
                </label>
                <input
                  type="text"
                  placeholder="Search 107+ exercises to add..."
                  value={searchAddExercise}
                  onChange={e => setSearchAddExercise(e.target.value)}
                  className="w-full input-pro text-xs py-2"
                />

                {searchAddExercise && (
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 max-h-36 overflow-y-auto space-y-1">
                    {filteredSearchExercises.map(ex => (
                      <div
                        key={ex.id}
                        onClick={() => handleAddExerciseToEdit(ex.name)}
                        className="p-2 rounded-lg hover:bg-slate-800/80 cursor-pointer flex items-center justify-between text-xs text-slate-200"
                      >
                        <span>{ex.name} <span className="text-[10px] text-slate-400">({ex.muscle})</span></span>
                        <span className="text-fitrex-red text-xs font-bold">+ Add</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-pro-secondary flex-1 text-xs py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-pro-primary flex-1 text-xs py-2.5 shadow-glow-red"
                >
                  Save Template
                </button>
              </div>
            </form>
          ) : (
            /* ================= VIEW TEMPLATES LIST ================= */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {templates.map(tpl => (
                <div
                  key={tpl.id}
                  className="pro-card p-4 border-slate-800 hover:border-fitrex-red/50 transition-all flex flex-col justify-between bg-[#0a0e1c] shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase px-2 py-0.5 rounded-full bg-fitrex-red/20 text-fitrex-red border border-fitrex-red/30">
                          {tpl.muscleCategory || 'Routine'}
                        </span>
                        <h4 className="text-base font-black text-white">{tpl.name}</h4>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(tpl)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                          title="Edit exercise list"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {templates.length > 1 && (
                          <button
                            onClick={(e) => handleDeleteTemplate(tpl.id, e)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                            title="Delete template"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Exercises List in Template */}
                    <div className="space-y-1 my-3 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 max-h-40 overflow-y-auto">
                      {tpl.exercises.map((exName, idx) => (
                        <div key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-fitrex-red shrink-0"></span>
                          <span className="truncate">{exName}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Load Template into Today's Workout Button */}
                  <button
                    onClick={() => {
                      onLoadTemplate(tpl);
                      onClose();
                    }}
                    className="w-full btn-pro-primary py-2 text-xs font-black flex items-center justify-center gap-1.5 shadow-glow-red mt-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Load {tpl.name} into Today
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}