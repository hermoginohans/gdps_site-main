import React, { useState } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileTabBar } from './components/layout/MobileTabBar';
import { CartDrawer } from './components/common/CartDrawer';
import { QuickSearchModal } from './components/common/QuickSearchModal';
import { LoadingScreen } from './components/common/LoadingScreen';
import { PromotionalPopup } from './components/common/PromotionalPopup';
import { EsportsGlobalBackground } from './components/layout/EsportsGlobalBackground';

import { HomePage } from './pages/HomePage';
import { AdminPage } from './pages/AdminPage';
import { CatalogProvider, useCatalog } from './context/CatalogContext';
import { GAMES } from './data/mockData';
import { CatalogPages } from './pages/CatalogPages';
import { GamesPage } from './pages/GamesPage';
import { GameDetailPage } from './pages/GameDetailPage';
import { AuctionPage } from './pages/AuctionPage';
import { OrderTrackPage } from './pages/OrderTrackPage';
import { VouchersPage } from './pages/VouchersPage';
import { PartnershipPage } from './pages/PartnershipPage';
import { ShopPage } from './pages/ShopPage';
import { CartPage } from './pages/CartPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { DashboardPage } from './pages/DashboardPage';
import { AuthPages } from './pages/AuthPages';
import { AboutPage } from './pages/AboutPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

const AppContent: React.FC = () => {
  const { currentPath } = useRouter();
  const { isLoading } = useAuth();
  const { products, loading: catalogLoading } = useCatalog();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  if (isLoading) return <LoadingScreen />;
  if (currentPath === '/admin' || currentPath.startsWith('/admin/')) return <AdminPage />;

  // Router dispatcher
  const renderPage = () => {
    if (currentPath === '/') return <HomePage />;
    if (currentPath === '/games') return <GamesPage />;
    if (currentPath.startsWith('/games/')) return <GameDetailPage />;
    if (currentPath === '/auction') return <AuctionPage />;
    if (currentPath === '/payment' || currentPath === '/track') return <OrderTrackPage />;
    if (currentPath === '/vouchers' || currentPath === '/promo') return <VouchersPage />;
    if (currentPath.startsWith('/partnership')) return <PartnershipPage />;
    if (currentPath === '/shop') return <ShopPage />;
    if (currentPath === '/shop/cart') return <CartPage />;
    if (currentPath === '/blog') return <BlogPage />;
    if (currentPath.startsWith('/blog/')) return <BlogPostPage />;
    if (currentPath === '/dashboard') return <DashboardPage />;
    if (currentPath === '/login') return <AuthPages initialMode="login" />;
    if (currentPath === '/register') return <AuthPages initialMode="register" />;
    if (currentPath === '/reset-password') return <ResetPasswordPage />;
    if (currentPath === '/about') return <AboutPage />;
    if (currentPath === '/faqs') return <FaqPage />;
    if (currentPath === '/contact') return <ContactPage />;
    if (currentPath === '/terms-and-conditions') return <LegalPage initialTab="terms" />;
    if (currentPath === '/privacy-policy') return <LegalPage initialTab="privacy" />;
    if (currentPath === '/cookies-policy') return <LegalPage initialTab="cookies" />;

    // Fallback to HomePage
    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark text-brand-text relative selection:bg-brand-gold selection:text-black">
      {/* Global Dynamic E-Sports Ambient Atmosphere */}
      <EsportsGlobalBackground />

      {/* Top announcement ticker */}
      <AnnouncementBar />
      {currentPath === '/' && <PromotionalPopup />}

      {/* Main navigation header */}
      <Navbar onOpenSearch={() => setIsSearchModalOpen(true)} />

      {/* Main content body */}
      <main className="grow relative z-10">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile bottom quick tab bar */}
      <MobileTabBar />

      {/* Global interactive slide-out cart drawer */}
      <CartDrawer />

      {/* Command+K quick search modal */}
      <QuickSearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <RouterProvider>
      <CurrencyProvider>
        <AuthProvider>
          <CartProvider>
            <CatalogProvider><AppContent /></CatalogProvider>
          </CartProvider>
        </AuthProvider>
      </CurrencyProvider>
    </RouterProvider>
  );
};

export default App;
