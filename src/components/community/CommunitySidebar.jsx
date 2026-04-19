import { navItems, sidebarCards } from '../../data/communityDashboardData';
import { useCommunityDashboard } from '../../context/CommunityDashboardContext';

const CommunitySidebar = () => {
  const { activeNav, handleNavSelect, handleSidebarCardAction } = useCommunityDashboard();

  return (
    <aside className="order-2 lg:order-1">
      <div className="space-y-4 lg:sticky lg:top-24">
        <div className="hidden rounded-[28px] border border-slate-200/80 bg-white/90 p-4 shadow-soft lg:block">
          <div className="mb-3 px-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Navigation</p>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeNav === item.label;

              return (
                <button
                  key={item.label}
                  className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 shadow-[inset_0_0_0_1px_rgba(109,40,217,0.12)]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  type="button"
                  onClick={() => handleNavSelect(item)}
                >
                  <span className="flex items-center gap-3">
                    <span className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl text-[11px] font-bold ${isActive ? 'bg-white text-brand-700' : 'bg-slate-100 text-slate-500'}`}>
                      {item.badge}
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </span>
                  <span className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-brand-500' : 'bg-transparent'}`} />
                </button>
              );
            })}
          </nav>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {sidebarCards.map((card) => (
            <div key={card.title} className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-soft">
              <div className="mb-4 inline-flex rounded-full bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-600">
                {card.kind}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{card.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
                  type="button"
                  onClick={() => handleSidebarCardAction(card)}
                >
                  {card.cta}
                </button>

                {card.secondaryCta ? (
                  <button
                    className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-200 hover:text-brand-600"
                    type="button"
                    onClick={() => handleSidebarCardAction(card, 'secondary')}
                  >
                    {card.secondaryCta}
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default CommunitySidebar;
