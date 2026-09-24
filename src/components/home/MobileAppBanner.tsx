import { ArrowRight, Bell, Gift, Home, Menu, Search, Signal, Ticket, Wifi, Zap } from 'lucide-react';
import { Link } from '../../context/RouterContext';
import { assetUrl } from '../../utils/assets';

const APP_STORE_URL = 'https://apps.apple.com/ph/app/gpds-gameshop/id6760887841';
const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.gpdsgameshop.store&pli=1';

const games = [
  ['Mobile Legends', 'mobile-legends.webp'],
  ['Honor of Kings', 'honor-of-kings.webp'],
  ['Valorant', 'valorant.png'],
  ['Blood Strike', 'blood-strike.webp'],
  ['Crystal of Atlan', 'crystal-of-atlan.webp'],
  ['Steam Wallet', 'steam-wallet-code.webp'],
];

function StoreBadge({ platform, url }: { platform: 'ios' | 'android'; url: string }) {
  const content = <>
    {platform === 'ios' ? (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.05 12.54c.03 3.12 2.74 4.16 2.77 4.18-.02.07-.43 1.48-1.43 2.94-.86 1.26-1.75 2.51-3.15 2.54-1.38.03-1.83-.82-3.41-.82-1.57 0-2.06.79-3.36.85-1.35.05-2.38-1.36-3.25-2.61-1.78-2.56-3.14-7.24-1.31-10.4.91-1.57 2.53-2.56 4.29-2.59 1.34-.03 2.6.91 3.41.91.82 0 2.35-1.12 3.96-.96.67.03 2.56.27 3.78 2.06-.1.06-2.26 1.31-2.3 3.9ZM14.46 4.89c.72-.87 1.21-2.08 1.07-3.29-1.04.04-2.3.69-3.05 1.56-.67.77-1.26 2-1.1 3.18 1.16.09 2.35-.59 3.08-1.45Z" /></svg>
    ) : (
      <svg viewBox="0 0 28 32" aria-hidden="true"><path fill="#32bbff" d="M1 1 16 16 1 31Z"/><path fill="#00df83" d="m1 1 19 11-4 4Z"/><path fill="#ffcf45" d="m20 12 7 4-7 4-4-4Z"/><path fill="#ff5169" d="m1 31 15-15 4 4Z"/></svg>
    )}
    <span><small>{url ? (platform === 'ios' ? 'Download on the' : 'GET IT ON') : 'COMING SOON ON'}</small><strong>{platform === 'ios' ? 'App Store' : 'Google Play'}</strong></span>
  </>;
  return url ? <a className="app-store-badge" href={url} target="_blank" rel="noopener noreferrer">{content}</a>
    : <span className="app-store-badge app-store-pending" aria-label={`${platform === 'ios' ? 'App Store' : 'Google Play'} — coming soon`}>{content}</span>;
}

function PhonePreview({ android = false }: { android?: boolean }) {
  return <div className={`app-phone ${android ? 'app-phone-android' : 'app-phone-ios'}`}>
    <div className="app-phone-camera" />
    <div className="app-phone-screen">
      <div className="app-phone-status"><span>{android ? '12:30' : '9:41'}</span><span><Signal size={9}/><Wifi size={9}/><i /></span></div>
      <div className="app-phone-brand"><span><img src={assetUrl('/gpds_icon.png')} alt="" loading="lazy"/> GPDS</span><Bell size={15}/></div>
      <div className="app-phone-search"><Search size={11}/> Search games, top-up…</div>
      <div className="app-phone-hero"><img src={assetUrl('/slider/mlbb.webp')} alt="" loading="lazy"/><div><strong>{android ? <>TOP UP.<br/>GAME ON.</> : <>TOP UP.<br/>PLAY MORE.</>}</strong><span>Instant. Secure. Always on.</span></div></div>
      <div className="app-phone-tabs"><b>Popular</b><span>Mobile Games</span><span>Vouchers</span></div>
      <div className="app-phone-games">{games.map(([name, file]) => <div key={file}><img src={assetUrl(`/games/${file}`)} alt="" loading="lazy"/><strong>{name}</strong><span>Top-up</span></div>)}</div>
      <div className="app-phone-voucher"><Gift size={23}/><span><strong>App-only vouchers</strong><small>More games. More rewards.</small></span></div>
      <div className="app-phone-nav"><span><Home/>Home</span><span><Ticket/>Orders</span><span><Menu/>More</span></div>
    </div>
  </div>;
}

export function MobileAppBanner() {
  return <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="mobile-app-heading">
    <div className="app-promo">
      <div className="app-promo-main">
        <div className="app-promo-copy">
          <span className="app-promo-label">GPDS MOBILE</span>
          <h2 id="mobile-app-heading">Your next top-up.<br/>Always within reach.</h2>
          <p>Get the GPDS app for faster checkout, instant updates, and exclusive vouchers.</p>
          <div className="app-store-badges"><StoreBadge platform="ios" url={APP_STORE_URL}/><StoreBadge platform="android" url={GOOGLE_PLAY_URL}/></div>
          <Link to="/games" className="app-promo-web">Browse web store <ArrowRight size={17}/></Link>
        </div>
        <div className="app-promo-phones" aria-hidden="true"><div className="app-promo-orbit"/><PhonePreview/><PhonePreview android/></div>
      </div>
      <div className="app-promo-benefits">
        {[{ Icon: Zap, title: 'Fast checkout', copy: 'Top up in seconds, hassle-free.' }, { Icon: Bell, title: 'Real-time updates', copy: 'Know when your top-up is complete.' }, { Icon: Ticket, title: 'App-only vouchers', copy: 'Exclusive deals, right in the app.' }].map(({ Icon, title, copy }) => <div className="app-promo-benefit" key={title}><span className="app-benefit-icon"><Icon size={23}/></span><div><h3>{title}</h3><p>{copy}</p></div></div>)}
      </div>
    </div>
  </section>;
}
