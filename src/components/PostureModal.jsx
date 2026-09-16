import React, { useState } from 'react';
import { X, Youtube, CheckCircle2, AlertTriangle, ExternalLink, Image as ImageIcon, Sparkles, Edit3 } from 'lucide-react';

// Extract valid YouTube embed ID
function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function PostureModal({ exercise, isOpen, onClose, onUpdateExercise }) {
  const [isEditing, setIsEditing] = useState(false);
  const [customVideo, setCustomVideo] = useState(exercise?.youtubeUrl || '');
  const [customPhoto, setCustomPhoto] = useState(exercise?.photoUrl || '');
  const [customNotes, setCustomNotes] = useState(exercise?.customNotes || '');

  if (!isOpen || !exercise) return null;

  const ytId = getYouTubeId(customVideo || exercise.youtubeUrl);

  const handleSave = () => {
    if (onUpdateExercise) {
      onUpdateExercise({
        ...exercise,
        youtubeUrl: customVideo,
        photoUrl: customPhoto,
        customNotes
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl glass-card p-5 sm:p-6 border border-slate-700/80 shadow-2xl relative my-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-muscle bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                {exercise.muscle}
              </span>
              {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                <span className="text-[11px] text-slate-400">
                  + {exercise.secondaryMuscles.join(', ')}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">{exercise.name}</h2>
            <p className="text-xs text-slate-400">Correct form, posture checkpoints & posture tutorial</p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-colors"
              title="Edit Video or Custom Notes"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video or Photo Media Section */}
        <div className="mb-5 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
          {ytId ? (
            <div className="relative pb-[56.25%] h-0">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1`}
                title={`${exercise.name} Form Tutorial`}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : exercise.photoUrl ? (
            <div className="relative h-64 bg-slate-900 flex items-center justify-center overflow-hidden">
              <img
                src={exercise.photoUrl}
                alt={exercise.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center px-4">
              <Youtube className="w-12 h-12 text-slate-600 mb-2" />
              <p className="text-sm text-slate-400 font-medium">No YouTube demonstration linked yet</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-3 text-xs text-emerald-400 hover:underline"
              >
                + Add YouTube Video Link
              </button>
            </div>
          )}
        </div>

        {/* Edit Media Drawer */}
        {isEditing && (
          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700 mb-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Edit Form Links & Notes</h4>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">YouTube Tutorial Link</label>
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={customVideo}
                onChange={e => setCustomVideo(e.target.value)}
                className="w-full input-field text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Photo / Diagram URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={customPhoto}
                onChange={e => setCustomPhoto(e.target.value)}
                className="w-full input-field text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Personal Form Cues / Setup Notes</label>
              <textarea
                rows={2}
                placeholder="e.g. Pin elbows closer to ribs; 2 sec pause at chest..."
                value={customNotes}
                onChange={e => setCustomNotes(e.target.value)}
                className="w-full input-field text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => setIsEditing(false)} className="btn-secondary text-xs py-1.5 px-3">
                Cancel
              </button>
              <button onClick={handleSave} className="btn-primary text-xs py-1.5 px-3">
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* External Video Button */}
        {(customVideo || exercise.youtubeUrl) && (
          <div className="flex justify-end mb-4">
            <a
              href={customVideo || exercise.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open in YouTube App / Web
            </a>
          </div>
        )}

        {/* Posture Cues & Common Mistakes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Key Form Checkpoints */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Form & Posture Cues
            </h4>
            <ul className="space-y-2">
              {(exercise.cues || [
                'Maintain neutral spine throughout the entire repetition',
                'Engage core and brace abdominal wall',
                'Control the eccentric (lowering) phase for 2-3 seconds'
              ]).map((cue, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{cue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Mistakes */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Mistakes to Avoid
            </h4>
            <ul className="space-y-2">
              {(exercise.mistakes || [
                'Using momentum and swinging upper body',
                'Cutting range of motion short at top or bottom',
                'Holding breath instead of exhaling on exertion'
              ]).map((err, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span>{err}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Custom User Notes */}
        {exercise.customNotes && !isEditing && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> My Personal Notes
            </h5>
            <p className="text-xs text-slate-300 whitespace-pre-line">{exercise.customNotes}</p>
          </div>
        )}

      </div>
    </div>
  );
}
