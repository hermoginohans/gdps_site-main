import { 
  Game, 
  PaymentMethod, 
  Voucher, 
  AuctionItem, 
  ShopProduct, 
  BlogPost, 
  Order 
} from '../types';
import { assetUrl } from '../utils/assets';

export const GAMES: Game[] = [
  {
    id: 'mobile-legends',
    slug: 'mobile-legends',
    name: 'Mobile Legends: Bang Bang PH',
    publisher: 'Moonton Games',
    category: 'Trending Games',
    platform: ['Mobile'],
    rating: 5.0,
    reviewsCount: 27240,
    discountBadge: '25% OFF',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
    description: 'Top up Mobile Legends in the Philippines and save up to 25% on MLBB diamonds. Pay with GCash, Maya, GrabPay, QRPH, cards, PayPal, Wise, or USDT. Delivered in 1–5 minutes.',
    deliveryTime: '1 - 5 mins',
    requiresServerId: true,
    idLabel: 'User ID',
    serverIdLabel: 'Zone ID',
    idPlaceholder: 'e.g. 123456789',
    serverIdPlaceholder: 'e.g. 1234',
    guideTitle: 'How to find your Mobile Legends User ID & Zone ID',
    guideInstructions: [
      'Open Mobile Legends: Bang Bang on your device.',
      'Tap on your profile avatar at the top left corner of the main lobby.',
      'Your User ID and Zone ID are displayed under your nickname: 123456789 (1234).',
      'The 9-digit number is your User ID, and the 4-digit number inside the parentheses is your Zone ID.'
    ],
    tags: ['Instant', 'GCash', 'Maya', 'MOBA', 'Diamond Pass'],
    isTrending: true,
    denominations: [
      { id: 'ml_pass_weekly', name: 'Weekly Diamond Pass', amount: 220, bonus: 0, pricePhp: 95, originalPricePhp: 125, isPopular: true, category: 'Passes' },
      { id: 'ml_pass_twilight', name: 'Twilight Pass', amount: 500, bonus: 0, pricePhp: 485, originalPricePhp: 550, category: 'Passes' },
      { id: 'ml_50', name: '50 Diamonds (+5 Bonus)', amount: 50, bonus: 5, pricePhp: 48, originalPricePhp: 55, category: 'Diamonds' },
      { id: 'ml_100', name: '100 Diamonds (+12 Bonus)', amount: 100, bonus: 12, pricePhp: 95, originalPricePhp: 110, isPopular: true, category: 'Diamonds' },
      { id: 'ml_250', name: '250 Diamonds (+30 Bonus)', amount: 250, bonus: 30, pricePhp: 235, originalPricePhp: 275, category: 'Diamonds' },
      { id: 'ml_500', name: '500 Diamonds (+65 Bonus)', amount: 500, bonus: 65, pricePhp: 465, originalPricePhp: 550, isPopular: true, category: 'Diamonds' },
      { id: 'ml_1000', name: '1,000 Diamonds (+150 Bonus)', amount: 1000, bonus: 150, pricePhp: 915, originalPricePhp: 1100, category: 'Diamonds' },
      { id: 'ml_2000', name: '2,000 Diamonds (+350 Bonus)', amount: 2000, bonus: 350, pricePhp: 1820, originalPricePhp: 2200, category: 'Diamonds' },
      { id: 'ml_5000', name: '5,000 Diamonds (+1,000 Bonus)', amount: 5000, bonus: 1000, pricePhp: 4499, originalPricePhp: 5500, isPopular: true, category: 'Diamonds' },
    ]
  },
  {
    id: 'honor-of-kings',
    slug: 'honor-of-kings',
    name: 'Honor of Kings (HoK)',
    publisher: 'Tencent / Level Infinite',
    category: 'Trending Games',
    platform: ['Mobile'],
    rating: 5.0,
    reviewsCount: 3285,
    discountBadge: '10% OFF',
    image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=500&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80',
    description: 'Top up Honor of Kings (HoK) Tokens in the Philippines at GPDS Game Shop. Save up to 10% off official prices, pay with GCash, Maya, or QRPH, and receive tokens in 1–5 minutes.',
    deliveryTime: '1 - 5 mins',
    requiresServerId: true,
    idLabel: 'Player ID (UID)',
    serverIdLabel: 'Server Name',
    idPlaceholder: 'e.g. 89201948',
    serverIdPlaceholder: 'e.g. Global Server 1',
    guideTitle: 'Where to locate your Honor of Kings Player ID',
    guideInstructions: [
      'Launch Honor of Kings on iOS or Android.',
      'Tap your user avatar in the upper left corner of the home screen.',
      'Switch to the "Personal Info" or "Basic Info" tab.',
      'Locate your Player ID numeric string and tap the copy icon.'
    ],
    tags: ['Instant', 'Tokens', 'Level Infinite', 'MOBA'],
    isTrending: true,
    denominations: [
      { id: 'hok_80', name: '80 Tokens (+8 Bonus)', amount: 80, bonus: 8, pricePhp: 55, originalPricePhp: 65, category: 'Diamonds' },
      { id: 'hok_240', name: '240 Tokens (+25 Bonus)', amount: 240, bonus: 25, pricePhp: 165, originalPricePhp: 190, isPopular: true, category: 'Diamonds' },
      { id: 'hok_400', name: '400 Tokens (+45 Bonus)', amount: 400, bonus: 45, pricePhp: 270, originalPricePhp: 310, category: 'Diamonds' },
      { id: 'hok_800', name: '800 Tokens (+100 Bonus)', amount: 800, bonus: 100, pricePhp: 540, originalPricePhp: 620, isPopular: true, category: 'Diamonds' },
      { id: 'hok_1200', name: '1,200 Tokens (+180 Bonus)', amount: 1200, bonus: 180, pricePhp: 799, originalPricePhp: 930, category: 'Diamonds' },
      { id: 'hok_2400', name: '2,400 Tokens (+400 Bonus)', amount: 2400, bonus: 400, pricePhp: 1590, originalPricePhp: 1850, category: 'Diamonds' },
      { id: 'hok_weekly_pass', name: 'Weekly Glory Pass', amount: 300, bonus: 0, pricePhp: 99, originalPricePhp: 120, isPopular: true, category: 'Passes' }
    ]
  },
  {
    id: 'valorant',
    slug: 'valorant',
    name: 'Valorant (Riot Points PH)',
    publisher: 'Riot Games',
    category: 'PC Games',
    platform: ['PC'],
    rating: 5.0,
    reviewsCount: 5760,
    discountBadge: '5% OFF',
    image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=500&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    description: 'Buy Valorant Points (VP) in the Philippines at GPDS Game Shop with discounted PHP pricing. VP is credited directly using your Riot ID and Tagline.',
    deliveryTime: '1 - 5 mins',
    requiresServerId: false,
    idLabel: 'Riot ID + Tagline',
    idPlaceholder: 'e.g. Phoenix#PH1',
    guideTitle: 'How to find your Riot ID & Tagline',
    guideInstructions: [
      'Log into the Riot Client or Valorant.',
      'Hover over your friend card or open the Settings menu.',
      'Your Riot ID consists of your Game Name followed by the hashtag (#) and your Tagline.'
    ],
    tags: ['Instant', 'Riot Games', 'Tactical FPS', 'VP'],
    isTrending: true,
    denominations: [
      { id: 'val_475', name: '475 Valorant Points', amount: 475, pricePhp: 190, originalPricePhp: 200, category: 'Diamonds' },
      { id: 'val_1000', name: '1,000 Valorant Points', amount: 1000, pricePhp: 380, originalPricePhp: 400, isPopular: true, category: 'Diamonds' },
      { id: 'val_2050', name: '2,050 Valorant Points', amount: 2050, pricePhp: 760, originalPricePhp: 800, category: 'Diamonds' },
      { id: 'val_3650', name: '3,650 Valorant Points', amount: 3650, pricePhp: 1330, originalPricePhp: 1400, isPopular: true, category: 'Diamonds' },
      { id: 'val_5350', name: '5,350 Valorant Points', amount: 5350, pricePhp: 1900, originalPricePhp: 2000, isPopular: true, category: 'Diamonds' },
      { id: 'val_11000', name: '11,000 Valorant Points', amount: 11000, pricePhp: 3800, originalPricePhp: 4000, category: 'Diamonds' }
    ]
  },
  {
    id: 'blood-strike',
    slug: 'blood-strike',
    name: 'Blood Strike Top-up',
    publisher: 'NetEase Games',
    category: 'Trending Games',
    platform: ['Mobile', 'PC'],
    rating: 5.0,
    reviewsCount: 1900,
    discountBadge: '15% OFF',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    description: 'Buy cheap Blood Strike Gold in the Philippines at GPDS Game Shop. User ID top-up for Elite Strike Pass, S-tier Strikers, and Mythic skins.',
    deliveryTime: '1 - 5 mins',
    requiresServerId: false,
    idLabel: 'User ID (UID)',
    idPlaceholder: 'e.g. 849201948',
    guideTitle: 'Find your Blood Strike User ID',
    guideInstructions: [
      'Open Blood Strike and tap your avatar icon in the lobby.',
      'Under your nickname, tap the copy button next to your numeric User ID.'
    ],
    tags: ['NetEase', 'Battle Royale', 'Gold', 'Instant'],
    isTrending: true,
    denominations: [
      { id: 'bs_100', name: '100 Gold', amount: 100, pricePhp: 49, originalPricePhp: 60, category: 'Diamonds' },
      { id: 'bs_300', name: '300 (+30) Gold', amount: 330, pricePhp: 145, originalPricePhp: 175, isPopular: true, category: 'Diamonds' },
      { id: 'bs_500', name: '500 (+60) Gold', amount: 560, pricePhp: 240, originalPricePhp: 290, category: 'Diamonds' },
      { id: 'bs_1000', name: '1,000 (+150) Gold', amount: 1150, pricePhp: 475, originalPricePhp: 580, isPopular: true, category: 'Diamonds' },
      { id: 'bs_pass', name: 'Elite Strike Pass', amount: 500, pricePhp: 249, originalPricePhp: 299, isPopular: true, category: 'Passes' }
    ]
  },
  {
    id: 'ragnarok-zero-global-philippines',
    slug: 'ragnarok-zero-global-philippines',
    name: 'Ragnarok Zero: Global PH',
    publisher: 'Gravity Co., Ltd.',
    category: 'Trending Games',
    platform: ['PC'],
    rating: 5.0,
    reviewsCount: 3500,
    discountBadge: '5% OFF',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    description: 'Buy Ragnarok Zero Global Philippines Kafra Points and Game Access Passes at GPDS using secure local checkout.',
    deliveryTime: '2 - 7 mins',
    requiresServerId: true,
    idLabel: 'Account ID / Character Name',
    serverIdLabel: 'Server',
    idPlaceholder: 'e.g. ROZeroPlayer',
    serverIdPlaceholder: 'e.g. Prontera Server 1',
    guideTitle: 'Find your Ragnarok Zero Account ID',
    guideInstructions: [
      'Login to your Ragnarok Zero launcher.',
      'Check your Master Account ID displayed on the launcher header.'
    ],
    tags: ['MMORPG', 'Gravity', 'Kafra Points'],
    denominations: [
      { id: 'ro_500', name: '500 Kafra Points', amount: 500, pricePhp: 240, originalPricePhp: 255, category: 'Diamonds' },
      { id: 'ro_1000', name: '1,000 Kafra Points', amount: 1000, pricePhp: 475, originalPricePhp: 500, isPopular: true, category: 'Diamonds' },
      { id: 'ro_2500', name: '2,500 Kafra Points', amount: 2500, pricePhp: 1180, originalPricePhp: 1250, category: 'Diamonds' }
    ]
  },
  {
    id: 'bleach-soul-resonance',
    slug: 'bleach-soul-resonance',
    name: 'BLEACH: Soul Resonance',
    publisher: 'Nuverse',
    category: 'New Release',
    platform: ['Mobile', 'PC'],
    rating: 5.0,
    reviewsCount: 867,
    discountBadge: '10% OFF',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    description: 'Buy cheap Bleach: Soul Resonance Spiritual Jade, Monthly Card, and Battle Pass in PH at GPDS Game Shop. Top up using only Player ID and Server.',
    deliveryTime: '1 - 5 mins',
    requiresServerId: true,
    idLabel: 'Player ID',
    serverIdLabel: 'Server',
    idPlaceholder: 'e.g. 7381920',
    serverIdPlaceholder: 'e.g. Asia Server',
    guideTitle: 'Locate your Bleach Soul Resonance ID',
    guideInstructions: [
      'Open the game and click on your avatar.',
      'Your numeric Player ID is located under your avatar.'
    ],
    tags: ['Anime', 'Nuverse', 'Spiritual Jade', 'New'],
    isNew: true,
    denominations: [
      { id: 'bleach_60', name: '60 Spiritual Jade', amount: 60, pricePhp: 49, originalPricePhp: 55, category: 'Diamonds' },
      { id: 'bleach_300', name: '300 (+30) Spiritual Jade', amount: 330, pricePhp: 245, originalPricePhp: 275, isPopular: true, category: 'Diamonds' },
      { id: 'bleach_pass', name: 'Soul Reaper Monthly Pass', amount: 500, pricePhp: 249, originalPricePhp: 299, isPopular: true, category: 'Passes' }
    ]
  },
  {
    id: 'steam-wallet-code',
    slug: 'steam-wallet-code',
    name: 'Steam Wallet Code (PH)',
    publisher: 'Valve Corporation',
    category: 'Voucher',
    platform: ['PC'],
    rating: 5.0,
    reviewsCount: 14200,
    discountBadge: '5% OFF',
    image: assetUrl('/steam-wallet-card.svg'),
    bannerImage: assetUrl('/steam-deck.jpg'),
    description: 'Buy a Steam Wallet Code in the Philippines at GPDS. Pay with GCash, Maya, or QRPH and get a digital code by email to redeem on your PH Steam account.',
    deliveryTime: 'Instant Email',
    requiresServerId: false,
    idLabel: 'Email / Phone Number for Delivery',
    idPlaceholder: 'e.g. gamer@gmail.com',
    guideTitle: 'How to redeem your Steam Wallet Code',
    guideInstructions: [
      'Open Steam client and go to "Games" > "Redeem a Steam Wallet Code".',
      'Enter the 15-character code received via email/SMS from GPDS.',
      'Funds are instantly added in PHP to your Steam Wallet balance.'
    ],
    tags: ['Steam', 'Voucher', 'Gift Card', 'Digital Code'],
    denominations: [
      { id: 'steam_50', name: '₱50 Steam Wallet Code', amount: 50, pricePhp: 55, originalPricePhp: 60, category: 'Diamonds' },
      { id: 'steam_100', name: '₱100 Steam Wallet Code', amount: 100, pricePhp: 105, originalPricePhp: 115, category: 'Diamonds' },
      { id: 'steam_250', name: '₱250 Steam Wallet Code', amount: 250, pricePhp: 260, originalPricePhp: 280, isPopular: true, category: 'Diamonds' },
      { id: 'steam_500', name: '₱500 Steam Wallet Code', amount: 500, pricePhp: 515, originalPricePhp: 550, isPopular: true, category: 'Diamonds' },
      { id: 'steam_1000', name: '₱1,000 Steam Wallet Code', amount: 1000, pricePhp: 1025, originalPricePhp: 1100, category: 'Diamonds' }
    ]
  },
  {
    id: 'razer-gold-direct-top-up-pin-php',
    slug: 'razer-gold-direct-top-up-pin-php',
    name: 'Razer Gold Direct Top-Up Pin (PHP)',
    publisher: 'Razer Inc.',
    category: 'Voucher',
    platform: ['PC', 'Mobile'],
    rating: 5.0,
    reviewsCount: 9800,
    discountBadge: '3% OFF',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
    description: 'Buy Razer Gold Direct Top-Up PIN PHP at GPDS in values from PHP 20 to PHP 5,000. Use digital PIN on thousands of supported games.',
    deliveryTime: 'Instant Email',
    requiresServerId: false,
    idLabel: 'Email / Mobile for PIN',
    idPlaceholder: 'e.g. 09171234567',
    guideTitle: 'Redeeming Razer Gold PIN',
    guideInstructions: [
      'Visit gold.razer.com and log in to your account.',
      'Click "Reload Now" and choose "Razer Gold PIN".',
      'Enter the Serial Number and PIN from GPDS checkout.'
    ],
    tags: ['Razer', 'Voucher', 'Universal Top Up'],
    denominations: [
      { id: 'razer_100', name: '₱100 Razer Gold PIN', amount: 100, pricePhp: 98, originalPricePhp: 100, category: 'Diamonds' },
      { id: 'razer_300', name: '₱300 Razer Gold PIN', amount: 300, pricePhp: 294, originalPricePhp: 300, isPopular: true, category: 'Diamonds' },
      { id: 'razer_500', name: '₱500 Razer Gold PIN', amount: 500, pricePhp: 490, originalPricePhp: 500, isPopular: true, category: 'Diamonds' },
      { id: 'razer_1000', name: '₱1,000 Razer Gold PIN', amount: 1000, pricePhp: 975, originalPricePhp: 1000, category: 'Diamonds' }
    ]
  },
  {
    id: 'roblox-gift-card',
    slug: 'roblox-gift-card',
    name: 'Roblox Gift Card & Robux',
    publisher: 'Roblox Corporation',
    category: 'Voucher',
    platform: ['PC', 'Mobile'],
    rating: 5.0,
    reviewsCount: 660,
    discountBadge: '5% OFF',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    description: 'Buy a Roblox gift card in the Philippines at GPDS. Pay with GCash, Maya, or QRPH and get a digital Robux code by email to redeem at roblox.com/redeem.',
    deliveryTime: 'Instant Email',
    requiresServerId: false,
    idLabel: 'Email address for gift card code',
    idPlaceholder: 'e.g. gamer@gmail.com',
    guideTitle: 'Redeeming Roblox Card',
    guideInstructions: [
      'Go to roblox.com/redeem in your web browser.',
      'Log into your account.',
      'Enter the PIN code sent by GPDS and click Redeem.'
    ],
    tags: ['Robux', 'Roblox', 'Gift Card'],
    denominations: [
      { id: 'rbx_400', name: '400 Robux Card', amount: 400, pricePhp: 285, originalPricePhp: 310, isPopular: true, category: 'Diamonds' },
      { id: 'rbx_800', name: '800 Robux Card', amount: 800, pricePhp: 565, originalPricePhp: 610, category: 'Diamonds' },
      { id: 'rbx_1700', name: '1,700 Robux Card', amount: 1700, pricePhp: 1140, originalPricePhp: 1220, category: 'Diamonds' }
    ]
  },
  {
    id: 'poppo-live-coins',
    slug: 'poppo-live-coins',
    name: 'Poppo Live Coins',
    publisher: 'Poppo Live',
    category: 'Others',
    platform: ['Mobile'],
    rating: 5.0,
    reviewsCount: 2900,
    discountBadge: '15% OFF',
    image: 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=500&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    description: 'Buy cheap Poppo Live Coins in PH via your UID, no password needed. Send gifts to streamers, unlock VIP. Fast 4 to 7 min delivery.',
    deliveryTime: '4 - 7 mins',
    requiresServerId: false,
    idLabel: 'Poppo User ID (UID)',
    idPlaceholder: 'e.g. 1928471',
    guideTitle: 'How to find Poppo Live UID',
    guideInstructions: [
      'Open Poppo Live application.',
      'Click the "My" tab at bottom right.',
      'Your User ID is displayed under your profile avatar.'
    ],
    tags: ['Live Stream', 'Coins', 'VIP'],
    denominations: [
      { id: 'poppo_7000', name: '7,000 Coins', amount: 7000, pricePhp: 54, originalPricePhp: 65, category: 'Diamonds' },
      { id: 'poppo_35000', name: '35,000 Coins', amount: 35000, pricePhp: 265, originalPricePhp: 310, isPopular: true, category: 'Diamonds' },
      { id: 'poppo_70000', name: '70,000 Coins', amount: 70000, pricePhp: 520, originalPricePhp: 610, category: 'Diamonds' }
    ]
  },
  {
    id: 'mobile-load-and-promo',
    slug: 'mobile-load-and-promo',
    name: 'Mobile Load & DATA Promos PH',
    publisher: 'Globe, Smart, DITO, TM, TNT',
    category: 'Others',
    platform: ['Mobile'],
    rating: 4.9,
    reviewsCount: 540,
    discountBadge: '5% OFF',
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=1200&auto=format&fit=crop&q=80',
    description: 'Buy mobile load and data promos online at GPDS Game Shop. Fast delivery for Globe, TM, Smart, TNT, DITO, GIGA, GoPLUS, Magic Data.',
    deliveryTime: '1 - 3 mins',
    requiresServerId: false,
    idLabel: 'Philippine Mobile Number (11 digits)',
    idPlaceholder: 'e.g. 09171234567',
    guideTitle: 'Philippine Mobile Load Top-Up',
    guideInstructions: [
      'Double check your 11-digit mobile number starting with 09.',
      'Select your promo package or regular load amount.',
      'Load is sent instantly to your SIM via direct telco gateway.'
    ],
    tags: ['Telco', 'Globe', 'Smart', 'DITO', 'Data'],
    denominations: [
      { id: 'load_50', name: '₱50 Regular Load', amount: 50, pricePhp: 48, originalPricePhp: 50, category: 'Diamonds' },
      { id: 'load_100', name: '₱100 Regular Load', amount: 100, pricePhp: 96, originalPricePhp: 100, isPopular: true, category: 'Diamonds' },
      { id: 'load_goplus99', name: 'Globe Go+99 (8GB + 8GB)', amount: 99, pricePhp: 95, originalPricePhp: 99, isPopular: true, category: 'Passes' },
      { id: 'load_giga99', name: 'Smart GIGA Games 99', amount: 99, pricePhp: 95, originalPricePhp: 99, category: 'Passes' }
    ]
  }
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'gcash',
    name: 'GCash',
    category: 'E-Wallet',
    iconName: 'Smartphone',
    feePercent: 1.5,
    feeFixedPhp: 0,
    instructions: 'Instant scan QR or direct GCash app authorization. Zero manual verification needed.',
    badge: 'Most Popular',
    color: '#007DFE'
  },
  {
    id: 'maya',
    name: 'Maya',
    category: 'E-Wallet',
    iconName: 'CreditCard',
    feePercent: 1.5,
    feeFixedPhp: 0,
    instructions: 'Pay directly via Maya wallet balance or virtual card.',
    badge: 'Instant',
    color: '#1BC47D'
  },
  {
    id: 'grabpay',
    name: 'GrabPay PH',
    category: 'E-Wallet',
    iconName: 'Wallet',
    feePercent: 1.8,
    feeFixedPhp: 0,
    instructions: 'Quick checkout with your GrabPay wallet balance.',
    color: '#00B14F'
  },
  {
    id: 'qrph',
    name: 'QRPH (All PH Banks & Wallets)',
    category: 'Bank Transfer / QR',
    iconName: 'QrCode',
    feePercent: 1.0,
    feeFixedPhp: 0,
    instructions: 'Scan with BDO, BPI, UnionBank, RCBC, GoTyme, SeaBank, or any InstaPay app.',
    badge: 'Lowest Fee',
    color: '#F5A623'
  },
  {
    id: 'card',
    name: 'Credit / Debit Card (Visa/Mastercard)',
    category: 'Cards',
    iconName: 'CreditCard',
    feePercent: 2.5,
    feeFixedPhp: 15,
    instructions: 'Secured by 3D-Secure 2.0. Supports local and international cards.',
    color: '#6366F1'
  },
  {
    id: 'paypal',
    name: 'PayPal / International Cards',
    category: 'Global / Crypto',
    iconName: 'Globe',
    feePercent: 3.5,
    feeFixedPhp: 20,
    instructions: 'Pay with PayPal balance, international credit cards, or bank balance.',
    color: '#003087'
  },
  {
    id: 'usdt',
    name: 'USDT / Crypto (Binance Pay / TRC20)',
    category: 'Global / Crypto',
    iconName: 'Coins',
    feePercent: 0,
    feeFixedPhp: 0,
    instructions: 'Zero processing fee. Pay via Binance Pay, OKX, or USDT TRC20 transfer.',
    badge: '0% Fee',
    color: '#26A17B'
  }
];

