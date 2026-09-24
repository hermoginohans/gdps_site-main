import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Headphones, Minus, Plus, Search, ShieldCheck, Users, Zap } from 'lucide-react';
import { OFFICIAL_FAQS } from '../../data/officialData';
import { Link } from '../../context/RouterContext';
import './SupportCenter.css';

const categories = ['General', 'Top-ups', 'Payments', 'Security'] as const;
type Category = typeof categories[number];
const categoryIds: Record<Category, number[]> = {
  General: [1, 2, 13, 14],
  'Top-ups': [13, 14],
  Payments: [1, 13],
  Security: [2],
};

export function SupportCenter() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('General');
  const [openId, setOpenId] = useState<number | null>(1);
  const filtered = OFFICIAL_FAQS.filter(faq =>
    categoryIds[category].includes(faq.id) &&
    `${faq.question} ${faq.answer}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <section className="support-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="support-title">
      <div className="support-intro">
        <span className="support-eyebrow">Support center</span>
        <h2 id="support-title">Questions?<br />We’ve got<br /><span>answers.</span></h2>
        <p className="support-description">Everything you need to know about top-ups, payments, and account security.</p>
        <div className="support-contact">
          <span className="support-headset"><Headphones size={32} aria-hidden="true" /></span>
          <div>
            <h3>Still need a hand?</h3>
            <p>Our team is here to help.</p>
            <Link to="/contact" className="support-contact-link">Contact support <ArrowRight size={20} aria-hidden="true" /></Link>
          </div>
        </div>
        <div className="support-benefits">
          <span><ShieldCheck aria-hidden="true" /><span>Secure<br />Transactions</span></span>
          <span><Zap aria-hidden="true" /><span>Fast<br />Processing</span></span>
          <span><Users aria-hidden="true" /><span>Trusted by<br />Gamers</span></span>
        </div>
        <div className="support-tagline">Play more. Game on.</div>
      </div>

      <div className="support-questions">
        <label className="support-search">
          <Search size={22} aria-hidden="true" />
          <span className="sr-only">Search frequently asked questions</span>
          <input type="search" placeholder="Search for an answer..." value={query} onChange={event => setQuery(event.target.value)} />
        </label>
        <div className="support-categories" role="group" aria-label="FAQ categories">
          {categories.map(item => (
            <button key={item} type="button" aria-pressed={category === item} onClick={() => {
              setCategory(item);
              setOpenId(categoryIds[item][0]);
            }}>{item}</button>
          ))}
        </div>
        <div className="support-accordion">
          {filtered.map(faq => {
            const isOpen = openId === faq.id;
            return (
              <article className={`support-item${isOpen ? ' is-open' : ''}`} key={faq.id}>
                <h3>
                  <button id={`support-question-${faq.id}`} type="button" aria-expanded={isOpen} aria-controls={`support-answer-${faq.id}`} onClick={() => setOpenId(isOpen ? null : faq.id)}>
                    <span className="support-number" aria-hidden="true">{String(OFFICIAL_FAQS.indexOf(faq) + 1).padStart(2, '0')}</span>
                    <span className="support-question-text">{faq.question}</span>
                    <span className="support-toggle">{isOpen ? <Minus size={19} /> : <Plus size={19} />}</span>
                  </button>
                </h3>
                <div id={`support-answer-${faq.id}`} role="region" aria-labelledby={`support-question-${faq.id}`} hidden={!isOpen} className="support-answer">
                  <p>{faq.answer}</p>
                  {faq.id === 1 && <Link to="/about" className="support-about">Learn more about us <ArrowUpRight size={16} aria-hidden="true" /></Link>}
                </div>
              </article>
            );
          })}
          {filtered.length === 0 && <div className="support-empty" role="status"><h3>No answers found</h3><p>Try another search or browse all questions.</p><button type="button" onClick={() => { setQuery(''); setCategory('General'); setOpenId(1); }}>Clear filters <ArrowRight size={16} /></button></div>}
        </div>
      </div>
    </section>
  );
}
