import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, X, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { getSettings } from '../services/storage';

export default function RestTimer({
  isOpen,
  onClose,
  seconds,
  setSeconds,
  isRunning,
  setIsRunning
}) {
  const [totalDuration, setTotalDuration] = useState(seconds || 90);
  const [isMinimized, setIsMinimized] = useState(false);
  const audioContextRef = useRef(null);

  // Play synthetic pleasant beep using Web Audio API
  const playChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = audioContextRef.current || new AudioContext();
      audioContextRef.current = ctx;

      const now = ctx.currentTime;
      // First beep
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now); // A5
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.25);

      // Second higher beep
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1760, now + 0.18); // A6
      gain2.gain.setValueAtTime(0.35, now + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.18);
      osc2.stop(now + 0.45);

      // Mobile vibration
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    } catch (e) {
      console.log('Audio chime error:', e);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            playChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  if (!isOpen) return null;

  const setPreset = (sec) => {
    setTotalDuration(sec);
    setSeconds(sec);
    setIsRunning(true);
  };

  const adjustSeconds = (delta) => {
    const next = Math.max(5, seconds + delta);
    setSeconds(next);
    if (next > totalDuration) setTotalDuration(next);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(totalDuration);
  };

  const progress = totalDuration > 0 ? (seconds / totalDuration) : 0;
  const strokeDashoffset = 283 * (1 - progress);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formattedTime = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all">
      {isMinimized ? (
        /* Minimized floating pill */
        <div
          onClick={() => setIsMinimized(false)}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-full shadow-2xl cursor-pointer border backdrop-blur-md ${
            isRunning
              ? 'bg-slate-900/90 border-emerald-500/50 shadow-emerald-500/20'
              : 'bg-slate-900/90 border-slate-700'
          }`}
        >
          <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
          <span className="mono-num text-sm font-bold text-white">{formattedTime}</span>
          <Maximize2 className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
        </div>
      ) : (
        /* Expanded Rest Timer Card */
        <div className="glass-card p-5 w-80 border-emerald-500/30 shadow-2xl relative bg-[#0d121f]/95 backdrop-blur-lg">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Rest Interval
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
                title="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-rose-400 rounded-lg"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Circular Countdown Gauge */}
          <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                className="text-slate-800"
                strokeWidth="7"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                className="text-emerald-400 transition-all duration-500 ease-linear"
                strokeWidth="7"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-white mono-num tracking-tight">
                {formattedTime}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-1">
                {isRunning ? 'RESTING' : seconds === 0 ? 'TIME UP!' : 'PAUSED'}
              </span>
            </div>
          </div>

          {/* Steppers & Controls */}
          <div className="flex items-center justify-center gap-3 my-4">
            <button
              onClick={() => adjustSeconds(-15)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              title="-15s"
            >
              -15s
            </button>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`p-3.5 rounded-2xl font-bold flex items-center justify-center shadow-lg transition-all ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={resetTimer}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => adjustSeconds(15)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              title="+15s"
            >
              +15s
            </button>
          </div>

          {/* Quick Presets */}
          <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-800/80">
            {[45, 60, 90, 120].map((sec) => (
              <button
                key={sec}
                onClick={() => setPreset(sec)}
                className={`py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  totalDuration === sec
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-800/40 text-slate-400 hover:text-white'
                }`}
              >
                {sec < 60 ? `${sec}s` : `${sec / 60}m`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
