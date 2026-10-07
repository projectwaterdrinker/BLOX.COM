import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  GameExperience, 
  CatalogItem, 
  Friend, 
  RobloxGroup, 
  UserNotification, 
  DirectMessage, 
  TradeOffer, 
  AvatarCustomization,
  CatalogCategory
} from '../types/roblox';
import { 
  INITIAL_USER, 
  INITIAL_EXPERIENCES, 
  INITIAL_CATALOG_ITEMS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_GROUPS 
} from '../data/mockData';
import { sounds } from '../services/soundEffects';
import confetti from 'canvas-confetti';

interface RobloxContextType {
  // Navigation
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  
  // User & Profile
  user: UserProfile;
  updateUserBio: (bio: string) => void;
  updateStatusMessage: (status: string) => void;
  updateProfileDetails: (displayName: string, username: string, safeChat: boolean) => void;
  
  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  // Sound
  soundEnabled: boolean;
  toggleSound: () => void;
  
  // Robux & Economy
  buyRobux: (amount: number, bonus?: number) => void;
  buyCatalogItem: (item: CatalogItem) => { success: boolean; message: string };
  buyGamePass: (gameId: string, passId: string) => { success: boolean; message: string };
  isRobuxModalOpen: boolean;
  setIsRobuxModalOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  
  // Avatar Customization
  updateAvatarConfig: (updates: Partial<AvatarCustomization>) => void;
  equipItem: (item: CatalogItem) => void;
  unequipItem: (category: CatalogCategory) => void;
  
  // Games & Experiences
  experiences: GameExperience[];
  selectedGame: GameExperience | null;
  setSelectedGame: (game: GameExperience | null) => void;
  activePlayingGame: GameExperience | null;
  launchGame: (game: GameExperience) => void;
  closeGame: () => void;
  toggleLikeGame: (gameId: string) => void;
  toggleDislikeGame: (gameId: string) => void;
  toggleFavoriteGame: (gameId: string) => void;
  awardBadgeToUser: (badgeName: string, icon: string, description: string) => void;
  addCreatedGame: (newGame: Omit<GameExperience, 'id' | 'creator' | 'likes' | 'dislikes' | 'visits' | 'ratingPercent' | 'gamepasses' | 'badges' | 'servers'>) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchCategory: 'all' | 'experiences' | 'players' | 'marketplace' | 'groups';
  setSearchCategory: (cat: 'all' | 'experiences' | 'players' | 'marketplace' | 'groups') => void;

  // Friends & Social
  friends: Friend[];
  addFriendByUsername: (username: string) => { success: boolean; message: string };
  removeFriend: (friendId: string) => void;

  // Notifications
  notifications: UserNotification[];
  unreadNotifsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  acceptFriendRequest: (notifId: string) => void;

  // Catalog
  catalogItems: CatalogItem[];

  // Groups
  groups: RobloxGroup[];
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  postGroupWall: (groupId: string, message: string) => void;

  // Messages
  messages: DirectMessage[];
  sendMessage: (recipientId: string, recipientName: string, content: string) => void;

  // Trade
  trades: TradeOffer[];
  createTradeOffer: (partner: Friend, yourItems: CatalogItem[], theirItems: CatalogItem[], yourRobux: number, theirRobux: number) => { success: boolean; message: string };
  acceptTradeOffer: (tradeId: string) => void;
  declineTradeOffer: (tradeId: string) => void;

  // Safe Chat Filter
  filterSafeText: (input: string) => string;
}

const RobloxContext = createContext<RobloxContextType | null>(null);

const STORAGE_KEY_USER = 'roblox_web_user_v1';
const STORAGE_KEY_GAMES = 'roblox_web_games_v1';
const STORAGE_KEY_NOTIFS = 'roblox_web_notifs_v1';
const STORAGE_KEY_MSGS = 'roblox_web_msgs_v1';
const STORAGE_KEY_GROUPS = 'roblox_web_groups_v1';

