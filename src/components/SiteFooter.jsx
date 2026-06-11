const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/', icon: 'facebook' },
  { label: 'Instagram', href: 'https://www.instagram.com/', icon: 'instagram' },
  { label: 'TikTok', href: 'https://www.tiktok.com/', icon: 'tiktok' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
  { label: 'YouTube', href: 'https://www.youtube.com/', icon: 'youtube' },
  { label: 'X', href: 'https://x.com/', icon: 'x' },
  { label: 'WhatsApp', href: 'https://www.whatsapp.com/', icon: 'whatsapp' },
];

const currentYear = new Date().getFullYear();

const SocialIcon = ({ name }) => {
  const commonProps = {
    'aria-hidden': 'true',
    focusable: 'false',
    viewBox: '0 0 24 24',
  };

  switch (name) {
    case 'facebook':
      return (
        <svg {...commonProps}>
          <path d="M14 8h2V5h-2.4C10.8 5 9 6.8 9 9.5V11H7v3h2v5h3v-5h2.4l.6-3h-3V9.6c0-1 .5-1.6 2-1.6Z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...commonProps}>
          <rect height="14" rx="4" width="14" x="5" y="5" />
          <circle cx="12" cy="12" r="3.1" />
          <circle cx="16.2" cy="7.8" r="1" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg {...commonProps}>
          <path d="M14 5c.4 2.3 1.8 3.8 4 4v3c-1.4 0-2.7-.4-4-1.2v4.6c0 2.5-2 4.6-4.7 4.6A4.4 4.4 0 0 1 5 15.6c0-2.7 2.2-4.6 5-4.4v3.1c-1.2-.2-2 .4-2 1.4 0 .8.6 1.4 1.4 1.4 1 0 1.6-.7 1.6-1.8V5h3Z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...commonProps}>
          <path d="M6 10h3v9H6v-9Zm1.5-4.5A1.8 1.8 0 1 1 7.5 9a1.8 1.8 0 0 1 0-3.5ZM11 10h2.8v1.2c.6-.8 1.5-1.4 3-1.4 2.3 0 3.7 1.5 3.7 4.3V19h-3v-4.4c0-1.3-.5-2-1.6-2s-1.9.8-1.9 2V19h-3v-9Z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg {...commonProps}>
          <rect height="11" rx="3" width="16" x="4" y="6.5" />
          <path d="m10.5 9.5 4.5 2.5-4.5 2.5v-5Z" />
        </svg>
      );
    case 'x':
      return (
        <svg {...commonProps}>
          <path d="M6 5h3.4l3.1 4.2L16.2 5H20l-5.7 6.5L20 19h-3.5l-3.8-5-4.4 5H4.5l6.4-7.2L6 5Z" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg {...commonProps}>
          <path d="M12 4a8 8 0 0 0-6.8 12.2L4.4 20l3.9-.9A8 8 0 1 0 12 4Zm4.4 11.4c-.2.6-1.1 1.1-1.7 1.2-.5.1-1.2.1-3.1-.7-2.6-1.1-4.2-3.6-4.4-3.9-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.8-.3h.6c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.5c-.2.2-.3.4-.1.7.2.4.8 1.2 1.6 1.8 1.1 1 2 1.3 2.4 1.4.3.1.5.1.7-.1l.8-1c.2-.2.4-.3.7-.2l1.9.9c.3.2.5.3.5.5 0 .1 0 .4-.2.8Z" />
        </svg>
      );
    default:
      return null;
  }
};

const SiteFooter = () => {
  return (
    <footer className="app-footer">
      <div className="app-footer-bottom">
        <p>© {currentYear}. All rights reserved.</p>
        <div className="app-footer-social app-footer-social-bottom" aria-label="Social media links">
          {socialLinks.map((item) => (
            <a aria-label={item.label} href={item.href} key={item.label} rel="noreferrer" target="_blank" title={item.label}>
              <SocialIcon name={item.icon} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
