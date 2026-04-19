import { postOptions } from '../../data/communityDashboardData';
import { useCommunityDashboard } from '../../context/CommunityDashboardContext';

const CloseIcon = () => (
  <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
    <path d="M6 6L18 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    <path d="M18 6L6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
  </svg>
);

const PostModal = () => {
  const { isPostModalOpen, closePostModal, openPanel } = useCommunityDashboard();

  if (!isPostModalOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm" onClick={closePostModal} />
      <div className="fixed inset-x-4 top-1/2 z-[60] mx-auto w-full max-w-2xl -translate-y-1/2 rounded-[32px] border border-white/70 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.28)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-500">Create a post</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Choose what you want to share</h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Start with a service, event, help request, or shared ride. Everything opens in a slide-in workflow so members never leave the dashboard.
            </p>
          </div>

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-brand-200 hover:text-brand-600"
            type="button"
            onClick={closePostModal}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {postOptions.map((option) => (
            <button
              key={option.title}
              className="group rounded-[28px] border border-slate-200 bg-slate-50/80 p-5 text-left transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50"
              type="button"
              onClick={() => openPanel(option.panelType)}
            >
              <div className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-600 ring-1 ring-brand-100">
                New
              </div>
              <h4 className="mt-4 text-lg font-semibold text-slate-900">{option.title}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-500">{option.description}</p>
              <span className="mt-5 inline-flex items-center text-sm font-semibold text-brand-600">Open form</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default PostModal;
