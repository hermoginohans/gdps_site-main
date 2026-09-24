import { Headphones, Link2, Users, Video, Gift, TrendingUp } from 'lucide-react';
import { OFFICIAL_SITE_SETTINGS } from '../../data/officialData';
import './DashboardAuction.css';

export function DashboardPartnerRegistration({ program }: { program: 'affiliate' | 'streamer' }) {
  const title = program === 'affiliate' ? 'Affiliate' : 'Streamer';
  const isAffiliate = program === 'affiliate';
  const Icon = isAffiliate ? Users : Video;
  const highlights = isAffiliate ? [
    { icon: Link2, title: 'Your referral link', detail: 'Share with your community' },
    { icon: TrendingUp, title: 'Earn commissions', detail: 'Grow through referrals' },
    { icon: Headphones, title: 'Partner support', detail: 'Get help from our team' },
  ] : [
    { icon: Video, title: 'Your creator code', detail: 'Connect with your viewers' },
    { icon: Gift, title: 'Viewer discounts', detail: 'Give your community more' },
    { icon: TrendingUp, title: 'Creator commissions', detail: 'Earn as your audience grows' },
  ];
  const message = `Hi GPDS! I'd like to register for the ${title} Program. Please help me with registration.`;

  return (
    <section className="dashboard-auction" aria-labelledby={`${program}-dashboard-title`}>
      <h2 id={`${program}-dashboard-title`}>{title} Program</h2>
      <div className="dashboard-auction-card">
        <span className="dashboard-auction-emblem"><Icon size={38} strokeWidth={2} aria-hidden="true" /></span>
        <h3>Join Our {title} Community</h3>
        <p className="dashboard-auction-description">{isAffiliate
          ? 'Turn your recommendations into rewards. Share GPDS with your community and earn commissions through referrals. Contact our team to learn about the affiliate program and get started.'
          : 'Bring more value to your streams. Give your viewers a creator code, unlock discounts for your community, and earn commissions. Contact our team to learn about the streamer program and get started.'}</p>
        <a className="dashboard-auction-register" href={`https://wa.me/${OFFICIAL_SITE_SETTINGS.whatsapp}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" aria-label={`Register for the ${title} Program via WhatsApp (opens in a new tab)`}><Icon size={20} aria-hidden="true" />Register as {isAffiliate ? 'an Affiliate' : 'a Streamer'}</a>
        <p className="dashboard-auction-contact-note">Contact the admin on WhatsApp to register.</p>
        <div className="dashboard-auction-highlights">
          {highlights.map(highlight => <div key={highlight.title}><highlight.icon aria-hidden="true" /><strong>{highlight.title}</strong><span>{highlight.detail}</span></div>)}
        </div>
      </div>
    </section>
  );
}
