import React, { useState, useEffect } from 'react';
import { Lock, Unlock, KeyRound, AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { getPinConfig, savePinConfig, hashPin } from '../services/storage';

export default function PinLockModal({ isOpen, onUnlock, forceSetup = false, onClose }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryInput, setRecoveryInput] = useState('');
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [tempPin, setTempPin] = useState('');
  const [recoveryPhrase, setRecoveryPhrase] = useState('');

  const pinConfig = getPinConfig();

  useEffect(() => {
    if (forceSetup || (!pinConfig.enabled && !pinConfig.pinHash)) {
      setIsSettingUp(true);
      setSetupStep(1);
    } else {
      setIsSettingUp(false);
    }
    setPin('');
    setError('');
  }, [isOpen, forceSetup]);

  if (!isOpen) return null;

  const triggerShake = (msg) => {
    setError(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
    setPin('');
  };

  const handleKeyPress = (num) => {
    if (pin.length < 6) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError('');

      if (!isSettingUp && nextPin.length >= 4) {
        if (hashPin(nextPin) === pinConfig.pinHash) {
          onUnlock();
          setPin('');
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  const handleUnlockSubmit = () => {
    if (!pin) return;
    if (hashPin(pin) === pinConfig.pinHash) {
      onUnlock();
      setPin('');
    } else {
      triggerShake('Incorrect PIN. Please try again.');
    }
  };

  const handleSetupNext = () => {
    if (setupStep === 1) {
      if (pin.length < 4) {
        triggerShake('PIN must be at least 4 digits');
        return;
      }
      setTempPin(pin);
      setPin('');
      setSetupStep(2);
    } else if (setupStep === 2) {
      if (pin !== tempPin) {
        triggerShake('PINs do not match. Try again.');
        setSetupStep(1);
        setTempPin('');
        return;
      }
      setSetupStep(3);
    } else if (setupStep === 3) {
      if (!recoveryPhrase.trim()) {
        setError('Please set a recovery phrase');
        return;
      }
      savePinConfig({
        enabled: true,
        pinHash: hashPin(tempPin),
        recoveryPhrase: recoveryPhrase.trim().toLowerCase(),
        timeoutMinutes: 15
      });
      setIsSettingUp(false);
      onUnlock();
    }
  };

  const handleRecoverySubmit = () => {
    if (recoveryInput.trim().toLowerCase() === (pinConfig.recoveryPhrase || '').toLowerCase()) {
      savePinConfig({ enabled: false, pinHash: '', recoveryPhrase: '', timeoutMinutes: 15 });
      setShowRecovery(false);
      setIsSettingUp(true);
      setSetupStep(1);
    } else {
      setError('Incorrect recovery phrase');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`w-full max-w-sm pro-card p-6 border border-fitrex-red/30 shadow-2xl relative ${isShaking ? 'shake-animation' : ''}`}>
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-fitrex-red/15 border border-fitrex-red/40 flex items-center justify-center mb-3 shadow-glow-red">
            {isSettingUp ? (
              <ShieldCheck className="w-8 h-8 text-fitrex-red" />
            ) : (
              <Lock className="w-8 h-8 text-fitrex-red" />
            )}
          </div>
          
          <h2 className="text-xl font-black text-white tracking-tight">
            {isSettingUp 
              ? (setupStep === 1 ? 'Create Security PIN' : setupStep === 2 ? 'Confirm Your PIN' : 'Set Recovery Phrase')
              : 'Fitrex App Locked'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            {isSettingUp
              ? (setupStep === 1 ? 'Keep your personal workout logs secure' : setupStep === 2 ? 'Re-enter your PIN to confirm' : 'Use this if you ever forget your PIN')
              : 'Enter your PIN to access your workouts'}
          </p>
        </div>

        {/* Recovery */}
        {showRecovery ? (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your recovery phrase..."
              value={recoveryInput}
              onChange={e => setRecoveryInput(e.target.value)}
              className="w-full input-pro py-3 text-sm"
              autoFocus
            />
            {error && <p className="text-xs text-rose-400 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> {error}</p>}
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowRecovery(false)} className="btn-pro-secondary flex-1 text-sm py-2.5">
                Cancel
              </button>
              <button onClick={handleRecoverySubmit} className="btn-pro-primary flex-1 text-sm py-2.5">
                Reset PIN
              </button>
            </div>
          </div>
        ) : isSettingUp && setupStep === 3 ? (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="e.g. MySecretAnswer"
              value={recoveryPhrase}
              onChange={e => setRecoveryPhrase(e.target.value)}
              className="w-full input-pro py-3 text-sm"
              autoFocus
            />
            {error && <p className="text-xs text-rose-400 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> {error}</p>}
            <button onClick={handleSetupNext} className="w-full btn-pro-primary py-3 text-sm">
              Save & Unlock
            </button>
          </div>
        ) : (
          <div>
            {/* PIN Dots Display in Red */}
            <div className="flex justify-center items-center gap-3 mb-6 h-10">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    pin.length > idx
                      ? 'bg-fitrex-red scale-110 shadow-glow-red'
                      : 'bg-slate-800 border border-slate-700'
                  }`}
                />
              ))}
              {pin.length > 4 && (
                <span className="text-xs text-fitrex-red mono-num ml-1">+{pin.length - 4}</span>
              )}
            </div>

            {error && (
              <p className="text-xs text-rose-400 text-center mb-4 flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {error}
              </p>
            )}

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto mb-5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeyPress(num.toString())}
                  className="h-14 rounded-2xl bg-slate-800/60 hover:bg-slate-700/60 active:scale-95 transition-all text-xl font-bold text-white flex items-center justify-center border border-slate-700/40"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleDelete}
                className="h-14 rounded-2xl bg-slate-800/30 hover:bg-slate-700/40 active:scale-95 transition-all text-xs font-bold text-slate-400 flex items-center justify-center"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleKeyPress('0')}
                className="h-14 rounded-2xl bg-slate-800/60 hover:bg-slate-700/60 active:scale-95 transition-all text-xl font-bold text-white flex items-center justify-center border border-slate-700/40"
              >
                0
              </button>
              <button
                type="button"
                onClick={isSettingUp ? handleSetupNext : handleUnlockSubmit}
                className="h-14 rounded-2xl bg-fitrex-red hover:bg-red-600 active:scale-95 transition-all text-white font-black flex items-center justify-center shadow-glow-red"
              >
                {isSettingUp ? <ArrowRight className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-800/60">
              {!isSettingUp && pinConfig.recoveryPhrase && (
                <button
                  type="button"
                  onClick={() => { setShowRecovery(true); setError(''); }}
                  className="hover:text-fitrex-red transition-colors flex items-center gap-1"
                >
                  <KeyRound className="w-3.5 h-3.5" /> Forgot PIN?
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
