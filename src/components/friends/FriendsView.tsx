import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Play, 
  MessageSquare, 
  Check, 
  X, 
  Clock, 
  MoreVertical 
} from 'lucide-react';
import { useRoblox } from '../../context/RobloxContext';
import { Friend, GameExperience } from '../../types/roblox';

interface FriendsViewProps {
  onPlayGame: (game: GameExperience) => void;
}

export const FriendsView: React.FC<FriendsViewProps> = ({ onPlayGame }) => {
  const { 
    user, 
    addFriendByUsername, 
    removeFriend, 
    setCurrentTab, 
    experiences,
    sendMessage 
  } = useRoblox();

  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'ingame'>('all');
  const [addUsernameInput, setAddUsernameInput] = useState('');
  const [feedback, setFeedback] = useState<{ success: boolean; msg: string } | null>(null);

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addUsernameInput.trim()) return;
    const res = addFriendByUsername(addUsernameInput.trim());
    setFeedback({ success: res.success, msg: res.message });
    if (res.success) setAddUsernameInput('');
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredFriends = user.friends.filter(f => {
    if (activeTab === 'online') return f.status === 'online' || f.status === 'ingame';
    if (activeTab === 'ingame') return f.status === 'ingame';
    return true;
  });

  return (
    <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-[#00A2FF]" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Friends</h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Connect and play together with your friends across Roblox experiences.
          </p>
        </div>

        {/* Add Friend Form */}
        <form onSubmit={handleAddFriend} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add player by username..."
            value={addUsernameInput}
            onChange={(e) => setAddUsernameInput(e.target.value)}
            className="bg-[#191b1d] border border-[#2d3035] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00A2FF] w-52 sm:w-60"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-[#00A2FF] hover:bg-[#008fe0] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {feedback && (
        <div className={`p-3 rounded-xl text-xs font-bold text-center animate-fade-in ${
          feedback.success ? 'bg-emerald-600/90 text-white' : 'bg-red-600/90 text-white'
        }`}>
          {feedback.msg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#2d3035] text-sm font-bold gap-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-2.5 px-4 border-b-2 transition cursor-pointer ${
            activeTab === 'all' ? 'border-[#00A2FF] text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          All ({user.friends.length})
        </button>
        <button
          onClick={() => setActiveTab('online')}
          className={`py-2.5 px-4 border-b-2 transition cursor-pointer ${
            activeTab === 'online' ? 'border-[#00A2FF] text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Online ({user.friends.filter(f => f.status !== 'offline').length})
        </button>
        <button
          onClick={() => setActiveTab('ingame')}
          className={`py-2.5 px-4 border-b-2 transition cursor-pointer ${
            activeTab === 'ingame' ? 'border-[#00A2FF] text-white' : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          In Game ({user.friends.filter(f => f.status === 'ingame').length})
        </button>
      </div>

      {/* Friends Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFriends.map(friend => {
          const matchedGame = experiences.find(e => e.id === friend.currentGameId || e.title.includes(friend.currentGameTitle || ''));

          return (
            <div 
              key={friend.id} 
              className="bg-[#191b1d] border border-[#2d3035] hover:border-zinc-600 rounded-2xl p-4 flex flex-col justify-between transition shadow-md space-y-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img src={friend.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover border border-zinc-700" />
                  <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-[#191b1d] ${
                    friend.status === 'ingame' ? 'bg-[#00A2FF]' :
                    friend.status === 'online' ? 'bg-emerald-500' : 'bg-zinc-500'
                  }`} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm text-white truncate">{friend.displayName}</h3>
                  <div className="text-xs text-zinc-400 truncate">@{friend.username}</div>

                  <div className="text-[11px] font-medium mt-1 truncate">
                    {friend.status === 'ingame' ? (
                      <span className="text-[#00A2FF]">Playing {friend.currentGameTitle}</span>
                    ) : friend.status === 'online' ? (
                      <span className="text-emerald-400">Online</span>
                    ) : (
                      <span className="text-zinc-500">Last seen {friend.lastSeen || 'recently'}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#25282e]">
                {friend.status === 'ingame' && (
                  <button
                    onClick={() => {
                      if (matchedGame) onPlayGame(matchedGame);
                      else onPlayGame(experiences[0]);
                    }}
                    className="flex-1 py-1.5 bg-[#00B06F] hover:bg-[#009b62] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Join Server</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setCurrentTab('messages');
                  }}
                  className="flex-1 py-1.5 bg-[#232527] hover:bg-[#2d3035] border border-zinc-700 text-zinc-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message</span>
                </button>

                <button
                  onClick={() => removeFriend(friend.id)}
                  className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition cursor-pointer"
                  title="Remove friend"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
