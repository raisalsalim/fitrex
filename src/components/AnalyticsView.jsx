import React, { useState } from 'react';
import { LineChart, Trophy, TrendingUp, Zap, Calendar, Target, Award, Sparkles, PieChart, Layers } from 'lucide-react';
import { getWorkouts, getPersonalRecords, getSettings } from '../services/storage';

export default function AnalyticsView({ activeProfileId }) {
  const settings = getSettings();
  const unit = settings.unit || 'kg';
  const workouts = getWorkouts(activeProfileId);
  const prs = getPersonalRecords(activeProfileId);

  const exerciseNames = Object.keys(prs);
  const [selectedExercise, setSelectedExercise] = useState(exerciseNames[0] || 'Barbell Bench Press');
  const [metricTab, setMetricTab] = useState('weight'); // 'weight' | '1rm' | 'volume'

  // Extract progression points for selected exercise
  const exerciseHistory = [];
  workouts.forEach(w => {
    (w.exercises || []).forEach(ex => {
      if (ex.name.toLowerCase() === selectedExercise.toLowerCase()) {
        const completedSets = (ex.sets || []).filter(s => s.completed);
        if (completedSets.length > 0) {
          const maxWeight = Math.max(...completedSets.map(s => Number(s.weight) || 0));
          const totalVol = completedSets.reduce((sum, s) => sum + ((Number(s.weight) || 0) * (Number(s.reps) || 0)), 0);
          const best1RM = Math.max(...completedSets.map(s => {
            const wgt = Number(s.weight) || 0;
            const r = Number(s.reps) || 0;
            return Math.round(wgt * (1 + r / 30));
          }));

          exerciseHistory.push({
            date: w.date,
            maxWeight,
            totalVol,
            best1RM,
            setsCount: completedSets.length
          });
        }
      }
    });
  });

  exerciseHistory.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Compute Muscle Volume Distribution for the current profile
  const muscleVolume = {};
  workouts.forEach(w => {
    (w.exercises || []).forEach(ex => {
      const m = ex.muscle || 'other';
      (ex.sets || []).forEach(s => {
        if (s.completed) {
          const vol = (Number(s.weight) || 0) * (Number(s.reps) || 0);
          muscleVolume[m] = (muscleVolume[m] || 0) + vol;
        }
      });
    });
  });

  const totalMuscleVol = Object.values(muscleVolume).reduce((a, b) => a + b, 0) || 1;

  // Render SVG progression chart
  const renderChart = (key, color, glowColor) => {
    if (exerciseHistory.length < 2) {
      return (
        <div className="h-52 flex flex-col items-center justify-center text-xs text-slate-500 text-center p-6 border border-dashed border-slate-800 rounded-2xl">
          <TrendingUp className="w-8 h-8 text-slate-600 mb-2" />
          <p className="font-semibold text-slate-400">Not enough session data yet</p>
          <p className="text-[11px] text-slate-500 mt-1">Complete at least 2 sessions of {selectedExercise} to unlock your high-resolution progression curves.</p>
        </div>
      );
    }

    const padding = 35;
    const width = 600;
    const height = 210;
    const values = exerciseHistory.map(d => d[key]);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = (maxVal - minVal) || 1;

    const points = exerciseHistory.map((d, i) => {
      const x = padding + (i / (exerciseHistory.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((d[key] - minVal) / range) * (height - 2 * padding);
      return { x, y, val: d[key], date: d.date };
    });

    const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

    return (
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-52 sm:h-60">
          <defs>
            <linearGradient id={`grad_${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.5, 1].map((r, idx) => {
            const y = height - padding - r * (height - 2 * padding);
            const val = Math.round(minVal + r * range);
            return (
              <g key={idx}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <text x={padding - 10} y={y + 3} textAnchor="end" fill="#64748b" fontSize="10" fontFamily="monospace">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path
            d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
            fill={`url(#grad_${key})`}
          />

          {/* Glowing Line */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 4px 10px ${glowColor})` }}
          />

          {/* Data Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4.5" fill="#05070d" stroke={color} strokeWidth="3" />
              <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="800" fontFamily="monospace">
                {p.val}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const currentPR = prs[selectedExercise] || { maxWeight: 0, best1RM: 0, maxVolume: 0 };

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      
      {/* Header & Exercise Selector */}
      <div className="pro-card p-6 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-fitrex-lime/10 text-fitrex-lime border border-fitrex-lime/30">
              PRO ANALYTICS
            </span>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <LineChart className="w-6 h-6 text-fitrex-lime" /> Performance Progression
          </h2>
          <p className="text-xs text-slate-400">Track maximum load improvements, estimated 1-Rep Max & training volume</p>
        </div>

        {exerciseNames.length > 0 && (
          <select
            value={selectedExercise}
            onChange={e => setSelectedExercise(e.target.value)}
            className="input-pro text-xs py-2.5 px-3 min-w-[240px] font-bold text-fitrex-lime bg-slate-900 shadow-sm"
          >
            {exerciseNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Selected Movement Milestone Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        
        {/* 1. All-Time Max Weight */}
        <div className="pro-card p-5 border-slate-800 flex items-center gap-4 pro-card-glow">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/15">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Personal Record (PR)</span>
            <span className="text-2xl font-black text-white mono-num tracking-tight">
              {currentPR.maxWeight ? `${currentPR.maxWeight} ${unit}` : '--'}
            </span>
            <span className="text-[10px] text-amber-400 font-semibold block mt-0.5">Top Heaviest Lift</span>
          </div>
        </div>

        {/* 2. Estimated 1-Rep Max */}
        <div className="pro-card p-5 border-slate-800 flex items-center gap-4 pro-card-glow">
          <div className="w-12 h-12 rounded-2xl bg-fitrex-lime/15 border border-fitrex-lime/30 flex items-center justify-center text-fitrex-lime shadow-glow-lime">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Est. 1-Rep Max (1RM)</span>
            <span className="text-2xl font-black text-white mono-num tracking-tight">
              {currentPR.best1RM ? `${currentPR.best1RM} ${unit}` : '--'}
            </span>
            <span className="text-[10px] text-fitrex-lime font-semibold block mt-0.5">Epley Formula Model</span>
          </div>
        </div>

        {/* 3. Max Single-Set Volume */}
        <div className="pro-card p-5 border-slate-800 flex items-center gap-4 pro-card-glow">
          <div className="w-12 h-12 rounded-2xl bg-fitrex-cyan/15 border border-fitrex-cyan/30 flex items-center justify-center text-fitrex-cyan shadow-glow-cyan">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Peak Set Volume</span>
            <span className="text-2xl font-black text-white mono-num tracking-tight">
              {currentPR.maxVolume ? `${currentPR.maxVolume} ${unit}` : '--'}
            </span>
            <span className="text-[10px] text-fitrex-cyan font-semibold block mt-0.5">Weight × Reps Output</span>
          </div>
        </div>

      </div>

      {/* Main Interactive Chart Section */}
      <div className="pro-card p-6 border-slate-800 space-y-4">
        
        {/* Metric Switcher Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-fitrex-lime" /> {selectedExercise} Curves
          </h3>

          <div className="flex gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setMetricTab('weight')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                metricTab === 'weight' ? 'bg-fitrex-lime text-slate-950 shadow-glow-lime' : 'text-slate-400 hover:text-white'
              }`}
            >
              Max Weight
            </button>
            <button
              onClick={() => setMetricTab('1rm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                metricTab === '1rm' ? 'bg-fitrex-lime text-slate-950 shadow-glow-lime' : 'text-slate-400 hover:text-white'
              }`}
            >
              Est. 1RM
            </button>
            <button
              onClick={() => setMetricTab('volume')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                metricTab === 'volume' ? 'bg-fitrex-lime text-slate-950 shadow-glow-lime' : 'text-slate-400 hover:text-white'
              }`}
            >
              Volume Load
            </button>
          </div>
        </div>

        {metricTab === 'weight' && renderChart('maxWeight', '#a3e635', 'rgba(163, 230, 53, 0.4)')}
        {metricTab === '1rm' && renderChart('best1RM', '#06b6d4', 'rgba(6, 182, 212, 0.4)')}
        {metricTab === 'volume' && renderChart('totalVol', '#a855f7', 'rgba(168, 85, 247, 0.4)')}
      </div>

      {/* Muscle Volume Load Balance */}
      <div className="pro-card p-6 border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-fitrex-lime" /> Muscle Training Balance
          </h3>
          <span className="text-xs text-slate-400">All-time volume distribution</span>
        </div>

        <div className="space-y-3">
          {Object.entries(muscleVolume)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([muscle, vol]) => {
              const percent = Math.round((vol / totalMuscleVol) * 100);
              return (
                <div key={muscle} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white capitalize">{muscle}</span>
                    <span className="text-slate-400 mono-num">{vol.toLocaleString()} {unit} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-fitrex-lime to-fitrex-cyan h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Personal Records Trophy Hall */}
      <div className="pro-card p-6 border-slate-800 space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" /> Personal Records (PR) Hall of Fame
        </h3>

        {exerciseNames.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">
            Complete sets in your workout logger to establish verified PRs!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {exerciseNames.map(name => {
              const record = prs[name];
              return (
                <div
                  key={name}
                  onClick={() => setSelectedExercise(name)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedExercise === name
                      ? 'bg-slate-850 border-fitrex-lime/50 shadow-glow-lime'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-extrabold text-white truncate max-w-[200px]">{name}</h4>
                    <span className="text-xs font-black bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full mono-num">
                      {record.maxWeight} {unit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Est 1RM: <strong className="text-fitrex-cyan mono-num">{record.best1RM} {unit}</strong></span>
                    <span>Peak Vol: <strong className="text-fitrex-purple mono-num">{record.maxVolume} {unit}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
