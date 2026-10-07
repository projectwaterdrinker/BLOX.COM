export type GenreType = 
  | 'All' 
  | 'Roleplay' 
  | 'Adventure' 
  | 'Action' 
  | 'Simulator' 
  | 'Tycoon' 
  | 'Obstacle Course (Obby)' 
  | 'Horror' 
  | 'Survival' 
  | 'Sports';

export type CatalogCategory = 
  | 'All' 
  | 'Hats' 
  | 'Faces' 
  | 'Shirts' 
  | 'Pants' 
  | 'Accessories' 
  | 'Gear' 
  | 'Animations';

export interface GamePass {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: string;
  owned?: boolean;
}

export interface GameBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Impossible';
  earned?: boolean;
}

export interface GameServer {
  id: string;
  region: string;
  ping: number;
  playersCount: number;
  maxPlayers: number;
  friendsInServer?: string[];
}

export interface GameExperience {
  id: string;
  title: string;
  creator: string;
  creatorVerified?: boolean;
  thumbnail: string;
  banner: string;
  activePlayers: number;
  likes: number;
  dislikes: number;
  visits: number;
  genre: GenreType;
  description: string;
  ratingPercent: number;
  isFeatured?: boolean;
  gamepasses: GamePass[];
  badges: GameBadge[];
  servers: GameServer[];
  modeType?: 'obby' | 'rpg' | 'survival' | 'city';
}

export interface CatalogItem {
  id: string;
  name: string;
  creator: string;
  category: CatalogCategory;
  price: number; // 0 for free
  isLimited?: boolean;
  originalPrice?: number;
  thumbnail: string;
  colorHex?: string;
  description: string;
  type: 'hat' | 'face' | 'shirt' | 'pants' | 'accessory' | 'gear' | 'animation';
  rarity?: 'Standard' | 'Rare' | 'Legendary' | 'Limited U';
}

export interface Friend {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  status: 'online' | 'offline' | 'ingame';
  currentGameTitle?: string;
  currentGameId?: string;
  lastSeen?: string;
  bio?: string;
}

export interface UserNotification {
  id: string;
  type: 'friend_request' | 'trade' | 'badge' | 'game_update' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  avatarUrl?: string;
  actionUrl?: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface GroupWallPost {
  id: string;
  author: string;
  authorAvatar: string;
  rank: string;
  content: string;
  timestamp: string;
}

export interface RobloxGroup {
  id: string;
  name: string;
  emblem: string;
  owner: string;
  membersCount: number;
  description: string;
  shout?: {
    author: string;
    text: string;
    date: string;
  };
  isJoined?: boolean;
  wall: GroupWallPost[];
}

export interface TradeOffer {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  yourItems: CatalogItem[];
  theirItems: CatalogItem[];
  yourRobuxOffer: number;
  theirRobuxOffer: number;
  status: 'pending' | 'accepted' | 'declined' | 'countered';
  timestamp: string;
}

export interface AvatarCustomization {
  skinColor: string; // hex
  headColor?: string;
  torsoColor?: string;
  leftArmColor?: string;
  rightArmColor?: string;
  leftLegColor?: string;
  rightLegColor?: string;
  equippedHat?: CatalogItem | null;
  equippedFace?: CatalogItem | null;
  equippedShirt?: CatalogItem | null;
  equippedPants?: CatalogItem | null;
  equippedAccessory?: CatalogItem | null;
  equippedGear?: CatalogItem | null;
  scaleHeight: number; // 0.9 to 1.15
  scaleWidth: number; // 0.85 to 1.15
  scaleHead: number; // 0.9 to 1.1
  bodyType: 'R6' | 'R15';
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  robux: number;
  bio: string;
  statusMessage: string;
  joinDate: string;
  avatarConfig: AvatarCustomization;
  inventory: CatalogItem[];
  badges: GameBadge[];
  favoriteGameIds: string[];
  likedGameIds: string[];
  dislikedGameIds: string[];
  recentGameIds: string[];
  friends: Friend[];
  createdGames: GameExperience[];
  theme: 'dark' | 'light';
  safeChatEnabled: boolean;
  accountPinEnabled: boolean;
}
