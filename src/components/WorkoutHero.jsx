import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Dumbbell, Flame, CheckCircle2 } from 'lucide-react';

export default function WorkoutHero({ currentWorkout, unit = 'kg' }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => setElapsedSeconds(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

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
    <div className="pro-card p-5 sm:p-6 border-slate-800/80 mb-6 bg-gradient-to-r from-slate-900/90 to-slate-950/90 shadow-xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-5">
        
        {/* Left: Friendly Greeting & Simple Status */}
        <div className="text-center md:text-left space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fitrex-lime/10 border border-fitrex-lime/30 text-fitrex-lime text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-current" /> Ready to workout
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Today's Training Session
          </h2>
          <p className="text-xs text-slate-400">
            {exercises.length === 0 
              ? 'Select your target muscles below and tap Add Exercise to begin.'
              : `${exercises.length} movements · ${doneSets} of ${totalSets} sets finished`}
          </p>
        </div>

        {/* Center/Right: Simple Big Workout Timer */}
        <div className="flex items-center gap-3 bg-slate-950/80 p-2.5 sm:px-4 sm:py-2.5 rounded-2xl border border-slate-800">
          <div className="text-right pr-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Session Time
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white mono-num">
              {formatTime(elapsedSeconds)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all shadow-lg ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                : 'bg-fitrex-lime hover:bg-lime-300 text-slate-950 shadow-glow-lime'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            <span>{isRunning ? 'Pause' : 'Start Workout'}</span>
          </button>

          {elapsedSeconds > 0 && (
            <button
              type="button"
              onClick={() => { setIsRunning(false); setElapsedSeconds(0); }}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* 3 Simple Highlights if workout is underway */}
      {totalSets > 0 && (
        <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-slate-800/80 text-center">
          <div className="p-2 rounded-xl bg-slate-900/40">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Sets Done</span>
            <span className="text-base font-extrabold text-white mono-num">{doneSets} / {totalSets}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/40">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Volume</span>
            <span className="text-base font-extrabold text-fitrex-lime mono-num">{totalVolume.toLocaleString()} {unit}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/40">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Progress</span>
            <span className="text-base font-extrabold text-fitrex-cyan mono-num">
              {Math.round((doneSets / totalSets) * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
