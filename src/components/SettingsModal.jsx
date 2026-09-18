import React, { useState } from 'react';
import { 
  X, Cloud, Lock, Download, Upload, Trash2, KeyRound, 
  ExternalLink, Check, AlertCircle, RefreshCw, Smartphone, Laptop
} from 'lucide-react';
import { 
  getGistConfig, saveGistConfig, syncWithGist, 
  getPinConfig, savePinConfig, getSettings, saveSettings,
  exportAllDataPackage, importDataPackage 
} from '../services/storage';

export default function SettingsModal({ isOpen, onClose, onRequirePinSetup }) {
  const [gistConfig, setGistConfig] = useState(getGistConfig());
  const [tokenInput, setTokenInput] = useState(gistConfig.token || '');
  const [autoSync, setAutoSync] = useState(gistConfig.autoSync !== false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(null);

  const [pinConfig, setPinConfig] = useState(getPinConfig());
  const [settings, setLocalSettings] = useState(getSettings());
  const [activeTab, setActiveTab] = useState('sync'); // 'sync' | 'security' | 'backup' | 'deploy'

  if (!isOpen) return null;

  const handleSaveGist = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    const updated = {
      ...gistConfig,
      token: tokenInput.trim(),
      autoSync
    };
    saveGistConfig(updated);
    setGistConfig(updated);

    const res = await syncWithGist();
    setIsSyncing(false);
    if (res.success) {
      setSyncFeedback({ type: 'success', text: `Sync successful! Connected to private Gist ID: ${res.gistId}` });
      setGistConfig(getGistConfig());
    } else {
      setSyncFeedback({ type: 'error', text: res.message });
    }
  };

  const handleTogglePin = () => {
    if (pinConfig.enabled) {
      if (confirm('Disable PIN protection? Anyone visiting the site will be able to view workouts.')) {
        const next = { ...pinConfig, enabled: false };
        savePinConfig(next);
        setPinConfig(next);
      }
    } else {
      onClose();
      onRequirePinSetup();
    }
  };

  const handleUnitChange = (u) => {
    const next = { ...settings, unit: u };
    saveSettings(next);
    setLocalSettings(next);
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const data = exportAllDataPackage();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitrex_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        importDataPackage(json);
        alert('Fitrex backup imported successfully! Page will refresh to load all data.');
        window.location.reload();
      } catch (err) {
        alert('Failed to import backup: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-xl glass-card p-5 sm:p-6 border-slate-700 shadow-2xl relative my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-fitrex-red/10 border border-fitrex-red/30 flex items-center justify-center text-fitrex-red font-bold">
            ⚡
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Fitrex Settings</h3>
            <p className="text-xs text-slate-400">Free GitHub cloud sync, PIN lock & cross-device backup</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 border-b border-slate-800 pb-2 mb-5">
          <button
            onClick={() => setActiveTab('sync')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'sync' ? 'bg-fitrex-red text-white shadow-glow-red' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" /> 100% Free Cloud Sync
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'security' ? 'bg-fitrex-red text-white shadow-glow-red' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" /> PIN Security
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'backup' ? 'bg-fitrex-red text-white shadow-glow-red' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" /> Backup & Units
          </button>
          <button
            onClick={() => setActiveTab('deploy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'deploy' ? 'bg-fitrex-red text-white shadow-glow-red' : 'text-slate-400 hover:text-white'
            }`}
          >
            🚀 GitHub Deploy
          </button>
        </div>

        {/* TAB 1: 100% Free GitHub Gist Sync */}
        {activeTab === 'sync' && (
          <div className="space-y-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-fitrex-red uppercase tracking-wider">
                <Smartphone className="w-4 h-4" /> ↔ <Laptop className="w-4 h-4" /> Sync Between Phone & Laptop
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                GitHub Gists are <strong>100% free and private</strong>. Fitrex uses a secret Gist in your own GitHub account to keep your workouts in sync across your phone and laptop on different Wi-Fi or cellular networks.
              </p>
            </div>

            {/* How to generate token */}
            <div className="p-3.5 rounded-xl bg-fitrex-red/5 border border-fitrex-red/20 text-xs text-slate-300 space-y-1.5">
              <div className="font-bold text-white flex items-center justify-between">
                <span>How to connect in 1 minute:</span>
                <a
                  href="https://github.com/settings/tokens/new?description=Fitrex+Sync&scopes=gist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fitrex-red hover:underline flex items-center gap-1 text-[11px]"
                >
                  Generate Token on GitHub <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[11px] text-slate-400">
                1. Click the link above to open GitHub Token Settings.<br />
                2. Ensure the <strong>gist</strong> checkbox is checked.<br />
                3. Click "Generate token" at bottom, copy it, and paste below:
              </p>
            </div>

            {/* Token Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">GitHub Personal Access Token</label>
              <input
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={tokenInput}
                onChange={e => setTokenInput(e.target.value)}
                className="w-full input-pro text-xs py-2.5 font-mono"
              />
            </div>

            {/* Auto sync checkbox */}
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSync}
                onChange={e => setAutoSync(e.target.checked)}
                className="rounded accent-fitrex-red"
              />
              Auto-sync workouts to GitHub Gist when saved
            </label>

            {/* Status & Feedback */}
            {syncFeedback && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                syncFeedback.type === 'success'
                  ? 'bg-fitrex-red/10 text-fitrex-red border border-fitrex-red/30'
                  : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
              }`}>
                {syncFeedback.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{syncFeedback.text}</span>
              </div>
            )}

            {gistConfig.lastSyncedAt && (
              <p className="text-[11px] text-slate-400">
                Last synchronized: {new Date(gistConfig.lastSyncedAt).toLocaleString()}
              </p>
            )}

            <button
              onClick={handleSaveGist}
              disabled={isSyncing}
              className="w-full btn-primary text-xs py-2.5 flex items-center justify-center gap-2"
            >
              {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
              {gistConfig.token ? 'Save & Sync Now' : 'Connect & Sync with GitHub Gist'}
            </button>
          </div>
        )}

        {/* TAB 2: PIN Security */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">App Lock Screen</h4>
                  <p className="text-xs text-slate-400">
                    Require a numerical PIN when opening Fitrex on phone or laptop
                  </p>
                </div>
                <button
                  onClick={handleTogglePin}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    pinConfig.enabled
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-fitrex-red text-white shadow-glow-red font-bold'
                  }`}
                >
                  {pinConfig.enabled ? 'Disable PIN' : 'Set Up PIN'}
                </button>
              </div>
            </div>

            {pinConfig.enabled && (
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-fitrex-red flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> PIN Security is Active
                </span>
                <p className="text-xs text-slate-400">
                  Your workouts and body metrics are protected from public visitors to your GitHub Pages URL.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onRequirePinSetup();
                  }}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  Change PIN Code
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Backup & Units */}
        {activeTab === 'backup' && (
          <div className="space-y-4">
            {/* Units Selection */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Weight Units</h4>
                <p className="text-xs text-slate-400">Choose preferred measurement system</p>
              </div>
              <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => handleUnitChange('kg')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    settings.unit === 'kg' ? 'bg-fitrex-red text-white shadow-glow-red' : 'text-slate-400'
                  }`}
                >
                  KG
                </button>
                <button
                  onClick={() => handleUnitChange('lbs')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    settings.unit === 'lbs' ? 'bg-fitrex-red text-white shadow-glow-red' : 'text-slate-400'
                  }`}
                >
                  LBS
                </button>
              </div>
            </div>

            {/* Offline JSON Backup */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white">Manual JSON File Backup</h4>
              <p className="text-xs text-slate-400">
                Download a complete snapshot of all profiles, workouts, PRs, and body metrics.
              </p>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleExportBackup}
                  className="btn-secondary flex-1 text-xs py-2 flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-fitrex-red" /> Export Backup
                </button>

                <label className="btn-secondary flex-1 text-xs py-2 flex items-center justify-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-cyan-400" /> Import Backup
                  <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GitHub Deploy Guide */}
        {activeTab === 'deploy' && (
          <div className="space-y-3 text-xs text-slate-300">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-sm font-bold text-fitrex-red flex items-center gap-1.5">
                🚀 How to Deploy 100% Free to GitHub Pages
              </h4>
              <p className="text-slate-400">
                Fitrex is already configured with relative paths and an automated GitHub Actions deployment workflow.
              </p>
            </div>

            <ol className="space-y-2.5 pl-4 list-decimal text-slate-300">
              <li>
                <strong>Create a new GitHub Repository</strong> on <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-fitrex-red underline">github.com/new</a> (e.g. named <code>fitrex</code>).
              </li>
              <li>
                <strong>Push your code</strong> to GitHub:
                <pre className="bg-slate-950 p-2 rounded-lg text-[11px] font-mono mt-1 text-slate-300 overflow-x-auto">
git add .
git commit -m "Initial Fitrex release"
git remote add origin https://github.com/YOUR_USERNAME/fitrex.git
git branch -M main
git push -u origin main
                </pre>
              </li>
              <li>
                In your GitHub repo: Go to <strong>Settings</strong> → <strong>Pages</strong>. Under <strong>Build and deployment &gt; Source</strong>, select <strong>GitHub Actions</strong>.
              </li>
              <li>
                Done! Your app will be live at <code>https://YOUR_USERNAME.github.io/fitrex/</code> completely free!
              </li>
            </ol>
          </div>
        )}

      </div>
    </div>
  );
}
