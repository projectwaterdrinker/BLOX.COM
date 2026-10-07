import React, { useState } from 'react';
import { 
  Hammer, 
  Plus, 
  Play, 
  BarChart3, 
  Settings, 
  Sparkles, 
  X, 
  Check, 
  Globe 
} from 'lucide-react';
import { useRoblox } from '../../context/RobloxContext';
import { GameExperience, GenreType } from '../../types/roblox';

interface CreateStudioViewProps {
  onSelectGame: (game: GameExperience) => void;
  onPlayGame: (game: GameExperience) => void;
}

export const CreateStudioView: React.FC<CreateStudioViewProps> = ({ onSelectGame, onPlayGame }) => {
  const { user, addCreatedGame, setCurrentTab } = useRoblox();

  const [isCreatingModal, setIsCreatingModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newGenre, setNewGenre] = useState<GenreType>('Obstacle Course (Obby)');
  const [newDescription, setNewDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<'baseplate' | 'obby' | 'city' | 'survival'>('obby');

  const templates = [
    {
      id: 'obby' as const,
      name: 'Rainbow Obby Course',
      desc: 'Floating platforms, checkpoints, hazards, and finish podium.',
      icon: '🌈',
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'baseplate' as const,
      name: 'Classic 2026 Baseplate',
      desc: 'Clean 512x512 stud grey baseplate ready for custom scripting.',
      icon: '🧱',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'city' as const,
      name: 'Modern Town & Roleplay',
      desc: 'City street grid with furnished houses, cars, and hangout spots.',
      icon: '🏙️',
      thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'survival' as const,
      name: 'Natural Disaster Island',
      desc: 'Elevated terrain map with weather disaster system.',
      icon: '🌪️',
      thumbnail: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const handleCreatePlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const chosen = templates.find(t => t.id === selectedTemplate) || templates[0];

    addCreatedGame({
      title: newTitle.trim(),
      description: newDescription.trim() || `Welcome to ${newTitle.trim()}! Built with Roblox Studio.`,
      genre: newGenre,
      thumbnail: chosen.thumbnail,
      banner: chosen.thumbnail,
      activePlayers: 1,
      modeType: selectedTemplate === 'survival' ? 'survival' : selectedTemplate === 'city' ? 'city' : 'obby'
    });

    setIsCreatingModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Hammer className="w-6 h-6 text-[#00A2FF]" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Creator Dashboard</h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Build, publish, and monetize experiences with Roblox Studio.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingModal(true)}
          className="px-4 py-2 bg-[#00A2FF] hover:bg-[#008fe0] text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Experience</span>
        </button>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#191b1d] border border-[#2d3035] p-5 rounded-2xl">
          <div className="text-xs text-zinc-400 font-bold uppercase">Total Creator Visits</div>
          <div className="text-2xl font-black font-mono text-white mt-2">12,442</div>
          <div className="text-[11px] text-emerald-400 mt-1">↑ 18% this week</div>
        </div>

        <div className="bg-[#191b1d] border border-[#2d3035] p-5 rounded-2xl">
          <div className="text-xs text-zinc-400 font-bold uppercase">Active Player Sessions</div>
          <div className="text-2xl font-black font-mono text-white mt-2">43</div>
          <div className="text-[11px] text-zinc-400 mt-1">Across 2 servers</div>
        </div>

        <div className="bg-[#191b1d] border border-[#2d3035] p-5 rounded-2xl">
          <div className="text-xs text-zinc-400 font-bold uppercase">Developer Payouts (R$)</div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-2">R$ 1,850</div>
          <div className="text-[11px] text-zinc-400 mt-1">Available for DevEx</div>
        </div>
      </div>

      {/* Your Published Experiences */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
          Your Experiences ({user.createdGames.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.createdGames.map(game => (
            <div 
              key={game.id}
              className="bg-[#191b1d] border border-[#2d3035] hover:border-zinc-500 rounded-2xl overflow-hidden p-4 flex flex-col justify-between transition-all shadow-md space-y-3"
            >
              <div className="relative aspect-video w-full rounded-xl bg-zinc-800 overflow-hidden">
                <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  <span>Public</span>
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-white truncate">{game.title}</h3>
                <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{game.description}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-[#25282e] font-mono">
                <span>{game.activePlayers} Playing</span>
                <span>{game.visits.toLocaleString()} Visits</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onPlayGame(game)}
                  className="flex-1 py-1.5 bg-[#00B06F] hover:bg-[#009b62] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Test Place</span>
                </button>
                <button
                  onClick={() => onSelectGame(game)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create New Place Modal */}
      {isCreatingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#191b1d] border border-[#2d3035] rounded-3xl p-6 text-white shadow-2xl space-y-6 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#2d3035]">
              <div className="flex items-center gap-2">
                <Hammer className="w-5 h-5 text-[#00A2FF]" />
                <h2 className="text-lg font-black">Publish New Experience</h2>
              </div>
              <button 
                onClick={() => setIsCreatingModal(false)}
                className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlace} className="space-y-4">
              {/* Template picker */}
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                  Choose Starter Template
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {templates.map(tpl => (
                    <div
                      key={tpl.id}
                      onClick={() => setSelectedTemplate(tpl.id)}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${
                        selectedTemplate === tpl.id
                          ? 'border-[#00A2FF] bg-[#00A2FF]/10 ring-2 ring-[#00A2FF]/20'
                          : 'border-[#2d3035] bg-[#141518] hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-2xl">{tpl.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{tpl.name}</div>
                        <div className="text-[10px] text-zinc-400 line-clamp-1">{tpl.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Experience Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mega Speed Run 2026"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#121316] border border-zinc-700 focus:border-[#00A2FF] rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              {/* Genre */}
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Genre
                </label>
                <select
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value as any)}
                  className="w-full bg-[#121316] border border-zinc-700 text-xs text-white rounded-xl px-3 py-2 cursor-pointer"
                >
                  <option value="Obstacle Course (Obby)">Obstacle Course (Obby)</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Roleplay">Roleplay</option>
                  <option value="Action">Action</option>
                  <option value="Survival">Survival</option>
                  <option value="Tycoon">Tycoon</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe gameplay mechanics, objectives, and updates..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-[#121316] border border-zinc-700 focus:border-[#00A2FF] rounded-xl p-3 text-xs text-white"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreatingModal(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-xl hover:bg-zinc-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#00A2FF] hover:bg-[#008fe0] text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-lg shadow-[#00A2FF]/25"
                >
                  Publish Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
