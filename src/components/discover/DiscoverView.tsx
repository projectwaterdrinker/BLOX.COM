import React, { useState } from 'react';
import { 
  Search, 
  Play, 
  ThumbsUp, 
  Users, 
  Filter, 
  Compass, 
  Sparkles,
  TrendingUp,
  Star
} from 'lucide-react';
import { useRoblox } from '../../context/RobloxContext';
import { GameExperience, GenreType } from '../../types/roblox';

interface DiscoverViewProps {
  onSelectGame: (game: GameExperience) => void;
  onPlayGame: (game: GameExperience) => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({ onSelectGame, onPlayGame }) => {
  const { experiences } = useRoblox();

  const [selectedGenre, setSelectedGenre] = useState<GenreType>('All');
  const [filterSort, setFilterSort] = useState<'popular' | 'top_rated' | 'visits'>('popular');
  const [localSearch, setLocalSearch] = useState('');

  const genres: GenreType[] = [
    'All',
    'Action',
    'Adventure',
    'Roleplay',
    'Obstacle Course (Obby)',
    'Survival',
    'Tycoon',
    'Simulator'
  ];

  // Filtering
  const filtered = experiences.filter(game => {
    const matchesGenre = selectedGenre === 'All' || game.genre === selectedGenre;
    const matchesSearch = !localSearch.trim() || 
      game.title.toLowerCase().includes(localSearch.toLowerCase()) ||
      game.description.toLowerCase().includes(localSearch.toLowerCase()) ||
      game.creator.toLowerCase().includes(localSearch.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (filterSort === 'popular') return b.activePlayers - a.activePlayers;
    if (filterSort === 'top_rated') return b.ratingPercent - a.ratingPercent;
    if (filterSort === 'visits') return b.visits - a.visits;
    return 0;
  });

  return (
    <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-[#00A2FF]" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Discover Experiences</h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Browse through millions of user-created virtual worlds, adventures, and roleplays.
          </p>
        </div>

        {/* Local Search inside Discover */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search experiences..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full bg-[#191b1d] border border-[#2d3035] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#00A2FF]"
          />
        </div>
      </div>

      {/* Genre Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {genres.map(genre => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 transition cursor-pointer ${
              selectedGenre === genre
                ? 'bg-[#00A2FF] text-white shadow-md shadow-[#00A2FF]/20'
                : 'bg-[#191b1d] hover:bg-[#232527] border border-[#2d3035] text-zinc-300'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Sort Buttons Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-[#2d3035]">
        <div className="text-xs font-semibold text-zinc-400">
          Showing <span className="text-white font-mono">{sorted.length}</span> experiences
        </div>

        <div className="flex items-center gap-1.5 bg-[#191b1d] p-1 rounded-xl border border-[#2d3035]">
          <button
            onClick={() => setFilterSort('popular')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterSort === 'popular' ? 'bg-[#2b2d31] text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>Popular</span>
          </button>

          <button
            onClick={() => setFilterSort('top_rated')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterSort === 'top_rated' ? 'bg-[#2b2d31] text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-emerald-400" />
            <span>Top Rated</span>
          </button>

          <button
            onClick={() => setFilterSort('visits')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterSort === 'visits' ? 'bg-[#2b2d31] text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>Most Visits</span>
          </button>
        </div>
      </div>

      {/* Grid of Experiences */}
      {sorted.length === 0 ? (
        <div className="py-16 text-center text-zinc-400 bg-[#191b1d] rounded-2xl border border-[#2d3035]">
          <p className="text-sm">No experiences found matching your filters.</p>
          <button
            onClick={() => {
              setSelectedGenre('All');
              setLocalSearch('');
            }}
            className="mt-3 text-xs text-[#00A2FF] font-bold hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sorted.map(game => (
            <div
              key={game.id}
              onClick={() => onSelectGame(game)}
              className="bg-[#191b1d] border border-[#2d3035] hover:border-zinc-500 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col"
            >
              <div className="relative aspect-square w-full bg-zinc-800 overflow-hidden">
                <img 
                  src={game.thumbnail} 
                  alt={game.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Instant Play Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayGame(game);
                    }}
                    className="w-12 h-12 bg-[#00B06F] hover:bg-[#009b62] active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg transition cursor-pointer"
                    title="Play Experience"
                  >
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </button>
                </div>

                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-[10px] text-zinc-300 px-2 py-0.5 rounded">
                  {game.genre}
                </div>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white truncate group-hover:text-[#00A2FF] transition-colors">
                    {game.title}
                  </h3>
                  <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                    By {game.creator}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400 mt-3 pt-2 border-t border-[#25282e]">
                  <div className="flex items-center gap-1 font-semibold text-emerald-400">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{game.ratingPercent}%</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-zinc-400">
                    <Users className="w-3 h-3" />
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
      )}
    </div>
  );
};
