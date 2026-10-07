import { GameExperience, CatalogItem, Friend, RobloxGroup, UserNotification, UserProfile } from '../types/roblox';

export const INITIAL_EXPERIENCES: GameExperience[] = [
  {
    id: 'blox-fruits',
    title: 'Blox Fruits [UPDATE 24]',
    creator: 'Gamer Robot Inc',
    creatorVerified: true,
    thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    activePlayers: 412580,
    likes: 6850400,
    dislikes: 421000,
    visits: 34120500120,
    genre: 'Adventure',
    description: 'Welcome to Blox Fruits! Become a master swordsman or a powerful blox fruit user as you train to become the strongest player to ever live. You can choose to fight against tough enemies or have powerful boss battles while sailing across the ocean to find hidden secrets.',
    ratingPercent: 94,
    isFeatured: true,
    modeType: 'rpg',
    gamepasses: [
      { id: 'gp-bf-1', name: '2x Mastery', price: 450, description: 'Earn double weapon and fruit mastery from all combat.', icon: '⚡' },
      { id: 'gp-bf-2', name: 'Dark Blade (Yoru)', price: 1200, description: 'Unlock the legendary mythical sword with unmatched slicing range.', icon: '🗡️' },
      { id: 'gp-bf-3', name: 'Fast Boats', price: 350, description: 'Travel the high seas at triple turbo speed.', icon: '⛵' }
    ],
    badges: [
      { id: 'b-bf-1', name: 'Sea Explorer', description: 'Reached the Second Sea after defeating the Swan boss.', icon: '🌊', rarity: 'Rare' },
      { id: 'b-bf-2', name: 'Fruit Awakening', description: 'Fully awakened a devil fruit in the raid chamber.', icon: '🔥', rarity: 'Impossible' }
    ],
    servers: [
      { id: 'srv-bf-us1', region: 'North America (East)', ping: 28, playersCount: 11, maxPlayers: 12, friendsInServer: ['GamerDave'] },
      { id: 'srv-bf-eu1', region: 'Europe (London)', ping: 45, playersCount: 12, maxPlayers: 12 },
      { id: 'srv-bf-ap1', region: 'Asia (Tokyo)', ping: 110, playersCount: 8, maxPlayers: 12 }
    ]
  },
  {
    id: 'brookhaven-rp',
    title: 'Brookhaven 🏡RP',
    creator: 'Wolfpaq',
    creatorVerified: true,
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
    activePlayers: 384190,
    likes: 4950100,
    dislikes: 580000,
    visits: 51200100400,
    genre: 'Roleplay',
    description: 'A place to hang out with like-minded people and roleplay. Own and live in amazing houses, drive cool vehicles, and explore the bustling city of Brookhaven.',
    ratingPercent: 90,
    isFeatured: true,
    modeType: 'city',
    gamepasses: [
      { id: 'gp-bh-1', name: 'Penthouse Mansions', price: 500, description: 'Access luxury villas with helicopter landing pads and pools.', icon: '🏰' },
      { id: 'gp-bh-2', name: 'Super Sports Cars', price: 650, description: 'Drive hypercars with turbo nitroboost.', icon: '🏎️' },
      { id: 'gp-bh-3', name: 'Estate Fireplace & Pools', price: 200, description: 'Custom landscaping tools for your lot.', icon: '🏊' }
    ],
    badges: [
      { id: 'b-bh-1', name: 'Citizen of Brookhaven', description: 'Explored all town secrets, the bank vault, and police station.', icon: '🏙️', rarity: 'Common' }
    ],
    servers: [
      { id: 'srv-bh-1', region: 'North America (West)', ping: 22, playersCount: 18, maxPlayers: 20, friendsInServer: ['PixelQueen'] },
      { id: 'srv-bh-2', region: 'North America (Central)', ping: 34, playersCount: 19, maxPlayers: 20 }
    ]
  },
  {
    id: 'tower-of-hell',
    title: 'Tower of Hell ⏱️',
    creator: 'YXCeptional Studios',
    creatorVerified: true,
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
    activePlayers: 94820,
    likes: 3120000,
    dislikes: 540000,
    visits: 21890000000,
    genre: 'Obstacle Course (Obby)',
    description: 'Reach the top of the randomly generated tower before the timer runs out! No checkpoints, high stakes, pure parkour skill.',
    ratingPercent: 85,
    isFeatured: false,
    modeType: 'obby',
    gamepasses: [
      { id: 'gp-toh-1', name: 'Speed Coil', price: 300, description: 'Run 1.5x faster across obstacle beams.', icon: '🌀' },
      { id: 'gp-toh-2', name: 'Gravity Coil', price: 350, description: 'Jump higher with reduced gravity float.', icon: '🪶' },
      { id: 'gp-toh-3', name: 'Hourglass (Timer Freeze)', price: 600, description: 'Freeze stage timer for 30 seconds.', icon: '⏳' }
    ],
    badges: [
      { id: 'b-toh-1', name: 'Top of the Tower', description: 'Reached the golden halo vault on the 6th section without falling.', icon: '👑', rarity: 'Rare' }
    ],
    servers: [
      { id: 'srv-toh-1', region: 'North America (East)', ping: 31, playersCount: 15, maxPlayers: 20 }
    ]
  },
  {
    id: 'natural-disaster-survival',
    title: 'Natural Disaster Survival 🌪️',
    creator: 'Stickmasterluke',
    creatorVerified: true,
    thumbnail: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80',
    activePlayers: 48900,
    likes: 2750000,
    dislikes: 198000,
    visits: 18500200100,
    genre: 'Survival',
    description: 'Quickly run for shelter as tornadoes, tsunamis, acid rain, volcanic eruptions, and earthquakes strike the elevated island map! Classic physics mayhem.',
    ratingPercent: 93,
    isFeatured: false,
    modeType: 'survival',
    gamepasses: [
      { id: 'gp-nds-1', name: 'Green Balloon', price: 80, description: 'Slow your descent when blown off rooftops.', icon: '🎈' },
      { id: 'gp-nds-2', name: 'Disaster Radar', price: 100, description: 'Discover which disaster is spawning 10s early.', icon: '📡' },
      { id: 'gp-nds-3', name: 'Apple of Health', price: 80, description: 'Bite into a rejuvenating apple to regenerate HP.', icon: '🍎' }
    ],
    badges: [
      { id: 'b-nds-1', name: 'Disaster Champion', description: 'Survive 5 consecutive natural disasters without taking damage.', icon: '🏆', rarity: 'Rare' }
    ],
    servers: [
      { id: 'srv-nds-1', region: 'North America (Central)', ping: 29, playersCount: 24, maxPlayers: 30, friendsInServer: ['Stickmasterluke'] }
    ]
  },
  {
    id: 'blade-ball',
    title: 'Blade Ball ⚔️ [CLANS]',
    creator: 'Wiggity.',
    creatorVerified: true,
    thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
    activePlayers: 114300,
    likes: 3820000,
    dislikes: 260000,
    visits: 12400190000,
    genre: 'Action',
    description: 'A focus and timing deflection game where a homing deflecting ball targets players with accelerating velocity. Deflect with your blade, use unique abilities, and win rounds!',
    ratingPercent: 93,
    isFeatured: true,
    modeType: 'rpg',
    gamepasses: [
      { id: 'gp-bb-1', name: 'VIP Pass & Exclusive Sword', price: 399, description: 'VIP tag, 2x coins, and Chrome Katana.', icon: '💎' },
      { id: 'gp-bb-2', name: 'Shadow Step Ability', price: 599, description: 'Instantly teleport behind opponents.', icon: '👥' }
    ],
    badges: [
      { id: 'b-bb-1', name: 'Ultimate Deflector', description: 'Deflected a ball travelling over 200 MPH.', icon: '⚡', rarity: 'Rare' }
    ],
    servers: [
      { id: 'srv-bb-1', region: 'North America (East)', ping: 19, playersCount: 16, maxPlayers: 18 }
    ]
  },
  {
    id: 'the-hunt-2026',
    title: 'The Hunt: First Edition 🌀 [MEGA EVENT]',
    creator: 'Roblox Events',
    creatorVerified: true,
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    activePlayers: 520000,
    likes: 8900000,
    dislikes: 310000,
    visits: 45000000000,
    genre: 'Adventure',
    description: 'Enter the infinite multiverse portal vault! Complete quests across the top 100 Roblox experiences to earn limited Vault Badges, exclusive ugc items, and the Grand Infinite Crown.',
    ratingPercent: 96,
    isFeatured: true,
    modeType: 'obby',
    gamepasses: [
      { id: 'gp-hunt-1', name: 'Infinite Compass Tracker', price: 250, description: 'Instantly highlight hidden portal tokens.', icon: '🧭' }
    ],
    badges: [
      { id: 'b-hunt-1', name: 'Vault Keymaster', description: 'Unlocked the golden vault door in The Hunt.', icon: '🗝️', rarity: 'Impossible', earned: true }
    ],
    servers: [
      { id: 'srv-hunt-1', region: 'Global Low-Latency', ping: 15, playersCount: 30, maxPlayers: 50, friendsInServer: ['Builderman'] }
    ]
  },
  {
    id: 'dress-to-impress',
    title: 'Dress To Impress 💅 [SUMMER GLAM]',
    creator: 'DTI Group',
    creatorVerified: true,
    thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&auto=format&fit=crop&q=80',
    activePlayers: 132400,
    likes: 4120000,
    dislikes: 210000,
    visits: 9800000000,
    genre: 'Roleplay',
    description: 'Style your fashion outfit according to round themes! Walk the runway, strike poses, and rate other models to earn stars and climb the Top Model hierarchy.',
    ratingPercent: 95,
    isFeatured: true,
    modeType: 'city',
    gamepasses: [
      { id: 'gp-dti-1', name: 'VIP Fashion Closet', price: 799, description: 'Exclusive mermaid dresses, tiaras, and shoes.', icon: '✨' },
      { id: 'gp-dti-2', name: 'Custom Makeup Palette', price: 349, description: 'Unlock limitless makeup and lip gloss shades.', icon: '💄' }
    ],
    badges: [
      { id: 'b-dti-1', name: 'Runway Queen', description: 'Won 1st place on the runway 10 times.', icon: '👑', rarity: 'Rare' }
    ],
    servers: [
      { id: 'srv-dti-1', region: 'Europe (Frankfurt)', ping: 38, playersCount: 12, maxPlayers: 16 }
    ]
  },
  {
    id: 'theme-park-tycoon-2',
    title: 'Theme Park Tycoon 2 🎢',
    creator: 'Den_S',
    creatorVerified: true,
    thumbnail: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=600&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1502136969935-8d8eef54d77b?w=1200&auto=format&fit=crop&q=80',
    activePlayers: 26800,
    likes: 2100000,
    dislikes: 72000,
    visits: 4200000000,
    genre: 'Tycoon',
    description: 'Build and operate your very own amusement park! Construct custom roller coasters with loop-de-loops, stalls, scenery, and attract millions of visitors.',
    ratingPercent: 97,
    isFeatured: false,
    modeType: 'city',
    gamepasses: [
      { id: 'gp-tpt-1', name: 'Disable Collisions', price: 350, description: 'Place rides and custom scenery closer together.', icon: '📐' }
    ],
    badges: [
      { id: 'b-tpt-1', name: 'Five Star Resort', description: 'Achieved a complete 5.0 park rating from NPC visitors.', icon: '⭐', rarity: 'Rare' }
    ],
    servers: [
      { id: 'srv-tpt-1', region: 'North America (Central)', ping: 30, playersCount: 5, maxPlayers: 6 }
    ]
  }
];

