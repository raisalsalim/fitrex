import React from 'react';
import { 
  Dumbbell, Activity, LineChart, BookOpen, Settings, Lock, 
  Cloud, CloudOff, RefreshCw, Timer, ChevronDown
} from 'lucide-react';
import { getActiveProfile, getGistConfig } from '../services/storage';

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
    <header className="sticky top-0 z-40 bg-[#05070d]/95 backdrop-blur-xl border-b border-white/[0.08] px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        
        {/* Brand & Red Logo */}
        <div className="flex items-center gap-3.5">
          <div 
            className="flex items-center gap-2.5 cursor-pointer group" 
            onClick={() => setCurrentView('workouts')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-fitrex-red to-red-600 flex items-center justify-center shadow-glow-red group-hover:scale-105 transition-transform">
              <Dumbbell className="w-5 h-5 text-white font-black -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-wider text-white">
                  FITREX
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-fitrex-red/20 text-fitrex-red border border-fitrex-red/40 tracking-wider">
                  PRO
                </span>
              </div>
              <span className="block text-[10px] text-slate-400 font-semibold tracking-widest uppercase -mt-0.5">
                Workout Tracker
              </span>
            </div>
          </div>

          {/* Profile Switcher */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 hover:border-fitrex-red/50 transition-all shadow-sm"
            title="Switch User Profile"
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm"
              style={{ backgroundColor: activeProfile.color || '#ef4444' }}
            >
              {activeProfile.avatar || activeProfile.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-bold text-slate-200 max-w-[80px] truncate">
              {activeProfile.name}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* View Navigation Tabs - Desktop */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-white/[0.08]">
          <button
            onClick={() => setCurrentView('workouts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentView === 'workouts'
                ? 'bg-gradient-to-r from-fitrex-red to-red-600 text-white shadow-glow-red'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Dumbbell className="w-4 h-4" /> Workouts
          </button>

          <button
            onClick={() => setCurrentView('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentView === 'analytics'
                ? 'bg-gradient-to-r from-fitrex-red to-red-600 text-white shadow-glow-red'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <LineChart className="w-4 h-4" /> Analytics & PRs
          </button>

          <button
            onClick={() => setCurrentView('body')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentView === 'body'
                ? 'bg-gradient-to-r from-fitrex-red to-red-600 text-white shadow-glow-red'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-4 h-4" /> Body Stats
          </button>

          <button
            onClick={() => setCurrentView('library')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              currentView === 'library'
                ? 'bg-gradient-to-r from-fitrex-red to-red-600 text-white shadow-glow-red'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Form Guides
          </button>
        </nav>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          
          {/* Rest Timer Capsule */}
          <button
            onClick={onToggleTimer}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
              timerRunning
                ? 'bg-fitrex-red/20 border-fitrex-red/50 text-fitrex-red shadow-lg shadow-fitrex-red/20 animate-pulse'
                : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
            }`}
            title="Gym Rest Timer"
          >
            <Timer className={`w-4 h-4 ${timerRunning ? 'animate-spin' : ''}`} />
            <span className="mono-num font-bold">{formatTimer(timerSeconds)}</span>
          </button>

          {/* GitHub Gist Cloud Sync */}
          <button
            onClick={onSyncGist}
            className={`p-2 rounded-xl border text-xs flex items-center transition-all ${
              gistConfig.token
                ? gistConfig.syncStatus === 'syncing'
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                  : 'bg-slate-900/80 border-slate-700/80 text-fitrex-red hover:border-fitrex-red/50'
                : 'bg-slate-900/80 border-slate-700/80 text-slate-500 hover:text-slate-300'
            }`}
            title={gistConfig.token ? 'GitHub Gist Cloud Sync Connected' : 'Free Cloud Sync in Settings'}
          >
            {gistConfig.syncStatus === 'syncing' ? (
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            ) : gistConfig.token ? (
              <Cloud className="w-4 h-4 text-fitrex-red" />
            ) : (
              <CloudOff className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* PIN Lock */}
          <button
            onClick={onLockApp}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-slate-600 text-slate-400 hover:text-white transition-colors"
            title="Lock Fitrex with PIN"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-slate-600 text-slate-400 hover:text-white transition-colors"
            title="Settings & Cloud Sync"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Mobile Subnav */}
      <div className="md:hidden flex items-center justify-around pt-2.5 mt-2.5 border-t border-white/[0.06]">
        <button
          onClick={() => setCurrentView('workouts')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            currentView === 'workouts' ? 'text-fitrex-red' : 'text-slate-400'
          }`}
        >
          <Dumbbell className="w-4 h-4" /> Workouts
        </button>
        <button
          onClick={() => setCurrentView('analytics')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            currentView === 'analytics' ? 'text-fitrex-red' : 'text-slate-400'
          }`}
        >
          <LineChart className="w-4 h-4" /> Progress
        </button>
        <button
          onClick={() => setCurrentView('body')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            currentView === 'body' ? 'text-fitrex-red' : 'text-slate-400'
          }`}
        >
          <Activity className="w-4 h-4" /> Body
        </button>
        <button
          onClick={() => setCurrentView('library')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            currentView === 'library' ? 'text-fitrex-red' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Guides
        </button>
      </div>
    </header>
  );
}
