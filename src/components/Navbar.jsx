import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, LineChart, Activity, BookOpen, Lock, Settings, 
  Cloud, CloudOff, RefreshCw, ChevronDown, Timer, User
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
  const [activeProfile, setActiveProfile] = useState(getActiveProfile());
  const gistConfig = getGistConfig();

  useEffect(() => {
    setActiveProfile(getActiveProfile());
  }, [currentView]);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const displayName = activeProfile?.name || 'My Profile';
  const displayAvatar = activeProfile?.avatar || (activeProfile?.name ? activeProfile.name.charAt(0).toUpperCase() : 'U');

  return (
    <header className="sticky top-0 z-40 bg-[#05070d]/95 backdrop-blur-md border-b border-white/[0.08] px-2 sm:px-6 py-2 sm:py-2.5 shadow-xl w-full overflow-hidden">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand with Official FITREX CLUB Panther Logo */}
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => setCurrentView('workouts')}
          >
            <div className="h-8 sm:h-11 w-16 sm:w-32 flex items-center justify-center overflow-hidden shrink-0">
              <img 
                src="./logo.png" 
                alt="FITREX CLUB" 
                className="h-full w-full object-contain drop-shadow-[0_0_12px_rgba(239,68,68,0.4)] group-hover:scale-105 transition-transform"
              />
            </div>
          </div>

          {/* User-Specific Profile Badge & Switcher */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 hover:border-fitrex-red/60 transition-all shadow-sm group shrink-0"
            title="Switch or Manage User Profile"
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm bg-fitrex-red shrink-0"
            >
              {displayAvatar}
            </div>
            <span className="text-xs font-black text-slate-200 hidden xs:inline max-w-[65px] sm:max-w-[120px] truncate group-hover:text-white">
              {displayName}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-fitrex-red transition-colors shrink-0" />
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
            <LineChart className="w-4 h-4" /> Progress & PRs
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

        {/* Right Tools - Ultra Responsive to fit seamlessly on mobile screens */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* Rest Timer Capsule */}
          <button
            onClick={onToggleTimer}
            className={`px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-2 transition-all ${
              timerRunning
                ? 'bg-fitrex-red/20 border-fitrex-red/50 text-fitrex-red shadow-lg shadow-fitrex-red/20 animate-pulse'
                : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
            }`}
            title="Gym Rest Timer"
          >
            <Timer className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${timerRunning ? 'animate-spin text-fitrex-red' : ''}`} />
            <span className="mono-num font-bold">{formatTimer(timerSeconds)}</span>
          </button>

          {/* GitHub Gist Cloud Sync */}
          <button
            onClick={onSyncGist}
            className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl border text-xs flex items-center transition-all ${
              gistConfig.token
                ? gistConfig.syncStatus === 'syncing'
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                  : 'bg-slate-900/80 border-slate-700/80 text-fitrex-red hover:border-fitrex-red/50'
                : 'bg-slate-900/80 border-slate-700/80 text-slate-500 hover:text-slate-300'
            }`}
            title={gistConfig.token ? 'GitHub Gist Cloud Sync Connected' : 'Free Cloud Sync in Settings'}
          >
            {gistConfig.syncStatus === 'syncing' ? (
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-cyan-400" />
            ) : gistConfig.token ? (
              <Cloud className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-fitrex-red" />
            ) : (
              <CloudOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
            )}
          </button>

          {/* PIN Lock App Button */}
          <button
            onClick={onLockApp}
            className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-fitrex-red/60 text-slate-400 hover:text-white transition-colors"
            title="Lock Fitrex App with PIN"
          >
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-slate-600 text-slate-400 hover:text-white transition-colors"
            title="Settings & Cloud Sync"
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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