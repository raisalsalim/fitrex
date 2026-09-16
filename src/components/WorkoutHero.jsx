import React, { useState, useEffect } from 'react';
import { Flame, Trophy, Clock, Zap, Calculator, BarChart2, ShieldCheck, ChevronRight } from 'lucide-react';

export default function WorkoutHero({ 
  currentWorkout, 
  onOpenPlateCalc, 
  unit = 'kg',
  onOpenAnalytics 
}) {
  // Live workout session duration timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatElapsed = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Compute live session stats
  const exercises = currentWorkout?.exercises || [];
  let totalVolume = 0;
  let totalSets = 0;
  let completedSets = 0;

  exercises.forEach(ex => {
    (ex.sets || []).forEach(s => {
      totalSets++;
      if (s.completed) {
        completedSets++;
        totalVolume += (Number(s.weight) || 0) * (Number(s.reps) || 0);
      }
    });
  });

  const completionPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  // Days consistency streak mock (Current week: M T W T F S S)
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayIdx = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <div className="pro-card p-5 border-slate-800 shadow-2xl relative overflow-hidden mb-6">
      
      {/* Subtle glowing ambient accent in top-right */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-fitrex-lime/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-fitrex-cyan/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner: Consistency & Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        
        {/* Weekly Consistency Streak */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-fitrex-lime/10 border border-fitrex-lime/30 text-fitrex-lime text-xs font-bold shadow-glow-lime">
            <Flame className="w-4 h-4 fill-current animate-pulse" />
            <span>4 DAY STREAK</span>
          </div>

          <div className="flex items-center gap-1">
            {days.map((d, idx) => {
              const isPast = idx < todayIdx;
              const isToday = idx === todayIdx;
              return (
                <div
                  key={idx}
                  className={`w-6 h-6 rounded-lg text-[10px] font-extrabold flex items-center justify-center transition-all ${
                    isToday
                      ? 'bg-fitrex-lime text-slate-950 ring-2 ring-fitrex-lime/50 shadow-glow-lime'
                      : isPast
                      ? 'bg-slate-800 text-fitrex-lime border border-fitrex-lime/30'
                      : 'bg-slate-900/60 text-slate-600 border border-slate-800'
                  }`}
                >
                  {d}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Tools: Plate Calculator */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPlateCalc}
            className="btn-pro-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 hover:border-fitrex-lime/40"
          >
            <Calculator className="w-3.5 h-3.5 text-fitrex-lime" />
            <span>Plate Calc</span>
          </button>
        </div>
      </div>

      {/* Main Metrics 4-Column Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
        
        {/* 1. Workout Volume */}
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Volume</span>
            <Zap className="w-4 h-4 text-fitrex-lime" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white mono-num tracking-tight">
              {totalVolume.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-fitrex-lime">{unit}</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Weight × Reps Completed</span>
        </div>

        {/* 2. Sets Completed Progress */}
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sets Completed</span>
            <span className="text-xs font-bold text-fitrex-cyan mono-num">{completionPercent}%</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white mono-num tracking-tight">
              {completedSets}
            </span>
            <span className="text-xs text-slate-400">/ {totalSets} sets</span>
          </div>
          {/* Mini progress bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-fitrex-lime to-fitrex-cyan h-full rounded-full transition-all duration-300"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>

        {/* 3. Session Elapsed Time */}
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Duration</span>
            <Clock className="w-4 h-4 text-fitrex-amber" />
          </div>
          <span className="text-2xl font-black text-white mono-num tracking-tight block">
            {formatElapsed(elapsedSeconds)}
          </span>
          <span className="text-[10px] text-fitrex-amber font-semibold mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-fitrex-amber animate-ping" />
            Active Session
          </span>
        </div>

        {/* 4. Exercises Count & Target */}
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Exercises</span>
            <Trophy className="w-4 h-4 text-fitrex-purple" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white mono-num tracking-tight">
              {exercises.length}
            </span>
            <span className="text-xs text-slate-400">movements</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
            {currentWorkout?.muscles?.join(', ') || 'No target'}
          </span>
        </div>

      </div>

    </div>
  );
}
