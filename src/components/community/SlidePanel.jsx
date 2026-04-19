import { useCommunityDashboard } from '../../context/CommunityDashboardContext';

const panelCopy = {
  bookService: {
    eyebrow: 'Book service',
    title: 'Request a service booking',
    description: 'Share what you need, where you need it, and your preferred timing so providers can reply fast.',
    primaryLabel: 'Send booking request',
    titleLabel: 'Service you need',
    titlePlaceholder: 'Photoshoot, makeup, tutor, home support...',
    locationLabel: 'Preferred area',
    locationPlaceholder: 'City, neighborhood, or remote',
  },
  offerService: {
    eyebrow: 'Post service',
    title: 'Share a service or listing',
    description: 'Tell members what you offer, where you serve, and how they can book you.',
    primaryLabel: 'Publish service',
    titleLabel: 'Service title',
    titlePlaceholder: 'Photoshoot, home help, tutoring...',
    locationLabel: 'Service area',
    locationPlaceholder: 'City, neighborhood, or remote',
  },
  createEvent: {
    eyebrow: 'Create event',
    title: 'Launch a community event',
    description: 'Plan your gathering, add the format, and invite members right from the dashboard.',
    primaryLabel: 'Publish event',
    titleLabel: 'Event name',
    titlePlaceholder: 'Potluck, sports match, workshop...',
    locationLabel: 'Venue or meeting point',
    locationPlaceholder: 'Community center, park, or online',
  },
  askForHelp: {
    eyebrow: 'Ask for help',
    title: 'Open a support request',
    description: 'Describe what you need so the right volunteers or service providers can respond.',
    primaryLabel: 'Send request',
    titleLabel: 'What do you need help with?',
    titlePlaceholder: 'Airport pickup, legal referral, child care...',
    locationLabel: 'Where is help needed?',
    locationPlaceholder: 'Area, neighborhood, or remote',
  },
  offerRide: {
    eyebrow: 'Offer ride',
    title: 'Share a ride with the community',
    description: 'Post pickup details, route timing, and seat availability in a fast flow.',
    primaryLabel: 'Share ride',
    titleLabel: 'Ride title',
    titlePlaceholder: 'Airport pickup, temple ride, weekend carpool...',
    locationLabel: 'Pickup and route',
    locationPlaceholder: 'Start point and destination',
  },
};

const CloseIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
    <path d="M6 6L18 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    <path d="M18 6L6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
  </svg>
);

const SlidePanel = () => {
  const { activePanel, closePanel, submitPanel } = useCommunityDashboard();

  if (!activePanel) {
    return null;
  }

  const copy = panelCopy[activePanel] || panelCopy.offerService;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-slate-950/35 backdrop-blur-sm" onClick={closePanel} />

      <aside className="fixed inset-x-0 bottom-0 z-[70] max-h-[88vh] rounded-t-[32px] border border-white/70 bg-white p-5 shadow-[0_-20px_70px_rgba(15,23,42,0.18)] sm:inset-y-0 sm:right-0 sm:left-auto sm:w-full sm:max-w-md sm:rounded-none sm:rounded-l-[32px] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-500">{copy.eyebrow}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{copy.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{copy.description}</p>
          </div>

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-brand-200 hover:text-brand-600"
            type="button"
            onClick={closePanel}
          >
            <CloseIcon />
          </button>
        </div>

        <form className="mt-6 space-y-4 overflow-y-auto pb-6" onSubmit={submitPanel}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">{copy.titleLabel}</span>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white"
              name="title"
              placeholder={copy.titlePlaceholder}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">{copy.locationLabel}</span>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white"
              name="location"
              placeholder={copy.locationPlaceholder}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Date or timing</span>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white"
              name="timing"
              placeholder="Tomorrow evening, weekends, flexible..."
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Details</span>
            <textarea
              className="min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-300 focus:bg-white"
              name="details"
              placeholder="Add a short description, who this is for, and any helpful next steps."
            />
          </label>

          <div className="rounded-[28px] bg-brand-50 p-4">
            <p className="text-sm font-semibold text-brand-700">Tips for better responses</p>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-brand-700/90">
              <li>Be specific about time, place, and availability.</li>
              <li>Mention whether this is urgent, flexible, or family-related.</li>
              <li>Use a clear title so members know how to help quickly.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
              type="submit"
            >
              {copy.primaryLabel}
            </button>
            <button
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-brand-200 hover:text-brand-600"
              type="button"
              onClick={closePanel}
            >
              Cancel
            </button>
          </div>
        </form>
      </aside>
    </>
  );
};

export default SlidePanel;