export const VOUCHERS: Voucher[] = [
  {
    id: 'v_1',
    code: 'GPDSFIRST50',
    title: 'First-Time Gamer Voucher',
    discountValue: '₱50 OFF',
    discountFixedPhp: 50,
    minSpendPhp: 250,
    expiryDate: '2026-12-31',
    description: 'Get ₱50 off your first top-up transaction at GPDS Game Shop.',
    applicableGames: ['All'],
    category: 'New Gamer'
  },
  {
    id: 'v_2',
    code: 'MLBBFEST25',
    title: 'Mobile Legends Special Discount',
    discountValue: '25% OFF',
    discountPercent: 25,
    minSpendPhp: 200,
    expiryDate: '2026-10-31',
    description: 'Massive 25% discount on MLBB Diamonds and Weekly Diamond Pass.',
    applicableGames: ['mobile-legends'],
    category: 'Flash Deal'
  },
  {
    id: 'v_3',
    code: 'STREAMER2',
    title: 'Creator Community Code',
    discountValue: '5% OFF',
    discountPercent: 5,
    minSpendPhp: 100,
    expiryDate: '2026-12-31',
    description: 'Official streamer partner discount applicable to all game purchases.',
    applicableGames: ['All'],
    category: 'Streamer Code'
  },
  {
    id: 'v_4',
    code: 'HOKGLORY',
    title: 'Honor of Kings Token Boost',
    discountValue: '10% OFF',
    discountPercent: 10,
    minSpendPhp: 150,
    expiryDate: '2026-11-15',
    description: 'Discount code on all Honor of Kings token tiers and Battle Passes.',
    applicableGames: ['honor-of-kings'],
    category: 'Flash Deal'
  }
];

