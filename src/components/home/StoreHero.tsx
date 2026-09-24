import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Gamepad2, Headphones, Pause, Play, Star, Ticket, Wallet, Zap } from 'lucide-react';
import { Link } from '../../context/RouterContext';
import { OFFICIAL_SLIDERS } from '../../data/officialData';
import { assetUrl } from '../../utils/assets';
import './StoreHero.css';
import './StoreHeroReference.css';
import { useCatalog } from '../../context/CatalogContext';

const slides = [
  { name: 'MLBB', url: '/games/mobile-legends', picture: assetUrl('/hero-fantasy.png'), featured: true },
  ...OFFICIAL_SLIDERS.filter(slide => slide.name !== 'Welcome').map(slide => ({ ...slide, featured: false })),
];

export function StoreHero() {
  const { products, openProduct } = useCatalog();
  const shortcuts = ['mobile-legends', 'valorant', 'honor-of-kings', 'genshin'].map(term => products.find(product => product.slug.includes(term))).filter((product): product is NonNullable<typeof product> => !!product);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  useEffect(() => {
    if (paused || interacting || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setIndex(previous => (previous + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, [paused, interacting]);
  const slide = slides[index];
  const select = (next: number) => { setIndex((next + slides.length) % slides.length); setPaused(true); };

  return (
    <section className="store-hero" aria-labelledby="store-hero-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="store-hero-grid">
          <div className="store-hero-copy">
            <span className="store-hero-pill">PLAY MORE. PAY LESS.</span>
            <h1 id="store-hero-title">Your next win<br /><span>starts here.</span></h1>
            <p>Top up diamonds, tokens, and game vouchers for your favorites. Find your game and explore the packages.</p>
            <div className="store-hero-actions">
              <Link to="/games" className="hero-topup"><Zap size={21} fill="currentColor" aria-hidden="true" />Top up now <ArrowRight size={20} aria-hidden="true" /></Link>
              <Link to="/games" className="hero-explore"><Gamepad2 size={22} aria-hidden="true" />Explore games</Link>
            </div>
            <p className="store-hero-games">Mobile Legends · Honor of Kings · And more</p>
            
          </div>
          <div className="hero-carousel" role="region" aria-roledescription="carousel" aria-label="Featured promotions" onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocusCapture={() => setInteracting(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}>
            <div className={`hero-promo${slide.featured ? ' hero-promo-featured' : ''}`} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}: ${slide.name}`}>
              <img src={slide.picture} alt={slide.featured ? 'Blue-armored mage and golden warrior surrounded by glowing crystals' : slide.name} fetchPriority={index === 0 ? 'high' : 'auto'} />
              <div className="hero-promo-tags"><span><Star size={13} fill="currentColor" aria-hidden="true" />Featured top-up</span><span>{slide.name}</span></div>
              <div className="hero-promo-copy">
                <div><p>{slide.featured ? 'Mobile Legends: Bang Bang' : 'GPDS Game Shop'}</p><h2>{slide.featured ? <>More diamonds.<br />More possibilities.</> : slide.name}</h2>{slide.featured && <span>Find the right pack for your next match.</span>}</div>
                <Link to={slide.url} className="hero-deal">View deals <ArrowUpRight size={17} aria-hidden="true" /></Link>
              </div>
            </div>
            <div className="hero-carousel-controls">
              <button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play promotions' : 'Pause promotions'}>{paused ? <Play size={15} /> : <Pause size={15} />}</button>
              <div className="hero-carousel-dots">{slides.map((item, i) => <button type="button" key={`${item.name}-${i}`} onClick={() => select(i)} aria-label={`Show promotion ${i + 1}: ${item.name}`} aria-current={i === index ? 'true' : undefined}><span /></button>)}</div>
              <div className="hero-carousel-arrows"><button type="button" onClick={() => select(index - 1)} aria-label="Previous promotion"><ArrowLeft size={18} /></button><button type="button" onClick={() => select(index + 1)} aria-label="Next promotion"><ArrowRight size={18} /></button></div>
            </div>
          </div>
        </div>
        <div className="reference-benefits">{[{ icon: Zap, title: 'Easy top-ups', text: 'Find the right package' }, { icon: Gamepad2, title: 'Your favorite games', text: 'Explore our live catalog' }, { icon: Wallet, title: 'Try demo checkout', text: 'No real payment required' }, { icon: Headphones, title: 'Helpful support', text: 'We are here for you' }].map(item => <div key={item.title}><span><item.icon size={27} /></span><div><strong>{item.title}</strong><p>{item.text}</p></div></div>)}</div>
        <div className="reference-shortcut-heading"><h2>Jump into your game</h2><Link to="/games">Browse all games <ArrowRight size={17} /></Link></div>
        <div className="reference-game-shortcuts">{shortcuts.map(product => <button type="button" key={product.id} onClick={() => openProduct(product)}><img src={product.picture} alt="" /><strong>{product.name}</strong><span><ArrowRight size={20} /></span></button>)}</div>
      </div>
    </section>
  );
}
