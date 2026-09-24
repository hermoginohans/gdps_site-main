// Official live data pulled directly from gpdsgameshop.com
import { assetUrl } from '../utils/assets';

export interface OfficialSlider {
  id: number;
  name: string;
  url: string;
  picture: string;
}

export interface OfficialCategory {
  key: string;
  label: string;
}

export interface OfficialProduct {
  gameGroup?: { id: number; name: string; variants: { id: number; slug: string; name: string; picture: string; provider_country: string | null; region_label: string | null; discount_tag: number | null; average_rating: number; total_reviews: number }[] } | null;
  source?: 'supplier';
  inputFields?: { name: string; label: string; placeholder: string; type: 'text' | 'select'; options: { value: string; label: string }[] }[];
  packages?: { id: string; name: string; price: number; stock?: number | null }[];
  id: number;
  name: string;
  slug: string;
  category: string;
  picture: string;
  discountTag: string | null;
  rating: number;
  reviewsCount: number;
  minPrice: number | null;
  maxPrice: number | null;
  description: string;
  isGiftCard: boolean;
}

export interface OfficialBlog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  category: string;
  author: string;
  publishedAt: string;
}

export interface OfficialFaq {
  id: number;
  question: string;
  answer: string;
}

export const OFFICIAL_SLIDERS: OfficialSlider[] = [
  {
    "id": 15,
    "name": "Welcome",
    "url": "/",
    "picture": assetUrl("/slider/welcome.webp")
  },
  {
    "id": 16,
    "name": "Reseller",
    "url": "/partnership",
    "picture": assetUrl("/slider/reseller.webp")
  },
  {
    "id": 17,
    "name": "MLBB PH",
    "url": "/games/mobile-legends",
    "picture": assetUrl("/slider/mlbb.webp")
  },
  {
    "id": 18,
    "name": "Valorant",
    "url": "/games/valorant",
    "picture": assetUrl("/slider/valo.webp")
  }
];

export const OFFICIAL_CATEGORIES: OfficialCategory[] = [
  {
    "key": "trending-games",
    "label": "Trending Games"
  },
  {
    "key": "new-release",
    "label": "New Release"
  },
  {
    "key": "popular-games",
    "label": "Popular Games"
  },
  {
    "key": "games",
    "label": "Games"
  },
  {
    "key": "entertainment",
    "label": "Entertainment"
  },
  {
    "key": "voucher",
    "label": "Voucher"
  },
  {
    "key": "electronic-devices",
    "label": "Electronic Devices"
  },
  {
    "key": "cdkeys",
    "label": "CDKEYS"
  },
  {
    "key": "others",
    "label": "Others"
  },
  {
    "key": "gift-card",
    "label": "Gift Card"
  }
];