export const AUCTION_ITEMS: AuctionItem[] = [
  {
    id: 'auc_1',
    title: 'MLBB Mythical Immortal Account | 185 Skins (6 Collector, 2 Legend, Exorcist Kagura)',
    game: 'Mobile Legends: Bang Bang',
    gameIcon: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    badges: ['Verified Safe', '100% Clean Bind', 'Legend Skins'],
    description: 'All heroes unlocked, 185 total skins including Granger Legend, Gusion Legend, Ling Collector, and Exorcist series. Clean Moonton bind with email surrender.',
    server: 'PH / Asia Server',
    currentBidPhp: 8500,
    minNextBidPhp: 8750,
    buyNowPricePhp: 12000,
    bidsCount: 14,
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(), // 6 hours from now
    isFeatured: true,
    bidHistory: [
      { bidder: 'Gamer***91', amountPhp: 8500, timeAgo: '8 mins ago' },
      { bidder: 'Shadow***ph', amountPhp: 8200, timeAgo: '24 mins ago' },
      { bidder: 'Mark***23', amountPhp: 7900, timeAgo: '1 hour ago' },
      { bidder: 'Ace***7', amountPhp: 7500, timeAgo: '3 hours ago' }
    ],
    seller: {
      name: 'GPDS Verified Escrow',
      verified: true,
      rating: 5.0
    }
  },
  {
    id: 'auc_2',
    title: 'Valorant Radiant Account | Prime Vandal, Reaver Karambit, Kuronami Bundle',
    game: 'Valorant (AP/PH)',
    gameIcon: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=100&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    badges: ['Radiant Rank', 'First Owner', 'AP Server'],
    description: 'Current Episode Radiant with high MMR. Contains full Kuronami bundle, Prime Vandal, Reaver Knife, and 4 Battlepasses maxed out.',
    server: 'Asia Pacific (PH Ping 8ms)',
    currentBidPhp: 11200,
    minNextBidPhp: 11500,
    buyNowPricePhp: 16500,
    bidsCount: 21,
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(), // 18 hours from now
    bidHistory: [
      { bidder: 'Jett***god', amountPhp: 11200, timeAgo: '15 mins ago' },
      { bidder: 'Clutch***01', amountPhp: 10800, timeAgo: '42 mins ago' },
      { bidder: 'Viper***main', amountPhp: 10200, timeAgo: '2 hours ago' }
    ],
    seller: {
      name: 'Official GPDS Escrow',
      verified: true,
      rating: 4.9
    }
  },
  {
    id: 'auc_3',
    title: 'Honor of Kings Grandmaster ID | Musashi Legend Skin + All Assassin Heroes Maxed',
    game: 'Honor of Kings',
    gameIcon: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=100&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
    badges: ['Grandmaster', 'VIP 8', 'Instant Escrow'],
    description: 'High tier Grandmaster account with VIP 8 privileges, exclusive Musashi & Diaochan skins, 98% win rate in solo queue.',
    server: 'Global Server',
    currentBidPhp: 4900,
    minNextBidPhp: 5100,
    buyNowPricePhp: 7000,
    bidsCount: 9,
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 28).toISOString(), // 28 hours from now
    bidHistory: [
      { bidder: 'King***PH', amountPhp: 4900, timeAgo: '35 mins ago' },
      { bidder: 'Li***Bai', amountPhp: 4600, timeAgo: '1 hour ago' }
    ],
    seller: {
      name: 'GPDS Verified Partner',
      verified: true,
      rating: 5.0
    }
  }
];

