import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Maximize2, Minimize2, Bell } from 'lucide-react';

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

  const playChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = audioContextRef.current || new AudioContext();
      audioContextRef.current = ctx;

      const now = ctx.currentTime;
      // High-end double chime
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, now); // B5
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.51, now + 0.15); // E6
      gain2.gain.setValueAtTime(0.35, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.5);

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
        <div
          onClick={() => setIsMinimized(false)}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-full shadow-2xl cursor-pointer border backdrop-blur-xl transition-all hover:scale-105 ${
            isRunning
              ? 'bg-[#05070d]/95 border-fitrex-lime/60 shadow-glow-lime'
              : 'bg-[#05070d]/95 border-slate-700'
          }`}
        >
          <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-fitrex-lime animate-ping' : 'bg-slate-500'}`} />
          <span className="mono-num text-sm font-black text-white">{formattedTime}</span>
          <Maximize2 className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
        </div>
      ) : (
        <div className="pro-card p-5 w-80 border-fitrex-lime/40 shadow-2xl relative bg-[#070b14]/95 backdrop-blur-2xl">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-fitrex-lime flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-fitrex-lime animate-ping" />
              Rest Interval
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
                title="Minimize to Floating Pill"
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
                className="text-slate-800/80"
                strokeWidth="7"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                className="text-fitrex-lime transition-all duration-500 ease-linear"
                strokeWidth="7"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                style={{ filter: 'drop-shadow(0 0 6px rgba(163, 230, 53, 0.5))' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white mono-num tracking-tight">
                {formattedTime}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold mt-1">
                {isRunning ? 'RESTING' : seconds === 0 ? 'READY TO LIFT!' : 'PAUSED'}
              </span>
            </div>
          </div>

          {/* Steppers & Controls */}
          <div className="flex items-center justify-center gap-3 my-4">
            <button
              onClick={() => adjustSeconds(-15)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-black text-xs"
              title="-15s"
            >
              -15s
            </button>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`p-3.5 rounded-2xl font-black flex items-center justify-center shadow-lg transition-all ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/40'
                  : 'bg-fitrex-lime hover:bg-lime-300 text-slate-950 shadow-glow-lime'
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
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-black text-xs"
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
                className={`py-1.5 rounded-xl text-xs font-black transition-all ${
                  totalDuration === sec
                    ? 'bg-fitrex-lime text-slate-950 shadow-glow-lime'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white'
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