export const OFFICIAL_PRODUCTS: OfficialProduct[] = [
  {
    "id": 196,
    "name": "Valorant",
    "slug": "valorant",
    "category": "Games",
    "picture": assetUrl("/games/valorant.png"),
    "discountTag": "5% OFF",
    "rating": 5,
    "reviewsCount": 576,
    "minPrice": 199,
    "maxPrice": 3992,
    "description": "Buy Valorant Points (VP) in the Philippines at GPDS Game Shop with discounted PHP pricing. Pay with GCash, Maya, GrabPay, or QRPH. VP is credited directly to your Valorant account in 1 to 5 minutes using only your Riot ID and Tagline.",
    "isGiftCard": false
  },
  {
    "id": 262,
    "name": "Lordnine : Infinite Class",
    "slug": "lordnine-infinite-class",
    "category": "Games",
    "picture": assetUrl("/games/lordnine-infinite-class.webp"),
    "discountTag": "5% OFF",
    "rating": 5,
    "reviewsCount": 1278,
    "minPrice": 132,
    "maxPrice": 4461,
    "description": "Buy cheap LORDNINE: Infinite Class Diamonds in the Philippines at GPDS Game Shop. UID + Character Name top-up via Smilegate STOVE. GCash, Maya, QRPH supported.",
    "isGiftCard": false
  },
  {
    "id": 240,
    "name": "LEAGUE OF LEGENDS : WILD RIFT",
    "slug": "league-of-legends-wild-rift",
    "category": "Games",
    "picture": assetUrl("/games/league-of-legends-wild-rift.webp"),
    "discountTag": "15% OFF",
    "rating": 5,
    "reviewsCount": 94,
    "minPrice": 195,
    "maxPrice": 4108,
    "description": "Buy cheap League of Legends Wild Rift Wild Cores in the Philippines at GPDS Game Shop. Riot ID top-up for Wild Pass, champions, and premium skins. GCash, Maya, QRPH supported.",
    "isGiftCard": false
  },
  {
    "id": 160,
    "name": "Ragnarok M Classic - UID",
    "slug": "ragnarok-m-classic-uid",
    "category": "Games",
    "picture": assetUrl("/games/ragnarok-m-classic-uid.png"),
    "discountTag": "20% OFF",
    "rating": 5,
    "reviewsCount": 1284,
    "minPrice": 158,
    "maxPrice": 90901,
    "description": "Buy cheap Ragnarok M: Classic Zeny in the Philippines at GPDS Game Shop. Character ID top-up for the game's Zeny-only economy. GCash, Maya, QRPH supported.",
    "isGiftCard": false
  },
  {
    "id": 187,
    "name": "Roblox Gift Card",
    "slug": "roblox-gift-card",
    "category": "Games",
    "picture": assetUrl("/games/roblox-gift-card.jpg"),
    "discountTag": "5% OFF",
    "rating": 5,
    "reviewsCount": 660,
    "minPrice": 70,
    "maxPrice": 23144,
    "description": "Buy a Roblox gift card in the Philippines at GPDS. Pay with GCash, Maya, or QRPH and get a digital Robux code by email to redeem at roblox.com/redeem.",
    "isGiftCard": false
  },
  {
    "id": 49,
    "name": "Crystal of Atlan",
    "slug": "crystal-of-atlan",
    "category": "Games",
    "picture": assetUrl("/games/crystal-of-atlan.webp"),
    "discountTag": "15% OFF",
    "rating": 5,
    "reviewsCount": 2060,
    "minPrice": 54,
    "maxPrice": 106447,
    "description": "Buy cheap Crystal of Atlan Vouchers, Opals, and Phantasium Pass in the Philippines at GPDS Game Shop. Player ID top-up for gacha and packs. GCash, Maya, QRPH.",
    "isGiftCard": false
  },
  {
    "id": 308,
    "name": "Ragnarok: The New World TH",
    "slug": "ragnarok-the-new-world",
    "category": "New Release",
    "picture": assetUrl("/games/ragnarok-the-new-world.png"),
    "discountTag": "10% OFF",
    "rating": 5,
    "reviewsCount": 4185,
    "minPrice": 66,
    "maxPrice": 134854,
    "description": "Top up Ragnarok: The New World Thailand Starstones and passes through a OneOne OOC payment link. Select the Thailand region and complete secure GPDS checkout.",
    "isGiftCard": false
  },
  {
    "id": 252,
    "name": "RF Online Next PH via Razer",
    "slug": "rf-online-next",
    "category": "New Release",
    "picture": assetUrl("/games/rf-online-next.webp"),
    "discountTag": "10% OFF",
    "rating": 5,
    "reviewsCount": 22547,
    "minPrice": 53,
    "maxPrice": 3906,
    "description": "Top up RF Online Next Cash Points at GPDS Philippines. UID and Server only, no login needed. Bellato, Corra, Acresia factions. GCash, Maya, PayPal.",
    "isGiftCard": false
  },
  {
    "id": 299,
    "name": "Ragnarok Origin Classic",
    "slug": "ragnarok-origin-classic",
    "category": "New Release",
    "picture": assetUrl("/games/ragnarok-origin-classic.png"),
    "discountTag": "15% OFF",
    "rating": 5,
    "reviewsCount": 3651,
    "minPrice": 53,
    "maxPrice": 25745,
    "description": "Safely buy the most affordable Ragnarok Origin Classic Top Up in Philippines, backed by 10x Money-Back Guarantee, only at GPDS GAME SHOP Philippines! Top-up payments",
    "isGiftCard": false
  },
  {
    "id": 372,
    "name": "Architect : Land of Exiles",
    "slug": "architect-land-of-exiles",
    "category": "New Release",
    "picture": assetUrl("/games/architect-land-of-exiles.jpg"),
    "discountTag": null,
    "rating": 5,
    "reviewsCount": 10,
    "minPrice": 298,
    "maxPrice": 20427,
    "description": "Buy Architect: Land of Exiles Diamonds at GPDS. Generate a MyCard payment link from the official DRIMAGE Web Shop, then complete checkout in PHP.",
    "isGiftCard": false
  },
  {
    "id": 279,
    "name": "Ragnarok Twilight",
    "slug": "ragnarok-twilight",
    "category": "New Release",
    "picture": assetUrl("/games/ragnarok-twilight.webp"),
    "discountTag": "10% OFF",
    "rating": 5,
    "reviewsCount": 24,
    "minPrice": 276,
    "maxPrice": 78867,
    "description": "Buy cheap Ragnarok Twilight Big Cat Gems in PH via Account ID + Server, no password. Fashion Roulette, Hero Transformation. GCash, Maya, QRPH. 3-7 min delivery.",
    "isGiftCard": false
  },
  {
    "id": 282,
    "name": "Blue Protocol : Star Resonance Global",
    "slug": "blue-protocol-star-resonance-global",
    "category": "New Release",
    "picture": assetUrl("/games/blue-protocol-star-resonance-global.png"),
    "discountTag": "6% OFF",
    "rating": 5,
    "reviewsCount": 3,
    "minPrice": 41,
    "maxPrice": 5327,
    "description": "Buy Blue Protocol Star Resonance Star Crystals cheap. UID-based top up via your User ID and Server. Pay GCash, Maya, GrabPay, QRPH, PayPal, Wise, USDT. PH-based.",
    "isGiftCard": false
  },
  {
    "id": 351,
    "name": "Ragnarok Zero: Global PH",
    "slug": "ragnarok-zero-global-philippines",
    "category": "Trending Games",
    "picture": assetUrl("/games/ragnarok-zero-global-philippines.webp"),
    "discountTag": "5% OFF",
    "rating": 5,
    "reviewsCount": 3526,
    "minPrice": 55,
    "maxPrice": 11030,
    "description": "Buy Ragnarok Zero Global Philippines Kafra Points and Game Access Passes at GPDS using a secure OneOne OOC payment link with PHP checkout.",
    "isGiftCard": false
  },
  {
    "id": 135,
    "name": "Blood Strike Top-up",
    "slug": "blood-strike",
    "category": "Trending Games",
    "picture": assetUrl("/games/blood-strike.webp"),
    "discountTag": "15% OFF",
    "rating": 5,
    "reviewsCount": 1868,
    "minPrice": 27,
    "maxPrice": 24023,
    "description": "Buy cheap Blood Strike Gold in the Philippines at GPDS Game Shop. User ID top-up for Elite Strike Pass, S-tier Strikers, and Mythic skins. GCash, Maya, QRPH.",
    "isGiftCard": false
  },
  {
    "id": 271,
    "name": "BLEACH: Soul Resonance",
    "slug": "bleach-soul-resonance",
    "category": "Trending Games",
    "picture": assetUrl("/games/bleach-soul-resonance.webp"),
    "discountTag": "10% OFF",
    "rating": 5,
    "reviewsCount": 867,
    "minPrice": 52,
    "maxPrice": 51985,
    "description": "Buy cheap Bleach: Soul Resonance Spiritual Jade, Monthly Card, and Battle Pass in PH at GPDS Game Shop. Top up to your Nuverse account using only Player ID and Server, no password. GCash, Maya, QRPH, Visa, PayPal, Wise, USDT. 1 to 5 min, since 2018.",
    "isGiftCard": false
  },
  {
    "id": 237,
    "name": "Mobile Legends PH",
    "slug": "mobile-legends",
    "category": "Trending Games",
    "picture": assetUrl("/games/mobile-legends.webp"),
    "discountTag": "25% OFF",
    "rating": 5,
    "reviewsCount": 27225,
    "minPrice": 45,
    "maxPrice": 19033,
    "description": "Top up Mobile Legends in the Philippines and save up to 25% on MLBB diamonds. Pay with GCash, Maya, GrabPay, QRPH, cards, PayPal, Wise, or USDT. Delivered in 1–5 minutes.",
    "isGiftCard": false
  },
  {
    "id": 186,
    "name": "Honor of Kings",
    "slug": "honor-of-kings",
    "category": "Trending Games",
    "picture": assetUrl("/games/honor-of-kings.webp"),
    "discountTag": "10% OFF",
    "rating": 5,
    "reviewsCount": 285,
    "minPrice": 11,
    "maxPrice": 5533,
    "description": "Top up Honor of Kings (HoK) Tokens in the Philippines at GPDS Game Shop. Save up to 10% off official prices, pay with GCash, Maya, or QRPH, and receive tokens in 1–5 minutes using only your Player ID and Server.",
    "isGiftCard": false
  },
  {
    "id": 23,
    "name": "Dragon Nest M: Classic - SEA",
    "slug": "dragon-nest-m-top-up-sea",
    "category": "Trending Games",
    "picture": assetUrl("/games/dragon-nest-m-top-up-sea.webp"),
    "discountTag": "15% OFF",
    "rating": 5,
    "reviewsCount": 8678,
    "minPrice": 243,
    "maxPrice": 23920,
    "description": "Buy Dragon Nest M: Classic SEA Cash and DN Pass at GPDS with your User ID and Server ID. No password needed. Pay GCash, Maya, QRPH. Fast delivery since 2018.",
    "isGiftCard": false
  },
  {
    "id": 305,
    "name": "HeeSay",
    "slug": "heesay",
    "category": "Entertainment",
    "picture": assetUrl("/games/heesay.png"),
    "discountTag": "15% OFF",
    "rating": 5,
    "reviewsCount": 120,
    "minPrice": 42,
    "maxPrice": 5538,
    "description": "Top up HeeSay Beans cheap at GPDS Game Shop Philippines. HeeSay ID only, no login. GCash, Maya, QRPH, PayPal accepted. Trusted since 2018.",
    "isGiftCard": false
  },
  {
    "id": 25,
    "name": "Uplive",
    "slug": "uplive",
    "category": "Entertainment",
    "picture": assetUrl("/games/uplive.png"),
    "discountTag": null,
    "rating": 5,
    "reviewsCount": 1,
    "minPrice": 65,
    "maxPrice": 33946,
    "description": "Recharge cheap Uplive Diamonds in the Philippines at GPDS Game Shop. Top up by Uplive ID, no login, via GCash, Maya, QRPH, or PayPal. Delivered in minutes.",
    "isGiftCard": false
  },
  {
    "id": 29,
    "name": "WeSing",
    "slug": "wesing",
    "category": "Entertainment",
    "picture": assetUrl("/games/wesing.jpg"),
    "discountTag": null,
    "rating": 5,
    "reviewsCount": 3,
    "minPrice": 47,
    "maxPrice": 93,
    "description": "Top up WeSing Kcoins at GPDS Philippines. WeSing ID only, no password needed. Gift performers, tip live streamers, unlock OPM songs. GCash.",
    "isGiftCard": false
  },
  {
    "id": 256,
    "name": "Discord Nitro",
    "slug": "discord-nitro",
    "category": "Entertainment",
    "picture": assetUrl("/games/discord-nitro.webp"),
    "discountTag": "5% OFF",
    "rating": 5,
    "reviewsCount": 120,
    "minPrice": 6507,
    "maxPrice": 6507,
    "description": "Buy cheap Discord Nitro & Nitro Basic gift codes in PH. 1, 3, or 12 months. No login needed. GCash, Maya, QRPH. 3 to 8 min email delivery.",
    "isGiftCard": false
  },
  {
    "id": 274,
    "name": "MIKA CHAT COINS",
    "slug": "mika-chat-coins",
    "category": "Entertainment",
    "picture": assetUrl("/games/mika-chat-coins.webp"),
    "discountTag": "5% OFF",
    "rating": 5,
    "reviewsCount": 120,
    "minPrice": 67,
    "maxPrice": 3331,
    "description": "Buy Mika Chat Coins at GPDS Game Shop. Fast, secure top-up for your favorite chat app. Enjoy smooth transactions and quick delivery with trusted service.",
    "isGiftCard": false
  },
  {
    "id": 303,
    "name": "LivU",
    "slug": "livu",
    "category": "Entertainment",
    "picture": assetUrl("/games/livu.png"),
    "discountTag": "15% OFF",
    "rating": 5,
    "reviewsCount": 2,
    "minPrice": 186,
    "maxPrice": 55110,
    "description": "Buy Livu Coins & Diamonds PH Beans cheap at GPDS Game Shop Philippines. HeeSay ID only, no login. GCash, Maya, QRPH, PayPal accepted. Trusted since 2018.",
    "isGiftCard": false
  },
  {
    "id": 356,
    "name": "Razer Gold Direct Top-Up Pin (PHP)",
    "slug": "razer-gold-direct-top-up-pin-php",
    "category": "Voucher",
    "picture": assetUrl("/games/razer-gold-direct-top-up-pin-php.webp"),
    "discountTag": null,
    "rating": 4.9,
    "reviewsCount": 39,
    "minPrice": 21,
    "maxPrice": 5082,
    "description": "Buy Razer Gold Direct Top-Up PIN PHP at GPDS in values from PHP 20 to PHP 5,000. Use the digital PIN on supported game checkouts in the Philippines.",
    "isGiftCard": false
  },
  {
    "id": 344,
    "name": "Microsoft Office & Windows OEM Global",
    "slug": "microsoft-office-windows-oem-global",
    "category": "Voucher",
    "picture": assetUrl("/games/microsoft-office-windows-oem-global.webp"),
    "discountTag": "80% OFF",
    "rating": 5,
    "reviewsCount": 1,
    "minPrice": 598,
    "maxPrice": 2649,
    "description": "Buy Microsoft Office and Windows OEM Global product keys at GPDS Game Shop. Choose Windows 10/11 or Office 2016/2019/2021 with digital delivery.",
    "isGiftCard": false
  },
  {
    "id": 192,
    "name": "Steam Wallet Code",
    "slug": "steam-wallet-code",
    "category": "Voucher",
    "picture": assetUrl("/games/steam-wallet-code.webp"),
    "discountTag": "5% OFF",
    "rating": 5,
    "reviewsCount": 872,
    "minPrice": 50,
    "maxPrice": 2200,
    "description": "Buy a Steam Wallet Code in the Philippines at GPDS. Pay with GCash, Maya, or QRPH and get a digital code by email to redeem on your PH Steam account.",
    "isGiftCard": false
  },
  {
    "id": 230,
    "name": "PlayStation® Gift Card (PSN)",
    "slug": "voucher-playstation-network-psn",
    "category": "Voucher",
    "picture": assetUrl("/games/voucher-playstation-network-psn.webp"),
    "discountTag": "5% OFF",
    "rating": 5,
    "reviewsCount": 207,
    "minPrice": 67,
    "maxPrice": 18578,
    "description": "Buy cheap PSN wallet codes in the Philippines at GPDS Game Shop in 9 regional currencies (USD, SGD, HKD, JPY, GBP, EUR, IDR, TRY, BRL). Match the card to your account region. GCash, Maya, QRPH, Visa, PayPal, Wise, USDT. 1 to 5 min email delivery.",
    "isGiftCard": false
  },
  {
    "id": 339,
    "name": "GPDS Gift Card",
    "slug": "gpds-gift-card",
    "category": "Voucher",
    "picture": assetUrl("/games/gpds-gift-card.png"),
    "discountTag": null,
    "rating": 5,
    "reviewsCount": 89,
    "minPrice": 100,
    "maxPrice": 10000,
    "description": "Buy a GPDS Gift Card and send game top-up credit to friends, family, and loved ones. Fast delivery with GCash, Maya, cards, PayPal, Wise, and USDT",
    "isGiftCard": true
  },
  {
    "id": 336,
    "name": "Voucher LDCloud",
    "slug": "voucher-ldcloud",
    "category": "Voucher",
    "picture": assetUrl("/games/voucher-ldcloud.webp"),
    "discountTag": "10% OFF",
    "rating": 4.4,
    "reviewsCount": 7,
    "minPrice": 37,
    "maxPrice": 391,
    "description": "Buy Voucher LDCloud in the Philippines at GPDS Game Shop. Instant delivery, no password needed. Pay with GCash, Maya, QRPH, cards, PayPal, Wise, or USDT.",
    "isGiftCard": false
  },
  {
    "id": 325,
    "name": "Nord VPN Voucher",
    "slug": "nord-vpn-voucher",
    "category": "Voucher",
    "picture": assetUrl("/games/nord-vpn-voucher.png"),
    "discountTag": "5% OFF",
    "rating": 5,
    "reviewsCount": 3,
    "minPrice": 691,
    "maxPrice": 691,
    "description": "Buy NordVPN subscription/account in the Philippines at GPDS Game Shop. Enjoy secure browsing, online privacy, fast VPN access, streaming, gaming, and safe internet use.",
    "isGiftCard": false
  },
  {
    "id": 272,
    "name": "Blizzard Gift Card",
    "slug": "blizzard-gift-card",
    "category": "Voucher",
    "picture": assetUrl("/games/blizzard-gift-card.webp"),
    "discountTag": "10% OFF",
    "rating": 5,
    "reviewsCount": 6,
    "minPrice": 1278,
    "maxPrice": 4561,
    "description": "Get your Blizzard Gift Card now at GPDS Game Shop. Top up Battle.net for games like Diablo, WoW, and Overwatch. Fast delivery and secure local payments.",
    "isGiftCard": false
  },
  {
    "id": 300,
    "name": "The Seven Deadly Sins: Origin Log In",
    "slug": "seven-deadlysins-origin",
    "category": "Popular Games",
    "picture": assetUrl("/games/seven-deadlysins-origin.png"),
    "discountTag": "10% OFF",
    "rating": 5,
    "reviewsCount": 120,
    "minPrice": 50,
    "maxPrice": 4895,
    "description": "Buy The Seven Deadly Sins: Origin Star Memory cheap. Login-based top up via Netmarble account. Pay GCash, Maya, QRPH, PayPal. Cross-platform sync.",
    "isGiftCard": false
  },
  {
    "id": 17,
    "name": "Ragnarok Online 3",
    "slug": "ragnarok-online-3",
    "category": "Popular Games",
    "picture": assetUrl("/games/ragnarok-online-3.png"),
    "discountTag": null,
    "rating": 5,
    "reviewsCount": 120,
    "minPrice": 50,
    "maxPrice": 500,
    "description": "Buy Ragnarok Online 3 Diamonds at GPDS Game Shop. Pay GCash, Maya, QRPH. Instant UID delivery, PH support since 2018, no login required.",
    "isGiftCard": false
  },
  {
    "id": 38,
    "name": "Legend of Mushroom: Rush",
    "slug": "legend-of-mushroom-rush",
    "category": "Popular Games",
    "picture": assetUrl("/games/legend-of-mushroom-rush.jpg"),
    "discountTag": null,
    "rating": 5,
    "reviewsCount": 6,
    "minPrice": 51,
    "maxPrice": 30701,
    "description": "Buy Legend of Mushroom: Rush Gems cheap. UID-based top up via User ID and Server (ID/TH/CN/VN/EN). Pay GCash, Maya, QRPH, PayPal. Gems are paid, Diamonds earned.",
    "isGiftCard": false
  },
  {
    "id": 143,
    "name": "Ragnarok Idle Adventure Plus",
    "slug": "ragnarok-idle-adventure-plus",
    "category": "Popular Games",
    "picture": assetUrl("/games/ragnarok-idle-adventure-plus.webp"),
    "discountTag": null,
    "rating": 5,
    "reviewsCount": 285,
    "minPrice": 48,
    "maxPrice": 48057,
    "description": "Cheap Ragnarok Idle Adventure Plus Voucher in PH at GPDS. Secret Code + Server, no password. Vouchers convert to Gold Poring in-game. GCash, Maya. 4-8 min.",
    "isGiftCard": false
  },
  {
    "id": 183,
    "name": "Poppo Live Coins",
    "slug": "poppo-live-coins",
    "category": "Others",
    "picture": assetUrl("/games/poppo-live-coins.png"),
    "discountTag": "15% OFF",
    "rating": 5,
    "reviewsCount": 2911,
    "minPrice": 7,
    "maxPrice": 239803,
    "description": "Buy cheap Poppo Live Coins in PH via your UID, no password needed. Send gifts to streamers, unlock VIP. GCash, Maya, QRPH. 4 to 7 min delivery.",
    "isGiftCard": false
  },
  {
    "id": 281,
    "name": "TikTok China Diamonds Douyin",
    "slug": "tiktok-china-diamonds-douyin",
    "category": "Others",
    "picture": assetUrl("/games/tiktok-china-diamonds-douyin.webp"),
    "discountTag": "5% OFF",
    "rating": 5,
    "reviewsCount": 8,
    "minPrice": 312,
    "maxPrice": 207978,
    "description": "Buy Douyin (TikTok China) Diamonds cheap. UID-only top up via your Douyin account. Pay GCash, Maya, QRPH, PayPal. For live-stream gifting, not TikTok International.",
    "isGiftCard": false
  },
  {
    "id": 291,
    "name": "Tango Live",
    "slug": "tango-live",
    "category": "Others",
    "picture": assetUrl("/games/tango-live.png"),
    "discountTag": "10% OFF",
    "rating": 5,
    "reviewsCount": 7,
    "minPrice": 57,
    "maxPrice": 57286,
    "description": "Buy cheap Tango Live Coins in the Philippines for gifts, VIP perks, and Top Gifter rankings. Pay with GCash, Maya, GrabPay, QRPH, PayPal, Wise, or USDT. Credited instantly to your Tango ID. Trusted PH support since 2018.",
    "isGiftCard": false
  },
  {
    "id": 313,
    "name": "Mobile Load & DATA",
    "slug": "mobile-load-and-promo",
    "category": "Others",
    "picture": assetUrl("/games/mobile-load-and-promo.png"),
    "discountTag": "5% OFF",
    "rating": 4.9,
    "reviewsCount": 54,
    "minPrice": 10,
    "maxPrice": 1005,
    "description": "Buy mobile load and data promos online at GPDS Game Shop. Fast delivery for Globe, TM, Smart, TNT, DITO, GIGA, GoPLUS, Magic Data, call, text, and gaming promos in the Philippines.",
    "isGiftCard": false
  },
  {
    "id": 27,
    "name": "CHAMET",
    "slug": "chamet",
    "category": "Others",
    "picture": assetUrl("/games/chamet.png"),
    "discountTag": "15% OFF",
    "rating": 5,
    "reviewsCount": 1451,
    "minPrice": 209,
    "maxPrice": 69801,
    "description": "Buy cheap Chamet Diamonds in PH via your UID, no password needed. Send gifts to hosts, unlock translation, party rooms. GCash, Maya, QRPH. 3-4 min delivery.",
    "isGiftCard": false
  },
  {
    "id": 193,
    "name": "Starmaker karaoke",
    "slug": "starmaker-karaoke",
    "category": "Others",
    "picture": assetUrl("/games/starmaker-karaoke.png"),
    "discountTag": "15% OFF",
    "rating": 5,
    "reviewsCount": 1,
    "minPrice": 48,
    "maxPrice": 36989,
    "description": "Buy StarMaker Coins cheap. Login-based top up via StarMaker email, password, and SID. Pay GCash, Maya, GrabPay, QRPH, PayPal. For Filipino singers and supporters.",
    "isGiftCard": false
  },
  {
    "id": 33,
    "name": "Iphone 16 Promax",
    "slug": "iphone-16-promax",
    "category": "Electronic Devices",
    "picture": assetUrl("/games/iphone-16-promax.jpg"),
    "discountTag": null,
    "rating": 5,
    "reviewsCount": 120,
    "minPrice": 50,
    "maxPrice": 500,
    "description": "Order the latest iPhone 16 Pro Max at GPDS Game Shop. Trusted seller, secure checkout, and fast nationwide shipping for all buyers across the country.",
    "isGiftCard": false
  },
  {
    "id": 259,
    "name": "Iphone 12",
    "slug": "iphone-12",
    "category": "Electronic Devices",
    "picture": assetUrl("/games/iphone-12.png"),
    "discountTag": null,
    "rating": 5,
    "reviewsCount": 120,
    "minPrice": 27660,
    "maxPrice": 27660,
    "description": "Buy an unlocked Apple iPhone 12 in the Philippines: 64GB, 128GB, or 256GB in new, refurbished, or inspected used condition. Pay with GCash, Maya, GrabPay, QRPH, PayPal, Wise, or USDT. Tracked nationwide shipping, GPDS Game Shop since 2018.",
    "isGiftCard": false
  },
  {
    "id": 53,
    "name": "Microsoft Office 2021 Pro",
    "slug": "microsoft-office-2021-pro",
    "category": "CDKEYS",
    "picture": assetUrl("/games/microsoft-office-2021-pro.jpg"),
    "discountTag": null,
    "rating": 5,
    "reviewsCount": 120,
    "minPrice": 50,
    "maxPrice": 500,
    "description": "Microsoft Office 2021 Pro product key delivered after payment. One-time purchase. Word, Excel, PowerPoint, Outlook, Publisher, Access, OneNote. GCash accepted.",
    "isGiftCard": false
  },
  {
    "id": 54,
    "name": "Microsoft Windows 11 Pro CDKEY",
    "slug": "microsoft-windows-11-pro-cdkey",
    "category": "CDKEYS",
    "picture": assetUrl("/games/microsoft-windows-11-pro-cdkey.jpg"),
    "discountTag": null,
    "rating": 5,
    "reviewsCount": 120,
    "minPrice": 50,
    "maxPrice": 500,
    "description": "Buy a Microsoft Windows 11 Pro CD key in the Philippines with GCash, Maya, or QRPH. Instant key delivery and activation help from GPDS Game Shop.",
    "isGiftCard": false
  },
  {
    "id": 358,
    "name": "SM Gift Pass Philippines",
    "slug": "sm-gift-pass-philippines",
    "category": "Gift Card",
    "picture": assetUrl("/games/sm-gift-pass-philippines.png"),
    "discountTag": null,
    "rating": 5,
    "reviewsCount": 120,
    "minPrice": 114,
    "maxPrice": 5701,
    "description": "",
    "isGiftCard": false
  },
  {
    "id": 359,
    "name": "Playstation Austria",
    "slug": "playstation-austria",
    "category": "Gift Card",
    "picture": assetUrl("/games/playstation-austria.webp"),
    "discountTag": null,
    "rating": 5,
    "reviewsCount": 120,
    "minPrice": 632,
    "maxPrice": 15801,
    "description": "",
    "isGiftCard": true
  }
];

