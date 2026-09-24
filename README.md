# GPDS Website Design - Next-Gen E-Sports & Gaming Top-Up Platform

A modern, high-performance redesign for **GPDS Game Shop** (the premier gaming top-up platform in the Philippines). Built with React 19, Vite, TypeScript, and Tailwind CSS.

## 🚀 Live Public Preview
- **Live Preview URL**: [https://leanderchua.github.io/GPDS-Website-design/](https://leanderchua.github.io/GPDS-Website-design/)

---

## 🎮 Key Features
- **Official Brand Assets & Content**: Extracted real branding, transparent gold logos, badges, and all 48 official products from `gpdsgameshop.com`.
- **Dynamic E-Sports Arena Atmosphere**:
  - Interactive canvas particle system with mouse-tracking spotlights and squad mesh connections.
  - Sweeping tournament stadium spotlights and drifting auroras.
  - 3D perspective cyber arena floor grid with smooth scroll animations.
- **Compact & Modern Navigation**:
  - Compact sticky navbar with quick search (Cmd/Ctrl + K), localized currency selector (PHP, USD, EUR, SGD), and mobile navigation drawer.
  - Zero word-wrapping on promotional badges (`5% OFF`).
- **Interactive Top-Up Workflow**:
  - Instant server / Zone ID verification, diamond package selection, and payment method selector (GCash, Maya, QRPH, Cards, USDT).
- **Responsive & Accessible**: Seamlessly adapts across mobile, tablet, and ultra-wide displays.

---

## 🛠 Tech Stack
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS + Custom E-Sports Arena Animations
- **Icons**: Lucide React
- **Deployment**: GitHub Pages via GitHub Actions

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build
```

## Laravel Authentication API

The Laravel backend is in `backend/` and uses Sanctum session authentication. Start it with Laragon's PHP:

```powershell
cd backend
php artisan serve --host=127.0.0.1 --port=8000
```

The backend exposes these endpoints:

```php
// routes/api.php
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
  Route::get('/user', fn (Request $request) => $request->user());
  Route::post('/logout', [AuthController::class, 'logout']);
});
```

The backend is already configured for the Vite app at `http://localhost:3000`, uses SQLite, and includes the required migrations. The authenticated user response includes `id`, `name`, `email`, `avatar`, `vipTier`, `loyaltyPoints`, and `savedAccounts` so it matches the frontend `UserProfile` type.

### Google Sign-In Setup

Create a Google OAuth 2.0 Web application in Google Cloud Console and add this authorized redirect URI:

```text
http://localhost:8000/auth/google/callback
```

Put the generated credentials in `backend/.env`:

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

The same Google button is shown on both Sign In and Sign Up. Google accounts are linked by Google ID, or by email when an existing email account matches.

Copy `.env.example` to `.env` and update `VITE_API_URL` if Laravel is hosted somewhere other than `http://localhost:8000`.
