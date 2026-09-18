import React, { useState, useEffect } from 'react';
import { Lock, Unlock, ShieldCheck, AlertCircle, ArrowRight, User, KeyRound, Users } from 'lucide-react';
import { 
  getPinConfig, savePinConfig, hashPin, getProfiles, getActiveProfile, 
  loginOrRegisterProfile, verifyProfilePin, getAuthenticatedProfileId 
} from '../services/storage';

export default function PinLockModal({ isOpen, onUnlock }) {
  const [profiles, setProfiles] = useState(getProfiles());
  const activeProfile = getActiveProfile();

  // Mode: 'onboarding' (ask username & pin) | 'unlock' (locked PIN keypad)
  const [mode, setMode] = useState(() => {
    const auth = getAuthenticatedProfileId();
    const profs = getProfiles();
    if (!auth || profs.length === 0) return 'onboarding';
    return 'unlock';
  });

  // Onboarding Form State - user specific
  const [userName, setUserName] = useState('');
  const [setupPin, setSetupPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState(activeProfile?.id || '');

  // Unlock Keypad State
  const [unlockPin, setUnlockPin] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryInput, setRecoveryInput] = useState('');

  useEffect(() => {
    const currentAuth = getAuthenticatedProfileId();
    const currentProfs = getProfiles();
    setProfiles(currentProfs);
    
    if (!currentAuth || currentProfs.length === 0) {
      setMode('onboarding');
      setUserName('');
      setSetupPin('');
      setConfirmPin('');
    } else {
      setMode('unlock');
      setSelectedProfileId(activeProfile?.id || currentProfs[0]?.id || '');
    }
    setUnlockPin('');
    setError('');
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerShake = (msg) => {
    setError(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
    setUnlockPin('');
  };

  // --- KEYPAD INPUT FOR UNLOCK ---
  const handleKeypadPress = (num) => {
    if (unlockPin.length < 6) {
      const nextPin = unlockPin + num;
      setUnlockPin(nextPin);
      setError('');

      if (nextPin.length >= 4) {
        const targetId = selectedProfileId || activeProfile?.id || profiles[0]?.id;
        const success = verifyProfilePin(targetId, nextPin);
        if (success) {
          onUnlock(targetId);
          setUnlockPin('');
        } else if (nextPin.length === 4) {
          const targetProf = profiles.find(p => p.id === targetId);
          const pinConfig = getPinConfig();
          const targetHash = targetProf?.pinHash || pinConfig.pinHash;
          if (targetHash && hashPin(nextPin) !== targetHash) {
            triggerShake('Incorrect PIN. Please try again.');
          }
        }
      }
    }
  };

  const handleKeypadDelete = () => {
    setUnlockPin(prev => prev.slice(0, -1));
    setError('');
  };

  const handleUnlockSubmit = () => {
    if (!unlockPin) return;
    const targetId = selectedProfileId || activeProfile?.id || profiles[0]?.id;
    const success = verifyProfilePin(targetId, unlockPin);
    if (success) {
      onUnlock(targetId);
      setUnlockPin('');
    } else {
      triggerShake('Incorrect PIN. Please try again.');
    }
  };

  // --- ONBOARDING / USER PROFILE LOGIN SUBMIT ---
  const handleOnboardingSubmit = (e) => {
    e?.preventDefault();
    const trimmed = userName.trim();
    if (!trimmed) {
      setError('Please enter your username');
      return;
    }

    if (setupPin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }

    if (setupPin !== confirmPin) {
      setError('PINs do not match. Please re-enter.');
      return;
    }

    // Save profile with user's specific username and PIN
    const prof = loginOrRegisterProfile({
      name: trimmed,
      pin: setupPin,
      color: '#ef4444'
    });

    onUnlock(prof.id);
  };

  const handleSelectExistingProfile = (prof) => {
    setSelectedProfileId(prof.id);
    setMode('unlock');
    setUnlockPin('');
    setError('');
  };

  const handleRecoverySubmit = () => {
    const pinConfig = getPinConfig();
    if (recoveryInput.trim().toLowerCase() === (pinConfig.recoveryPhrase || 'fitrex').toLowerCase()) {
      savePinConfig({ enabled: false, pinHash: '', recoveryPhrase: 'fitrex', timeoutMinutes: 15 });
      setShowRecovery(false);
      setMode('onboarding');
      setError('');
    } else {
      setError('Incorrect recovery phrase (default: fitrex)');
    }
  };

  const currentDisplayProfile = profiles.find(p => p.id === selectedProfileId) || activeProfile || profiles[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`w-full max-w-md pro-card p-6 sm:p-7 border border-fitrex-red/40 shadow-2xl relative ${isShaking ? 'shake-animation' : ''} bg-[#060913]`}>
        
        {/* FITREX CLUB Official Panther Logo Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-24 h-24 mb-2 flex items-center justify-center drop-shadow-[0_0_18px_rgba(239,68,68,0.5)]">
            <img
              src="./logo.png"
              alt="FITREX CLUB"
              className="w-full h-full object-contain hover:scale-105 transition-transform"
            />
          </div>

          <h2 className="text-xl font-black text-white tracking-tight">
            {mode === 'onboarding' 
              ? 'Welcome to FITREX CLUB' 
              : `FITREX CLUB • LOCKED`}
          </h2>
          
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            {mode === 'onboarding'
              ? 'Enter your username and create a 4-digit PIN. Your session will stay logged in on this device.'
              : `Welcome back, ${currentDisplayProfile?.name || 'Athlete'}! Enter your 4-digit PIN to access your workouts.`}
          </p>
        </div>

        {/* ----------------- MODE A: FIRST TIME / USER SETUP FORM ----------------- */}
        {mode === 'onboarding' ? (
          <form onSubmit={handleOnboardingSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Your Username / Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. John, Alex, Chris..."
                  value={userName}
                  onChange={e => { setUserName(e.target.value); setError(''); }}
                  className="w-full input-pro pl-9 py-2.5 text-sm font-semibold"
                  autoFocus
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Create 4-Digit PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="••••"
                  value={setupPin}
                  onChange={e => { setSetupPin(e.target.value.replace(/\D/g, '')); setError(''); }}
                  className="w-full input-pro py-2.5 text-center text-base tracking-widest font-black mono-num"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Confirm PIN
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="••••"
                  value={confirmPin}
                  onChange={e => { setConfirmPin(e.target.value.replace(/\D/g, '')); setError(''); }}
                  className="w-full input-pro py-2.5 text-center text-base tracking-widest font-black mono-num"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5 justify-center">
                <AlertCircle className="w-4 h-4" /> {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full btn-pro-primary py-3 text-sm font-black flex items-center justify-center gap-2 shadow-glow-red"
            >
              Start Workout Logging <ArrowRight className="w-4 h-4" />
            </button>

            {/* If user profiles exist in storage, allow selecting */}
            {profiles.length > 0 && (
              <div className="pt-3 border-t border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 block mb-2">Or switch to an existing user profile:</span>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {profiles.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectExistingProfile(p)}
                      className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:border-fitrex-red hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <span className="w-2 h-2 rounded-full bg-fitrex-red"></span>
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        ) : showRecovery ? (
          /* ----------------- RECOVERY FORM ----------------- */
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Enter your recovery phrase to reset PIN (default is <span className="text-fitrex-red font-bold">fitrex</span>):
            </p>
            <input
              type="text"
              placeholder="e.g. fitrex"
              value={recoveryInput}
              onChange={e => setRecoveryInput(e.target.value)}
              className="w-full input-pro py-3 text-sm"
              autoFocus
            />
            {error && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> {error}
              </p>
            )}
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowRecovery(false)} className="btn-pro-secondary flex-1 text-sm py-2.5">
                Cancel
              </button>
              <button onClick={handleRecoverySubmit} className="btn-pro-primary flex-1 text-sm py-2.5 shadow-glow-red">
                Reset PIN
              </button>
            </div>
          </div>
        ) : (
          /* ----------------- MODE B: LOCKED PIN KEYPAD ----------------- */
          <div>
            {/* Active User Avatar & Name display */}
            <div className="flex items-center justify-center gap-2 mb-4 bg-slate-900/60 py-1.5 px-3 rounded-xl border border-slate-800 w-fit mx-auto">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center font-black text-xs text-white shadow-sm bg-fitrex-red"
              >
                {currentDisplayProfile?.avatar || currentDisplayProfile?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-black text-white">
                {currentDisplayProfile?.name || 'User Profile'}
              </span>
            </div>

            {/* Glowing Red PIN Dots */}
            <div className="flex justify-center items-center gap-3 mb-6 h-10">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    unlockPin.length > idx
                      ? 'bg-fitrex-red scale-110 shadow-glow-red'
                      : 'bg-slate-800 border border-slate-700'
                  }`}
                />
              ))}
              {unlockPin.length > 4 && (
                <span className="text-xs text-fitrex-red mono-num ml-1">+{unlockPin.length - 4}</span>
              )}
            </div>

            {error && (
              <p className="text-xs text-rose-400 text-center mb-4 flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {error}
              </p>
            )}

            {/* Keypad Grid */}
            <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto mb-5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeypadPress(num.toString())}
                  className="h-14 rounded-2xl bg-slate-800/60 hover:bg-slate-700/60 active:scale-95 transition-all text-xl font-bold text-white flex items-center justify-center border border-slate-700/40"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleKeypadDelete}
                className="h-14 rounded-2xl bg-slate-800/30 hover:bg-slate-700/40 active:scale-95 transition-all text-xs font-bold text-slate-400 flex items-center justify-center"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="h-14 rounded-2xl bg-slate-800/60 hover:bg-slate-700/60 active:scale-95 transition-all text-xl font-bold text-white flex items-center justify-center border border-slate-700/40"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleUnlockSubmit}
                className="h-14 rounded-2xl bg-fitrex-red hover:bg-red-600 active:scale-95 transition-all text-white font-black flex items-center justify-center shadow-glow-red"
              >
                <Unlock className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Actions: Switch User or Forgot PIN */}
            <div className="flex justify-between items-center text-xs text-slate-400 pt-3 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  setMode('onboarding');
                  setUserName('');
                  setSetupPin('');
                  setConfirmPin('');
                  setError('');
                }}
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-fitrex-red" /> Switch / New Profile
              </button>

              <button
                type="button"
                onClick={() => { setShowRecovery(true); setError(''); }}
                className="hover:text-fitrex-red transition-colors flex items-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5" /> Forgot PIN?
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}