export const INITIAL_CATALOG_ITEMS: CatalogItem[] = [
  {
    id: 'hat-valk',
    name: 'Valkyrie Helm',
    creator: 'Roblox',
    category: 'Hats',
    type: 'hat',
    price: 50000,
    isLimited: true,
    thumbnail: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=300&auto=format&fit=crop&q=80',
    colorHex: '#38bdf8',
    description: 'Straight from the halls of Valhalla. An angelic helm for the truest Roblox champions.',
    rarity: 'Limited U'
  },
  {
    id: 'hat-dominus',
    name: 'Dominus Aureus',
    creator: 'Roblox',
    category: 'Hats',
    type: 'hat',
    price: 125000,
    isLimited: true,
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80',
    colorHex: '#f59e0b',
    description: 'The pure golden aura of absolute prestige and royalty.',
    rarity: 'Limited U'
  },
  {
    id: 'hat-fedora',
    name: 'Classic Black Fedora',
    creator: 'Roblox',
    category: 'Hats',
    type: 'hat',
    price: 250,
    thumbnail: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=300&auto=format&fit=crop&q=80',
    colorHex: '#1e293b',
    description: 'A timeless gentleman brim fedora with a smooth red ribbon band.',
    rarity: 'Standard'
  },
  {
    id: 'hat-clockwork',
    name: 'Clockwork Headphones',
    creator: 'Roblox',
    category: 'Hats',
    type: 'hat',
    price: 8500,
    isLimited: true,
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80',
    colorHex: '#0284c7',
    description: 'Listen to the ticking beats of time with polished brass cog gears.',
    rarity: 'Rare'
  },
  {
    id: 'face-epic',
    name: 'Epic Face',
    creator: 'Roblox',
    category: 'Faces',
    type: 'face',
    price: 1500,
    thumbnail: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=300&auto=format&fit=crop&q=80',
    colorHex: '#facc15',
    description: 'The most legendary meme face in platform history. :D',
    rarity: 'Rare'
  },
  {
    id: 'face-chill',
    name: 'Chill Face',
    creator: 'Roblox',
    category: 'Faces',
    type: 'face',
    price: 0,
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    colorHex: '#64748b',
    description: 'Just kicking back and taking life one block at a time.',
    rarity: 'Standard'
  },
  {
    id: 'face-super-happy',
    name: 'Super Super Happy Face',
    creator: 'Roblox',
    category: 'Faces',
    type: 'face',
    price: 18000,
    isLimited: true,
    thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    colorHex: '#f43f5e',
    description: 'Pure joy and smiling delight.',
    rarity: 'Limited U'
  },
  {
    id: 'shirt-neon',
    name: 'Cyberpunk Neon Matrix Jacket',
    creator: 'KronoClothing',
    category: 'Shirts',
    type: 'shirt',
    price: 5,
    thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&auto=format&fit=crop&q=80',
    colorHex: '#06b6d4',
    description: 'Glow in dark cyan neon circuitry with matching tactical zippers.',
    rarity: 'Standard'
  },
  {
    id: 'shirt-retro',
    name: 'Classic 2007 Roblox Blue Shirt',
    creator: 'Roblox',
    category: 'Shirts',
    type: 'shirt',
    price: 0,
    thumbnail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80',
    colorHex: '#2563eb',
    description: 'The nostalgic vintage blue tee with classic chest emblem.',
    rarity: 'Standard'
  },
  {
    id: 'pants-dark',
    name: 'Black Combat Cargo Trousers',
    creator: 'StreetStyleUGC',
    category: 'Pants',
    type: 'pants',
    price: 5,
    thumbnail: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=300&auto=format&fit=crop&q=80',
    colorHex: '#18181b',
    description: 'Stealth combat trousers with strapped knee buckles and kicks.',
    rarity: 'Standard'
  },
  {
    id: 'acc-wings',
    name: 'Sparkle Time Wings',
    creator: 'Roblox',
    category: 'Accessories',
    type: 'accessory',
    price: 15000,
    isLimited: true,
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
    colorHex: '#8b5cf6',
    description: 'Enchanted amethyst wings infused with twinkling sparkles.',
    rarity: 'Legendary'
  },
  {
    id: 'acc-katana',
    name: 'Golden Katana of Light',
    creator: 'SwordMasterUGC',
    category: 'Gear',
    type: 'gear',
    price: 850,
    thumbnail: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=300&auto=format&fit=crop&q=80',
    colorHex: '#eab308',
    description: 'Wearable back sheathed katana forged from pure sunlight.',
    rarity: 'Rare'
  },
  {
    id: 'anim-levitation',
    name: 'Levitation Animation Pack',
    creator: 'Roblox',
    category: 'Animations',
    type: 'animation',
    price: 1000,
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
    colorHex: '#a855f7',
    description: 'Float seamlessly above the ground with effortless mystical power.',
    rarity: 'Rare'
  }
];

