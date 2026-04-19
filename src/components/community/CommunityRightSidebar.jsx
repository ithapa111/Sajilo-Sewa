import { communityPulse, notificationItems, offerItems, upcomingEvents } from '../../data/communityDashboardData';
import { useCommunityDashboard } from '../../context/CommunityDashboardContext';

const CommunityRightSidebar = () => {
  const { showToast, openPanel } = useCommunityDashboard();

  return (
    <aside className="order-3">
      <div className="space-y-4 lg:sticky lg:top-24">
        <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-500">Community pulse</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">Live dashboard stats</h3>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600">Live</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {communityPulse.map((item) => (
              <div key={item.label} className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
                <p className="mt-1 text-sm text-emerald-600">{item.delta}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="upcoming-events" className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-soft">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-500">Upcoming events</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">Keep your calendar warm</h3>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-4">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-500">{item.schedule}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">{item.meta}</p>
                <button
                  className="mt-4 inline-flex items-center rounded-full border border-brand-200 bg-white px-3 py-2 text-sm font-semibold text-brand-600 transition hover:border-brand-300 hover:bg-brand-50"
                  type="button"
                  onClick={() => showToast(item.title, `${item.cta} is ready from the event panel.`)}
                >
                  {item.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section id="notifications" className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-soft">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-500">Notifications</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">Fresh updates</h3>
            </div>
            <button
              className="text-sm font-semibold text-slate-500 transition hover:text-brand-600"
              type="button"
              onClick={() => showToast('Notifications cleared', 'You are all caught up for now.')}
            >
              Mark all read
            </button>
          </div>

          <div className="space-y-3">
            {notificationItems.map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-4">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-soft">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-500">Offers & deals</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">Useful community wins</h3>
          </div>

          <div className="space-y-3">
            {offerItems.map((item) => (
              <div key={item.title} className="rounded-3xl bg-gradient-to-br from-brand-50 to-white p-4 ring-1 ring-inset ring-brand-100">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.subtitle}</p>
              </div>
            ))}
          </div>

          <button
            className="mt-4 inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
            type="button"
            onClick={() => openPanel('offerService')}
          >
            Share your offer
          </button>
        </section>
      </div>
    </aside>
  );
};

export default CommunityRightSidebar;
