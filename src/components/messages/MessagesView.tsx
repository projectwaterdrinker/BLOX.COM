import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  User, 
  ShieldCheck, 
  Lock, 
  Search 
} from 'lucide-react';
import { useRoblox } from '../../context/RobloxContext';

export const MessagesView: React.FC = () => {
  const { user, messages, sendMessage, friends } = useRoblox();

  const [selectedFriendId, setSelectedFriendId] = useState<string>(friends[0]?.id || '');
  const [inputText, setInputText] = useState('');

  const activeFriend = friends.find(f => f.id === selectedFriendId) || friends[0];

  // Conversation between current user and selected friend
  const conversation = messages.filter(
    m => (m.senderId === user.id && m.recipientId === activeFriend?.id) ||
         (m.senderId === activeFriend?.id && m.recipientId === user.id)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeFriend) return;
    sendMessage(activeFriend.id, activeFriend.displayName, inputText.trim());
    setInputText('');
  };

  return (
    <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-[#00A2FF]" />
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Messages</h1>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Direct messaging with your friends. Safe chat filtering is active.
        </p>
      </div>

      {/* Main Split Layout: Friends list + Message Thread */}
      <div className="flex-1 bg-[#191b1d] border border-[#2d3035] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-xl">
        
        {/* Left Thread List (35%) */}
        <div className="w-full md:w-80 border-r border-[#2d3035] flex flex-col bg-[#16171a]">
          <div className="p-3 border-b border-[#2d3035] text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Conversations
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#222428]">
            {friends.map(friend => {
              const isSelected = friend.id === activeFriend?.id;
              const lastMsg = messages
                .filter(m => (m.senderId === friend.id && m.recipientId === user.id) || (m.senderId === user.id && m.recipientId === friend.id))
                .slice(-1)[0];

              return (
                <button
                  key={friend.id}
                  onClick={() => setSelectedFriendId(friend.id)}
                  className={`w-full p-3.5 flex items-center gap-3 text-left transition cursor-pointer ${
                    isSelected ? 'bg-[#24272e] border-l-4 border-[#00A2FF]' : 'hover:bg-[#1e2024]'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img src={friend.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-zinc-700" />
                    <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#16171a] ${
                      friend.status === 'online' ? 'bg-emerald-500' :
                      friend.status === 'ingame' ? 'bg-[#00A2FF]' : 'bg-zinc-500'
                    }`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">{friend.displayName}</span>
                      <span className="text-[10px] text-zinc-500">{lastMsg?.timestamp || 'Active'}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {lastMsg?.content || friend.bio || 'Say hello!'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Active Chat Window (65%) */}
        <div className="flex-1 flex flex-col bg-[#191b1d]">
          {activeFriend ? (
            <>
              {/* Chat Friend Header */}
              <div className="px-5 py-3.5 border-b border-[#2d3035] flex items-center justify-between bg-[#1d1f23]">
                <div className="flex items-center gap-3">
                  <img src={activeFriend.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover border border-zinc-700" />
                  <div>
                    <h3 className="text-sm font-bold text-white">{activeFriend.displayName}</h3>
                    <div className="text-[11px] text-zinc-400">@{activeFriend.username}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Safe Chat Protected</span>
                </div>
              </div>

              {/* Chat Message Scroll */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3">
                {conversation.length === 0 ? (
                  <div className="py-12 text-center text-zinc-400 text-xs">
                    Start a friendly conversation with {activeFriend.displayName}!
                  </div>
                ) : (
                  conversation.map(msg => {
                    const isMe = msg.senderId === user.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                          isMe 
                            ? 'bg-[#00A2FF] text-white rounded-br-none shadow-md shadow-[#00A2FF]/20' 
                            : 'bg-[#25282e] text-zinc-200 border border-zinc-700/60 rounded-bl-none'
                        }`}>
                          <p>{msg.content}</p>
                          <span className={`text-[9px] block text-right mt-1 font-mono ${
                            isMe ? 'text-white/80' : 'text-zinc-500'
                          }`}>
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSend} className="p-3 border-t border-[#2d3035] flex items-center gap-2 bg-[#1d1f23]">
                <input
                  type="text"
                  placeholder="Type a message... (Safe chat filter enabled)"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-[#121316] border border-zinc-700 focus:border-[#00A2FF] text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#00A2FF] hover:bg-[#008fe0] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
              Select a friend to begin chat
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
