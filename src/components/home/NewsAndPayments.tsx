import { ArrowRight, ArrowUpRight, CreditCard, LockKeyhole, QrCode, Wallet } from 'lucide-react';
import { OFFICIAL_BLOGS } from '../../data/officialData';
import { Link } from '../../context/RouterContext';
import './NewsAndPayments.css';

const payments = [
  { name: 'GCash', style: 'gcash' }, { name: 'Maya', style: 'maya' },
  { name: 'QRPH InstaPay', style: 'qrph' }, { name: 'GrabPay', style: 'grabpay' },
  { name: 'Visa', style: 'visa' }, { name: 'Mastercard', style: 'mastercard' },
  { name: 'PayPal', style: 'paypal' }, { name: 'USDT', style: 'usdt' },
];

function displayDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
}

export function NewsAndPayments() {
  const [featured, ...stories] = OFFICIAL_BLOGS.slice(0, 4);
  return (
    <div className="news-payments max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section aria-labelledby="latest-news-title">
        <div className="news-section-heading">
          <div>
            <p className="news-eyebrow">The latest from GPDS</p>
            <h2 id="latest-news-title">Stay <span>ahead of the game.</span></h2>
            <p className="news-subtitle">Esports stories, game updates, and guides worth your time.</p>
          </div>
          <Link to="/blog" className="news-view-all">View all news <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
        <div className="news-editorial-grid">
          {featured && <article className="news-featured">
            <Link to={`/blog/${featured.slug}`} className="news-featured-link">
              <div className="news-featured-image">
                <img src={featured.thumbnail} alt="" loading="lazy" />
                <span className="news-featured-badge">Featured · {featured.category}</span>
              </div>
              <div className="news-featured-copy">
                <time dateTime={featured.publishedAt}>{displayDate(featured.publishedAt)}</time>
                <h3>{featured.title}</h3>
                <p>{featured.excerpt}</p>
                <span className="news-read-story">Read story <ArrowUpRight size={16} aria-hidden="true" /></span>
              </div>
            </Link>
          </article>}
          <div className="news-story-list">
            {stories.map(story => <article className="news-story" key={story.id}>
              <Link to={`/blog/${story.slug}`} className="news-story-link">
                <div className="news-story-image"><img src={story.thumbnail} alt="" loading="lazy" /></div>
                <div className="news-story-copy">
                  <span className={`news-category${story.category.toLowerCase().includes('guide') ? ' news-category-guide' : ''}`}>{story.category}</span>
                  <time dateTime={story.publishedAt}>{displayDate(story.publishedAt)}</time>
                  <h3>{story.title}</h3>
                  <ArrowRight className="news-story-arrow" size={20} aria-hidden="true" />
                </div>
              </Link>
            </article>)}
          </div>
        </div>
      </section>

      <section className="payment-panel" aria-labelledby="payment-options-title">
        <div className="payment-panel-main">
          <div className="payment-intro">
            <span className="payment-wallet"><Wallet size={43} strokeWidth={1.5} aria-hidden="true" /></span>
            <div><p className="payment-eyebrow">Payment options</p><h2 id="payment-options-title">Your top-up. Your way.</h2><p className="payment-description">Choose your preferred payment method at checkout.</p></div>
          </div>
          <ul className="payment-method-grid" aria-label="Supported payment methods">
            {payments.map(payment => <li key={payment.name} className={`payment-method payment-${payment.style}`}>
              {payment.style === 'qrph' ? <QrCode aria-hidden="true" /> : payment.style === 'mastercard' ? <span className="payment-card-circles" aria-hidden="true" /> : payment.style === 'usdt' ? <span className="payment-usdt-mark" aria-hidden="true">₮</span> : payment.style === 'gcash' ? <Wallet aria-hidden="true" /> : payment.style === 'paypal' ? <CreditCard aria-hidden="true" /> : null}
              <span>{payment.name}</span>
            </li>)}
          </ul>
        </div>
        <p className="payment-note"><LockKeyhole size={15} aria-hidden="true" />Review available payment options at checkout.</p>
      </section>
    </div>
  );
}
