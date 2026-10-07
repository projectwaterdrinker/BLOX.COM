import React, { useState } from 'react';
import { 
  Play, 
  ChevronRight, 
  ChevronLeft, 
  ThumbsUp, 
  Users, 
  Edit3, 
  Check, 
  Sparkles,
  Flame,
  UserCheck
} from 'lucide-react';
import { useRoblox } from '../../context/RobloxContext';
import { GameExperience, Friend } from '../../types/roblox';
import { AvatarViewer } from '../avatar/AvatarViewer';
import { sounds } from '../../services/soundEffects';

interface HomeViewProps {
  onSelectGame: (game: GameExperience) => void;
  onPlayGame: (game: GameExperience) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectGame, onPlayGame }) => {
  const { 
    user, 
    updateStatusMessage, 
    experiences, 
    setCurrentTab 
  } = useRoblox();

  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState(user.statusMessage);

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStatus.trim()) {
      updateStatusMessage(newStatus.trim());
    }
    setIsEditingStatus(false);
  };

  // Recent / Continue Playing experiences
  const recentGames = user.recentGameIds
    .map(id => experiences.find(e => e.id === id))
    .filter((g): g is GameExperience => Boolean(g));

  // Friends currently playing games
  const playingFriends = user.friends.filter(f => f.status === 'ingame' && f.currentGameTitle);

  // Popular & Top rated games
  const popularGames = [...experiences].sort((a, b) => b.activePlayers - a.activePlayers);
  const topRatedGames = [...experiences].sort((a, b) => b.ratingPercent - a.ratingPercent);
  const featuredGames = experiences.filter(e => e.isFeatured);
  const obbyGames = experiences.filter(e => e.genre === 'Obstacle Course (Obby)');
  const roleplayGames = experiences.filter(e => e.genre === 'Roleplay');

  return (
    <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* 1. User Greeting & Status Banner */}
      <div className="bg-[#191b1d] border border-[#2d3035] rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Avatar doll preview in greeting */}
          <div 
            onClick={() => setCurrentTab('avatar')}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-[#25282e] to-[#1c1e22] border border-[#393b3d] flex items-center justify-center overflow-hidden cursor-pointer group shrink-0 relative shadow-inner"
            title="Customize Avatar in Avatar Editor"
          >
            <AvatarViewer config={user.avatarConfig} size="md" interactive={false} />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold">
              Edit
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Welcome back, {user.displayName}!
              </h1>
            </div>
            <div className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              @{user.username} • <span className="text-emerald-400 font-mono font-bold">R$ {user.robux.toLocaleString()}</span>
            </div>

            {/* Status balloon message */}
            <div className="mt-2.5">
              {isEditingStatus ? (
                <form onSubmit={handleSaveStatus} className="flex items-center gap-2 max-w-md">
                  <input
                    type="text"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    placeholder="What are you up to?"
                    maxLength={100}
                    autoFocus
                    className="bg-[#111216] border border-[#00A2FF] text-white text-xs px-3 py-1.5 rounded-lg focus:outline-none w-full"
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-[#00A2FF] text-white rounded-lg hover:bg-[#008fe0] cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div 
                  onClick={() => setIsEditingStatus(true)}
                  className="inline-flex items-center gap-2 text-xs text-zinc-300 hover:text-white bg-[#222428] hover:bg-[#2b2e34] px-3 py-1.5 rounded-full border border-zinc-700/60 cursor-pointer transition"
                  title="Click to change your status"
                >
                  <span className="text-amber-400">💭</span>
                  <span className="italic truncate max-w-xs sm:max-w-md">"{user.statusMessage}"</span>
                  <Edit3 className="w-3 h-3 text-zinc-500 ml-1" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick links pill buttons */}
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <button
            onClick={() => setCurrentTab('avatar')}
            className="flex-1 md:flex-initial px-4 py-2 bg-[#232527] hover:bg-[#2e3137] border border-[#393b3d] text-zinc-200 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Avatar Editor
          </button>
          <button
            onClick={() => setCurrentTab('friends')}
            className="flex-1 md:flex-initial px-4 py-2 bg-[#232527] hover:bg-[#2e3137] border border-[#393b3d] text-zinc-200 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Friends ({user.friends.length})
          </button>
        </div>
      </div>

      {/* 2. Continue Playing Row */}
      {recentGames.length > 0 && (
        <GameRow
          title="Continue Playing"
          subtitle="Pick up right where you left off"
          games={recentGames}
          onSelect={onSelectGame}
          onPlay={onPlayGame}
          highlightPlay
        />
      )}

      {/* 3. Friends Activity / Friend Presence */}
      {playingFriends.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">Friends Playing Now</h2>
            </div>
            <button 
              onClick={() => setCurrentTab('friends')}
              className="text-xs text-[#00A2FF] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>See All Friends</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {playingFriends.map(friend => {
              const matchedGame = experiences.find(e => e.id === friend.currentGameId || e.title.includes(friend.currentGameTitle || ''));
              return (
                <div 
                  key={friend.id} 
                  className="bg-[#191b1d] border border-[#2d3035] hover:border-zinc-600 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                      <img src={friend.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-zinc-700" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-[#191b1d]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{friend.displayName}</div>
                      <div className="text-[11px] text-[#00A2FF] font-medium truncate">{friend.currentGameTitle}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (matchedGame) onPlayGame(matchedGame);
                      else onPlayGame(experiences[0]);
                    }}
                    className="px-3 py-1.5 bg-[#00B06F] hover:bg-[#009b62] text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer shadow"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Join</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Featured Platform Event Banner */}
      {featuredGames.length > 0 && (
        <div className="relative rounded-3xl overflow-hidden border border-indigo-500/40 shadow-2xl bg-gradient-to-r from-purple-950/80 via-indigo-950/90 to-blue-950/80 p-6 sm:p-8">
          <div className="max-w-xl space-y-3 z-10 relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Special Platform Event</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {featuredGames[0].title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed">
              {featuredGames[0].description}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onPlayGame(featuredGames[0])}
                className="px-6 py-3 bg-[#00B06F] hover:bg-[#009b62] text-white rounded-xl font-bold text-sm flex items-center gap-2 transition cursor-pointer shadow-lg shadow-[#00B06F]/25"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Event Now</span>
              </button>
              <button
                onClick={() => onSelectGame(featuredGames[0])}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition cursor-pointer border border-white/20"
              >
                More Details
              </button>
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 pointer-events-none hidden md:block">
            <img 
              src={featuredGames[0].banner} 
              alt="" 
              className="w-full h-full object-cover object-right mask-gradient"
            />
          </div>
        </div>
      )}

      {/* 5. Popular & Top Rated Row */}
      <GameRow
        title="Popular & Trending"
        subtitle="The most active experiences across Roblox right now"
        games={popularGames}
        onSelect={onSelectGame}
        onPlay={onPlayGame}
      />

      {/* 6. Top Rated Row */}
      <GameRow
        title="Top Rated by Players"
        subtitle="Experiences with the highest community ratings"
        games={topRatedGames}
        onSelect={onSelectGame}
        onPlay={onPlayGame}
      />

      {/* 7. Obstacle Course (Obby) Row */}
      {obbyGames.length > 0 && (
        <GameRow
          title="Obstacle Courses & Parkour (Obby)"
          subtitle="Test your timing, agility, and jumps"
          games={obbyGames}
          onSelect={onSelectGame}
          onPlay={onPlayGame}
        />
      )}

      {/* 8. Roleplay Row */}
      {roleplayGames.length > 0 && (
        <GameRow
          title="Roleplay & Hangout"
          subtitle="Hang out, explore towns, and create your stories"
          games={roleplayGames}
          onSelect={onSelectGame}
          onPlay={onPlayGame}
        />
      )}
    </div>
  );
};

