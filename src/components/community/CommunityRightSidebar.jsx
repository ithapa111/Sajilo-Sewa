import { communityPulseItems, notificationItems, offerItems, upcomingEvents } from '../../data/communityDashboardData';
import { useCommunityDashboard } from '../../context/CommunityDashboardContext';

const CommunityRightSidebar = () => {
  const { openPanel, showToast } = useCommunityDashboard();

  return (
    <aside className="order-3">
      <div className="space-y-4 lg:sticky lg:top-24">
        <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">Community pulse</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-950">What is happening now</h2>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-800">
              Live
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {communityPulseItems.map((item) => (
              <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-4" key={item.label}>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-600">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{item.value}</p>
                <p className="mt-1 text-sm text-emerald-700">{item.delta}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-soft" id="upcoming-events">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">Upcoming events</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-950">Keep your calendar warm</h2>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((item) => (
              <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-4" key={item.title}>
                <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                <p className="mt-1 text-sm text-slate-700">{item.schedule}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-600">{item.meta}</p>
                <button
                  className="mt-4 inline-flex items-center rounded-full border border-brand-300 bg-white px-3 py-2 text-sm font-semibold text-brand-800 transition hover:border-brand-400 hover:bg-brand-50"
                  onClick={() => showToast(item.title, `${item.cta} is ready from the event panel.`)}
                  type="button"
                >
                  {item.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-soft" id="notifications">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">Notifications</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-950">Fresh updates</h2>
            </div>
            <button
              className="text-sm font-semibold text-slate-700 transition hover:text-brand-700"
              onClick={() => showToast('Notifications cleared', 'You are all caught up for now.')}
              type="button"
            >
              Mark all read
            </button>
          </div>

          <div className="space-y-3">
            {notificationItems.map((item) => (
              <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-4" key={item.title}>
                <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-soft">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">Offers & deals</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-950">Useful community wins</h2>
          </div>

          <div className="space-y-3">
            {offerItems.map((item) => (
              <div className="rounded-3xl bg-gradient-to-br from-brand-50 to-white p-4 ring-1 ring-inset ring-brand-200" key={item.title}>
                <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{item.subtitle}</p>
              </div>
            ))}
          </div>

          <button
            className="mt-4 inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
            onClick={() => openPanel('offerService')}
            type="button"
          >
            Share your offer
          </button>
        </section>
      </div>
    </aside>
  );
};

export default CommunityRightSidebar;
