import React from 'react';
import { 
  Home, 
  User, 
  MessageSquare, 
  Users, 
  Shirt, 
  Briefcase, 
  ArrowLeftRight, 
  ShieldAlert, 
  Sparkles,
  Compass,
  Store,
  Hammer
} from 'lucide-react';
import { useRoblox } from '../../context/RobloxContext';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const { currentTab, setCurrentTab, user, messages } = useRoblox();

  const unreadMessagesCount = messages.filter(m => !m.read && m.recipientId === user.id).length;
  const onlineFriendsCount = user.friends.filter(f => f.status === 'online' || f.status === 'ingame').length;

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, count: null },
    { id: 'profile', label: 'Profile', icon: User, count: null },
    { id: 'messages', label: 'Messages', icon: MessageSquare, count: unreadMessagesCount > 0 ? unreadMessagesCount : null },
    { id: 'friends', label: 'Friends', icon: Users, count: onlineFriendsCount > 0 ? `${onlineFriendsCount} on` : null },
    { id: 'avatar', label: 'Avatar Editor', icon: Shirt, count: null },
    { id: 'inventory', label: 'Inventory', icon: Briefcase, count: user.inventory.length },
    { id: 'trade', label: 'Trade', icon: ArrowLeftRight, count: null },
    { id: 'groups', label: 'Groups', icon: ShieldAlert, count: null },
  ];

  const exploreItems = [
    { id: 'discover', label: 'Discover Games', icon: Compass },
    { id: 'marketplace', label: 'Marketplace', icon: Store },
    { id: 'create', label: 'Roblox Studio', icon: Hammer },
  ];

  return (
    <aside 
      className={`shrink-0 bg-[#191b1d] border-r border-[#2d3035] transition-all duration-200 select-none flex flex-col justify-between ${
        collapsed ? 'w-16' : 'w-56 lg:w-60'
      }`}
    >
      <div className="py-3 px-2 space-y-4">
        {/* Main Personal Section */}
        <div className="space-y-1">
          {!collapsed && (
            <div className="px-3 pb-1 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Account
            </div>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#00A2FF] text-white shadow-md shadow-[#00A2FF]/20' 
                    : 'text-zinc-300 hover:text-white hover:bg-[#232527]'
                } ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.count && (
                      <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-[#2a2d33] text-zinc-400'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Explore Hubs Section */}
        <div className="pt-2 border-t border-[#2d3035] space-y-1">
          {!collapsed && (
            <div className="px-3 pb-1 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Explore & Build
            </div>
          )}
          {exploreItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#00A2FF] text-white shadow-md shadow-[#00A2FF]/20' 
                    : 'text-zinc-300 hover:text-white hover:bg-[#232527]'
                } ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Banner: Roblox Premium Upgrade Promo */}
      {!collapsed && (
        <div className="p-3 m-2 rounded-xl bg-gradient-to-br from-indigo-950/60 to-purple-950/50 border border-indigo-700/30">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white">Roblox Premium</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed mb-2">
            Get 10% more Robux, trade limiteds, and unlock exclusive items.
          </p>
          <button 
            onClick={() => setCurrentTab('marketplace')}
            className="w-full py-1.5 text-xs font-bold bg-[#00A2FF] hover:bg-[#008fe0] text-white rounded-lg transition cursor-pointer shadow-sm"
          >
            Explore Benefits
          </button>
        </div>
      )}
    </aside>
  );
};
