import { Link } from 'react-router-dom';

const footerSocialLinks = [
  {
    label: 'Facebook',
    href: '#facebook',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6H17V4.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.4V11H7.5v3h2.8v8h3.2Z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#instagram',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm9.75 1.5a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: '#tiktok',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M14.5 2c.3 2.2 1.6 3.9 3.8 4.3v2.7a7 7 0 0 1-3.8-1.2v7.1a5.9 5.9 0 1 1-5.9-5.9c.4 0 .8 0 1.2.1v2.9a3 3 0 1 0 1.8 2.9V2h2.9Z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#youtube',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M21.6 7.2a2.9 2.9 0 0 0-2-2c-1.8-.5-7.6-.5-7.6-.5s-5.8 0-7.6.5a2.9 2.9 0 0 0-2 2C2 9 2 12 2 12s0 3 .4 4.8a2.9 2.9 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.9 2.9 0 0 0 2-2C22 15 22 12 22 12s0-3-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
      </svg>
    ),
  },
];

const footerLinks = [
  { label: 'About', href: '#about' },
  { label: 'Careers', href: '#careers' },
  { label: 'Press', href: '#press' },
  { label: 'Privacy', href: '#privacy' },
  { label: 'Terms', href: '#terms' },
];

const SiteFooter = () => (
  <footer className="site-footer site-footer-clean" aria-label="Footer">
    <Link className="site-footer-brand" to="/">
      <img className="footer-logo" src="/assets/logo-mark.svg" alt="Sazilo logo" />
      <div className="site-footer-brand-copy">
        <img className="footer-name-logo" src="/assets/LogoName-header.png" alt="Sazilo Sewa" />
        <p>Trusted local services, support, health, and events.</p>
      </div>
    </Link>

    <div className="site-footer-content">
      <div className="footer-links site-footer-links">
        {footerLinks.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
      </div>

      <div className="site-footer-meta">
        <div className="footer-social ride-footer-social site-footer-social">
          {footerSocialLinks.map((item) => (
            <a key={item.label} href={item.href} aria-label={item.label}>
              {item.icon}
            </a>
          ))}
        </div>

        <div className="footer-note site-footer-note">&copy; 2026 Sazilo Sewa. All rights reserved.</div>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
