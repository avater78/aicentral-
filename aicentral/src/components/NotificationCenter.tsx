import React from 'react';
import { X, Bell, Zap, Tag, ShieldCheck, Check } from 'lucide-react';

interface NotificationCenterProps {
  onClose: () => void;
  onClearAll: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose, onClearAll }) => {
  const notifications = [
    { id: 1, title: '⚡ Price Drop Alert', desc: 'Midjourney v6 introduced a $10/mo Basic Tier.', time: '10m ago', unread: true },
    { id: 2, title: '🌟 New Verified AI Tool', desc: 'ElevenLabs Dubbing Studio added to Voice & Audio hub.', time: '2h ago', unread: true },
    { id: 3, title: '🎓 Course Completed', desc: 'You completed Prompt Engineering Masterclass.', time: '1d ago', unread: false }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl p-5 text-slate-100 space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-purple-500/10">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-extrabold">Smart Notifications</h3>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onClearAll} className="text-[11px] text-cyan-400 hover:underline">Mark all read</button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          {notifications.map((n) => (
            <div key={n.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{n.title}</span>
                <span className="text-[10px] text-slate-500">{n.time}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{n.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