export const INITIAL_FRIENDS: Friend[] = [
  {
    id: 'u-builderman',
    username: 'Builderman',
    displayName: 'Builderman',
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    status: 'ingame',
    currentGameTitle: 'The Hunt: First Edition 🌀',
    currentGameId: 'the-hunt-2026',
    bio: 'Welcome to Roblox! Always building new worlds.'
  },
  {
    id: 'u-stickmaster',
    username: 'Stickmasterluke',
    displayName: 'Luke',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    status: 'ingame',
    currentGameTitle: 'Natural Disaster Survival 🌪️',
    currentGameId: 'natural-disaster-survival',
    bio: 'Creator of Natural Disaster Survival. Beware of the meteorites!'
  },
  {
    id: 'u-gamerdave',
    username: 'GamerDave2026',
    displayName: 'Dave [Level Max]',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    status: 'ingame',
    currentGameTitle: 'Blox Fruits [UPDATE 24]',
    currentGameId: 'blox-fruits',
    bio: 'Bounty hunting in Third Sea. Trade with me!'
  },
  {
    id: 'u-pixelqueen',
    username: 'PixelQueenX',
    displayName: 'Chloe ✨',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    bio: 'Styling fits in Dress To Impress 💅. DMs open!'
  },
  {
    id: 'u-shadowblox',
    username: 'ShadowBlox99',
    displayName: 'Alex',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'offline',
    lastSeen: '2 hours ago',
    bio: 'Tower of Hell speedrunner. Sub 1:15 record.'
  }
];

