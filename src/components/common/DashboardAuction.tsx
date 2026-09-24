import { ChartNoAxesColumnIncreasing, Gamepad2, Gift, Headphones } from 'lucide-react';
import { OFFICIAL_SITE_SETTINGS } from '../../data/officialData';
import './DashboardAuction.css';

export function DashboardAuction() {
  const message = "Hi GPDS! I'd like to register as an auctioneer. Please help me complete my auction profile.";
  return (
    <section className="dashboard-auction" aria-labelledby="dashboard-auction-title">
      <h2 id="dashboard-auction-title">Auction House</h2>
      <div className="dashboard-auction-card">
        <span className="dashboard-auction-emblem"><ChartNoAxesColumnIncreasing size={38} strokeWidth={2} aria-hidden="true" /></span>
        <h3>Join Our Auction Community</h3>
        <p className="dashboard-auction-description">Interested in bidding on gaming items, skins, and gift cards? Contact our team to learn about auction registration and the profile requirements before you get started.</p>
        <a className="dashboard-auction-register" href={`https://wa.me/${OFFICIAL_SITE_SETTINGS.whatsapp}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" aria-label="Register as Auctioneer via WhatsApp (opens in a new tab)">
          <ChartNoAxesColumnIncreasing size={20} aria-hidden="true" />Register as Auctioneer
        </a>
        <p className="dashboard-auction-contact-note">Contact the admin on WhatsApp to register.</p>
        <div className="dashboard-auction-highlights">
          <div><Gamepad2 aria-hidden="true" /><strong>Gaming items</strong><span>Find your next upgrade</span></div>
          <div><Gift aria-hidden="true" /><strong>Skins & gift cards</strong><span>More ways to play</span></div>
          <div><Headphones aria-hidden="true" /><strong>Community support</strong><span>Get help from our team</span></div>
        </div>
      </div>
    </section>
  );
}
