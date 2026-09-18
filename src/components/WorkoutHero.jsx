import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flame, CheckCircle2, Clock, Zap } from 'lucide-react';

export default function WorkoutHero({ currentWorkout, unit = 'kg', activeProfileId, selectedDate }) {
  const timerStorageKey = `fitrex_session_timer_${activeProfileId}_${selectedDate || 'today'}`;

  // Read persisted timer state or default
  const getPersistedTimer = () => {
    try {
      const saved = localStorage.getItem(timerStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          accumulated: parsed.accumulated || 0,
          isRunning: Boolean(parsed.isRunning),
          startTimestamp: parsed.startTimestamp || null
        };
      }
    } catch (e) {}
    return { accumulated: 0, isRunning: false, startTimestamp: null };
  };

  const [timerState, setTimerState] = useState(getPersistedTimer);
  const [displaySeconds, setDisplaySeconds] = useState(0);

  // Compute actual elapsed seconds based on real timestamp
  const calculateCurrentSeconds = (state) => {
    let sec = state.accumulated || 0;
    if (state.isRunning && state.startTimestamp) {
      const delta = Math.floor((Date.now() - state.startTimestamp) / 1000);
      sec += Math.max(0, delta);
    }
    return sec;
  };

  // Re-sync when date or profile changes
  useEffect(() => {
    const current = getPersistedTimer();
    setTimerState(current);
    setDisplaySeconds(calculateCurrentSeconds(current));
  }, [timerStorageKey]);

  // Real-time ticking and screen-wake / visibility change re-calculation
  useEffect(() => {
    const syncTime = () => {
      setDisplaySeconds(calculateCurrentSeconds(timerState));
    };

    syncTime();
    let interval = null;
    if (timerState.isRunning) {
      interval = setInterval(syncTime, 1000);
    }

    // Mobile screen lock / unlock & browser tab visibility events
    const handleVisibility = () => {
      syncTime();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, [timerState]);

  // Persist state to localStorage
  const saveState = (newState) => {
    setTimerState(newState);
    setDisplaySeconds(calculateCurrentSeconds(newState));
    try {
      localStorage.setItem(timerStorageKey, JSON.stringify(newState));
    } catch (e) {}
  };

  const handleToggleRunning = () => {
    if (timerState.isRunning) {
      // PAUSE: lock in accumulated seconds
      const currentTotal = calculateCurrentSeconds(timerState);
      saveState({
        accumulated: currentTotal,
        isRunning: false,
        startTimestamp: null
      });
    } else {
      // START / RESUME: record start timestamp
      saveState({
        accumulated: timerState.accumulated || 0,
        isRunning: true,
        startTimestamp: Date.now()
      });
    }
  };

  const handleReset = () => {
    saveState({
      accumulated: 0,
      isRunning: false,
      startTimestamp: null
    });
  };

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const exercises = currentWorkout?.exercises || [];
  let totalSets = 0;
  let doneSets = 0;
  let totalVolume = 0;

  exercises.forEach(ex => {
    (ex.sets || []).forEach(s => {
      totalSets++;
      if (s.completed) {
        doneSets++;
        totalVolume += (Number(s.weight) || 0) * (Number(s.reps) || 0);
      }
    });
  });

  return (
    <div className="pro-card p-5 sm:p-6 border-slate-800/90 mb-6 bg-gradient-to-r from-[#0d1222] to-[#080b15] shadow-2xl relative overflow-hidden">
      
      {/* Subtle red ambient glow */}
      <div className="absolute -top-20 -right-20 w-56 h-56 bg-fitrex-red/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-5 relative z-10">
        
        {/* Left: Friendly Greeting & Status */}
        <div className="text-center md:text-left space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fitrex-red/10 border border-fitrex-red/30 text-fitrex-red text-xs font-black shadow-glow-red-sm">
            <Flame className="w-3.5 h-3.5 fill-current animate-pulse" /> Workout Active
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Today's Training Session
          </h2>
          <p className="text-xs text-slate-400">
            {exercises.length === 0 
              ? 'Select your target muscles below and tap Add Exercise to begin.'
              : `${exercises.length} movements · ${doneSets} of ${totalSets} sets completed`}
          </p>
        </div>

        {/* Center/Right: Persistent Workout Timer */}
        <div className="flex items-center gap-3 bg-[#050811]/90 p-3 sm:px-4 sm:py-3 rounded-2xl border border-slate-800 shadow-inner">
          <div className="text-right pr-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Session Duration
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white mono-num">
              {formatTime(displaySeconds)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleToggleRunning}
            className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all shadow-lg ${
              timerState.isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                : 'btn-pro-primary'
            }`}
          >
            {timerState.isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            <span>{timerState.isRunning ? 'Pause' : displaySeconds > 0 ? 'Resume' : 'Start Workout'}</span>
          </button>

          {displaySeconds > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Reset Session Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Highlights Bar */}
      {totalSets > 0 && (
        <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-slate-800/80 text-center relative z-10">
          <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase font-black block">Sets Done</span>
            <span className="text-base font-black text-white mono-num">{doneSets} / {totalSets}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase font-black block">Total Volume</span>
            <span className="text-base font-black text-fitrex-red mono-num">{totalVolume.toLocaleString()} {unit}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 uppercase font-black block">Completion</span>
            <span className="text-base font-black text-white mono-num">
              {Math.round((doneSets / totalSets) * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