export const INITIAL_NOTIFICATIONS: UserNotification[] = [
  {
    id: 'notif-1',
    type: 'badge',
    title: 'Badge Unlocked!',
    message: 'You earned the "Vault Keymaster" badge in The Hunt: First Edition!',
    timestamp: '10m ago',
    read: false,
    avatarUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'notif-2',
    type: 'friend_request',
    title: 'Friend Request',
    message: 'GamerDave2026 sent you a friend request.',
    timestamp: '1h ago',
    read: false,
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'notif-3',
    type: 'trade',
    title: 'Trade Offer Received',
    message: 'Stickmasterluke offered Classic Fedora for your Sparkle Time Wings.',
    timestamp: '5h ago',
    read: true,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'notif-4',
    type: 'game_update',
    title: 'Game Update: Blox Fruits',
    message: 'Update 24 is live! New fruit awakenings and weapons added.',
    timestamp: '1d ago',
    read: true
  }
];

export const INITIAL_GROUPS: RobloxGroup[] = [
  {
    id: 'grp-blox-studio',
    name: 'Blox Studio Official',
    emblem: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    owner: 'Roblox Admin',
    membersCount: 1420500,
    description: 'The central gathering ground for all developers, builders, scripters, and 3D modellers creating the future of Roblox!',
    shout: {
      author: 'Builderman',
      text: 'Summer Creator Jam registration is now open! Check out the developer forum.',
      date: 'Today at 10:15 AM'
    },
    isJoined: true,
    wall: [
      { id: 'w-1', author: 'GamerDave2026', authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80', rank: 'Member', content: 'Hyped for the new physics engine update! Anyone testing on studio?', timestamp: '30m ago' },
      { id: 'w-2', author: 'PixelQueenX', authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', rank: 'VIP Builder', content: 'Just released my new avatar hat pack! Check it out in Marketplace.', timestamp: '2h ago' }
    ]
  },
  {
    id: 'grp-redcliff',
    name: 'Knights of the Redcliff',
    emblem: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=300&auto=format&fit=crop&q=80',
    owner: 'Redcliff Commander',
    membersCount: 890400,
    description: 'Valiant defenders of peace across Robloxia. Honor, bravery, and chivalry.',
    shout: {
      author: 'Grand Master',
      text: 'Training rally this Friday in Redcliff Fortress server!',
      date: 'Yesterday'
    },
    isJoined: false,
    wall: [
      { id: 'w-3', author: 'SirGalahad', authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', rank: 'Knight Captain', content: 'Stand strong against the Korblox invaders!', timestamp: '4h ago' }
    ]
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'u-current-player',
  username: 'Robloxian_2026',
  displayName: 'Robloxian',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
  robux: 1250,
  bio: 'Hey! Welcome to my profile. I love playing Tower of Hell, exploring Blox Fruits, and creating custom obby games in Roblox Studio. Feel free to join my game!',
  statusMessage: 'Chilling in Brookhaven 🏡 and earning badges!',
  joinDate: 'March 2021',
  avatarConfig: {
    skinColor: '#facc15', // Classic pastel yellow
    headColor: '#facc15',
    torsoColor: '#0284c7', // Bright blue
    leftArmColor: '#facc15',
    rightArmColor: '#facc15',
    leftLegColor: '#16a34a', // Bright green
    rightLegColor: '#16a34a',
    equippedHat: INITIAL_CATALOG_ITEMS[2], // Classic Fedora
    equippedFace: INITIAL_CATALOG_ITEMS[4], // Epic Face
    equippedShirt: INITIAL_CATALOG_ITEMS[8], // Retro Blue Shirt
    equippedPants: INITIAL_CATALOG_ITEMS[9], // Combat cargo pants
    equippedAccessory: INITIAL_CATALOG_ITEMS[11], // Golden Katana
    equippedGear: null,
    scaleHeight: 1.0,
    scaleWidth: 1.0,
    scaleHead: 1.0,
    bodyType: 'R6'
  },
  inventory: [
    INITIAL_CATALOG_ITEMS[2],
    INITIAL_CATALOG_ITEMS[4],
    INITIAL_CATALOG_ITEMS[8],
    INITIAL_CATALOG_ITEMS[9],
    INITIAL_CATALOG_ITEMS[11],
    INITIAL_CATALOG_ITEMS[5], // Chill face
    INITIAL_CATALOG_ITEMS[7]  // Cyberpunk jacket
  ],
  badges: [
    { id: 'b-hunt-1', name: 'Vault Keymaster', description: 'Unlocked the golden vault door in The Hunt.', icon: '🗝️', rarity: 'Impossible', earned: true },
    { id: 'b-bh-1', name: 'Citizen of Brookhaven', description: 'Explored all town secrets.', icon: '🏙️', rarity: 'Common', earned: true },
    { id: 'b-veteran', name: '3 Year Veteran', description: 'Been an active member of Roblox for over 3 years.', icon: '🎖️', rarity: 'Rare', earned: true },
    { id: 'b-builder', name: 'Master Builder', description: 'Created an experience that was visited by over 100 players.', icon: '🔨', rarity: 'Rare', earned: true }
  ],
  favoriteGameIds: ['blox-fruits', 'the-hunt-2026', 'tower-of-hell'],
  likedGameIds: ['blox-fruits', 'the-hunt-2026'],
  dislikedGameIds: [],
  recentGameIds: ['the-hunt-2026', 'blox-fruits', 'tower-of-hell', 'brookhaven-rp'],
  friends: INITIAL_FRIENDS,
  createdGames: [
    {
      id: 'my-super-obby',
      title: 'Mega Rainbow Obby [100 STAGES]',
      creator: 'Robloxian_2026',
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
      activePlayers: 42,
      likes: 850,
      dislikes: 12,
      visits: 12400,
      genre: 'Obstacle Course (Obby)',
      description: 'Run, jump, and navigate through 100 vibrant rainbow obstacle stages! Checkpoints at every stage.',
      ratingPercent: 98,
      modeType: 'obby',
      gamepasses: [],
      badges: [],
      servers: []
    }
  ],
  theme: 'dark',
  safeChatEnabled: true,
  accountPinEnabled: false
};
