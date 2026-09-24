export type CurrencyCode = 'PHP' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'SGD' | 'AUD' | 'CAD' | 'HKD' | 'MYR' | 'IDR';

export interface CurrencyRate {
  date?: string;
  code: CurrencyCode;
  symbol: string;
  rateToPhp: number; // 1 PHP = rateToPhp in target currency, or 1 target currency = rateToPhp PHP
  name: string;
}

export type GameCategory = 
  | 'All'
  | 'Mobile Legends'
  | 'Trending Games'
  | 'New Release'
  | 'Mobile Games'
  | 'PC Games'
  | 'Voucher'
  | 'Others';

export interface DenominationItem {
  id: string;
  name: string;
  amount: number; // Base diamond/point amount
  bonus?: number; // Bonus amount
  pricePhp: number;
  originalPricePhp?: number;
  isPopular?: boolean;
  category?: 'Diamonds' | 'Passes' | 'Bundles' | 'Special';
  icon?: string;
}

export interface Game {
  id: string;
  slug: string;
  name: string;
  publisher: string;
  category: GameCategory;
  platform: ('Mobile' | 'PC' | 'Console')[];
  rating: number;
  reviewsCount: number;
  discountBadge?: string;
  image: string;
  bannerImage: string;
  description: string;
  deliveryTime: string; // e.g. "1 - 5 mins"
  requiresServerId: boolean;
  idLabel: string; // e.g. "User ID"
  serverIdLabel?: string; // e.g. "Zone ID" or "Server ID"
  idPlaceholder: string;
  serverIdPlaceholder?: string;
  guideTitle: string;
  guideInstructions: string[];
  denominations: DenominationItem[];
  tags: string[];
  isTrending?: boolean;
  isNew?: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  category: 'E-Wallet' | 'Bank Transfer / QR' | 'Cards' | 'Global / Crypto';
  iconName: string; // Lucide icon or brand identifier
  feePercent: number;
  feeFixedPhp: number;
  instructions: string;
  badge?: string;
  color: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  gameId: string;
  gameName: string;
  gameIcon: string;
  itemName: string;
  userId: string;
  serverId?: string;
  userEmail: string;
  userPhone?: string;
  paymentMethod: string;
  subtotalPhp: number;
  discountPhp: number;
  feePhp: number;
  totalPhp: number;
  currency: CurrencyCode;
  status: 'PENDING' | 'VERIFYING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  completedAt?: string;
  txHash?: string;
  statusHistory: {
    step: string;
    title: string;
    description: string;
    timestamp: string;
    done: boolean;
  }[];
}

export interface AuctionItem {
  id: string;
  title: string;
  game: string;
  gameIcon: string;
  image: string;
  badges: string[];
  description: string;
  server: string;
  currentBidPhp: number;
  minNextBidPhp: number;
  buyNowPricePhp?: number;
  bidsCount: number;
  endTime: string; // ISO string
  isFeatured?: boolean;
  bidHistory: {
    bidder: string;
    amountPhp: number;
    timeAgo: string;
  }[];
  seller: {
    name: string;
    verified: boolean;
    rating: number;
  };
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  discountValue: string; // e.g. "25% OFF" or "₱50 OFF"
  discountPercent?: number;
  discountFixedPhp?: number;
  minSpendPhp: number;
  expiryDate: string;
  description: string;
  applicableGames: string[]; // ['All'] or specific game slugs
  category: 'Flash Deal' | 'Streamer Code' | 'New Gamer' | 'VIP';
}

export interface ShopProduct {
  id: string;
  slug: string;
  name: string;
  category: 'Peripherals' | 'Cards & Codes' | 'Apparel' | 'Collectibles';
  pricePhp: number;
  originalPricePhp?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  inStock: boolean;
  description: string;
  specs: { [key: string]: string };
}

export interface CartItem {
  product: ShopProduct;
  quantity: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: 'Patch Notes' | 'Esports' | 'Guides' | 'News';
  author: string;
  date: string;
  readTime: string;
  image: string;
  summary: string;
  content: string[];
  tags: string[];
}

export interface UserSavedAccount {
  id: string;
  gameId: string;
  gameName: string;
  nickname: string;
  userId: string;
  serverId?: string;
}

export interface UserProfile {
  isAdmin?: boolean;
  id: string;
  name: string;
  email: string;
  avatar: string;
  vipTier: 'Bronze' | 'Silver' | 'Gold' | 'VIP Platinum';
  loyaltyPoints: number;
  savedAccounts: UserSavedAccount[];
}
