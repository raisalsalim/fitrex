import React, { useState } from 'react';
import { X, Scale, Calculator, Info } from 'lucide-react';
import { getSettings } from '../services/storage';

export default function PlateCalculatorModal({ isOpen, onClose, initialWeight = 60 }) {
  const settings = getSettings();
  const unit = settings.unit || 'kg';
  
  const [targetWeight, setTargetWeight] = useState(initialWeight || 60);
  const [barWeight, setBarWeight] = useState(unit === 'kg' ? 20 : 45);

  if (!isOpen) return null;

  // Available Olympic plates in kg or lbs
  const PLATES = unit === 'kg' ? [
    { weight: 25, color: '#dc2626', text: '#fff', label: '25kg' },
    { weight: 20, color: '#2563eb', text: '#fff', label: '20kg' },
    { weight: 15, color: '#eab308', text: '#000', label: '15kg' },
    { weight: 10, color: '#16a34a', text: '#fff', label: '10kg' },
    { weight: 5, color: '#f8fafc', text: '#000', label: '5kg' },
    { weight: 2.5, color: '#ef4444', text: '#fff', label: '2.5kg' },
    { weight: 1.25, color: '#94a3b8', text: '#fff', label: '1.25kg' },
  ] : [
    { weight: 45, color: '#2563eb', text: '#fff', label: '45lb' },
    { weight: 35, color: '#eab308', text: '#000', label: '35lb' },
    { weight: 25, color: '#16a34a', text: '#fff', label: '25lb' },
    { weight: 10, color: '#f8fafc', text: '#000', label: '10lb' },
    { weight: 5, color: '#ef4444', text: '#fff', label: '5lb' },
    { weight: 2.5, color: '#94a3b8', text: '#fff', label: '2.5lb' },
  ];

  const weightNeeded = Math.max(0, targetWeight - barWeight);
  const weightPerSide = weightNeeded / 2;

  // Calculate plates per side
  let remainder = weightPerSide;
  const plateCount = {};

  PLATES.forEach(p => {
    const count = Math.floor(remainder / p.weight);
    if (count > 0) {
      plateCount[p.weight] = count;
      remainder = Math.round((remainder - count * p.weight) * 100) / 100;
    }
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg pro-card p-6 border-slate-700/80 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-fitrex-lime/15 border border-fitrex-lime/30 flex items-center justify-center text-fitrex-lime shadow-glow-lime">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">Barbell Plate Calculator</h3>
            <p className="text-xs text-slate-400">See exact plates to slide on each side of the bar</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Target Weight ({unit.toUpperCase()})</label>
            <input
              type="number"
              step="2.5"
              value={targetWeight}
              onChange={e => setTargetWeight(parseFloat(e.target.value) || 0)}
              className="w-full input-pro text-sm font-bold mono-num"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Barbell Weight</label>
            <select
              value={barWeight}
              onChange={e => setBarWeight(parseFloat(e.target.value))}
              className="w-full input-pro text-sm font-bold bg-slate-900"
            >
              <option value={unit === 'kg' ? 20 : 45}>Standard Bar ({unit === 'kg' ? '20 kg' : '45 lbs'})</option>
              <option value={unit === 'kg' ? 15 : 35}>Women's / Tech Bar ({unit === 'kg' ? '15 kg' : '35 lbs'})</option>
              <option value={unit === 'kg' ? 10 : 25}>EZ Curl Bar ({unit === 'kg' ? '10 kg' : '25 lbs'})</option>
              <option value={0}>Smith Machine / No Bar (0)</option>
            </select>
          </div>
        </div>

        {/* Barbell Visual Display */}
        <div className="bg-fitrex-darker p-5 rounded-2xl border border-slate-800/80 mb-5">
          <div className="text-center mb-3">
            <span className="text-xs text-fitrex-lime font-bold uppercase tracking-wider">
              {weightPerSide > 0 ? `${weightPerSide} ${unit} Per Side` : 'No Plates Needed'}
            </span>
          </div>

          {/* Barbell illustration */}
          <div className="flex items-center justify-center h-28 relative">
            {/* Center Bar */}
            <div className="w-16 h-4 bg-gradient-to-b from-slate-400 via-slate-200 to-slate-500 rounded-l shadow-inner" />
            
            {/* Collar */}
            <div className="w-4 h-10 bg-slate-400 border border-slate-500 rounded-sm" />

            {/* Sleeve */}
            <div className="flex items-center gap-1.5 pl-1 bg-slate-700/50 py-2 px-2 rounded-r border-t border-b border-r border-slate-600 min-h-[50px] min-w-[140px]">
              {PLATES.map(p => {
                const count = plateCount[p.weight] || 0;
                if (count === 0) return null;
                return Array.from({ length: count }).map((_, i) => (
                  <div
                    key={`${p.weight}_${i}`}
                    className="flex items-center justify-center rounded shadow-lg border border-white/20 transition-transform hover:scale-105"
                    style={{
                      backgroundColor: p.color,
                      color: p.text,
                      height: `${Math.max(42, Math.min(84, p.weight * 3.2))}px`,
                      width: '20px',
                      fontSize: '9px',
                      fontWeight: '800'
                    }}
                    title={`${p.label}`}
                  >
                    <span className="transform -rotate-90 whitespace-nowrap">{p.weight}</span>
                  </div>
                ));
              })}
              {Object.keys(plateCount).length === 0 && (
                <span className="text-xs text-slate-500 italic pl-2">Just the barbell</span>
              )}
            </div>
          </div>
        </div>

        {/* Plates breakdown list */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Plates Breakdown (Each Side)</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PLATES.map(p => {
              const count = plateCount[p.weight] || 0;
              if (count === 0) return null;
              return (
                <div key={p.weight} className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div
                    className="w-4 h-4 rounded-full border border-white/30"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="text-xs font-bold text-white mono-num">
                    {count} × {p.label}
                  </span>
                </div>
              );
            })}
          </div>
          {remainder > 0 && (
            <p className="text-[11px] text-amber-400 mt-2">
              Note: Remaining {remainder * 2} {unit} cannot be made with standard plates.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