export const OFFICIAL_BLOGS: OfficialBlog[] = [
  {
    "id": 1062,
    "title": "Omega vs Aurora How to Watch September 18: 7:30 p.m. PHT Rematch",
    "slug": "omega-vs-aurora-how-to-watch-sept-18",
    "excerpt": "Smart Omega faces Aurora Gaming PH on Friday, September 18 at 7:30 p.m. PHT at Victoria Sports Tower. Omega sits 4–3 after two Week 4 2–1 wins. Aurora is 3–4 after a Week 3 2–0. Official streams plus the 5:00 p.m. Liquid–TNC opener.",
    "thumbnail": assetUrl("/blogs/omega-vs-aurora-how-to-watch-sept-18.jpg"),
    "category": "News",
    "author": "Gpds News Blog",
    "publishedAt": "2026-09-18"
  },
  {
    "id": 1061,
    "title": "Wo Long 2 Release Date: March 4, 2027 and Alpha Demo",
    "slug": "wo-long-2-release-date",
    "excerpt": "Koei Tecmo locked the Wo Long 2 release date to March 4, 2027 on Steam, Xbox PC, PS5, Switch 2, and Game Pass. The free Alpha Demo is playable through September 30. Steam Philippines prints ₱3,267 tonight.",
    "thumbnail": assetUrl("/blogs/wo-long-2-release-date.jpg"),
    "category": "News",
    "author": "Gpds News Blog",
    "publishedAt": "2026-09-17"
  },
  {
    "id": 1060,
    "title": "MLBB Patch 2.2.16 Notes: Masha Revamp, Map Change September 28",
    "slug": "mlbb-patch-2-2-16-notes",
    "excerpt": "Original Server Patch 2.2.16 is live with Season 42. Masha and Bruno change kits, 12 heroes get buffs, and the 2026 Annual Map Change is dated September 28. This is the notes sheet, not the September 12 preview.",
    "thumbnail": assetUrl("/blogs/mlbb-patch-2-2-16-notes.jpg"),
    "category": "News",
    "author": "Gpds News Blog",
    "publishedAt": "2026-09-17"
  },
  {
    "id": 1059,
    "title": "RF Online Next Coupon Code Guide: Where to Enter Discounts",
    "slug": "rf-online-next-coupon-code-guide-where-to-enter-discounts",
    "excerpt": "Enter a valid coupon in the GPDS coupon field before payment and confirm that the final checkout total changes. A code is not applied merely because the field accepts text; the order summary must show...",
    "thumbnail": assetUrl("/blogs/rf-online-next-coupon-code-guide-where-to-enter-discounts.jpeg"),
    "category": "Guides",
    "author": "Elang Seo",
    "publishedAt": "2026-09-17"
  },
  {
    "id": 1058,
    "title": "RF Online Next Cash Points vs Shop Packages: What Are You Buying?",
    "slug": "rf-online-next-cash-points-vs-shop-packages-what-are-you-buying",
    "excerpt": "Cast Points are a premium balance, while shop packages are specific products with fixed included items or benefits. Compare what appears on the final purchase screen instead of treating every package...",
    "thumbnail": assetUrl("/blogs/rf-online-next-cash-points-vs-shop-packages-what-are-you-buying.jpeg"),
    "category": "Guides",
    "author": "Elang Seo",
    "publishedAt": "2026-09-17"
  },
  {
    "id": 1057,
    "title": "Ragnarok The New World Region Selection for PH Top-Up",
    "slug": "ragnarok-the-new-world-region-selection-for-ph-top-up",
    "excerpt": "For the GPDS Philippines payment-link flow, follow the region instruction shown on the live product page and GNJOY checkout. The current guide routes Filipino orders through the required regional opti...",
    "thumbnail": assetUrl("/blogs/ragnarok-the-new-world-region-selection-for-ph-top-up.jpeg"),
    "category": "Guides",
    "author": "Elang Seo",
    "publishedAt": "2026-09-17"
  },
  {
    "id": 1056,
    "title": "Things Every Ragnarok: The New World Beginner Should Buy First (And What to Skip)",
    "slug": "ragnarok-the-new-world-what-to-buy-first",
    "excerpt": "Knowing how to allocate your budget in Ragnarok: The New World saves time and resources. This guide ranks the top early purchases for new players, starting with the First Top-Up Pack. It also points out which cosmetic and gacha offers to ignore so you can focus on the best value for your account.",
    "thumbnail": assetUrl("/blogs/ragnarok-the-new-world-what-to-buy-first.webp"),
    "category": "Guides",
    "author": "Julie",
    "publishedAt": "2026-09-17"
  },
  {
    "id": 1055,
    "title": "Netmarble Opens Pre-Registration for Seven Knights Re:BIRTH x Demon Slayer Crossover, Free Tanjiro Included",
    "slug": "seven-knights-demon-slayer-free-tanjiro",
    "excerpt": "The Infinity Castle arc comes to Seven Knights Re:BIRTH this October. Pre-register for the four-week Demon Slayer collaboration to secure 10 summon vouchers and claim a Legendary Tanjiro Kamado just by logging in.",
    "thumbnail": assetUrl("/blogs/seven-knights-demon-slayer-free-tanjiro.webp"),
    "category": "News & Update",
    "author": "Julie",
    "publishedAt": "2026-09-17"
  }
];