// Reusable Horizontal Scrolling Row for Game Experiences
interface GameRowProps {
  title: string;
  subtitle?: string;
  games: GameExperience[];
  onSelect: (game: GameExperience) => void;
  onPlay: (game: GameExperience) => void;
  highlightPlay?: boolean;
}

const GameRow: React.FC<GameRowProps> = ({ 
  title, 
  subtitle, 
  games, 
  onSelect, 
  onPlay, 
  highlightPlay = false 
}) => {
  const rowRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    sounds.playClick();
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    sounds.playClick();
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-3 relative group/row">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs text-zinc-400">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={scrollLeft}
            className="p-1.5 rounded-lg bg-[#232527] hover:bg-[#2e3137] text-zinc-300 hover:text-white cursor-pointer transition"
            title="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={scrollRight}
            className="p-1.5 rounded-lg bg-[#232527] hover:bg-[#2e3137] text-zinc-300 hover:text-white cursor-pointer transition"
            title="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div 
        ref={rowRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-none scroll-smooth"
      >
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => onSelect(game)}
            className="w-48 sm:w-56 shrink-0 bg-[#191b1d] border border-[#2d3035] hover:border-zinc-500 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Card Thumbnail */}
            <div className="relative aspect-square w-full bg-zinc-800 overflow-hidden">
              <img 
                src={game.thumbnail} 
                alt={game.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Play Overlay Button on Hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlay(game);
                  }}
                  className="w-12 h-12 bg-[#00B06F] hover:bg-[#009b62] active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg transition cursor-pointer"
                  title="Play"
                >
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </button>
              </div>

              {highlightPlay && (
                <div className="absolute top-2 left-2 bg-[#00B06F] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                  Resume
                </div>
              )}
            </div>

            {/* Title & Stats */}
            <div className="p-3">
              <h3 className="font-bold text-sm text-white truncate leading-tight group-hover:text-[#00A2FF] transition-colors">
                {game.title}
              </h3>

              <div className="flex items-center justify-between text-xs text-zinc-400 mt-2 font-medium">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3 text-emerald-400" />
                  <span>{game.ratingPercent}%</span>
                </div>
                <div className="flex items-center gap-1 font-mono">
                  <Users className="w-3 h-3 text-zinc-500" />
                  <span>
                    {game.activePlayers >= 1000 
                      ? `${(game.activePlayers / 1000).toFixed(0)}K` 
                      : game.activePlayers}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
