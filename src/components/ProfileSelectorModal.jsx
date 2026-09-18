import React, { useState, useEffect } from 'react';
import { X, UserPlus, Check, Trash2, User, KeyRound, ShieldCheck, AlertCircle } from 'lucide-react';
import { 
  getProfiles, saveProfiles, getActiveProfileId, setActiveProfileId, 
  unlockSession, hashPin, verifyProfilePin 
} from '../services/storage';

export default function ProfileSelectorModal({ isOpen, onClose, onProfileChanged }) {
  const [profiles, setProfiles] = useState(getProfiles());
  const [activeId, setActiveId] = useState(getActiveProfileId());
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPin, setNewPin] = useState('');
  const [error, setError] = useState('');

  // Pin verification state when switching to another profile
  const [verifyingProfile, setVerifyingProfile] = useState(null);
  const [enteredPin, setEnteredPin] = useState('');

  useEffect(() => {
    setProfiles(getProfiles());
    setActiveId(getActiveProfileId());
    setIsCreating(false);
    setVerifyingProfile(null);
    setError('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (profile) => {
    if (profile.id === activeId) {
      onClose();
      return;
    }

    // If profile has a PIN, prompt for PIN first
    if (profile.pinHash) {
      setVerifyingProfile(profile);
      setEnteredPin('');
      setError('');
    } else {
      activateProfile(profile.id);
    }
  };

  const handleVerifyPinSubmit = (e) => {
    e?.preventDefault();
    if (!verifyingProfile) return;

    if (verifyProfilePin(verifyingProfile.id, enteredPin)) {
      activateProfile(verifyingProfile.id);
    } else {
      setError('Incorrect PIN for this profile');
      setEnteredPin('');
    }
  };

  const activateProfile = (id) => {
    setActiveId(id);
    setActiveProfileId(id);
    unlockSession(id);
    onProfileChanged(id);
    onClose();
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) {
      setError('Please enter a username');
      return;
    }

    if (newPin && newPin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }

    const pinHash = newPin ? hashPin(newPin) : '';

    const newProfile = {
      id: 'profile_' + Date.now(),
      name: trimmed,
      pinHash,
      color: '#ef4444',
      avatar: trimmed.charAt(0).toUpperCase(),
      createdAt: Date.now()
    };

    const updated = [...profiles, newProfile];
    setProfiles(updated);
    saveProfiles(updated);
    setNewName('');
    setNewPin('');
    setIsCreating(false);
    activateProfile(newProfile.id);
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
      activateProfile(nextId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md pro-card p-6 relative border border-slate-700 shadow-2xl bg-[#080c16]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-900 border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with FITREX Panther Logo */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 flex items-center justify-center drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">
            <img src="./logo.png" alt="FITREX CLUB" className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Switch User Profile</h3>
            <p className="text-xs text-slate-400">User-specific workouts, personal PRs, and body metrics</p>
          </div>
        </div>

        {/* PIN Prompt when switching profile */}
        {verifyingProfile ? (
          <form onSubmit={handleVerifyPinSubmit} className="space-y-4 bg-slate-900/80 p-4 rounded-xl border border-fitrex-red/40">
            <div className="text-center">
              <span className="text-xs text-slate-300">
                Enter PIN for <strong className="text-white">{verifyingProfile.name}</strong>
              </span>
            </div>

            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="••••"
              value={enteredPin}
              onChange={e => { setEnteredPin(e.target.value.replace(/\D/g, '')); setError(''); }}
              className="w-full input-pro py-2.5 text-center text-lg tracking-widest font-black mono-num"
              autoFocus
              required
            />

            {error && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5 justify-center">
                <AlertCircle className="w-4 h-4" /> {error}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setVerifyingProfile(null)}
                className="btn-pro-secondary flex-1 text-xs py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-pro-primary flex-1 text-xs py-2 shadow-glow-red"
              >
                Unlock & Switch
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* User Profiles List */}
            <div className="space-y-2 mb-5 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-800/60">
              {profiles.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No profiles found. Create your user profile below.
                </div>
              ) : (
                profiles.map(p => {
                  const isActive = p.id === activeId;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelect(p)}
                      className={`pt-2 first:pt-0 p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isActive
                          ? 'bg-fitrex-red/[0.08] border-fitrex-red/50 shadow-md shadow-fitrex-red/10'
                          : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center font-black text-xs text-white shadow-sm bg-fitrex-red"
                        >
                          {p.avatar || p.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                            {p.name}
                            {isActive && (
                              <span className="text-[10px] bg-fitrex-red text-white px-2 py-0.5 rounded-full font-black shadow-glow-red-sm">
                                Active
                              </span>
                            )}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {p.pinHash ? 'PIN Protected' : 'No PIN'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {profiles.length > 1 && (
                          <button
                            onClick={(e) => handleDelete(p.id, e)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete Profile"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        {isActive && <Check className="w-4 h-4 text-fitrex-red ml-1" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Create Profile Section */}
            {isCreating ? (
              <form onSubmit={handleCreate} className="bg-slate-900/70 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider">Add User Profile</h4>
                
                <input
                  type="text"
                  placeholder="Username / Name (e.g. Mike, Sarah, Gym Buddy)"
                  value={newName}
                  onChange={e => { setNewName(e.target.value); setError(''); }}
                  className="w-full input-pro text-xs py-2"
                  autoFocus
                  required
                />

                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="4-Digit PIN (e.g. 1234)"
                  value={newPin}
                  onChange={e => { setNewPin(e.target.value.replace(/\D/g, '')); setError(''); }}
                  className="w-full input-pro text-xs py-2 mono-num"
                  required
                />

                {error && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {error}
                  </p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="btn-pro-secondary flex-1 text-xs py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-pro-primary flex-1 text-xs py-2 shadow-glow-red"
                  >
                    Save & Switch
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                className="w-full btn-pro-secondary py-2.5 text-xs font-black text-slate-200 border-dashed border-slate-700 hover:border-fitrex-red/50 hover:text-fitrex-red flex items-center justify-center gap-2 transition-all"
              >
                <UserPlus className="w-4 h-4 text-fitrex-red" /> Add Another User Profile
              </button>
            )}
          </>
        )}

      </div>
    </div>
  );
}