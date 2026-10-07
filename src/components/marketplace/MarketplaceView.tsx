import React, { useState } from 'react';
import { 
  Store, 
  Search, 
  Filter, 
  Tag, 
  Check, 
  Sparkles, 
  X, 
  Eye, 
  ShoppingCart,
  Coins
} from 'lucide-react';
import { useRoblox } from '../../context/RobloxContext';
import { CatalogItem, CatalogCategory } from '../../types/roblox';
import { AvatarViewer } from '../avatar/AvatarViewer';
import { sounds } from '../../services/soundEffects';

export const MarketplaceView: React.FC = () => {
  const { 
    catalogItems, 
    user, 
    buyCatalogItem, 
    setIsRobuxModalOpen 
  } = useRoblox();

  const [selectedCategory, setSelectedCategory] = useState<CatalogCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'limited'>('all');
  const [inspectItem, setInspectItem] = useState<CatalogItem | null>(null);
  const [purchaseStatus, setPurchaseStatus] = useState<{ success: boolean; msg: string } | null>(null);
  const [isTryingOn, setIsTryingOn] = useState(false);

  const categories: CatalogCategory[] = [
    'All',
    'Hats',
    'Faces',
    'Shirts',
    'Pants',
    'Accessories',
    'Gear',
    'Animations'
  ];

  // Filtering
  const filteredItems = catalogItems.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = !searchQuery.trim() || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.creator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = 
      priceFilter === 'all' ||
      (priceFilter === 'free' && item.price === 0) ||
      (priceFilter === 'limited' && item.isLimited);
    return matchesCat && matchesSearch && matchesPrice;
  });

  const handleBuy = (item: CatalogItem) => {
    const res = buyCatalogItem(item);
    setPurchaseStatus({ success: res.success, msg: res.message });
    setTimeout(() => setPurchaseStatus(null), 3500);
  };

  // Build temporary avatar config for "Try On" mode
  const tryOnConfig = inspectItem && isTryingOn ? {
    ...user.avatarConfig,
    ...(inspectItem.type === 'hat' ? { equippedHat: inspectItem } : {}),
    ...(inspectItem.type === 'face' ? { equippedFace: inspectItem } : {}),
    ...(inspectItem.type === 'shirt' ? { equippedShirt: inspectItem } : {}),
    ...(inspectItem.type === 'pants' ? { equippedPants: inspectItem } : {}),
    ...(inspectItem.type === 'accessory' || inspectItem.type === 'gear' ? { equippedAccessory: inspectItem } : {})
  } : user.avatarConfig;

  return (
    <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Store className="w-6 h-6 text-[#00A2FF]" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Marketplace</h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Discover community-created clothing, limited collectibles, accessories, and emotes.
          </p>
        </div>

        {/* Robux Balance & Buy Button */}
        <div className="flex items-center gap-3">
          <div className="bg-[#191b1d] border border-[#2d3035] px-4 py-2 rounded-xl flex items-center gap-2">
            <span className="text-xs text-zinc-400">Balance:</span>
            <span className="text-sm font-black font-mono text-emerald-400">
              R$ {user.robux.toLocaleString()}
            </span>
          </div>
          <button
            onClick={() => setIsRobuxModalOpen(true)}
            className="px-3.5 py-2 bg-[#00A2FF] hover:bg-[#008fe0] text-white text-xs font-bold rounded-xl transition cursor-pointer shadow"
          >
            Get Robux
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#191b1d] p-3 rounded-2xl border border-[#2d3035]">
        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#00A2FF] text-white'
                  : 'hover:bg-[#232527] text-zinc-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input & Price filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111216] border border-[#2d3035] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00A2FF]"
            />
          </div>

          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value as any)}
            className="bg-[#111216] border border-[#2d3035] text-zinc-300 text-xs px-2.5 py-1.5 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="all">All Items</option>
            <option value="free">Free Items</option>
            <option value="limited">Limiteds Only</option>
          </select>
        </div>
      </div>

      {/* Toast Feedback */}
      {purchaseStatus && (
        <div className={`p-3 rounded-xl text-xs font-bold text-center animate-fade-in ${
          purchaseStatus.success ? 'bg-emerald-600/90 text-white' : 'bg-red-600/90 text-white'
        }`}>
          {purchaseStatus.msg}
        </div>
      )}

      {/* Catalog Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredItems.map(item => {
          const isOwned = user.inventory.some(i => i.id === item.id);
          return (
            <div
              key={item.id}
              onClick={() => {
                setInspectItem(item);
                setIsTryingOn(false);
              }}
              className="bg-[#191b1d] border border-[#2d3035] hover:border-zinc-500 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col"
            >
              <div className="relative aspect-square w-full bg-[#121316] overflow-hidden flex items-center justify-center p-3">
                <img 
                  src={item.thumbnail} 
                  alt={item.name} 
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform"
                />

                {item.isLimited && (
                  <span className="absolute top-2 left-2 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow uppercase">
                    LIMITED
                  </span>
                )}

                {isOwned && (
                  <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
                    <Check className="w-3 h-3" />
                    <span>OWNED</span>
                  </span>
                )}
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white truncate group-hover:text-[#00A2FF] transition-colors">
                    {item.name}
                  </h3>
                  <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                    By {item.creator}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#25282e] flex items-center justify-between">
                  <div className="flex items-center gap-1 font-mono font-bold text-sm">
                    {item.price === 0 ? (
                      <span className="text-emerald-400 font-sans text-xs font-black">FREE</span>
                    ) : (
                      <>
                        <div className="w-3 h-3 bg-emerald-500 rotate-45 rounded-[1px]" />
                        <span className="text-white">{item.price.toLocaleString()}</span>
                      </>
                    )}
                  </div>

                  <span className="text-[10px] text-zinc-400 capitalize">{item.type}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Item Inspection & Try-On Modal */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#191b1d] border border-[#2d3035] rounded-3xl p-6 text-white shadow-2xl overflow-hidden">
            <button
              onClick={() => {
                setInspectItem(null);
                setIsTryingOn(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Avatar Try-On or Item Display */}
              <div className="bg-[#121316] border border-[#2b2d31] rounded-2xl p-4 flex flex-col items-center justify-center min-h-[260px] relative">
                {isTryingOn ? (
                  <AvatarViewer config={tryOnConfig} size="lg" interactive={true} />
                ) : (
                  <img 
                    src={inspectItem.thumbnail} 
                    alt={inspectItem.name} 
                    className="w-48 h-48 object-cover rounded-xl shadow-lg"
                  />
                )}

                {/* Try On Toggle Button */}
                <button
                  onClick={() => {
                    sounds.playClick();
                    setIsTryingOn(!isTryingOn);
                  }}
                  className={`mt-3 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isTryingOn ? 'bg-[#00A2FF] text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isTryingOn ? 'Viewing Avatar (Try-On)' : 'Try On Avatar'}</span>
                </button>
              </div>

              {/* Item Details */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-[#00A2FF] font-bold uppercase">{inspectItem.category}</span>
                    {inspectItem.isLimited && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                        Limited U
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-black text-white">{inspectItem.name}</h2>
                  <p className="text-xs text-zinc-400 mt-1">Creator: {inspectItem.creator}</p>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed bg-[#222428] p-3 rounded-xl border border-zinc-700/60">
                  {inspectItem.description}
                </p>

                {/* Price & Buy Action */}
                <div className="pt-2 border-t border-[#2d3035] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Price:</span>
                    <span className="text-lg font-black font-mono text-emerald-400">
                      {inspectItem.price === 0 ? 'FREE' : `R$ ${inspectItem.price.toLocaleString()}`}
                    </span>
                  </div>

                  {user.inventory.some(i => i.id === inspectItem.id) ? (
                    <div className="w-full py-3 bg-emerald-600/20 text-emerald-400 border border-emerald-500 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Item Already in Your Inventory</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleBuy(inspectItem)}
                      className="w-full py-3 bg-[#00B06F] hover:bg-[#009b62] active:scale-[0.98] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-[#00B06F]/25"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{inspectItem.price === 0 ? 'Get Free' : `Buy for R$ ${inspectItem.price.toLocaleString()}`}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
