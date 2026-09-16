import React, { useState } from 'react';
import { LineChart, Trophy, TrendingUp, Zap, Calendar, Target, Award } from 'lucide-react';
import { getWorkouts, getPersonalRecords, getSettings } from '../services/storage';

export default function AnalyticsView({ activeProfileId }) {
  const settings = getSettings();
  const unit = settings.unit || 'kg';
  const workouts = getWorkouts(activeProfileId);
  const prs = getPersonalRecords(activeProfileId);

  // Collect all unique exercises ever logged
  const exerciseNames = Object.keys(prs);
  const [selectedExercise, setSelectedExercise] = useState(exerciseNames[0] || 'Barbell Bench Press');

  // Extract progression points for selected exercise
  const exerciseHistory = [];
  workouts.forEach(w => {
    (w.exercises || []).forEach(ex => {
      if (ex.name.toLowerCase() === selectedExercise.toLowerCase()) {
        const completedSets = (ex.sets || []).filter(s => s.completed);
        if (completedSets.length > 0) {
          const maxWeight = Math.max(...completedSets.map(s => Number(s.weight) || 0));
          const maxReps = Math.max(...completedSets.map(s => Number(s.reps) || 0));
          const totalVol = completedSets.reduce((sum, s) => sum + ((Number(s.weight) || 0) * (Number(s.reps) || 0)), 0);
          const best1RM = Math.max(...completedSets.map(s => {
            const wgt = Number(s.weight) || 0;
            const r = Number(s.reps) || 0;
            return Math.round(wgt * (1 + r / 30));
          }));

          exerciseHistory.push({
            date: w.date,
            maxWeight,
            maxReps,
            totalVol,
            best1RM,
            setsCount: completedSets.length
          });
        }
      }
    });
  });

  // Sort chronologically
  exerciseHistory.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Render SVG progression chart
  const renderChart = (key, label, color) => {
    if (exerciseHistory.length < 2) {
      return (
        <div className="h-44 flex items-center justify-center text-xs text-slate-500 text-center">
          Log at least 2 sessions with completed sets to see your progression graph for {selectedExercise}.
        </div>
      );
    }

    const padding = 35;
    const width = 600;
    const height = 180;
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
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
          {[0, 0.5, 1].map((r, idx) => {
            const y = height - padding - r * (height - 2 * padding);
            const val = Math.round(minVal + r * range);
            return (
              <g key={idx}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <text x={padding - 8} y={y + 3} textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">
                  {val}
                </text>
              </g>
            );
          })}

          <path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="3.5" fill="#080b12" stroke={color} strokeWidth="2.5" />
              <text x={p.x} y={p.y - 8} textAnchor="middle" fill="#f8fafc" fontSize="9" fontWeight="600" fontFamily="monospace">
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
      
      {/* Exercise Selector */}
      <div className="glass-card p-5 border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <LineChart className="w-5 h-5 text-emerald-400" /> Exercise Progression & PRs
          </h2>
          <p className="text-xs text-slate-400">Track weight improvements and estimated 1-Rep Max curves over time</p>
        </div>

        {exerciseNames.length > 0 && (
          <select
            value={selectedExercise}
            onChange={e => setSelectedExercise(e.target.value)}
            className="input-field text-xs py-2 px-3 min-w-[220px] font-semibold text-emerald-400 bg-slate-900"
          >
            {exerciseNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Selected Exercise PR Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-card p-4 border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Max Weight Lifted</span>
            <span className="text-xl font-extrabold text-white mono-num">
              {currentPR.maxWeight ? `${currentPR.maxWeight} ${unit}` : '--'}
            </span>
          </div>
        </div>

        <div className="glass-card p-4 border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Est. 1-Rep Max (1RM)</span>
            <span className="text-xl font-extrabold text-white mono-num">
              {currentPR.best1RM ? `${currentPR.best1RM} ${unit}` : '--'}
            </span>
          </div>
        </div>

        <div className="glass-card p-4 border-slate-800 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">Max Set Volume</span>
            <span className="text-xl font-extrabold text-white mono-num">
              {currentPR.maxVolume ? `${currentPR.maxVolume} ${unit}` : '--'}
            </span>
          </div>
        </div>
      </div>

      {/* Weight Progression Chart */}
      <div className="glass-card p-5 border-slate-800 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4" /> Max Weight Lifted per Session ({unit.toUpperCase()})
        </h3>
        {renderChart('maxWeight', 'Weight', '#10b981')}
      </div>

      {/* Estimated 1RM Progression Chart */}
      <div className="glass-card p-5 border-slate-800 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          <Zap className="w-4 h-4" /> Estimated 1-Rep Max (Epley Formula) ({unit.toUpperCase()})
        </h3>
        {renderChart('best1RM', '1RM', '#06b6d4')}
      </div>

      {/* All-Time PR Trophy Cabinet */}
      <div className="glass-card p-5 border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" /> Personal Records (PR) Cabinet
        </h3>

        {exerciseNames.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">
            No personal records established yet. Complete sets in your workout log to unlock PR badges!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {exerciseNames.map(name => {
              const record = prs[name];
              return (
                <div
                  key={name}
                  onClick={() => setSelectedExercise(name)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedExercise === name
                      ? 'bg-slate-850 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-sm font-bold text-white truncate max-w-[200px]">{name}</h4>
                    <span className="text-[10px] bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                      {record.maxWeight} {unit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Est 1RM: {record.best1RM} {unit}</span>
                    <span>Best Vol: {record.maxVolume} {unit}</span>
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
