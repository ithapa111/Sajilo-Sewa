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
    <nav aria-label="Mobile community navigation" className="fixed inset-x-0 bottom-4 z-40 px-4 lg:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-5 items-end rounded-[28px] border border-white/80 bg-white/95 px-2 py-3 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
        {mobileNavItems.map((item) => {
          if (item.isPrimary) {
            return (
              <button
                aria-label="Create a new post"
                className="-mt-10 inline-flex h-16 w-16 items-center justify-center justify-self-center rounded-full bg-slate-950 text-white shadow-glass transition hover:bg-brand-700"
                key={item.key}
                onClick={() => handleMobileNav(item)}
                type="button"
              >
                <PlusIcon />
              </button>
            );
          }

          const isActive = activeMobileTab === item.key;

          return (
            <button
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center gap-2 px-2 text-[11px] font-semibold transition ${
                isActive ? 'text-brand-800' : 'text-slate-700'
              }`}
              key={item.key}
              onClick={() => handleMobileNav(item)}
              type="button"
            >
              <span className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-brand-700' : 'bg-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default CommunityBottomNav;
