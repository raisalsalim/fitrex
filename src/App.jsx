import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import WorkoutLogger from './components/WorkoutLogger';
import BodyStatsTracker from './components/BodyStatsTracker';
import AnalyticsView from './components/AnalyticsView';
import ExerciseLibraryModal from './components/ExerciseLibraryModal';
import RestTimer from './components/RestTimer';
import PinLockModal from './components/PinLockModal';
import ProfileSelectorModal from './components/ProfileSelectorModal';
import SettingsModal from './components/SettingsModal';
import { 
  getActiveProfileId, getPinConfig, getSettings, syncWithGist 
} from './services/storage';

export default function App() {
  const [currentView, setCurrentView] = useState('workouts'); // 'workouts' | 'analytics' | 'body' | 'library'
  const [activeProfileId, setActiveProfileId] = useState(() => getActiveProfileId());

  // Security Lock State
  const [isLocked, setIsLocked] = useState(() => {
    const config = getPinConfig();
    return Boolean(config.enabled && config.pinHash);
  });
  const [showPinSetup, setShowPinSetup] = useState(false);

  // Modals
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState(90);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);

  // Auto-sync with Gist on load if configured
  useEffect(() => {
    syncWithGist().catch(e => console.log('Init sync check:', e));
  }, []);

  const triggerTimer = (duration) => {
    setTimerSeconds(duration || 90);
    setTimerRunning(true);
    setTimerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onLockApp={() => setIsLocked(true)}
        onToggleTimer={() => setTimerOpen(prev => !prev)}
        timerRunning={timerRunning}
        timerSeconds={timerSeconds}
        onSyncGist={async () => {
          const res = await syncWithGist();
          if (res.success) {
            alert('Cloud Sync complete! All workouts up-to-date.');
          } else {
            alert('Sync failed: ' + (res.message || 'Check your token in Settings'));
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6">
        {currentView === 'workouts' && (
          <WorkoutLogger
            activeProfileId={activeProfileId}
            onTriggerTimer={triggerTimer}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView activeProfileId={activeProfileId} />
        )}

        {currentView === 'body' && (
          <BodyStatsTracker activeProfileId={activeProfileId} />
        )}

        {currentView === 'library' && (
          <ExerciseLibraryModal
            onAddExerciseToWorkout={(exercise) => {
              setCurrentView('workouts');
            }}
          />
        )}
      </main>

      {/* Floating Rest Timer */}
      <RestTimer
        isOpen={timerOpen}
        onClose={() => setTimerOpen(false)}
        seconds={timerSeconds}
        setSeconds={setTimerSeconds}
        isRunning={timerRunning}
        setIsRunning={setTimerRunning}
      />

      {/* Security PIN Lock Screen */}
      <PinLockModal
        isOpen={isLocked || showPinSetup}
        forceSetup={showPinSetup}
        onUnlock={() => {
          setIsLocked(false);
          setShowPinSetup(false);
        }}
        onClose={() => setShowPinSetup(false)}
      />

      {/* Profile Switcher Modal */}
      <ProfileSelectorModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onProfileChanged={(newId) => {
          setActiveProfileId(newId);
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onRequirePinSetup={() => setShowPinSetup(true)}
      />

    </div>
  );
}
