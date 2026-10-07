import React, { useState } from 'react';
import { 
  Shirt, 
  Palette, 
  Sliders, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Layers, 
  User, 
  X,
  Play
} from 'lucide-react';
import { useRoblox } from '../../context/RobloxContext';
import { AvatarViewer } from './AvatarViewer';
import { CatalogCategory, CatalogItem } from '../../types/roblox';
import { sounds } from '../../services/soundEffects';

export const AvatarEditorView: React.FC = () => {
  const { 
    user, 
    updateAvatarConfig, 
    equipItem, 
    unequipItem 
  } = useRoblox();

  const [activeTab, setActiveTab] = useState<'clothing' | 'body' | 'skin' | 'scale'>('clothing');
  const [clothingCategory, setClothingCategory] = useState<CatalogCategory>('Hats');

  // Classic Roblox Palette colors
  const skinColors = [
    { name: 'Pastel Yellow', hex: '#facc15' },
    { name: 'Bright Blue', hex: '#0284c7' },
    { name: 'Bright Green', hex: '#16a34a' },
    { name: 'Bright Red', hex: '#dc2626' },
    { name: 'Light Orange', hex: '#f97316' },
    { name: 'Nougat Tan', hex: '#d97706' },
    { name: 'Light Reddish Violet', hex: '#e11d48' },
    { name: 'Dark Stone Grey', hex: '#334155' },
    { name: 'Black', hex: '#18181b' },
    { name: 'White', hex: '#f8fafc' },
    { name: 'Deep Lavender', hex: '#8b5cf6' },
    { name: 'Teal', hex: '#0d9488' }
  ];

  // User's owned items in current subcategory
  const ownedItemsInCategory = user.inventory.filter(item => {
    if (clothingCategory === 'Hats') return item.type === 'hat';
    if (clothingCategory === 'Faces') return item.type === 'face';
    if (clothingCategory === 'Shirts') return item.type === 'shirt';
    if (clothingCategory === 'Pants') return item.type === 'pants';
    if (clothingCategory === 'Accessories') return item.type === 'accessory' || item.type === 'gear';
    if (clothingCategory === 'Animations') return item.type === 'animation';
    return false;
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

  const handleResetOutfit = () => {
    sounds.playClick();
    updateAvatarConfig({
      skinColor: '#facc15',
      torsoColor: '#0284c7',
      leftLegColor: '#16a34a',
      rightLegColor: '#16a34a',
      equippedHat: null,
      equippedFace: null,
      equippedShirt: null,
      equippedPants: null,
      equippedAccessory: null,
      bodyType: 'R6'
    });
  };

  return (
    <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Avatar Editor</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Customize your 3D avatar's appearance, clothing, skin tones, accessories, and scaling.
          </p>
        </div>

        <button
          onClick={handleResetOutfit}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#232527] hover:bg-[#2d3035] border border-zinc-700 text-xs font-bold text-zinc-300 hover:text-white rounded-xl transition cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Default</span>
        </button>
      </div>

      {/* Main Grid: Avatar Doll Preview + Customization Drawers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 3D Rotatable Avatar Doll (4 cols) */}
        <div className="lg:col-span-5 bg-[#191b1d] border border-[#2d3035] rounded-3xl p-6 flex flex-col items-center justify-between min-h-[420px] shadow-xl relative">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">3D Avatar Preview</span>
            <div className="flex items-center gap-1 bg-[#121316] p-1 rounded-lg border border-zinc-800 text-[11px] font-bold">
              <button
                onClick={() => updateAvatarConfig({ bodyType: 'R6' })}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  user.avatarConfig.bodyType === 'R6' ? 'bg-[#00A2FF] text-white' : 'text-zinc-400'
                }`}
              >
                R6
              </button>
              <button
                onClick={() => updateAvatarConfig({ bodyType: 'R15' })}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  user.avatarConfig.bodyType === 'R15' ? 'bg-[#00A2FF] text-white' : 'text-zinc-400'
                }`}
              >
                R15
              </button>
            </div>
          </div>

          {/* Interactive Avatar Viewer */}
          <div className="flex-1 flex items-center justify-center my-4">
            <AvatarViewer config={user.avatarConfig} size="xl" interactive={true} />
          </div>

          {/* Equipped items summary chips */}
          <div className="w-full pt-4 border-t border-[#2d3035] flex flex-wrap gap-1.5 justify-center">
            {user.avatarConfig.equippedHat && (
              <span className="bg-[#24272e] text-zinc-300 text-[11px] px-2.5 py-1 rounded-full border border-zinc-700/60 flex items-center gap-1">
                <span>🎩 {user.avatarConfig.equippedHat.name}</span>
                <button 
                  onClick={() => unequipItem('Hats')}
                  className="hover:text-red-400 cursor-pointer ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {user.avatarConfig.equippedShirt && (
              <span className="bg-[#24272e] text-zinc-300 text-[11px] px-2.5 py-1 rounded-full border border-zinc-700/60 flex items-center gap-1">
                <span>👕 {user.avatarConfig.equippedShirt.name}</span>
                <button 
                  onClick={() => unequipItem('Shirts')}
                  className="hover:text-red-400 cursor-pointer ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {user.avatarConfig.equippedPants && (
              <span className="bg-[#24272e] text-zinc-300 text-[11px] px-2.5 py-1 rounded-full border border-zinc-700/60 flex items-center gap-1">
                <span>👖 {user.avatarConfig.equippedPants.name}</span>
                <button 
                  onClick={() => unequipItem('Pants')}
                  className="hover:text-red-400 cursor-pointer ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {user.avatarConfig.equippedAccessory && (
              <span className="bg-[#24272e] text-zinc-300 text-[11px] px-2.5 py-1 rounded-full border border-zinc-700/60 flex items-center gap-1">
                <span>✨ {user.avatarConfig.equippedAccessory.name}</span>
                <button 
                  onClick={() => unequipItem('Accessories')}
                  className="hover:text-red-400 cursor-pointer ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Customization Controls (7 cols) */}
        <div className="lg:col-span-7 bg-[#191b1d] border border-[#2d3035] rounded-3xl p-6 flex flex-col shadow-xl">
          
          {/* Main Category Tabs */}
          <div className="flex border-b border-[#2d3035] pb-3 text-sm font-bold gap-2">
            <button
              onClick={() => setActiveTab('clothing')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
                activeTab === 'clothing' ? 'bg-[#00A2FF] text-white' : 'text-zinc-400 hover:bg-[#232527]'
              }`}
            >
              <Shirt className="w-4 h-4" />
              <span>Clothing & Accessories</span>
            </button>

            <button
              onClick={() => setActiveTab('skin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
                activeTab === 'skin' ? 'bg-[#00A2FF] text-white' : 'text-zinc-400 hover:bg-[#232527]'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Skin Color</span>
            </button>

            <button
              onClick={() => setActiveTab('scale')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
                activeTab === 'scale' ? 'bg-[#00A2FF] text-white' : 'text-zinc-400 hover:bg-[#232527]'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Scale & Body</span>
            </button>
          </div>

          {/* Sub-panels */}
          <div className="pt-5 flex-1">
            {activeTab === 'clothing' && (
              <div className="space-y-4">
                {/* Subcategory selection pills */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {(['Hats', 'Faces', 'Shirts', 'Pants', 'Accessories', 'Animations'] as CatalogCategory[]).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setClothingCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                        clothingCategory === cat
                          ? 'bg-[#2b2d31] text-white border border-[#393b3d]'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Owned items inventory grid */}
                <div>
                  <div className="text-xs font-semibold text-zinc-400 mb-2">
                    Owned {clothingCategory} ({ownedItemsInCategory.length})
                  </div>

                  {ownedItemsInCategory.length === 0 ? (
                    <div className="py-12 text-center text-zinc-400 bg-[#121316] rounded-2xl border border-[#2b2d31]">
                      <p className="text-xs">You don't own any items in this category yet.</p>
                      <p className="text-[11px] text-zinc-500 mt-1">Visit the Marketplace to grab hats, clothing, and gear!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1">
                      {ownedItemsInCategory.map(item => {
                        const equipped = isEquipped(item);
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              if (equipped) unequipItem(clothingCategory);
                              else equipItem(item);
                            }}
                            className={`p-2.5 rounded-2xl border transition cursor-pointer relative group flex flex-col justify-between ${
                              equipped 
                                ? 'bg-[#00A2FF]/15 border-[#00A2FF] ring-2 ring-[#00A2FF]/30' 
                                : 'bg-[#141518] border-[#2b2d31] hover:border-zinc-500'
                            }`}
                          >
                            <div className="aspect-square w-full rounded-xl bg-zinc-900 overflow-hidden mb-2 relative">
                              <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                              {equipped && (
                                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#00A2FF] text-white rounded-full flex items-center justify-center">
                                  <Check className="w-3 h-3" />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="text-xs font-bold text-white truncate">{item.name}</div>
                              <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                                {equipped ? 'Equipped' : 'Click to Equip'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'skin' && (
              <div className="space-y-4">
                <p className="text-xs text-zinc-300">
                  Select a classic skin color tone for your Robloxian's head and limbs:
                </p>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {skinColors.map(color => {
                    const isSelected = user.avatarConfig.skinColor === color.hex;
                    return (
                      <button
                        key={color.name}
                        onClick={() => updateAvatarConfig({ skinColor: color.hex, headColor: color.hex })}
                        className={`flex items-center gap-2.5 p-2 rounded-xl border transition cursor-pointer ${
                          isSelected ? 'border-[#00A2FF] ring-2 ring-[#00A2FF]/30 bg-[#24272e]' : 'border-zinc-700/60 bg-[#16171a] hover:bg-[#202227]'
                        }`}
                      >
                        <div 
                          className="w-7 h-7 rounded-lg shrink-0 border border-black/30 shadow-inner"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-xs font-semibold text-zinc-200 truncate">{color.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'scale' && (
              <div className="space-y-5 max-w-md">
                <p className="text-xs text-zinc-300">
                  Adjust body scale proportions:
                </p>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-1">
                      <span>Height:</span>
                      <span className="font-mono">{(user.avatarConfig.scaleHeight * 100).toFixed(0)}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0.9"
                      max="1.15"
                      step="0.05"
                      value={user.avatarConfig.scaleHeight}
                      onChange={(e) => updateAvatarConfig({ scaleHeight: parseFloat(e.target.value) })}
                      className="w-full accent-[#00A2FF] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-1">
                      <span>Width:</span>
                      <span className="font-mono">{(user.avatarConfig.scaleWidth * 100).toFixed(0)}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0.85"
                      max="1.15"
                      step="0.05"
                      value={user.avatarConfig.scaleWidth}
                      onChange={(e) => updateAvatarConfig({ scaleWidth: parseFloat(e.target.value) })}
                      className="w-full accent-[#00A2FF] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-1">
                      <span>Head Scale:</span>
                      <span className="font-mono">{(user.avatarConfig.scaleHead * 100).toFixed(0)}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0.9"
                      max="1.1"
                      step="0.05"
                      value={user.avatarConfig.scaleHead}
                      onChange={(e) => updateAvatarConfig({ scaleHead: parseFloat(e.target.value) })}
                      className="w-full accent-[#00A2FF] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
