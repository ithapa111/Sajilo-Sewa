import { Link } from 'react-router-dom';
import logoMark from '../../../assets/logo-mark.svg';
import logoName from '../../../assets/LogoName-header.png';
import { useCommunityDashboard } from '../../context/CommunityDashboardContext';

const SearchIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
    <path d="M20 20L16.65 16.65" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
  </svg>
);

const BellIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
    <path
      d="M15 17H5.5C6.6 15.9 7.25 14.45 7.25 12.75V10.75C7.25 7.55 9.52 5 12.5 5C15.48 5 17.75 7.55 17.75 10.75V12.75C17.75 14.45 18.4 15.9 19.5 17H15Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
    <path d="M10.25 19.25C10.68 20.02 11.52 20.5 12.5 20.5C13.48 20.5 14.32 20.02 14.75 19.25" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
  </svg>
);

const PlusIcon = () => (
  <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
    <path d="M12 5V19" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    <path d="M5 12H19" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
  </svg>
);

const CommunityHeader = () => {
  const { handleSearchSubmit, notificationCount, openPostModal, searchQuery, setSearchQuery, showToast } = useCommunityDashboard();

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-[1680px] grid-cols-1 gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(220px,auto)_minmax(0,1fr)_auto] lg:items-center">
        <Link className="brand-lockup" style={{ color: 'inherit', textDecoration: 'none' }} to="/">
          <img alt="" className="brand-logo" src={logoMark} />
          <div className="brand-stack">
            <img alt="Sazilo Sewa" className="brand-name-logo" src={logoName} />
            <p className="eyebrow" style={{ margin: 0, fontSize: '0.68rem', color: 'var(--muted)' }}>
              Community services
            </p>
          </div>
        </Link>

        <form
          aria-label="Search community services"
          className="flex items-center gap-3 rounded-full border border-slate-300 bg-white px-4 py-3 shadow-soft"
          onSubmit={handleSearchSubmit}
          role="search"
        >
          <label className="sr-only" htmlFor="community-dashboard-search">
            Search community services
          </label>
          <SearchIcon />
          <input
            className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-500"
            id="community-dashboard-search"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search services, events, doctors..."
            type="search"
            value={searchQuery}
          />
        </form>

        <div className="flex items-center justify-end gap-3">
          <button
            className="hidden items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 lg:inline-flex"
            onClick={openPostModal}
            type="button"
          >
            <PlusIcon />
            Post
          </button>
          <button
            aria-label={`Open notifications. ${notificationCount} unread updates.`}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
            onClick={() => showToast('Notifications synced', 'Your latest alerts are waiting in the right sidebar.')}
            type="button"
          >
            <BellIcon />
            <span className="absolute right-2 top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-700 px-1 text-[10px] font-bold text-white">
              {notificationCount}
            </span>
          </button>
          <button
            aria-label="Open profile tools"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-200 via-brand-100 to-pink-100 text-sm font-bold text-brand-800 shadow-soft transition hover:scale-[1.02]"
            onClick={() => showToast('Profile tools', 'Profile settings are not open yet.')}
            type="button"
          >
            IS
          </button>
        </div>
      </div>
    </header>
  );
};

export default CommunityHeader;
