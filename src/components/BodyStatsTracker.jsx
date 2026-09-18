import React, { useState } from 'react';
import { Activity, Scale, TrendingDown, TrendingUp, Plus, Trash2, Check } from 'lucide-react';
import { getBodyMetrics, saveBodyMetric, deleteBodyMetric, getSettings } from '../services/storage';

export default function BodyStatsTracker({ activeProfileId }) {
  const settings = getSettings();
  const unit = settings.unit || 'kg';

  const [metrics, setMetrics] = useState(() => getBodyMetrics(activeProfileId));
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('175');
  const [waist, setWaist] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || w <= 0) return;

    let weightKg = unit === 'lbs' ? w * 0.453592 : w;
    let heightM = h > 0 ? (h > 3 ? h / 100 : h) : 1.75;
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
    if (confirm('Delete this body measurement log?')) {
      const updated = deleteBodyMetric(id, activeProfileId);
      setMetrics(updated);
    }
  };

  const getBmiCategory = (bmi) => {
    if (!bmi) return { label: 'Unknown', color: 'text-slate-400', bg: 'bg-slate-800' };
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-cyan-400', bg: 'bg-cyan-500/20' };
    if (bmi < 25) return { label: 'Normal / Healthy', color: 'text-fitrex-red', bg: 'bg-fitrex-red/20' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-amber-400', bg: 'bg-amber-500/20' };
    return { label: 'Obese', color: 'text-rose-400', bg: 'bg-rose-500/20' };
  };

  const sortedByDate = [...metrics].sort((a, b) => new Date(a.date) - new Date(b.date));
  const currentEntry = sortedByDate[sortedByDate.length - 1];
  const firstEntry = sortedByDate[0];
  const totalChange = currentEntry && firstEntry ? (currentEntry.weight - firstEntry.weight).toFixed(1) : 0;
  const minWeight = sortedByDate.length > 0 ? Math.min(...sortedByDate.map(m => m.weight)) : 0;
  const maxWeight = sortedByDate.length > 0 ? Math.max(...sortedByDate.map(m => m.weight)) : 0;

  // Red Theme SVG Line Chart
  const renderWeightChart = () => {
    if (sortedByDate.length < 2) {
      return (
        <div className="h-48 flex items-center justify-center text-xs text-slate-500 text-center border border-dashed border-slate-800 rounded-2xl p-6">
          Log at least 2 body weight measurements to view your progress curve.
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
          <defs>
            <linearGradient id="bodyWeightGradRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {[0, 0.5, 1].map((ratio, idx) => {
            const y = height - padding - ratio * (height - 2 * padding);
            const val = (minW + ratio * rangeW).toFixed(1);
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
            fill="url(#bodyWeightGradRed)"
          />

          <path
            d={pathD}
            fill="none"
            stroke="#ef4444"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 4px 10px rgba(239, 68, 68, 0.5))' }}
          />

          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4.5" fill="#05070d" stroke="#ef4444" strokeWidth="3" />
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10"
                fontWeight="800"
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
      
      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="pro-card p-4 border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase font-black block mb-1">Current Weight</span>
          <span className="text-2xl font-black text-white mono-num">
            {currentEntry ? `${currentEntry.weight} ${unit}` : '--'}
          </span>
        </div>

        <div className="pro-card p-4 border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase font-black block mb-1">Net Change</span>
          <span className={`text-2xl font-black mono-num flex items-center gap-1 ${
            totalChange < 0 ? 'text-fitrex-red' : totalChange > 0 ? 'text-amber-400' : 'text-slate-300'
          }`}>
            {totalChange < 0 ? <TrendingDown className="w-5 h-5" /> : totalChange > 0 ? <TrendingUp className="w-5 h-5" /> : null}
            {totalChange > 0 ? `+${totalChange}` : totalChange} {unit}
          </span>
        </div>

        <div className="pro-card p-4 border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase font-black block mb-1">Weight Range</span>
          <span className="text-sm font-black text-white mono-num mt-1 block">
            {minWeight ? `${minWeight} - ${maxWeight} ${unit}` : '--'}
          </span>
        </div>

        <div className="pro-card p-4 border-slate-800">
          <span className="text-[11px] text-slate-400 uppercase font-black block mb-1">BMI</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-white mono-num">
              {currentEntry?.bmi || '--'}
            </span>
            {bmiCat && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${bmiCat.bg} ${bmiCat.color}`}>
                {bmiCat.label}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Weight Progression Curve */}
      <div className="pro-card p-6 border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Scale className="w-5 h-5 text-fitrex-red" /> Weight Trajectory
          </h3>
          <span className="text-xs text-slate-400">{sortedByDate.length} logs</span>
        </div>
        {renderWeightChart()}
      </div>

      {/* Form */}
      <div className="pro-card p-6 border-slate-800 space-y-4">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-5 h-5 text-fitrex-red" /> Log Body Measurement
        </h3>

        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full input-pro text-xs py-2.5"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Weight ({unit.toUpperCase()}) *</label>
            <input
              type="number"
              step="0.1"
              placeholder={unit === 'kg' ? '75.5' : '165.0'}
              value={weight}
              onChange={e => setWeight(e.target.value)}
              className="w-full input-pro text-xs py-2.5 mono-num font-bold"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Height (cm)</label>
            <input
              type="number"
              step="0.5"
              placeholder="175"
              value={height}
              onChange={e => setHeight(e.target.value)}
              className="w-full input-pro text-xs py-2.5 mono-num font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">Waist (cm)</label>
            <input
              type="number"
              step="0.5"
              placeholder="82"
              value={waist}
              onChange={e => setWaist(e.target.value)}
              className="w-full input-pro text-xs py-2.5 mono-num font-bold"
            />
          </div>

          <div className="sm:col-span-3">
            <input
              type="text"
              placeholder="Notes (e.g. Morning fasted)..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full input-pro text-xs py-2.5"
            />
          </div>

          <div>
            <button type="submit" className="w-full btn-pro-primary text-xs py-2.5">
              {savedSuccess ? <Check className="w-4 h-4 text-white font-black" /> : 'Log Measurement'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
