import { useEffect, useRef } from 'react';
import { useCommunityDashboard } from '../../context/CommunityDashboardContext';

const panelCopy = {
  askForHelp: {
    eyebrow: 'Support request',
    title: 'Ask for help',
    description: 'Share what you need, when you need it, and how the community can reach you.',
    submitLabel: 'Share request',
  },
  offerService: {
    eyebrow: 'Service listing',
    title: 'Offer a service',
    description: 'Tell people what you offer, when you are available, and how they can reach you.',
    submitLabel: 'Publish service',
  },
  createEvent: {
    eyebrow: 'Event setup',
    title: 'Create an event',
    description: 'Set the event name, key details, and preferred contact information for replies.',
    submitLabel: 'Create event',
  },
  offerRide: {
    eyebrow: 'Ride offer',
    title: 'Offer a ride',
    description: 'Post a ride with route details, timing, and any space limits.',
    submitLabel: 'Share ride',
  },
  bookService: {
    eyebrow: 'Booking request',
    title: 'Book a service',
    description: 'Send a clear request with the service type, preferred timing, and contact details.',
    submitLabel: 'Send booking',
  },
};

const SlidePanel = () => {
  const { activePanel, closePanel, submitPanel } = useCommunityDashboard();
  const panelRef = useRef(null);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (!activePanel) {
      return undefined;
    }

    const previousActiveElement = document.activeElement;
    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => {
      firstFieldRef.current?.focus();
    });

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closePanel();
      }

      if (event.key !== 'Tab' || !panelRef.current) {
        return;
      }

      const focusableElements = panelRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements.length) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleEscape);
      previousActiveElement?.focus?.();
    };
  }, [activePanel, closePanel]);

  if (!activePanel) {
    return null;
  }

  const panel = panelCopy[activePanel] || panelCopy.bookService;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/35 backdrop-blur-sm" onClick={closePanel} role="presentation">
      <aside
        aria-labelledby="slide-panel-title"
        aria-modal="true"
        className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col overflow-y-auto bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.28)] sm:p-7"
        onClick={(event) => event.stopPropagation()}
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">{panel.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950" id="slide-panel-title">
              {panel.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">{panel.description}</p>
          </div>
          <button
            aria-label="Close panel"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
            onClick={closePanel}
            type="button"
          >
            X
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={submitPanel}>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-900" htmlFor="panel-title">
              Title
            </label>
            <input
              className="rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300"
              id="panel-title"
              name="title"
              placeholder="Add a short, clear title"
              ref={firstFieldRef}
              required
              type="text"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-900" htmlFor="panel-details">
              Details
            </label>
            <textarea
              className="min-h-32 rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300"
              id="panel-details"
              name="details"
              placeholder="Share the key details people need to respond."
              required
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-900" htmlFor="panel-location">
              Location or neighborhood
            </label>
            <input
              className="rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300"
              id="panel-location"
              name="location"
              placeholder="Chicago, IL"
              type="text"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold text-slate-900" htmlFor="panel-contact">
              Best contact method
            </label>
            <input
              className="rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-300"
              id="panel-contact"
              name="contact"
              placeholder="Phone, email, or direct message"
              type="text"
            />
          </div>

          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
            Review your details before sharing. Clear posts usually get better replies.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              className="inline-flex items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
              type="submit"
            >
              {panel.submitLabel}
            </button>
            <button
              className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
              onClick={closePanel}
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
};

export default SlidePanel;
