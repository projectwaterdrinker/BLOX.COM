import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  ShieldCheck, 
  Lock, 
  Moon, 
  Sun, 
  Check, 
  User, 
  KeyRound,
  Shield
} from 'lucide-react';
import { useRoblox } from '../../context/RobloxContext';

export const AccountSettingsModal: React.FC = () => {
  const { 
    isSettingsModalOpen, 
    setIsSettingsModalOpen, 
    user, 
    updateProfileDetails, 
    theme, 
    toggleTheme 
  } = useRoblox();

  const [displayName, setDisplayName] = useState(user.displayName);
  const [username, setUsername] = useState(user.username);
  const [safeChat, setSafeChat] = useState(user.safeChatEnabled);
  const [accountPin, setAccountPin] = useState(user.accountPinEnabled);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isSettingsModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileDetails(displayName, username, safeChat);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsSettingsModalOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#191b1d] border border-[#2d3035] rounded-3xl p-6 sm:p-8 text-white shadow-2xl my-auto space-y-6">
        
        {/* Close Button */}
        <button
          onClick={() => setIsSettingsModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-[#2d3035]">
          <div className="p-2 bg-zinc-800 rounded-xl text-zinc-300">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black">Account Settings</h2>
            <p className="text-xs text-zinc-400">Manage identity, privacy safeguards, and theme settings</p>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-600/90 text-white rounded-xl text-xs font-bold text-center animate-fade-in flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Section 1: Account Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Account Info</h3>
            
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={20}
                required
                className="w-full bg-[#121316] border border-zinc-700 focus:border-[#00A2FF] rounded-xl px-3.5 py-2 text-xs text-white"
              />
              <span className="text-[10px] text-zinc-500 mt-0.5 block">Can be changed once every 7 days.</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Username (@)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={20}
                required
                className="w-full bg-[#121316] border border-zinc-700 focus:border-[#00A2FF] rounded-xl px-3.5 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          {/* Section 2: Security & Privacy */}
          <div className="space-y-3 pt-3 border-t border-[#2d3035]">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Privacy & Safety</h3>

            {/* Safe Chat Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-[#141518] rounded-2xl border border-zinc-800">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00A2FF]" />
                  <span className="text-xs font-bold text-white">Safe Chat Text Filter</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Automatically censors inappropriate words and sensitive personal details with ###.
                </p>
              </div>

              <input
                type="checkbox"
                checked={safeChat}
                onChange={(e) => setSafeChat(e.target.checked)}
                className="w-5 h-5 accent-[#00A2FF] cursor-pointer"
              />
            </div>

            {/* Account PIN */}
            <div className="flex items-center justify-between p-3.5 bg-[#141518] rounded-2xl border border-zinc-800">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">Account PIN Protection</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Require a 4-digit security PIN before trading or spending Robux.
                </p>
              </div>

              <input
                type="checkbox"
                checked={accountPin}
                onChange={(e) => setAccountPin(e.target.checked)}
                className="w-5 h-5 accent-[#00A2FF] cursor-pointer"
              />
            </div>
          </div>

          {/* Section 3: Theme */}
          <div className="space-y-3 pt-3 border-t border-[#2d3035]">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Appearance</h3>

            <div className="flex items-center justify-between p-3.5 bg-[#141518] rounded-2xl border border-zinc-800">
              <div className="flex items-center gap-2.5">
                {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                <span className="text-xs font-semibold text-white">Current Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-lg text-zinc-200 transition cursor-pointer"
              >
                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#2d3035] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(false)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#00A2FF] hover:bg-[#008fe0] text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-lg shadow-[#00A2FF]/25"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