export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord_1',
    orderNumber: 'GPDS-98241',
    gameId: 'mobile-legends',
    gameName: 'Mobile Legends PH',
    gameIcon: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&auto=format&fit=crop&q=80',
    itemName: 'Weekly Diamond Pass',
    userId: '489201934',
    serverId: '3209',
    userEmail: 'gamer@gpds.ph',
    userPhone: '09174541147',
    paymentMethod: 'GCash',
    subtotalPhp: 95,
    discountPhp: 5,
    feePhp: 1.35,
    totalPhp: 91.35,
    currency: 'PHP',
    status: 'COMPLETED',
    createdAt: '2026-09-18 09:42:10',
    completedAt: '2026-09-18 09:44:02',
    txHash: 'GCASH-TX-998824102914',
    statusHistory: [
      { step: '1', title: 'Order Placed', description: 'Order created with Weekly Diamond Pass', timestamp: '09:42:10 AM', done: true },
      { step: '2', title: 'Payment Confirmed', description: 'Paid via GCash automated gateway', timestamp: '09:42:45 AM', done: true },
      { step: '3', title: 'Server Queue', description: 'Connecting to Moonton direct API server', timestamp: '09:43:12 AM', done: true },
      { step: '4', title: 'Diamonds Credited', description: 'Delivered to UID: 489201934 (3209)', timestamp: '09:44:02 AM', done: true },
      { step: '5', title: 'Order Completed', description: 'Transaction finalized and receipt generated', timestamp: '09:44:02 AM', done: true }
    ]
  },
  {
    id: 'ord_2',
    orderNumber: 'GPDS-98242',
    gameId: 'honor-of-kings',
    gameName: 'Honor of Kings',
    gameIcon: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=100&auto=format&fit=crop&q=80',
    itemName: '800 Tokens (+100 Bonus)',
    userId: '78291044',
    serverId: 'Global Server 1',
    userEmail: 'progamer@gmail.com',
    paymentMethod: 'Maya',
    subtotalPhp: 540,
    discountPhp: 0,
    feePhp: 8.10,
    totalPhp: 548.10,
    currency: 'PHP',
    status: 'PROCESSING',
    createdAt: '2026-09-18 10:05:30',
    statusHistory: [
      { step: '1', title: 'Order Placed', description: 'Order created for 800 Tokens', timestamp: '10:05:30 AM', done: true },
      { step: '2', title: 'Payment Confirmed', description: 'Verified via Maya Instant Pay', timestamp: '10:06:05 AM', done: true },
      { step: '3', title: 'Server Queue', description: 'Sending token payload to Tencent Server', timestamp: '10:06:40 AM', done: true },
      { step: '4', title: 'Diamonds Credited', description: 'Crediting to game account in progress...', timestamp: 'In progress', done: false },
      { step: '5', title: 'Order Completed', description: 'Waiting for server ACK response', timestamp: 'Pending', done: false }
    ]
  },
  {
    id: 'ord_3',
    orderNumber: 'GPDS-98243',
    gameId: 'valorant',
    gameName: 'Valorant',
    gameIcon: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=100&auto=format&fit=crop&q=80',
    itemName: '2,050 Valorant Points',
    userId: 'Phoenix#PH1',
    userEmail: 'valorantfan@yahoo.com',
    paymentMethod: 'QRPH',
    subtotalPhp: 760,
    discountPhp: 50,
    feePhp: 7.10,
    totalPhp: 717.10,
    currency: 'PHP',
    status: 'VERIFYING',
    createdAt: '2026-09-18 10:14:15',
    statusHistory: [
      { step: '1', title: 'Order Placed', description: 'Order created for 2,050 VP', timestamp: '10:14:15 AM', done: true },
      { step: '2', title: 'Verifying Payment', description: 'Confirming QRPH reference with bank network', timestamp: 'Waiting bank ACK', done: false },
      { step: '3', title: 'Server Queue', description: 'Scheduled for Riot Direct Top-Up', timestamp: 'Pending', done: false },
      { step: '4', title: 'Diamonds Credited', description: 'Pending Riot top-up confirmation', timestamp: 'Pending', done: false },
      { step: '5', title: 'Order Completed', description: 'Pending delivery completion', timestamp: 'Pending', done: false }
    ]
  }
];

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 'prod_1',
    slug: 'gpds-official-esports-jersey',
    name: 'GPDS Official 2026 Pro Esports Jersey',
    category: 'Apparel',
    pricePhp: 899,
    originalPricePhp: 1199,
    rating: 4.9,
    reviewsCount: 312,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    description: 'Official moisture-wicking aerodynamic jersey worn by GPDS partner tournament teams and streamers. Features gold embroidered logo and sublimated cyber armor print.',
    specs: {
      'Material': '100% Breathable Dry-Fit Polyester',
      'Fit': 'Athletic Esports Fit',
      'Sizes Available': 'S, M, L, XL, 2XL',
      'Edition': 'Season 2026 Golden Era'
    }
  },
  {
    id: 'prod_2',
    slug: 'razer-deathadder-essential-black',
    name: 'Razer DeathAdder Essential Gaming Mouse (PH Warranty)',
    category: 'Peripherals',
    pricePhp: 950,
    originalPricePhp: 1290,
    rating: 5.0,
    reviewsCount: 840,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    description: 'Proven ergonomic form factor trusted by over 10 million gamers worldwide. 6,400 DPI optical sensor with 5 hyper-response buttons.',
    specs: {
      'Sensor': '6,400 True DPI Optical',
      'Switches': 'Mechanical (10M clicks)',
      'Cable': '1.8m Braided Fiber',
      'Warranty': '1 Year Official PH Distributor'
    }
  },
  {
    id: 'prod_3',
    slug: 'gpds-magnetic-phone-cooler',
    name: 'GPDS FrostBite RGB Magnetic Phone Cooler',
    category: 'Peripherals',
    pricePhp: 650,
    originalPricePhp: 850,
    rating: 4.8,
    reviewsCount: 425,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    description: 'Rapid semiconductor cooling drops smartphone temperature by up to 20°C in 60 seconds. Say goodbye to FPS drop in Mobile Legends & Honor of Kings.',
    specs: {
      'Cooling Type': 'Peltier Semiconductor Plate',
      'Attachment': 'MagSafe & Clamp Included',
      'RGB Lighting': 'Dynamic Spectrum Gradient',
      'Power': 'USB Type-C 15W Fast Input'
    }
  },
  {
    id: 'prod_4',
    slug: 'mlbb-collector-enamel-pins-box',
    name: 'MLBB Mythical Glory Commemorative Pin Set',
    category: 'Collectibles',
    pricePhp: 450,
    originalPricePhp: 600,
    rating: 5.0,
    reviewsCount: 190,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    inStock: true,
    description: 'Set of 5 heavy-duty metal enamel pins featuring Mythic rank badges and iconic heroes. Comes with velvet showcase box.',
    specs: {
      'Material': 'Zinc Alloy with Gold Plating',
      'Pieces': '5 Enamel Badges',
      'Packaging': 'Deluxe Collector Box'
    }
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post_1',
    slug: 'omega-vs-aurora-how-to-watch-sept-18',
    title: 'Omega vs Aurora: How to Watch MPL-PH Rematch & Matchup Analysis',
    category: 'Esports',
    author: 'Angelo "bhadzki" Leoncio',
    date: 'Sep 18, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    summary: 'The MPL Philippines rivalry returns with Omega Esports battling Aurora in an adrenaline-pumping regular season faceoff. Here is everything you need to know about bans and picks.',
    content: [
      'The stakes couldn’t be higher as Smart Omega takes on the red-hot Aurora Gaming roster in tonight’s 7:30 PM PHT clash. Both squads come in needing critical circuit points to secure upper-bracket seeding.',
      'Key matchup to watch: Kelra’s gold lane lane-dominance against Aurora’s aggressive roam strategies. Look out for Harith and Beatrix priority bans in Game 1.',
      'Fans watching through GPDS livestream partner watch parties can claim limited-edition promo codes redeemable for bonus MLBB diamonds.'
    ],
    tags: ['MPL-PH', 'Omega', 'Aurora', 'MLBB Esports']
  },
  {
    id: 'post_2',
    slug: 'mlbb-patch-notes-masha-revamp',
    title: 'MLBB Patch Notes: Masha Revamp, Map Terrain Updates, and Roam Boots Adjustments',
    category: 'Patch Notes',
    author: 'GPDS Game Analyst',
    date: 'Sep 15, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    summary: 'Moonton rolls out comprehensive balance adjustments targeting early game snowballing and tweaking hero capabilities across the EXP and Gold lanes.',
    content: [
      'Masha receives an extensive overhaul, transitioning from a pure split-push specialist into an imposing burst brawler capable of deleting squishies with empowered basic attacks.',
      'The Lord pit terrain now features wider sightlines, giving defensive teams better contest angles when defending their base inhibitors.',
      'New roam equipment adjustments ensure roamers gain 15% more passive gold during the first 8 minutes of ranked games.'
    ],
    tags: ['Patch Notes', 'Meta Tier List', 'Masha', 'Moonton']
  },
  {
    id: 'post_3',
    slug: 'rf-online-next-coupon-code-guide',
    title: 'RF Online Next Coupon Code Guide: Where to Enter Discounts & Claim Rewards',
    category: 'Guides',
    author: 'Staff Guide Team',
    date: 'Sep 12, 2026',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    summary: 'Step-by-step walkthrough on finding your account UID and redeeming Netmarble promo codes for RF Online Next Cash Points.',
    content: [
      'RF Online Next features three warring factions: Bellato Union, Holy Cora Alliance, and the Accretia Empire. Maximizing your battle gear requires smart allocation of Cash Points.',
      'To redeem coupon codes: Navigate to Settings > Account > Enter Coupon. Paste your GPDS voucher code to receive items directly in your in-game mailbox within seconds.'
    ],
    tags: ['RF Online Next', 'Coupon Guide', 'Cash Points']
  }
];

