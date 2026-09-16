import React, { useState } from 'react';
import { X, UserPlus, Check, Trash2, User, Sparkles } from 'lucide-react';
import { getProfiles, saveProfiles, getActiveProfileId, setActiveProfileId } from '../services/storage';

const COLOR_OPTIONS = [
  '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#f97316', '#ef4444'
];

export default function ProfileSelectorModal({ isOpen, onClose, onProfileChanged }) {
  const [profiles, setProfiles] = useState(getProfiles());
  const [activeId, setActiveId] = useState(getActiveProfileId());
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);

  if (!isOpen) return null;

  const handleSelect = (id) => {
    setActiveId(id);
    setActiveProfileId(id);
    onProfileChanged(id);
    onClose();
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newProfile = {
      id: 'profile_' + Date.now(),
      name: newName.trim(),
      color: selectedColor,
      avatar: newName.trim().charAt(0).toUpperCase(),
      createdAt: Date.now()
    };

    const updated = [...profiles, newProfile];
    setProfiles(updated);
    saveProfiles(updated);
    setNewName('');
    setIsCreating(false);
    handleSelect(newProfile.id);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (profiles.length <= 1) {
      alert('You must have at least one user profile.');
      return;
    }
    if (!confirm('Are you sure you want to delete this profile and its logs?')) return;

    const updated = profiles.filter(p => p.id !== id);
    setProfiles(updated);
    saveProfiles(updated);

    if (activeId === id) {
      const nextId = updated[0].id;
      handleSelect(nextId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card p-6 relative border border-slate-700/60 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Switch Profile</h3>
            <p className="text-xs text-slate-400">Manage individual workouts, PRs, and body logs</p>
          </div>
        </div>

        {/* Profiles List */}
        <div className="space-y-2.5 mb-6 max-h-60 overflow-y-auto pr-1">
          {profiles.map(p => {
            const isActive = p.id === activeId;
            return (
              <div
                key={p.id}
                onClick={() => handleSelect(p.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isActive
                    ? 'bg-slate-800/80 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm"
                    style={{ backgroundColor: p.color || '#10b981' }}
                  >
                    {p.avatar || p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                      {p.name}
                      {isActive && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium">Active</span>}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {p.isDefault ? 'Default Profile' : 'User Profile'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {profiles.length > 1 && (
                    <button
                      onClick={(e) => handleDelete(p.id, e)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete Profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {isActive && <Check className="w-5 h-5 text-emerald-400 ml-1" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Create Profile Section */}
        {isCreating ? (
          <form onSubmit={handleCreate} className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">New Profile</h4>
            <input
              type="text"
              placeholder="e.g. John, Partner, Sarah"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="w-full input-field text-sm"
              autoFocus
              maxLength={24}
            />

            <div>
              <label className="text-[11px] text-slate-400 block mb-1.5">Theme Color</label>
              <div className="flex gap-2">
                {COLOR_OPTIONS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      selectedColor === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="btn-secondary flex-1 text-xs py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1 text-xs py-2"
              >
                Create Profile
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full btn-secondary py-2.5 text-xs font-semibold text-slate-200 border-dashed border-slate-700 hover:border-emerald-500/40 hover:text-emerald-400"
          >
            <UserPlus className="w-4 h-4 mr-1.5" /> Add Another User Profile
          </button>
        )}
      </div>
    </div>
  );
}