export const RobloxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_USER;
  });

  const [experiences, setExperiences] = useState<GameExperience[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GAMES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_EXPERIENCES;
  });

  const [notifications, setNotifications] = useState<UserNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_NOTIFICATIONS;
  });

  const [groups, setGroups] = useState<RobloxGroup[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GROUPS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_GROUPS;
  });

  const [messages, setMessages] = useState<DirectMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MSGS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'msg-1',
        senderId: 'u-builderman',
        senderName: 'Builderman',
        senderAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
        recipientId: 'u-current-player',
        content: 'Welcome to Roblox! Check out the developer tools in Studio to build your dream worlds.',
        timestamp: 'Yesterday at 3:14 PM',
        read: true
      },
      {
        id: 'msg-2',
        senderId: 'u-gamerdave',
        senderName: 'GamerDave2026',
        senderAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        recipientId: 'u-current-player',
        content: 'Yo! Hop on Blox Fruits raid when you get online, we need a sword main!',
        timestamp: '2 hours ago',
        read: false
      }
    ];
  });

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [selectedGame, setSelectedGame] = useState<GameExperience | null>(null);
  const [activePlayingGame, setActivePlayingGame] = useState<GameExperience | null>(null);
  const [isRobuxModalOpen, setIsRobuxModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchCategory, setSearchCategory] = useState<'all' | 'experiences' | 'players' | 'marketplace' | 'groups'>('all');
  const [trades, setTrades] = useState<TradeOffer[]>([]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } catch {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GAMES, JSON.stringify(experiences));
    } catch {}
  }, [experiences]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
    } catch {}
  }, [groups]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MSGS, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Sync dark theme to body
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#111216';
      document.body.style.color = '#FFFFFF';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#F2F4F5';
      document.body.style.color = '#111216';
    }
  }, [theme]);

  const toggleTheme = () => {
    sounds.playClick();
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleSound = () => {
    sounds.playClick();
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setSoundEnabled(next);
  };

  // Safe Chat Filter Implementation (Replaces prohibited words or phone numbers with ###)
  const filterSafeText = (text: string): string => {
    if (!user.safeChatEnabled) return text;
    const bannedPatterns = [
      /\b(fuck|shit|bitch|ass|dick|cunt|pussy|whore|nigger|faggot|slut|cock)\b/gi,
      /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, // Phone numbers
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g // Emails
    ];
    let sanitized = text;
    for (const pattern of bannedPatterns) {
      sanitized = sanitized.replace(pattern, (match) => '#'.repeat(match.length));
    }
    return sanitized;
  };

  // User details update
  const updateUserBio = (bio: string) => {
    setUser(prev => ({ ...prev, bio: filterSafeText(bio) }));
  };

  const updateStatusMessage = (statusMessage: string) => {
    sounds.playClick();
    setUser(prev => ({ ...prev, statusMessage: filterSafeText(statusMessage) }));
  };

  const updateProfileDetails = (displayName: string, username: string, safeChat: boolean) => {
    sounds.playClick();
    setUser(prev => ({
      ...prev,
      displayName: displayName.trim() || prev.displayName,
      username: username.trim().toLowerCase() || prev.username,
      safeChatEnabled: safeChat
    }));
  };

  // Economy & Purchases
  const buyRobux = (amount: number, bonus: number = 0) => {
    const total = amount + bonus;
    sounds.playPurchase();
    confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    setUser(prev => ({
      ...prev,
      robux: prev.robux + total
    }));
    
    // Add notification
    const newNotif: UserNotification = {
      id: 'notif-buy-' + Date.now(),
      type: 'system',
      title: 'Robux Credited!',
      message: `Successfully added R$ ${total.toLocaleString()} to your account balance!`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const buyCatalogItem = (item: CatalogItem): { success: boolean; message: string } => {
    if (user.inventory.some(i => i.id === item.id)) {
      return { success: false, message: 'You already own this item!' };
    }
    if (user.robux < item.price) {
      return { success: false, message: 'Insufficient Robux balance. Buy more Robux to complete this purchase.' };
    }

    sounds.playPurchase();
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });

    setUser(prev => {
      const nextInv = [...prev.inventory, item];
      // Automatically equip if slot is empty or desirable
      const nextConfig = { ...prev.avatarConfig };
      if (item.type === 'hat') nextConfig.equippedHat = item;
      if (item.type === 'face') nextConfig.equippedFace = item;
      if (item.type === 'shirt') nextConfig.equippedShirt = item;
      if (item.type === 'pants') nextConfig.equippedPants = item;
      if (item.type === 'accessory' || item.type === 'gear') nextConfig.equippedAccessory = item;

      return {
        ...prev,
        robux: prev.robux - item.price,
        inventory: nextInv,
        avatarConfig: nextConfig
      };
    });

    return { success: true, message: `Successfully purchased "${item.name}"!` };
  };

  const buyGamePass = (gameId: string, passId: string): { success: boolean; message: string } => {
    const game = experiences.find(g => g.id === gameId);
    if (!game) return { success: false, message: 'Game not found' };
    const pass = game.gamepasses.find(p => p.id === passId);
    if (!pass) return { success: false, message: 'Game pass not found' };

    if (user.robux < pass.price) {
      return { success: false, message: 'Insufficient Robux to purchase this game pass!' };
    }

    sounds.playPurchase();
    setUser(prev => ({
      ...prev,
      robux: prev.robux - pass.price
    }));

    // Mark pass owned locally
    setExperiences(prev => prev.map(g => {
      if (g.id !== gameId) return g;
      return {
        ...g,
        gamepasses: g.gamepasses.map(p => p.id === passId ? { ...p, owned: true } : p)
      };
    }));

    return { success: true, message: `Purchased game pass "${pass.name}" for ${game.title}!` };
  };

  // Avatar customization
  const updateAvatarConfig = (updates: Partial<AvatarCustomization>) => {
    sounds.playClick();
    setUser(prev => ({
      ...prev,
      avatarConfig: { ...prev.avatarConfig, ...updates }
    }));
  };

  const equipItem = (item: CatalogItem) => {
    sounds.playClick();
    setUser(prev => {
      const config = { ...prev.avatarConfig };
      if (item.type === 'hat') config.equippedHat = item;
      if (item.type === 'face') config.equippedFace = item;
      if (item.type === 'shirt') config.equippedShirt = item;
      if (item.type === 'pants') config.equippedPants = item;
      if (item.type === 'accessory') config.equippedAccessory = item;
      if (item.type === 'gear') config.equippedGear = item;
      return { ...prev, avatarConfig: config };
    });
  };

  const unequipItem = (category: CatalogCategory) => {
    sounds.playClick();
    setUser(prev => {
      const config = { ...prev.avatarConfig };
      if (category === 'Hats') config.equippedHat = null;
      if (category === 'Faces') config.equippedFace = null;
      if (category === 'Shirts') config.equippedShirt = null;
      if (category === 'Pants') config.equippedPants = null;
      if (category === 'Accessories') config.equippedAccessory = null;
      if (category === 'Gear') config.equippedGear = null;
      return { ...prev, avatarConfig: config };
    });
  };

  // Game launch & playing
  const launchGame = (game: GameExperience) => {
    sounds.playClick();
    // Add to recent played games
    setUser(prev => ({
      ...prev,
      recentGameIds: [game.id, ...prev.recentGameIds.filter(id => id !== game.id)].slice(0, 8)
    }));
    setActivePlayingGame(game);
  };

  const closeGame = () => {
    sounds.playClick();
    setActivePlayingGame(null);
  };

  const toggleLikeGame = (gameId: string) => {
    sounds.playClick();
    setUser(prev => {
      const isLiked = prev.likedGameIds.includes(gameId);
      const isDisliked = prev.dislikedGameIds.includes(gameId);

      const nextLiked = isLiked 
        ? prev.likedGameIds.filter(id => id !== gameId)
        : [...prev.likedGameIds, gameId];
      const nextDisliked = isDisliked ? prev.dislikedGameIds.filter(id => id !== gameId) : prev.dislikedGameIds;

      setExperiences(expList => expList.map(g => {
        if (g.id !== gameId) return g;
        return {
          ...g,
          likes: isLiked ? g.likes - 1 : g.likes + 1,
          dislikes: isDisliked ? g.dislikes - 1 : g.dislikes
        };
      }));

      return {
        ...prev,
        likedGameIds: nextLiked,
        dislikedGameIds: nextDisliked
      };
    });
  };

  const toggleDislikeGame = (gameId: string) => {
    sounds.playClick();
    setUser(prev => {
      const isDisliked = prev.dislikedGameIds.includes(gameId);
      const isLiked = prev.likedGameIds.includes(gameId);

      const nextDisliked = isDisliked
        ? prev.dislikedGameIds.filter(id => id !== gameId)
        : [...prev.dislikedGameIds, gameId];
      const nextLiked = isLiked ? prev.likedGameIds.filter(id => id !== gameId) : prev.likedGameIds;

      setExperiences(expList => expList.map(g => {
        if (g.id !== gameId) return g;
        return {
          ...g,
          dislikes: isDisliked ? g.dislikes - 1 : g.dislikes + 1,
          likes: isLiked ? g.likes - 1 : g.likes
        };
      }));

      return {
        ...prev,
        dislikedGameIds: nextDisliked,
        likedGameIds: nextLiked
      };
    });
  };

  const toggleFavoriteGame = (gameId: string) => {
    sounds.playClick();
    setUser(prev => {
      const isFav = prev.favoriteGameIds.includes(gameId);
      return {
        ...prev,
        favoriteGameIds: isFav ? prev.favoriteGameIds.filter(id => id !== gameId) : [...prev.favoriteGameIds, gameId]
      };
    });
  };

  const awardBadgeToUser = (badgeName: string, icon: string, description: string) => {
    sounds.playBadgeUnlocked();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });

    const newBadge = {
      id: 'badge-' + Date.now(),
      name: badgeName,
      icon,
      description,
      rarity: 'Rare' as const,
      earned: true
    };

    setUser(prev => {
      if (prev.badges.some(b => b.name === badgeName)) return prev;
      return { ...prev, badges: [newBadge, ...prev.badges] };
    });

    const notif: UserNotification = {
      id: 'notif-badge-' + Date.now(),
      type: 'badge',
      title: 'Badge Unlocked!',
      message: `You earned the "${badgeName}" badge!`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const addCreatedGame = (newGameData: Omit<GameExperience, 'id' | 'creator' | 'likes' | 'dislikes' | 'visits' | 'ratingPercent' | 'gamepasses' | 'badges' | 'servers'>) => {
    sounds.playPurchase();
    const id = 'custom-' + Date.now();
    const newGame: GameExperience = {
      ...newGameData,
      id,
      creator: user.displayName,
      creatorVerified: false,
      likes: 1,
      dislikes: 0,
      visits: 1,
      ratingPercent: 100,
      gamepasses: [],
      badges: [{ id: 'b-' + id, name: 'First Visitor', description: 'Visited this world!', icon: '🌟', rarity: 'Common' }],
      servers: [{ id: 'srv-' + id, region: 'North America (Auto)', ping: 25, playersCount: 1, maxPlayers: 16 }]
    };

    setExperiences(prev => [newGame, ...prev]);
    setUser(prev => ({
      ...prev,
      createdGames: [newGame, ...prev.createdGames]
    }));
  };

  // Friends & Social
  const addFriendByUsername = (username: string): { success: boolean; message: string } => {
    sounds.playClick();
    const clean = username.trim().toLowerCase();
    if (!clean) return { success: false, message: 'Please enter a valid Roblox username.' };
    if (user.friends.some(f => f.username.toLowerCase() === clean)) {
      return { success: false, message: `You are already friends with @${clean}!` };
    }

    const newFriend: Friend = {
      id: 'u-' + Date.now(),
      username: clean,
      displayName: clean.charAt(0).toUpperCase() + clean.slice(1),
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      status: 'online',
      bio: 'Roblox player & world explorer.'
    };

    setUser(prev => ({ ...prev, friends: [newFriend, ...prev.friends] }));
    return { success: true, message: `Added @${clean} as your friend!` };
  };

  const removeFriend = (friendId: string) => {
    sounds.playClick();
    setUser(prev => ({
      ...prev,
      friends: prev.friends.filter(f => f.id !== friendId)
    }));
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    sounds.playClick();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const acceptFriendRequest = (notifId: string) => {
    sounds.playClick();
    const target = notifications.find(n => n.id === notifId);
    if (!target) return;
    markNotificationAsRead(notifId);

    // Add friend
    const newFriend: Friend = {
      id: 'u-req-' + Date.now(),
      username: 'GamerDave2026',
      displayName: 'Dave [Level Max]',
      avatarUrl: target.avatarUrl || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      status: 'online',
      bio: 'New friend from request.'
    };
    setUser(prev => ({
      ...prev,
      friends: [...prev.friends.filter(f => f.username !== 'GamerDave2026'), newFriend]
    }));
  };

  // Groups
  const joinGroup = (groupId: string) => {
    sounds.playClick();
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, isJoined: true, membersCount: g.membersCount + 1 } : g));
  };

  const leaveGroup = (groupId: string) => {
    sounds.playClick();
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, isJoined: false, membersCount: g.membersCount - 1 } : g));
  };

  const postGroupWall = (groupId: string, message: string) => {
    sounds.playClick();
    const safeContent = filterSafeText(message);
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      const newPost = {
        id: 'post-' + Date.now(),
        author: user.displayName,
        authorAvatar: user.avatarUrl,
        rank: 'Member',
        content: safeContent,
        timestamp: 'Just now'
      };
      return { ...g, wall: [newPost, ...g.wall] };
    }));
  };

  // Messages
  const sendMessage = (recipientId: string, recipientName: string, content: string) => {
    sounds.playClick();
    const safeContent = filterSafeText(content);
    const newMsg: DirectMessage = {
      id: 'msg-' + Date.now(),
      senderId: user.id,
      senderName: user.displayName,
      senderAvatar: user.avatarUrl,
      recipientId,
      content: safeContent,
      timestamp: 'Just now',
      read: true
    };
    setMessages(prev => [newMsg, ...prev]);

    // Simulate auto-reply from friend after 3 seconds for realistic feel
    setTimeout(() => {
      const replyMsg: DirectMessage = {
        id: 'msg-reply-' + Date.now(),
        senderId: recipientId,
        senderName: recipientName,
        senderAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        recipientId: user.id,
        content: `Got your message! Let's play some Roblox later today. 👍`,
        timestamp: 'Just now',
        read: false
      };
      setMessages(p => [replyMsg, ...p]);
    }, 2800);
  };

  // Trade
  const createTradeOffer = (
    partner: Friend, 
    yourItems: CatalogItem[], 
    theirItems: CatalogItem[], 
    yourRobux: number, 
    theirRobux: number
  ): { success: boolean; message: string } => {
    if (yourItems.length === 0 && yourRobux <= 0) {
      return { success: false, message: 'You must offer at least one item or Robux!' };
    }
    if (yourRobux > user.robux) {
      return { success: false, message: 'You do not have enough Robux to offer that amount.' };
    }

    sounds.playClick();
    const newTrade: TradeOffer = {
      id: 'trade-' + Date.now(),
      partnerId: partner.id,
      partnerName: partner.displayName,
      partnerAvatar: partner.avatarUrl,
      yourItems,
      theirItems,
      yourRobuxOffer: yourRobux,
      theirRobuxOffer: theirRobux,
      status: 'pending',
      timestamp: 'Just now'
    };

    setTrades(prev => [newTrade, ...prev]);
    return { success: true, message: `Trade offer successfully sent to ${partner.displayName}!` };
  };

  const acceptTradeOffer = (tradeId: string) => {
    sounds.playPurchase();
    setTrades(prev => prev.map(t => t.id === tradeId ? { ...t, status: 'accepted' } : t));
  };

  const declineTradeOffer = (tradeId: string) => {
    sounds.playClick();
    setTrades(prev => prev.map(t => t.id === tradeId ? { ...t, status: 'declined' } : t));
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <RobloxContext.Provider value={{
      currentTab,
      setCurrentTab,
      user,
      updateUserBio,
      updateStatusMessage,
      updateProfileDetails,
      theme,
      toggleTheme,
      soundEnabled,
      toggleSound,
      buyRobux,
      buyCatalogItem,
      buyGamePass,
      isRobuxModalOpen,
      setIsRobuxModalOpen,
      isSettingsModalOpen,
      setIsSettingsModalOpen,
      updateAvatarConfig,
      equipItem,
      unequipItem,
      experiences,
      selectedGame,
      setSelectedGame,
      activePlayingGame,
      launchGame,
      closeGame,
      toggleLikeGame,
      toggleDislikeGame,
      toggleFavoriteGame,
      awardBadgeToUser,
      addCreatedGame,
      searchQuery,
      setSearchQuery,
      searchCategory,
      setSearchCategory,
      friends: user.friends,
      addFriendByUsername,
      removeFriend,
      notifications,
      unreadNotifsCount,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      acceptFriendRequest,
      catalogItems: INITIAL_CATALOG_ITEMS,
      groups,
      joinGroup,
      leaveGroup,
      postGroupWall,
      messages,
      sendMessage,
      trades,
      createTradeOffer,
      acceptTradeOffer,
      declineTradeOffer,
      filterSafeText
    }}>
      {children}
    </RobloxContext.Provider>
  );
};

export const useRoblox = () => {
  const ctx = useContext(RobloxContext);
  if (!ctx) throw new Error('useRoblox must be used within a RobloxProvider');
  return ctx;
};