export const FAQS = [
  {
    question: 'What is GPDS Game Shop?',
    answer: 'GPDS Game Shop is a Philippines-based digital top-up platform founded in 2018 by Angelo "bhadzki" Leoncio. We sell discounted in-game currencies, passes, vouchers, and gift cards for Mobile Legends, Honor of Kings, Valorant, Genshin Impact, and dozens more titles with instant delivery via local Philippine and international payment methods.'
  },
  {
    question: 'Is GPDS Game Shop legit and safe? Do you need my password?',
    answer: 'Yes, 100% legitimate and operating continuously since 2018 with over 500,000 satisfied gamers. For direct game top-ups (MLBB, HoK, Valorant, etc.), GPDS only requires your in-game User ID and Server ID. We NEVER ask for your game password, OTP, or email credentials. Your account is completely safe from compromise.'
  },
  {
    question: 'How fast will my game diamonds or tokens be delivered?',
    answer: 'Most top-ups are processed automatically by our direct game API gateways and credited to your game account within 1 to 5 minutes after payment confirmation. You can track the live status anytime using our Track Order tool.'
  },
  {
    question: 'Which payment methods can I use?',
    answer: 'We support all major Philippine payment methods including GCash, Maya, GrabPay, QRPH (InstaPay from BDO, BPI, UnionBank, RCBC, GoTyme, SeaBank), Visa & Mastercard credit/debit cards, PayPal, and cryptocurrency (USDT via TRC20 and Binance Pay).'
  },
  {
    question: 'What is the 10x Money-Back Guarantee?',
    answer: 'We guarantee that all currency top-ups are genuine and authorized. In the unlikely event that an item is not delivered due to a verified system error on our end and cannot be resolved, we will provide a full refund plus guarantee credit.'
  },
  {
    question: 'What are the customer support operating hours?',
    answer: 'Our dedicated gamer support team is live 22 hours every day from 6:00 AM to 4:00 AM Philippine Time (PHT). You can reach us instantly on WhatsApp (+63 977 454 1147) or via our official Facebook page.'
  }
];

export const PARTNERSHIP_TIERS = [
  {
    tier: 'Silver Reseller',
    monthlyVolume: '₱20,000 - ₱50,000',
    discountMargin: '3% - 5% OFF retail',
    support: 'Standard Support',
    apiAccess: 'Manual Portal Access',
    color: 'from-slate-400 to-slate-600'
  },
  {
    tier: 'Gold Reseller',
    monthlyVolume: '₱50,001 - ₱150,000',
    discountMargin: '6% - 10% OFF retail',
    support: 'Priority VIP WhatsApp',
    apiAccess: 'API Access Available',
    color: 'from-amber-400 to-amber-600'
  },
  {
    tier: 'Platinum VIP',
    monthlyVolume: '₱150,001+',
    discountMargin: 'Up to 15% OFF retail',
    support: '24/7 Dedicated Account Rep',
    apiAccess: 'Full Wholesale REST API',
    color: 'from-cyan-400 to-blue-600'
  }
];
