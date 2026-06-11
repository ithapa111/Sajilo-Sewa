import { sidebarActionCards, sidebarNavItems } from '../../data/communityDashboardData';
import { useCommunityDashboard } from '../../context/CommunityDashboardContext';

const CommunitySidebar = () => {
  const { activeNav, handleNavSelect, handleSidebarCardAction } = useCommunityDashboard();

  return (
    <aside className="order-2 lg:order-1">
      <div className="space-y-4 lg:sticky lg:top-24">
        <nav aria-label="Community sections" className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">Quick navigation</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-950">Jump to what you need</h2>

          <div className="mt-4 space-y-2">
            {sidebarNavItems.map((item) => {
              const isActive = activeNav === item.label;

              return (
                <button
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex w-full items-center justify-between rounded-[20px] px-4 py-3 text-left text-sm font-semibold transition ${
                    isActive
                      ? 'bg-slate-950 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-700'
                  }`}
                  key={item.label}
                  onClick={() => handleNavSelect(item)}
                  type="button"
                >
                  <span>{item.label}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] ${
                      isActive ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">Sidebar actions</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-950">Useful next steps</h2>

          <div className="mt-4 space-y-4">
            {sidebarActionCards.map((card) => (
              <article className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4" key={card.title}>
                <h3 className="text-base font-semibold text-slate-950">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{card.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                    onClick={() => handleSidebarCardAction(card)}
                    type="button"
                  >
                    {card.cta}
                  </button>
                  {card.secondaryCta ? (
                    <button
                      className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
                      onClick={() => handleSidebarCardAction(card, 'secondary')}
                      type="button"
                    >
                      {card.secondaryCta}
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
};

export default CommunitySidebar;
