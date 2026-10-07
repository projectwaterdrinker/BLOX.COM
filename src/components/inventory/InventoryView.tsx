import React, { useState } from 'react';
import { 
  Briefcase, 
  Check, 
  Filter, 
  Sparkles, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useRoblox } from '../../context/RobloxContext';
import { CatalogCategory, CatalogItem } from '../../types/roblox';

export const InventoryView: React.FC = () => {
  const { user, equipItem, unequipItem, setCurrentTab } = useRoblox();
  const [selectedCategory, setSelectedCategory] = useState<CatalogCategory>('All');

  const categories: CatalogCategory[] = ['All', 'Hats', 'Faces', 'Shirts', 'Pants', 'Accessories', 'Gear'];

  const filteredItems = user.inventory.filter(item => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const isEquipped = (item: CatalogItem) => {
    const cfg = user.avatarConfig;
    return (
      cfg.equippedHat?.id === item.id ||
      cfg.equippedFace?.id === item.id ||
      cfg.equippedShirt?.id === item.id ||
      cfg.equippedPants?.id === item.id ||
      cfg.equippedAccessory?.id === item.id ||
      cfg.equippedGear?.id === item.id
    );
  };

  return (
    <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-[#00A2FF]" />
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Inventory</h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            All your acquired hats, clothing, limited items, and accessories in one vault.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('marketplace')}
          className="px-4 py-2 bg-[#00A2FF] hover:bg-[#008fe0] text-white text-xs font-bold rounded-xl transition cursor-pointer self-start sm:self-auto shadow"
        >
          Shop More in Marketplace
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#00A2FF] text-white'
                : 'bg-[#191b1d] hover:bg-[#232527] border border-[#2d3035] text-zinc-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center text-zinc-400 bg-[#191b1d] rounded-3xl border border-[#2d3035]">
          <p className="text-sm font-semibold">No items found in this inventory category.</p>
          <button
            onClick={() => setCurrentTab('marketplace')}
            className="mt-3 text-xs text-[#00A2FF] font-bold hover:underline cursor-pointer"
          >
            Explore Marketplace to acquire items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map(item => {
            const equipped = isEquipped(item);
            return (
              <div
                key={item.id}
                className="bg-[#191b1d] border border-[#2d3035] hover:border-zinc-500 rounded-2xl overflow-hidden p-3 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-md"
              >
                <div className="aspect-square w-full rounded-xl bg-[#121316] overflow-hidden mb-3 relative flex items-center justify-center">
                  <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                  
                  {equipped && (
                    <span className="absolute top-2 right-2 bg-[#00A2FF] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Equipped</span>
                    </span>
                  )}

                  {item.isLimited && (
                    <span className="absolute top-2 left-2 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                      LIMITED
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-sm text-white truncate">{item.name}</h3>
                  <div className="text-[11px] text-zinc-400 capitalize">{item.category}</div>
                </div>

                <div className="mt-3 pt-2 border-t border-[#25282e] flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (equipped) unequipItem(item.category);
                      else equipItem(item);
                    }}
                    className={`w-full py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      equipped 
                        ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' 
                        : 'bg-[#00A2FF] text-white hover:bg-[#008fe0]'
                    }`}
                  >
                    {equipped ? 'Unequip' : 'Equip on Avatar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
