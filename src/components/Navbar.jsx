import React from 'react';
import { Dumbbell, Activity, LineChart, BookOpen, Settings, Lock, Cloud, CloudOff, RefreshCw, Timer } from 'lucide-react';
import { getActiveProfile, getGistConfig, syncWithGist } from '../services/storage';

export default function Navbar({
  currentView,
  setCurrentView,
  onOpenProfile,
  onOpenSettings,
  onLockApp,
  onToggleTimer,
  timerRunning,
  timerSeconds,
  onSyncGist
}) {
  const activeProfile = getActiveProfile();
  const gistConfig = getGistConfig();

  const formatTimer = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#080b12]/85 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        
        {/* Brand & Profile */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('workouts')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Dumbbell className="w-5 h-5 text-slate-950 font-bold -rotate-45" />
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                FITREX
              </span>
              <span className="block text-[10px] text-emerald-400 font-medium -mt-1 tracking-widest">
                PRO GYM LOG
              </span>
            </div>
          </div>

          {/* Profile Switcher Pill */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
            title="Switch User Profile"
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
              style={{ backgroundColor: activeProfile.color || '#10b981' }}
            >
              {activeProfile.avatar || activeProfile.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-slate-200 max-w-[80px] truncate">
              {activeProfile.name}
            </span>
          </button>
        </div>

        {/* View Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setCurrentView('workouts')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentView === 'workouts'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" /> Workouts
          </button>

          <button
            onClick={() => setCurrentView('analytics')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentView === 'analytics'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" /> Progression & PRs
          </button>

          <button
            onClick={() => setCurrentView('body')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentView === 'body'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Body Metrics
          </button>

          <button
            onClick={() => setCurrentView('library')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentView === 'library'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Exercise Guides
          </button>
        </nav>

        {/* Right Tools & Utilities */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Rest Timer Toggle */}
          <button
            onClick={onToggleTimer}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              timerRunning
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-md shadow-amber-500/15'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
            title="Gym Rest Timer"
          >
            <Timer className={`w-4 h-4 ${timerRunning ? 'animate-pulse' : ''}`} />
            <span className="mono-num hidden xs:inline">{formatTimer(timerSeconds)}</span>
          </button>

          {/* Gist Cloud Sync Button */}
          <button
            onClick={onSyncGist}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition-all ${
              gistConfig.token
                ? gistConfig.syncStatus === 'syncing'
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400'
                  : 'bg-slate-900/60 border-slate-800 text-emerald-400 hover:border-emerald-500/40'
                : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={gistConfig.token ? 'GitHub Gist Sync (100% Free)' : 'Configure Free GitHub Cloud Sync in Settings'}
          >
            {gistConfig.syncStatus === 'syncing' ? (
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            ) : gistConfig.token ? (
              <Cloud className="w-4 h-4 text-emerald-400" />
            ) : (
              <CloudOff className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Lock Screen */}
          <button
            onClick={onLockApp}
            className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Lock Fitrex with PIN"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Settings & Data Sync"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Subnav */}
      <div className="md:hidden flex items-center justify-around pt-2 mt-2 border-t border-slate-800/60">
        <button
          onClick={() => setCurrentView('workouts')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-medium ${
            currentView === 'workouts' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Dumbbell className="w-4 h-4" /> Workouts
        </button>
        <button
          onClick={() => setCurrentView('analytics')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-medium ${
            currentView === 'analytics' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <LineChart className="w-4 h-4" /> Progress
        </button>
        <button
          onClick={() => setCurrentView('body')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-medium ${
            currentView === 'body' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Activity className="w-4 h-4" /> Body
        </button>
        <button
          onClick={() => setCurrentView('library')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-medium ${
            currentView === 'library' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Guides
        </button>
      </div>
    </header>
  );
}
