import React, { useState } from 'react';
import { LineChart, Trophy, TrendingUp, Zap, Target, Award } from 'lucide-react';
import { getWorkouts, getPersonalRecords, getSettings } from '../services/storage';

export default function AnalyticsView({ activeProfileId }) {
  const settings = getSettings();
  const unit = settings.unit || 'kg';
  const workouts = getWorkouts(activeProfileId);
  const prs = getPersonalRecords(activeProfileId);

  const exerciseNames = Object.keys(prs);
  const [selectedExercise, setSelectedExercise] = useState(exerciseNames[0] || 'Flat Dumbbell Press');
  const [metricTab, setMetricTab] = useState('weight');

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

  const renderChart = (key, color) => {
    if (exerciseHistory.length < 2) {
      return (
        <div className="h-52 flex flex-col items-center justify-center text-xs text-slate-500 text-center p-6 border border-dashed border-slate-800 rounded-2xl">
          <TrendingUp className="w-8 h-8 text-slate-600 mb-2" />
          <p className="font-semibold text-slate-400">Not enough session data yet</p>
          <p className="text-[11px] text-slate-500 mt-1">Complete at least 2 sessions of {selectedExercise} to see progression curves.</p>
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
            <linearGradient id={`grad_red_${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

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

          <path
            d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
            fill={`url(#grad_red_${key})`}
          />

          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 4px 10px ${color}66)` }}
          />

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
      
      {/* Header & Selector */}
      <div className="pro-card p-6 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <LineChart className="w-6 h-6 text-fitrex-red" /> Performance Progression
          </h2>
          <p className="text-xs text-slate-400">Track weight improvements and estimated 1-Rep Max curves over time</p>
        </div>

        {exerciseNames.length > 0 && (
          <select
            value={selectedExercise}
            onChange={e => setSelectedExercise(e.target.value)}
            className="input-pro text-xs py-2.5 px-3 w-full sm:w-auto sm:min-w-[240px] font-bold text-fitrex-red bg-slate-900 shadow-sm"
          >
            {exerciseNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="pro-card p-5 border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-fitrex-red/15 border border-fitrex-red/30 flex items-center justify-center text-fitrex-red shadow-glow-red-sm">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Personal Record (PR)</span>
            <span className="text-2xl font-black text-white mono-num">
              {currentPR.maxWeight ? `${currentPR.maxWeight} ${unit}` : '--'}
            </span>
          </div>
        </div>

        <div className="pro-card p-5 border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Est. 1-Rep Max</span>
            <span className="text-2xl font-black text-white mono-num">
              {currentPR.best1RM ? `${currentPR.best1RM} ${unit}` : '--'}
            </span>
          </div>
        </div>

        <div className="pro-card p-5 border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Peak Set Volume</span>
            <span className="text-2xl font-black text-white mono-num">
              {currentPR.maxVolume ? `${currentPR.maxVolume} ${unit}` : '--'}
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="pro-card p-6 border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            {selectedExercise} Progression
          </h3>

          <div className="flex gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setMetricTab('weight')}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                metricTab === 'weight' ? 'bg-fitrex-red text-white shadow-glow-red' : 'text-slate-400'
              }`}
            >
              Max Weight
            </button>
            <button
              onClick={() => setMetricTab('1rm')}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                metricTab === '1rm' ? 'bg-fitrex-red text-white shadow-glow-red' : 'text-slate-400'
              }`}
            >
              Est. 1RM
            </button>
          </div>
        </div>

        {metricTab === 'weight' && renderChart('maxWeight', '#ef4444')}
        {metricTab === '1rm' && renderChart('best1RM', '#f87171')}
      </div>

      {/* PR Cabinet */}
      <div className="pro-card p-6 border-slate-800 space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="w-5 h-5 text-fitrex-red" /> Personal Records (PR)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {exerciseNames.map(name => {
            const record = prs[name];
            return (
              <div
                key={name}
                onClick={() => setSelectedExercise(name)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedExercise === name
                    ? 'bg-slate-850 border-fitrex-red/60 shadow-glow-red-sm'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-sm font-black text-white truncate max-w-[200px]">{name}</h4>
                  <span className="text-xs font-black bg-fitrex-red/15 text-fitrex-red border border-fitrex-red/30 px-2.5 py-0.5 rounded-full mono-num">
                    {record.maxWeight} {unit}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Est 1RM: <strong className="text-white mono-num">{record.best1RM} {unit}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
