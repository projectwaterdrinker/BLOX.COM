import React, { useState } from 'react';
import { 
  Users, 
  ShieldAlert, 
  Send, 
  Megaphone, 
  Check, 
  Plus, 
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { useRoblox } from '../../context/RobloxContext';

export const GroupsView: React.FC = () => {
  const { groups, joinGroup, leaveGroup, postGroupWall, user } = useRoblox();
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || '');
  const [wallInput, setWallInput] = useState('');

  const activeGroup = groups.find(g => g.id === selectedGroupId) || groups[0];

  const handlePostWall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallInput.trim() || !activeGroup) return;
    postGroupWall(activeGroup.id, wallInput.trim());
    setWallInput('');
  };

  return (
    <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-[#00A2FF]" />
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Roblox Groups</h1>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Join creator communities, clans, building studios, and meet fellow developers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Groups List Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-[#191b1d] border border-[#2d3035] rounded-3xl p-4 space-y-3 shadow-xl">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-2">
            Communities
          </div>

          <div className="space-y-2">
            {groups.map(group => {
              const isSelected = group.id === activeGroup?.id;
              return (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroupId(group.id)}
                  className={`w-full p-3 rounded-2xl flex items-center gap-3 text-left transition cursor-pointer border ${
                    isSelected 
                      ? 'bg-[#24272e] border-[#00A2FF]' 
                      : 'bg-[#151619] border-transparent hover:border-zinc-700'
                  }`}
                >
                  <img src={group.emblem} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0 border border-zinc-700" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-white truncate">{group.name}</h3>
                    <div className="text-[11px] text-zinc-400">
                      {group.membersCount.toLocaleString()} members
                    </div>
                    {group.isJoined && (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-0.5">
                        <Check className="w-3 h-3" /> Joined
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Group Details & Wall (8 cols) */}
        {activeGroup && (
          <div className="lg:col-span-8 bg-[#191b1d] border border-[#2d3035] rounded-3xl p-6 space-y-6 shadow-xl">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2d3035]">
              <div className="flex items-center gap-4">
                <img src={activeGroup.emblem} alt="" className="w-16 h-16 rounded-2xl object-cover border border-zinc-700 shadow-md" />
                <div>
                  <h2 className="text-xl font-black text-white">{activeGroup.name}</h2>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    Owned by <strong className="text-white">{activeGroup.owner}</strong> • {activeGroup.membersCount.toLocaleString()} Members
                  </div>
                </div>
              </div>

              {activeGroup.isJoined ? (
                <button
                  onClick={() => leaveGroup(activeGroup.id)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition cursor-pointer self-start sm:self-auto"
                >
                  Leave Group
                </button>
              ) : (
                <button
                  onClick={() => joinGroup(activeGroup.id)}
                  className="px-5 py-2 bg-[#00A2FF] hover:bg-[#008fe0] text-white text-xs font-bold rounded-xl transition cursor-pointer self-start sm:self-auto shadow"
                >
                  Join Group
                </button>
              )}
            </div>

            {/* Group Shout */}
            {activeGroup.shout && (
              <div className="bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-500/20 p-4 rounded-2xl flex items-start gap-3">
                <Megaphone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                    Group Shout by {activeGroup.shout.author}
                  </div>
                  <p className="text-xs text-zinc-200 mt-1">{activeGroup.shout.text}</p>
                  <span className="text-[10px] text-zinc-500 block mt-1">{activeGroup.shout.date}</span>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-xs text-zinc-300 leading-relaxed bg-[#151619] p-3.5 rounded-xl border border-zinc-800">
                {activeGroup.description}
              </p>
            </div>

            {/* Group Wall */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Group Wall</h3>

              {/* Wall post input form */}
              {activeGroup.isJoined ? (
                <form onSubmit={handlePostWall} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Say something on the group wall..."
                    value={wallInput}
                    onChange={(e) => setWallInput(e.target.value)}
                    className="flex-1 bg-[#121316] border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00A2FF]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#00A2FF] hover:bg-[#008fe0] text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Post
                  </button>
                </form>
              ) : (
                <div className="p-3 bg-[#151619] rounded-xl text-xs text-zinc-400 text-center border border-zinc-800">
                  Join this group to post messages on the wall.
                </div>
              )}

              {/* Wall messages list */}
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {activeGroup.wall.map(post => (
                  <div key={post.id} className="bg-[#151619] border border-zinc-800 p-3 rounded-xl flex items-start gap-3">
                    <img src={post.authorAvatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 border border-zinc-700" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{post.author}</span>
                          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded font-mono">
                            {post.rank}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-500">{post.timestamp}</span>
                      </div>
                      <p className="text-xs text-zinc-300 mt-1">{post.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
