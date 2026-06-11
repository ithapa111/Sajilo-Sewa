import { Link } from 'react-router-dom';
import SiteFooter from '../components/SiteFooter';

const marketplaceLinks = [
  {
    title: 'Community services',
    description: 'Browse local services, help requests, places, events, and updates from the community.',
    to: '/community-services',
    cta: 'Open services',
  },
  {
    title: 'Food discovery',
    description: 'Explore Nepali and Indian restaurant picks, delivery options, and local food maps.',
    to: '/food',
    cta: 'Browse food',
  },
  {
    title: 'Ride support',
    description: 'Plan rides, compare options, and see pickup and dropoff details before you request.',
    to: '/ride',
    cta: 'Open rides',
  },
  {
    title: 'Courier and errands',
    description: 'Track local packages, compare delivery tiers, and review shipment details.',
    to: '/courier',
    cta: 'Open courier',
  },
];

const MarketplacePage = () => {
  return (
    <div className="page-shell marketplace-page-shell">
      <main className="marketplace-container" id="main-content">
        <header className="marketplace-header">
          <p className="eyebrow">Sazilo marketplace</p>
          <h1>Start with the service you need today.</h1>
          <p>
            Sazilo Sewa brings local discovery, services, food, rides, and courier support together for Nepalese communities in the USA.
          </p>
        </header>

        <section aria-label="Marketplace areas" className="marketplace-link-grid">
          {marketplaceLinks.map((item) => (
            <article className="marketplace-link-card" key={item.title}>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <Link className="button primary" to={item.to}>
                {item.cta}
              </Link>
            </article>
          ))}
        </section>
      </main>

      <SiteFooter />

      <style>{`
        .marketplace-container {
          display: grid;
          gap: 24px;
          width: min(1120px, 100%);
          margin: 0 auto;
        }

        .marketplace-header {
          display: grid;
          gap: 14px;
          padding: 34px;
          border: 1px solid rgba(24, 52, 45, 0.1);
          border-radius: 24px;
          background: #ffffff;
          box-shadow: var(--shadow);
        }

        .marketplace-header h1 {
          max-width: 760px;
          margin: 0;
          font-size: clamp(2rem, 4vw, 3.8rem);
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .marketplace-header p {
          max-width: 720px;
          margin: 0;
          color: var(--muted);
          font-size: 1rem;
          line-height: 1.7;
        }

        .marketplace-link-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .marketplace-link-card {
          display: grid;
          gap: 14px;
          align-content: start;
          min-height: 240px;
          padding: 22px;
          border: 1px solid rgba(24, 52, 45, 0.1);
          border-radius: 22px;
          background: #ffffff;
          box-shadow: 0 12px 30px rgba(24, 52, 45, 0.07);
        }

        .marketplace-link-card h2 {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.2;
        }

        .marketplace-link-card p {
          margin: 0;
          color: var(--muted);
          line-height: 1.6;
        }

        .marketplace-link-card .button {
          margin-top: auto;
          width: fit-content;
        }

        @media (max-width: 980px) {
          .marketplace-link-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .marketplace-header {
            padding: 24px;
          }

          .marketplace-link-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default MarketplacePage;
