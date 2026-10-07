/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RobloxProvider, useRoblox } from './context/RobloxContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { HomeView } from './components/home/HomeView';
import { DiscoverView } from './components/discover/DiscoverView';
import { MarketplaceView } from './components/marketplace/MarketplaceView';
import { AvatarEditorView } from './components/avatar/AvatarEditorView';
import { ProfileView } from './components/profile/ProfileView';
import { FriendsView } from './components/friends/FriendsView';
import { MessagesView } from './components/messages/MessagesView';
import { InventoryView } from './components/inventory/InventoryView';
import { TradeView } from './components/trade/TradeView';
import { GroupsView } from './components/groups/GroupsView';
import { CreateStudioView } from './components/create/CreateStudioView';
import { GameDetailsModal } from './components/game/GameDetailsModal';
import { PlayableGameClient } from './components/game/PlayableGameClient';
import { RobuxPurchaseModal } from './components/modals/RobuxPurchaseModal';
import { AccountSettingsModal } from './components/modals/AccountSettingsModal';
import { GameExperience } from './types/roblox';

const MainAppContent: React.FC = () => {
  const { 
    currentTab, 
    selectedGame, 
    setSelectedGame, 
    activePlayingGame, 
    launchGame, 
    closeGame 
  } = useRoblox();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSelectGame = (game: GameExperience) => {
    setSelectedGame(game);
  };

  const handlePlayGame = (game: GameExperience) => {
    setSelectedGame(null); // close details modal if open
    launchGame(game);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Body Area: Sidebar + Active View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left-hand Navigation Sidebar */}
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />

        {/* Dynamic Center Feed / Content */}
        <main className="flex-1 overflow-y-auto">
          {currentTab === 'home' && (
            <HomeView 
              onSelectGame={handleSelectGame} 
              onPlayGame={handlePlayGame} 
            />
          )}

          {currentTab === 'discover' && (
            <DiscoverView 
              onSelectGame={handleSelectGame} 
              onPlayGame={handlePlayGame} 
            />
          )}

          {currentTab === 'marketplace' && (
            <MarketplaceView />
          )}

          {currentTab === 'avatar' && (
            <AvatarEditorView />
          )}

          {currentTab === 'profile' && (
            <ProfileView 
              onSelectGame={handleSelectGame} 
              onPlayGame={handlePlayGame} 
            />
          )}

          {currentTab === 'friends' && (
            <FriendsView 
              onPlayGame={handlePlayGame} 
            />
          )}

          {currentTab === 'messages' && (
            <MessagesView />
          )}

          {currentTab === 'inventory' && (
            <InventoryView />
          )}

          {currentTab === 'trade' && (
            <TradeView />
          )}

          {currentTab === 'groups' && (
            <GroupsView />
          )}

          {currentTab === 'create' && (
            <CreateStudioView 
              onSelectGame={handleSelectGame} 
              onPlayGame={handlePlayGame} 
            />
          )}
        </main>
      </div>

      {/* Game Details Modal */}
      {selectedGame && (
        <GameDetailsModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
          onPlay={handlePlayGame}
        />
      )}

      {/* Playable Roblox Experience Launcher & Client Window */}
      {activePlayingGame && (
        <PlayableGameClient
          game={activePlayingGame}
          onClose={closeGame}
        />
      )}

      {/* Robux Purchase Modal */}
      <RobuxPurchaseModal />

      {/* Account Settings & Privacy Modal */}
      <AccountSettingsModal />
    </div>
  );
};

export default function App() {
  return (
    <RobloxProvider>
      <MainAppContent />
    </RobloxProvider>
  );
}