export const OFFICIAL_FAQS: OfficialFaq[] = [
  {
    "id": 1,
    "question": "What is GPDS Game Shop?",
    "answer": "GPDS Game Shop is a Philippines-based digital top-up service founded in 2018 by Angelo \"bhadzki\" Leoncio. We sell discounted in-game currency, vouchers, and digital products for Mobile Legends: Bang Bang (MLBB), Honor of Kings (HoK), Genshin Impact, Valorant, Call of Duty Mobile, Ragnarok titles, and other popular games. We serve solo players, ranked grinders, streamers, and resellers across the Philippines through local payment methods like GCash, Maya, GrabPay, and QRPH. Learn more on our About page."
  },
  {
    "id": 2,
    "question": "Is GPDS Game Shop legit and safe?",
    "answer": "Yes. GPDS Game Shop is a Philippines-based digital top-up service that has operated since 2018. Customers can review independent feedback on Trustpilot and use GPDS's official support channels if they need help with an order. For direct top-ups, GPDS only requires the game information shown at checkout, such as a User ID and Server or Zone ID; it does not require your password, OTP, or two-factor authentication code. Orders are recorded in the system and can be tracked using the Order ID. For login-based products, enter any requested credentials only through the secure GPDS checkout page, never through email, social media, or an unsolicited message."
  },
  {
    "id": 13,
    "question": "How do I top up a game at GPDS Game Shop?",
    "answer": "To top up at GPDS Game Shop, visit the game page in our catalog, enter your in-game User ID (UID) and Server or Zone ID, choose the pack you want, and pay through any supported method. Most direct top-ups — including MLBB, Honor of Kings, and Genshin Impact — are credited within 1 to 5 minutes after payment confirmation. No download is needed; everything works in your browser at gpdsgameshop.com."
  },
  {
    "id": 14,
    "question": "Which games can I top up at GPDS Game Shop?",
    "answer": "GPDS Game Shop supports top-ups for Mobile Legends: Bang Bang, Honor of Kings, Genshin Impact, Honkai: Star Rail, Valorant, League of Legends: Wild Rift, Call of Duty Mobile, Ragnarok M Classic, Ragnarok Origin Classic, Dragon Nest M, Lord Nine, Blood Strike, The Seven Deadly Sins: Origin, Raven 2, Legend of YMIR, and other popular titles. We also sell vouchers like Razer Gold, Garena Shells, Xbox Gift Cards, PSN, Netflix, and Spotify, and live-streaming top-ups for Bigo, Poppo, Tango, and TikTok. Browse the full list on our games catalog."
  }
];

export const OFFICIAL_SITE_SETTINGS = {
  "appName": "GPDS GAME SHOP",
  "logoUrl": assetUrl("/gpds_logo.png"),
  "altLogoUrl": assetUrl("/gpds_alt_logo.png"),
  "iconUrl": assetUrl("/gpds_icon.png"),
  "popupImageUrl": assetUrl("/slider/free_code.png"),
  "whatsapp": "639774541147",
  "facebook": "https://facebook.com/GPDSgameShopPH",
  "instagram": "https://instagram.com/@gpdsgameshop",
  "tiktok": "https://tiktok.com/@gpdsgameshop",
  "baseCurrency": "PHP"
};
