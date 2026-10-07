import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  LogOut, 
  Check, 
  UserPlus, 
  ExternalLink,
  Coins,
  ShieldCheck,
  X
} from 'lucide-react';
import { useRoblox } from '../../context/RobloxContext';
import { AvatarViewer } from '../avatar/AvatarViewer';

export const Navbar: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    user,
    theme,
    toggleTheme,
    soundEnabled,
    toggleSound,
    setIsRobuxModalOpen,
    setIsSettingsModalOpen,
    notifications,
    unreadNotifsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    acceptFriendRequest,
    searchQuery,
    setSearchQuery,
    searchCategory,
    setSearchCategory,
    setSelectedGame,
    experiences,
    catalogItems
  } = useRoblox();

  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut '/' to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered quick results for search dropdown
  const filteredGames = experiences.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.genre.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 3);

  const filteredItems = catalogItems.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 2);

  const handleSearchResultClick = (type: 'game' | 'item' | 'player', id?: string) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    if (type === 'game' && id) {
      const g = experiences.find(exp => exp.id === id);
      if (g) setSelectedGame(g);
    } else if (type === 'item') {
      setCurrentTab('marketplace');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-14 bg-[#191b1d] border-b border-[#2d3035] text-white flex items-center justify-between px-3 md:px-5 transition-colors duration-150">
      {/* Left: Roblox Logo & Navigation Links */}
      <div className="flex items-center gap-2 sm:gap-6">
        <button 
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          title="Roblox Home"
        >
          {/* Authentic Roblox tilted square emblem */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="w-6 h-6 bg-[#00A2FF] rounded-[5px] transform rotate-[14deg] group-hover:rotate-[28deg] transition-transform duration-200 flex items-center justify-center shadow-md shadow-[#00A2FF]/20">
              <div className="w-2.5 h-2.5 bg-[#191b1d] rounded-[2px] transform rotate-[2deg]" />
            </div>
          </div>
          <span className="font-extrabold text-xl tracking-tight hidden sm:inline-block font-sans">
            ROBLOX
          </span>
        </button>

        {/* Primary nav buttons */}
        <nav className="flex items-center gap-1 sm:gap-1.5 text-[14px] font-semibold text-zinc-300">
          <button
            onClick={() => setCurrentTab('discover')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              currentTab === 'discover' 
                ? 'text-white bg-[#2b2d31] font-bold' 
                : 'hover:text-white hover:bg-[#232527]'
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setCurrentTab('marketplace')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              currentTab === 'marketplace' 
                ? 'text-white bg-[#2b2d31] font-bold' 
                : 'hover:text-white hover:bg-[#232527]'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setCurrentTab('create')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              currentTab === 'create' 
                ? 'text-white bg-[#2b2d31] font-bold' 
                : 'hover:text-white hover:bg-[#232527]'
            }`}
          >
            Create
          </button>
        </nav>
      </div>

      {/* Center: Global Search Bar */}
      <div className="relative flex-1 max-w-xl mx-2 sm:mx-6 hidden md:block">
        <div className={`flex items-center bg-[#111216] border rounded-full px-3.5 py-1.5 transition-all ${
          isSearchFocused ? 'border-[#00A2FF] ring-2 ring-[#00A2FF]/20 shadow-lg' : 'border-[#393b3d]'
        }`}>
          <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search experiences, players, catalog items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          {searchQuery ? (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-zinc-400 hover:text-white cursor-pointer p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-zinc-800 text-zinc-400 rounded border border-zinc-700">
              /
            </kbd>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isSearchFocused && searchQuery.trim().length > 0 && (
          <div 
            className="absolute top-11 left-0 right-0 bg-[#1d1f23] border border-[#393b3d] rounded-xl shadow-2xl p-2 z-50 overflow-hidden"
            onMouseDown={(e) => e.preventDefault()} // prevent input blur
          >
            <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-zinc-400 border-b border-zinc-700/50 pb-2 mb-1">
              <span>Filter:</span>
              {(['all', 'experiences', 'marketplace', 'players', 'groups'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSearchCategory(cat)}
                  className={`capitalize px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                    searchCategory === cat ? 'bg-[#00A2FF] text-white' : 'hover:bg-zinc-800 text-zinc-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quick Game Matches */}
            {filteredGames.length > 0 && (
              <div className="mb-2">
                <div className="text-[11px] font-semibold text-zinc-400 px-2 py-1 uppercase tracking-wider">Experiences</div>
                {filteredGames.map(g => (
                  <button
                    key={g.id}
                    onClick={() => handleSearchResultClick('game', g.id)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#2a2d33] text-left cursor-pointer transition"
                  >
                    <img src={g.thumbnail} alt={g.title} className="w-9 h-9 rounded-md object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">{g.title}</div>
                      <div className="text-xs text-zinc-400 truncate">By {g.creator} • 👍 {g.ratingPercent}%</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Quick Marketplace Matches */}
            {filteredItems.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold text-zinc-400 px-2 py-1 uppercase tracking-wider">Catalog Items</div>
                {filteredItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSearchResultClick('item')}
                    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-[#2a2d33] text-left cursor-pointer transition"
                  >
                    <img src={item.thumbnail} alt={item.name} className="w-8 h-8 rounded-md object-cover bg-zinc-800" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{item.name}</div>
                      <div className="text-xs text-emerald-400">R$ {item.price.toLocaleString()}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {filteredGames.length === 0 && filteredItems.length === 0 && (
              <div className="py-4 text-center text-sm text-zinc-400">
                No matching results found for "{searchQuery}".
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Robux, Notifications, Sound, Profile */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Robux Balance & Buy Button */}
        <button
          onClick={() => setIsRobuxModalOpen(true)}
          className="flex items-center gap-1.5 bg-[#222428] hover:bg-[#2e3137] border border-[#393b3d] text-zinc-100 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer group shadow-sm"
          title="Buy or manage Robux"
        >
          {/* Hexagonal Robux Coin Icon */}
          <div className="w-4 h-4 bg-emerald-500 rounded-sm rotate-45 flex items-center justify-center shrink-0 shadow">
            <div className="w-1.5 h-1.5 bg-[#222428] rounded-[1px]" />
          </div>
          <span className="font-mono tracking-tight font-extrabold text-white group-hover:text-emerald-400 transition-colors">
            {user.robux.toLocaleString()}
          </span>
          <span className="text-zinc-400 text-xs font-normal hidden lg:inline">R$</span>
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-full hover:bg-[#2b2d31] text-zinc-300 hover:text-white transition cursor-pointer"
          title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
        </button>

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-full hover:bg-[#2b2d31] text-zinc-300 hover:text-white transition cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#ef4444] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#191b1d] animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Notifications Flyout Drawer */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#1d1f23] border border-[#393b3d] rounded-2xl shadow-2xl py-2 z-50">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#2d3035]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">Notifications</span>
                  {unreadNotifsCount > 0 && (
                    <span className="text-[11px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-semibold">
                      {unreadNotifsCount} new
                    </span>
                  )}
                </div>
                {unreadNotifsCount > 0 && (
                  <button 
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-[#00A2FF] hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#2a2d33]">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-zinc-400 text-xs">No notifications yet</div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-3 hover:bg-[#25282e] transition cursor-pointer flex gap-3 ${
                        !n.read ? 'bg-[#21242b]' : ''
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-zinc-800 shrink-0 overflow-hidden flex items-center justify-center border border-zinc-700">
                        {n.avatarUrl ? (
                          <img src={n.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : n.type === 'badge' ? (
                          <span className="text-base">🏆</span>
                        ) : (
                          <Bell className="w-4 h-4 text-[#00A2FF]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white truncate">{n.title}</span>
                          <span className="text-[10px] text-zinc-400 ml-1 shrink-0">{n.timestamp}</span>
                        </div>
                        <p className="text-xs text-zinc-300 mt-0.5 line-clamp-2">{n.message}</p>
                        
                        {/* Interactive actions for friend requests */}
                        {n.type === 'friend_request' && (
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                acceptFriendRequest(n.id);
                              }}
                              className="px-2.5 py-1 bg-[#00A2FF] hover:bg-[#008fe0] text-white rounded text-xs font-semibold transition cursor-pointer"
                            >
                              Accept
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markNotificationAsRead(n.id);
                              }}
                              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-medium transition cursor-pointer"
                            >
                              Ignore
                            </button>
                          </div>
                        )}
                      </div>
                      {!n.read && (
                        <div className="w-2 h-2 rounded-full bg-[#00A2FF] self-center shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings & Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-[#2b2d31] transition cursor-pointer ring-1 ring-zinc-700/60"
            title="Profile & Settings"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-zinc-800 border border-zinc-600 flex items-center justify-center">
              <AvatarViewer config={user.avatarConfig} size="sm" interactive={false} />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#191b1d]" />
            </div>
          </button>

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#1d1f23] border border-[#393b3d] rounded-2xl shadow-2xl py-2 z-50">
              {/* User overview */}
              <div className="px-4 py-3 border-b border-[#2d3035] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 border border-zinc-600">
                  <AvatarViewer config={user.avatarConfig} size="sm" interactive={false} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">{user.displayName}</div>
                  <div className="text-xs text-zinc-400 truncate">@{user.username}</div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Account</span>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1 text-sm">
                <button
                  onClick={() => {
                    setCurrentTab('profile');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-[#2a2d33] text-zinc-200 hover:text-white transition cursor-pointer text-left"
                >
                  <User className="w-4 h-4 text-zinc-400" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentTab('avatar');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-[#2a2d33] text-zinc-200 hover:text-white transition cursor-pointer text-left"
                >
                  <span className="text-base leading-none">👕</span>
                  <span>Avatar Editor</span>
                </button>

                <button
                  onClick={() => {
                    setIsSettingsModalOpen(true);
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-[#2a2d33] text-zinc-200 hover:text-white transition cursor-pointer text-left"
                >
                  <Settings className="w-4 h-4 text-zinc-400" />
                  <span>Account Settings</span>
                </button>

                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-[#2a2d33] text-zinc-200 hover:text-white transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                    <span>Theme: {theme === 'dark' ? 'Dark' : 'Light'}</span>
                  </div>
                  <span className="text-xs text-zinc-400">Toggle</span>
                </button>
              </div>

              <div className="pt-1 mt-1 border-t border-[#2d3035]">
                <button
                  onClick={() => {
                    setIsSettingsModalOpen(true);
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-[#2a2d33] text-zinc-400 hover:text-zinc-200 transition cursor-pointer text-left text-xs"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Help & Safety Center</span>
                </button>

                <button
                  onClick={() => {
                    // Quick reload / restart session simulation
                    window.location.reload();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-red-500/10 text-red-400 transition cursor-pointer text-left text-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Switch Account / Reload</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
