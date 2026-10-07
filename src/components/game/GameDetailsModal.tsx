import React, { useState } from 'react';
import { 
  Play, 
  ThumbsUp, 
  ThumbsDown, 
  Star, 
  Share2, 
  Users, 
  Eye, 
  Clock, 
  ShieldCheck, 
  X, 
  Coins, 
  Check, 
  Radio
} from 'lucide-react';
import { GameExperience } from '../../types/roblox';
import { useRoblox } from '../../context/RobloxContext';
import { sounds } from '../../services/soundEffects';

interface GameDetailsModalProps {
  game: GameExperience;
  onClose: () => void;
  onPlay: (game: GameExperience) => void;
}

export const GameDetailsModal: React.FC<GameDetailsModalProps> = ({ game, onClose, onPlay }) => {
  const { 
    user, 
    toggleLikeGame, 
    toggleDislikeGame, 
    toggleFavoriteGame, 
    buyGamePass 
  } = useRoblox();

  const [activeTab, setActiveTab] = useState<'about' | 'store' | 'servers'>('about');
  const [purchaseStatus, setPurchaseStatus] = useState<string | null>(null);

  const isLiked = user.likedGameIds.includes(game.id);
  const isDisliked = user.dislikedGameIds.includes(game.id);
  const isFavorite = user.favoriteGameIds.includes(game.id);

  const totalVotes = game.likes + game.dislikes;
  const likeRatio = totalVotes > 0 ? Math.round((game.likes / totalVotes) * 100) : game.ratingPercent;

  const handleBuyPass = (passId: string) => {
    const res = buyGamePass(game.id, passId);
    setPurchaseStatus(res.message);
    setTimeout(() => setPurchaseStatus(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#191b1d] border border-[#2d3035] rounded-2xl shadow-2xl overflow-hidden my-auto text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-zinc-300 hover:text-white flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Banner Image */}
        <div className="relative h-48 sm:h-64 w-full bg-zinc-900 overflow-hidden">
          <img 
            src={game.banner || game.thumbnail} 
            alt={game.title} 
            className="w-full h-full object-cover filter brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#191b1d] via-[#191b1d]/40 to-transparent" />

          {/* Quick Stats Overlay */}
          <div className="absolute bottom-4 left-4 sm:left-6 flex items-center gap-3">
            <img 
              src={game.thumbnail} 
              alt={game.title} 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-white/20 object-cover shadow-xl"
            />
            <div className="text-white">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">{game.title}</h1>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300 mt-1">
                <span>By <strong className="text-white font-semibold">{game.creator}</strong></span>
                {game.creatorVerified && <ShieldCheck className="w-4 h-4 text-[#00A2FF]" />}
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar (Play, Likes, Favorites) */}
        <div className="px-4 sm:px-6 py-4 border-b border-[#2d3035] flex flex-wrap items-center justify-between gap-3 bg-[#1e2024]">
          {/* Main Green Play Button */}
          <button
            onClick={() => onPlay(game)}
            className="flex-1 sm:flex-initial sm:min-w-56 h-12 bg-[#00B06F] hover:bg-[#009b62] active:scale-[0.98] text-white rounded-xl font-black text-base flex items-center justify-center gap-2.5 shadow-lg shadow-[#00B06F]/25 transition cursor-pointer"
          >
            <Play className="w-6 h-6 fill-white" />
            <span>PLAY</span>
          </button>

          {/* Engagement Buttons */}
          <div className="flex items-center gap-2">
            {/* Like */}
            <button
              onClick={() => toggleLikeGame(game.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer ${
                isLiked 
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                  : 'bg-[#232527] border-[#393b3d] text-zinc-300 hover:text-white'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{likeRatio}%</span>
            </button>

            {/* Dislike */}
            <button
              onClick={() => toggleDislikeGame(game.id)}
              className={`p-2 rounded-xl text-xs sm:text-sm border transition cursor-pointer ${
                isDisliked 
                  ? 'bg-red-500/20 border-red-500 text-red-400' 
                  : 'bg-[#232527] border-[#393b3d] text-zinc-400 hover:text-white'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
            </button>

            {/* Favorite */}
            <button
              onClick={() => toggleFavoriteGame(game.id)}
              className={`p-2 rounded-xl text-xs sm:text-sm border transition cursor-pointer ${
                isFavorite 
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400' 
                  : 'bg-[#232527] border-[#393b3d] text-zinc-400 hover:text-white'
              }`}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>

            {/* Share */}
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                sounds.playClick();
              }}
              className="p-2 bg-[#232527] border border-[#393b3d] hover:bg-[#2e3137] text-zinc-400 hover:text-white rounded-xl transition cursor-pointer"
              title="Copy experience link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feedback alert toast */}
        {purchaseStatus && (
          <div className="bg-emerald-600/90 text-white text-xs px-4 py-2 font-semibold text-center animate-fade-in">
            {purchaseStatus}
          </div>
        )}

        {/* Tab Header Navigation */}
        <div className="flex border-b border-[#2d3035] px-4 sm:px-6 text-sm font-bold text-zinc-400 bg-[#191b1d]">
          <button
            onClick={() => setActiveTab('about')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer ${
              activeTab === 'about' ? 'border-[#00A2FF] text-white' : 'border-transparent hover:text-zinc-200'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'store' ? 'border-[#00A2FF] text-white' : 'border-transparent hover:text-zinc-200'
            }`}
          >
            <span>Store</span>
            {game.gamepasses.length > 0 && (
              <span className="text-[10px] bg-zinc-700 text-zinc-300 px-1.5 py-0.2 rounded-full">
                {game.gamepasses.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('servers')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'servers' ? 'border-[#00A2FF] text-white' : 'border-transparent hover:text-zinc-200'
            }`}
          >
            <span>Servers</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded-full font-mono">
              {game.servers.length}
            </span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 max-h-96 overflow-y-auto">
          {activeTab === 'about' && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-sm text-zinc-200 whitespace-pre-line leading-relaxed">
                  {game.description}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#222428] border border-[#2d3035] p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>Active Players</span>
                  </div>
                  <div className="text-base font-mono font-bold text-white">
                    {game.activePlayers.toLocaleString()}
                  </div>
                </div>

                <div className="bg-[#222428] border border-[#2d3035] p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Total Visits</span>
                  </div>
                  <div className="text-base font-mono font-bold text-white">
                    {game.visits.toLocaleString()}
                  </div>
                </div>

                <div className="bg-[#222428] border border-[#2d3035] p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Genre</span>
                  </div>
                  <div className="text-base font-bold text-white">
                    {game.genre}
                  </div>
                </div>

                <div className="bg-[#222428] border border-[#2d3035] p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                    <Radio className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Server Size</span>
                  </div>
                  <div className="text-base font-bold text-white">
                    Up to {game.servers[0]?.maxPlayers || 20}
                  </div>
                </div>
              </div>

              {/* Badges showcase */}
              {game.badges.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                    Badges You Can Earn
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {game.badges.map(badge => {
                      const isEarned = user.badges.some(b => b.name === badge.name);
                      return (
                        <div key={badge.id} className="bg-[#222428] border border-[#2d3035] p-3 rounded-xl flex items-center gap-3">
                          <div className="w-11 h-11 bg-zinc-800 rounded-xl flex items-center justify-center text-xl shrink-0 border border-zinc-700">
                            {badge.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-white truncate">{badge.name}</h4>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                                isEarned ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                              }`}>
                                {isEarned ? 'Earned' : badge.rarity}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">{badge.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'store' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Gamepasses & Gear
                </h3>
                <span className="text-xs text-zinc-400">
                  Your Balance: <strong className="text-emerald-400 font-mono">R$ {user.robux.toLocaleString()}</strong>
                </span>
              </div>

              {game.gamepasses.length === 0 ? (
                <div className="py-8 text-center text-zinc-400 text-sm">
                  This experience has no store passes for sale currently.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {game.gamepasses.map(pass => (
                    <div key={pass.id} className="bg-[#222428] border border-[#2d3035] p-3.5 rounded-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl shrink-0 border border-zinc-700">
                          {pass.icon}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white truncate">{pass.name}</h4>
                          <p className="text-xs text-zinc-400 line-clamp-1">{pass.description}</p>
                        </div>
                      </div>

                      {pass.owned ? (
                        <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg shrink-0">
                          <Check className="w-3.5 h-3.5" />
                          <span>Owned</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleBuyPass(pass.id)}
                          className="px-3.5 py-1.5 bg-[#00A2FF] hover:bg-[#008fe0] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow"
                        >
                          <span>R$ {pass.price}</span>
                          <span>Buy</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'servers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Available Servers
                  </h3>
                  <p className="text-xs text-zinc-400">Join low-latency servers with your friends</p>
                </div>
                <button
                  onClick={() => {
                    sounds.playClick();
                    alert('Private Server created! 100 Robux deducted.');
                  }}
                  className="px-3 py-1.5 bg-[#232527] hover:bg-[#2d3034] border border-zinc-700 text-xs font-bold text-zinc-200 rounded-lg transition cursor-pointer"
                >
                  Create VIP Server (100 R$)
                </button>
              </div>

              <div className="space-y-2">
                {game.servers.map(server => (
                  <div key={server.id} className="bg-[#222428] border border-[#2d3035] p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white flex items-center gap-2">
                        <span>{server.region}</span>
                        <span className="text-[11px] text-emerald-400 font-mono">Ping: {server.ping}ms</span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5">
                        {server.playersCount} of {server.maxPlayers} players
                        {server.friendsInServer && server.friendsInServer.length > 0 && (
                          <span className="text-[#00A2FF] font-semibold ml-2">
                            • Friend {server.friendsInServer[0]} is here!
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onPlay(game)}
                      className="px-4 py-1.5 bg-[#00B06F] hover:bg-[#009b62] text-white rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
