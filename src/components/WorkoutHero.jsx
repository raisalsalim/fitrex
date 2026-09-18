import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flame } from 'lucide-react';
import { getActiveProfile } from '../services/storage';

export default function WorkoutHero({ currentWorkout, unit = 'kg', activeProfileId, selectedDate }) {
  const timerStorageKey = `fitrex_session_timer_${activeProfileId || 'def'}_${selectedDate || 'today'}`;
  const activeProfile = getActiveProfile();

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

  const calculateCurrentSeconds = (state) => {
    let sec = state.accumulated || 0;
    if (state.isRunning && state.startTimestamp) {
      const delta = Math.floor((Date.now() - state.startTimestamp) / 1000);
      sec += Math.max(0, delta);
    }
    return sec;
  };

  useEffect(() => {
    const current = getPersistedTimer();
    setTimerState(current);
    setDisplaySeconds(calculateCurrentSeconds(current));
  }, [timerStorageKey]);

  useEffect(() => {
    const syncTime = () => {
      setDisplaySeconds(calculateCurrentSeconds(timerState));
    };

    syncTime();
    let interval = null;
    if (timerState.isRunning) {
      interval = setInterval(syncTime, 1000);
    }

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

  const saveState = (newState) => {
    setTimerState(newState);
    setDisplaySeconds(calculateCurrentSeconds(newState));
    try {
      localStorage.setItem(timerStorageKey, JSON.stringify(newState));
    } catch (e) {}
  };

  const handleToggleRunning = () => {
    if (timerState.isRunning) {
      const currentTotal = calculateCurrentSeconds(timerState);
      saveState({
        accumulated: currentTotal,
        isRunning: false,
        startTimestamp: null
      });
    } else {
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
  const sessionTitle = activeProfile?.name ? `${activeProfile.name}'s Workout Session` : "Today's Training Session";

  return (
    <div className="pro-card p-4 sm:p-6 border-slate-800/90 mb-4 sm:mb-6 bg-gradient-to-r from-[#0b101f] to-[#070a14] shadow-2xl relative overflow-hidden">
      
      {/* Subtle red ambient glow */}
      <div className="absolute -top-20 -right-20 w-56 h-56 bg-fitrex-red/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        
        {/* Left: User-Specific Title & Status */}
        <div className="text-center sm:text-left space-y-1 w-full sm:w-auto">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-fitrex-red/15 border border-fitrex-red/30 text-fitrex-red text-[11px] font-black shadow-glow-red-sm">
            <Flame className="w-3 h-3 fill-current animate-pulse" /> Workout Session
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 justify-center sm:justify-start">
            {sessionTitle}
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400">
            {exercises.length === 0 
              ? 'Select your target muscles or pick a saved template below to begin.'
              : `${exercises.length} movements active for this session.`}
          </p>
        </div>

        {/* Center/Right: Persistent Workout Timer */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 bg-[#050811]/90 p-2.5 sm:px-4 sm:py-3 rounded-2xl border border-slate-800 shadow-inner w-full sm:w-auto">
          <div className="text-left sm:text-right pr-1 sm:pr-2">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Session Duration
            </span>
            <span className="text-xl sm:text-3xl font-black text-white mono-num">
              {formatTime(displaySeconds)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleToggleRunning}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all shadow-lg ${
                timerState.isRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                  : 'btn-pro-primary shadow-glow-red'
              }`}
            >
              {timerState.isRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
              <span>{timerState.isRunning ? 'Pause' : displaySeconds > 0 ? 'Resume' : 'Start'}</span>
            </button>

            {displaySeconds > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Reset Session Timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}