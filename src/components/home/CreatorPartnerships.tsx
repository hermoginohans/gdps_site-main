import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Copy, Crown, Layers, Link2, Radio, Store, Swords, Zap } from 'lucide-react';
import { Link } from '../../context/RouterContext';
import './CreatorPartnerships.css';

const creators = [
  { code: 'BHADZKI', name: 'Yatoro', discount: '₱50 OFF', role: 'TI Winner', icon: Crown, tone: 'gold' },
  { code: 'PROGAMER', name: 'ShadowSlayer', discount: '5% OFF', role: 'MLBB Mythical Glory', icon: Zap, tone: 'purple' },
  { code: 'VALOPH', name: 'JettCarry', discount: '5% OFF', role: 'Radiant Tier', icon: Swords, tone: 'rose' },
  { code: 'GPDSVIP', name: 'Official VIP', discount: 'VIP Reseller Rates', role: 'Reseller Pass', icon: Crown, tone: 'gold' },
];
const programs = [
  { tab: 'affiliate', title: 'Affiliate Program', badge: '2% Commission', icon: Link2, tone: 'gold', description: 'Share your unique link and earn on every successful transaction. No upfront cost.', benefits: ['Unique referral link', 'Earn on successful orders', 'No setup cost'], action: 'Become an affiliate' },
  { tab: 'streamer', title: 'Streamer Program', badge: '2% + 1% Viewer Discount', icon: Radio, tone: 'cyan', description: 'Earn commission while your viewers enjoy an exclusive discount on every order.', benefits: ['Your own creator code', 'Viewer discounts', 'Creator commissions'], action: 'Join as a streamer' },
  { tab: 'reseller', title: 'Become a Reseller', badge: 'Silver / Gold / Platinum', icon: Layers, tone: 'purple', description: 'Unlock tiered reseller rates. The more you top up, the better your pricing gets.', benefits: ['Exclusive reseller pricing', 'Three membership tiers', 'Scale as you grow'], action: 'Explore reseller tiers' },
  { tab: 'website', title: 'Create Your Website', badge: 'VIP Reseller Pricing', icon: Store, tone: 'green', description: 'Launch your own gaming top-up shop from ₱50,000.', benefits: ['Your own branding', 'Admin panel included', 'Direct API access'], action: 'Build your shop' },
];

export function CreatorPartnerships() {
  const [copied, setCopied] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copyCode(code: string) {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setMessage(`${code} copied to clipboard.`);
      timer.current = setTimeout(() => setCopied(null), 2200);
    } catch {
      setCopied(null);
      setMessage(`Could not access the clipboard. Select and copy ${code} manually.`);
    }
  }

  return (
    <div className="creator-partnerships max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section aria-labelledby="creator-perks-title">
        <div className="creator-eyebrow">Creator perks <span /></div>
        <div className="creator-heading-row">
          <div>
            <h2 id="creator-perks-title">Support your favorites. <span>Save on every top-up.</span></h2>
            <p>Use a creator code at checkout to unlock your discount.</p>
          </div>
          <Link to="/partnership?tab=streamer" className="creator-partner-link">Become a partner <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
        <div className="creator-card-grid">
          {creators.map((creator, index) => (
            <article key={creator.code} className={`creator-card${index === 0 ? ' creator-featured' : ''}`}>
              <div className="creator-profile">
                <span className={`partnership-icon tone-${creator.tone}`}><creator.icon aria-hidden="true" /></span>
                <div className="creator-details">
                  <span className="creator-role">{creator.role}</span>
                  <h3>{creator.name}</h3>
                  <p className="creator-discount">{creator.discount}</p>
                </div>
              </div>
              <div className="creator-code-divider">
                <div className="creator-code-strip">
                  <code>{creator.code}</code>
                  <button type="button" onClick={() => void copyCode(creator.code)} aria-label={`Copy ${creator.code} creator code`}>
                    {copied === creator.code ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
                    {copied === creator.code ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="creator-copy-status" role="status">{message}</p>
      </section>

      <section className="partnership-section" aria-labelledby="partnership-programs-title">
        <div className="partnership-heading">
          <div className="partnership-eyebrow"><span>Earn with GPDS</span></div>
          <h2 id="partnership-programs-title">Your <span>next level</span> starts here.</h2>
          <p>Choose a partnership that fits your goals.</p>
        </div>
        <div className="partnership-card-grid">
          {programs.map((program, index) => (
            <article key={program.tab} className={`partnership-card tone-${program.tone}${index === 0 ? ' creator-featured' : ''}`}>
              <div className="partnership-card-heading">
                <span className="partnership-icon"><program.icon aria-hidden="true" /></span>
                <div><span className="partnership-badge">{program.badge}</span><h3>{program.title}</h3></div>
              </div>
              <p className="partnership-description">{program.description}</p>
              <ul>{program.benefits.map(benefit => <li key={benefit}><span><Check size={12} strokeWidth={3} aria-hidden="true" /></span>{benefit}</li>)}</ul>
              <Link to={`/partnership?tab=${program.tab}`} className={`partnership-action${index === 0 ? ' partnership-action-primary' : ''}`}>{program.action} <ArrowRight size={17} aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
