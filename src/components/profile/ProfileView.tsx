import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  ShieldCheck, 
  Edit3, 
  Check, 
  Trophy, 
  Hammer, 
  Users, 
  Sparkles,
  ExternalLink,
  Play
} from 'lucide-react';
import { useRoblox } from '../../context/RobloxContext';
import { AvatarViewer } from '../avatar/AvatarViewer';
import { GameExperience } from '../../types/roblox';

interface ProfileViewProps {
  onSelectGame: (game: GameExperience) => void;
  onPlayGame: (game: GameExperience) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onSelectGame, onPlayGame }) => {
  const { 
    user, 
    updateUserBio, 
    setCurrentTab 
  } = useRoblox();

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(user.bio);
  const [profileTab, setProfileTab] = useState<'creations' | 'about' | 'badges'>('about');

  const handleSaveBio = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserBio(bioInput);
    setIsEditingBio(false);
  };

  return (
    <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Profile Header Card */}
      <div className="bg-[#191b1d] border border-[#2d3035] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 shadow-xl relative overflow-hidden">
        
        {/* Background ambient gradient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00A2FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left z-10">
          {/* Avatar Doll Showcase */}
          <div className="w-28 h-32 sm:w-36 sm:h-40 rounded-3xl bg-[#121316] border border-zinc-700/60 p-2 flex items-center justify-center relative shadow-inner shrink-0">
            <AvatarViewer config={user.avatarConfig} size="md" interactive={false} />
            <div className="absolute bottom-2 right-2 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-[#191b1d]" />
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{user.displayName}</h1>
                <ShieldCheck className="w-5 h-5 text-[#00A2FF]" />
              </div>
              <div className="text-sm text-zinc-400">@{user.username}</div>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-zinc-400 pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined {user.joinDate}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-zinc-400" />
                <span>{user.friends.length} Friends</span>
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-mono font-bold">
                R$ {user.robux.toLocaleString()}
              </span>
            </div>

            {/* Status balloon */}
            <div className="text-xs text-zinc-300 italic pt-1">
              "{user.statusMessage}"
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 z-10">
          <button
            onClick={() => setCurrentTab('avatar')}
            className="px-4 py-2 bg-[#00A2FF] hover:bg-[#008fe0] text-white text-xs font-bold rounded-xl transition cursor-pointer shadow"
          >
            Edit Avatar
          </button>
          <button
            onClick={() => setCurrentTab('trade')}
            className="px-4 py-2 bg-[#232527] hover:bg-[#2e3137] border border-zinc-700 text-zinc-200 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Trade Items
          </button>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex border-b border-[#2d3035] text-sm font-bold gap-3">
        <button
          onClick={() => setProfileTab('about')}
          className={`py-3 px-4 border-b-2 transition cursor-pointer ${
            profileTab === 'about' ? 'border-[#00A2FF] text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          About
        </button>
        <button
          onClick={() => setProfileTab('creations')}
          className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            profileTab === 'creations' ? 'border-[#00A2FF] text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span>Creations</span>
          <span className="text-xs bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded-full">
            {user.createdGames.length}
          </span>
        </button>
        <button
          onClick={() => setProfileTab('badges')}
          className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
            profileTab === 'badges' ? 'border-[#00A2FF] text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span>Badges</span>
          <span className="text-xs bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded-full">
            {user.badges.length}
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      {profileTab === 'about' && (
        <div className="space-y-6">
          {/* About Me / Bio */}
          <div className="bg-[#191b1d] border border-[#2d3035] rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">About Me</h3>
              {!isEditingBio && (
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="flex items-center gap-1 text-xs text-[#00A2FF] hover:underline cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Bio</span>
                </button>
              )}
            </div>

            {isEditingBio ? (
              <form onSubmit={handleSaveBio} className="space-y-3">
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  rows={4}
                  className="w-full bg-[#111216] border border-zinc-700 focus:border-[#00A2FF] rounded-xl p-3 text-sm text-white focus:outline-none"
                  placeholder="Tell other players about yourself..."
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingBio(false)}
                    className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-lg hover:bg-zinc-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#00A2FF] text-white text-xs font-bold rounded-lg hover:bg-[#008fe0] cursor-pointer flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                {user.bio}
              </p>
            )}
          </div>

          {/* User's Badges Preview */}
          <div className="bg-[#191b1d] border border-[#2d3035] rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Roblox Badges ({user.badges.length})</h3>
              <button 
                onClick={() => setProfileTab('badges')}
                className="text-xs text-[#00A2FF] hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {user.badges.slice(0, 4).map(badge => (
                <div key={badge.id} className="bg-[#131417] border border-[#2b2d31] p-3 rounded-2xl flex items-center gap-3">
                  <div className="text-2xl shrink-0 p-2 bg-zinc-800 rounded-xl border border-zinc-700">
                    {badge.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{badge.name}</div>
                    <div className="text-[10px] text-zinc-400 line-clamp-1">{badge.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {profileTab === 'creations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Experiences Created By {user.displayName}
            </h3>
            <button
              onClick={() => setCurrentTab('create')}
              className="text-xs text-[#00A2FF] font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <Hammer className="w-3.5 h-3.5" />
              <span>Open Creator Studio</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {user.createdGames.map(game => (
              <div 
                key={game.id}
                onClick={() => onSelectGame(game)}
                className="bg-[#191b1d] border border-[#2d3035] hover:border-zinc-500 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-200"
              >
                <div className="relative aspect-video w-full bg-zinc-800 overflow-hidden">
                  <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayGame(game);
                      }}
                      className="px-4 py-2 bg-[#00B06F] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Play</span>
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <h4 className="font-bold text-sm text-white truncate">{game.title}</h4>
                  <div className="flex items-center justify-between text-xs text-zinc-400 mt-2 font-mono">
                    <span>Visits: {game.visits.toLocaleString()}</span>
                    <span>👍 {game.ratingPercent}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {profileTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {user.badges.map(badge => (
            <div key={badge.id} className="bg-[#191b1d] border border-[#2d3035] p-4 rounded-2xl flex items-center gap-3">
              <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl shrink-0 border border-zinc-700 shadow-inner">
                {badge.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white truncate">{badge.name}</h4>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">
                    Unlocked
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
