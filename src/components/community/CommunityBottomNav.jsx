import { mobileNavItems } from '../../data/communityDashboardData';
import { useCommunityDashboard } from '../../context/CommunityDashboardContext';

const PlusIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
    <path d="M12 5V19" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    <path d="M5 12H19" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
  </svg>
);

const CommunityBottomNav = () => {
  const { activeMobileTab, handleMobileNav } = useCommunityDashboard();

  return (
    <nav className="fixed inset-x-0 bottom-4 z-40 px-4 lg:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-5 items-end rounded-[28px] border border-white/70 bg-white/95 px-2 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
        {mobileNavItems.map((item) => {
          if (item.isPrimary) {
            return (
              <button
                key={item.key}
                className="-mt-10 inline-flex h-16 w-16 items-center justify-center justify-self-center rounded-full bg-slate-900 text-white shadow-glass transition hover:bg-brand-600"
                type="button"
                onClick={() => handleMobileNav(item)}
              >
                <PlusIcon />
              </button>
            );
          }

          const isActive = activeMobileTab === item.key;

          return (
            <button
              key={item.key}
              className={`flex flex-col items-center gap-2 px-2 text-[11px] font-semibold transition ${
                isActive ? 'text-brand-600' : 'text-slate-400'
              }`}
              type="button"
              onClick={() => handleMobileNav(item)}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-brand-500' : 'bg-slate-300'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default CommunityBottomNav;
