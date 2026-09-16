import React, { useState } from 'react';
import { Activity, Scale, TrendingDown, TrendingUp, Plus, Trash2, Calendar, Check, AlertCircle } from 'lucide-react';
import { getBodyMetrics, saveBodyMetric, deleteBodyMetric, getSettings } from '../services/storage';

export default function BodyStatsTracker({ activeProfileId }) {
  const settings = getSettings();
  const unit = settings.unit || 'kg';

  const [metrics, setMetrics] = useState(() => getBodyMetrics(activeProfileId));
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('175'); // cm default
  const [waist, setWaist] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || w <= 0) return;

    // Calculate BMI: weight(kg) / (height(m)^2)
    let weightKg = unit === 'lbs' ? w * 0.453592 : w;
    let heightM = h > 0 ? (h > 3 ? h / 100 : h) : 1.75; // assume cm if > 3
    let bmi = 0;
    if (heightM > 0) {
      bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
    }

    const newMetric = {
      id: 'bm_' + Date.now(),
      date,
      weight: w,
      height: h,
      bmi,
      waist: waist ? parseFloat(waist) : null,
      notes
    };

    const updated = saveBodyMetric(newMetric, activeProfileId);
    setMetrics(updated);
    setWeight('');
    setNotes('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this body log entry?')) {
      const updated = deleteBodyMetric(id, activeProfileId);
      setMetrics(updated);
    }
  };

  // BMI Classification
  const getBmiCategory = (bmi) => {
    if (!bmi) return { label: 'Unknown', color: 'text-slate-400' };
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-cyan-400', bg: 'bg-cyan-500/20' };
    if (bmi < 25) return { label: 'Normal Weight', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-amber-400', bg: 'bg-amber-500/20' };
    return { label: 'Obese', color: 'text-rose-400', bg: 'bg-rose-500/20' };
  };

  // Stats calculation
  const sortedByDate = [...metrics].sort((a, b) => new Date(a.date) - new Date(b.date));
  const currentEntry = sortedByDate[sortedByDate.length - 1];
  const firstEntry = sortedByDate[0];
  const totalChange = currentEntry && firstEntry ? (currentEntry.weight - firstEntry.weight).toFixed(1) : 0;
  const minWeight = sortedByDate.length > 0 ? Math.min(...sortedByDate.map(m => m.weight)) : 0;
  const maxWeight = sortedByDate.length > 0 ? Math.max(...sortedByDate.map(m => m.weight)) : 0;

  // Simple responsive SVG line chart
  const renderWeightChart = () => {
    if (sortedByDate.length < 2) {
      return (
        <div className="h-48 flex items-center justify-center text-xs text-slate-500 text-center">
          Log at least 2 body weight measurements to view your interactive progress curve.
        </div>
      );
    }

    const padding = 35;
    const width = 600;
    const height = 200;
    const weights = sortedByDate.map(d => d.weight);
    const minW = Math.min(...weights) - 1;
    const maxW = Math.max(...weights) + 1;
    const rangeW = maxW - minW || 1;

    const points = sortedByDate.map((d, i) => {
      const x = padding + (i / (sortedByDate.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((d.weight - minW) / rangeW) * (height - 2 * padding);
      return { x, y, weight: d.weight, date: d.date };
    });

    const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

    return (
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 sm:h-56">
          {/* Subtle Grid Lines */}
          {[0, 0.5, 1].map((ratio, idx) => {
            const y = height - padding - ratio * (height - 2 * padding);
            const val = (minW + ratio * rangeW).toFixed(1);
            return (
              <g key={idx}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                <text x={padding - 8} y={y + 3} textAnchor="end" fill="#64748b" fontSize="10" fontFamily="monospace">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area gradient under curve */}
          <defs>
            <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
            fill="url(#weightGrad)"
          />

          {/* Line */}
          <path d={pathD} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="#080b12" stroke="#10b981" strokeWidth="2.5" />
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                fill="#f8fafc"
                fontSize="10"
                fontWeight="600"
                fontFamily="monospace"
              >
                {p.weight}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const bmiCat = currentEntry?.bmi ? getBmiCategory(currentEntry.bmi) : null;

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      
      {/* Title & Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card p-4 border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">Current Weight</span>
          <span className="text-2xl font-extrabold text-white mono-num">
            {currentEntry ? `${currentEntry.weight} ${unit}` : '--'}
          </span>
        </div>

        <div className="glass-card p-4 border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">Total Net Change</span>
          <span className={`text-2xl font-extrabold mono-num flex items-center gap-1 ${
            totalChange < 0 ? 'text-emerald-400' : totalChange > 0 ? 'text-amber-400' : 'text-slate-300'
          }`}>
            {totalChange < 0 ? <TrendingDown className="w-5 h-5" /> : totalChange > 0 ? <TrendingUp className="w-5 h-5" /> : null}
            {totalChange > 0 ? `+${totalChange}` : totalChange} {unit}
          </span>
        </div>

        <div className="glass-card p-4 border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">Lowest / Highest</span>
          <span className="text-sm font-bold text-slate-200 mono-num">
            {minWeight ? `${minWeight} - ${maxWeight} ${unit}` : '--'}
          </span>
        </div>

        <div className="glass-card p-4 border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">Latest BMI</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-white mono-num">
              {currentEntry?.bmi || '--'}
            </span>
            {bmiCat && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${bmiCat.bg} ${bmiCat.color}`}>
                {bmiCat.label}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Weight Progression Chart */}
      <div className="glass-card p-5 border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-400" /> Body Weight Progression Curve
          </h3>
          <span className="text-xs text-slate-400">{sortedByDate.length} logged entries</span>
        </div>
        {renderWeightChart()}
      </div>

      {/* Log New Entry Form */}
      <div className="glass-card p-5 border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-400" /> Log Body Measurement
        </h3>

        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full input-field text-xs py-2"
              required
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Weight ({unit.toUpperCase()}) *</label>
            <input
              type="number"
              step="0.1"
              placeholder={unit === 'kg' ? '75.5' : '165.0'}
              value={weight}
              onChange={e => setWeight(e.target.value)}
              className="w-full input-field text-xs py-2 mono-num"
              required
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Height (cm)</label>
            <input
              type="number"
              step="0.5"
              placeholder="175"
              value={height}
              onChange={e => setHeight(e.target.value)}
              className="w-full input-field text-xs py-2 mono-num"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Waist (Optional cm)</label>
            <input
              type="number"
              step="0.5"
              placeholder="82"
              value={waist}
              onChange={e => setWaist(e.target.value)}
              className="w-full input-field text-xs py-2 mono-num"
            />
          </div>

          <div className="sm:col-span-3">
            <input
              type="text"
              placeholder="Notes (e.g. Morning fasted, post hydration)..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full input-field text-xs py-2"
            />
          </div>

          <div>
            <button type="submit" className="w-full btn-primary text-xs py-2.5">
              {savedSuccess ? <Check className="w-4 h-4 text-white" /> : 'Record Entry'}
            </button>
          </div>
        </form>
      </div>

      {/* Historical Entries Table */}
      <div className="glass-card p-5 border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Log History</h3>
        
        {metrics.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">No body logs recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Weight</th>
                  <th className="py-2.5 px-3">Height</th>
                  <th className="py-2.5 px-3">BMI</th>
                  <th className="py-2.5 px-3">Notes</th>
                  <th className="py-2.5 px-2 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {metrics.map(m => (
                  <tr key={m.id} className="hover:bg-slate-900/30">
                    <td className="py-2.5 px-3 font-semibold text-slate-200">{m.date}</td>
                    <td className="py-2.5 px-3 font-bold text-white mono-num">{m.weight} {unit}</td>
                    <td className="py-2.5 px-3 text-slate-400 mono-num">{m.height ? `${m.height} cm` : '-'}</td>
                    <td className="py-2.5 px-3">
                      {m.bmi ? (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold mono-num ${getBmiCategory(m.bmi).bg} ${getBmiCategory(m.bmi).color}`}>
                          {m.bmi} ({getBmiCategory(m.bmi).label})
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 truncate max-w-[150px]">{m.notes || '-'}</td>
                    <td className="py-2.5 px-2 text-right">
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
