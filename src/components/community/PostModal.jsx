import { useEffect, useRef } from 'react';
import { postOptions } from '../../data/communityDashboardData';
import { useCommunityDashboard } from '../../context/CommunityDashboardContext';

const PostModal = () => {
  const { closePostModal, isPostModalOpen, openPanel } = useCommunityDashboard();
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isPostModalOpen) {
      return undefined;
    }

    const previousActiveElement = document.activeElement;
    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closePostModal();
      }

      if (event.key !== 'Tab' || !dialogRef.current) {
        return;
      }

      const focusableElements = dialogRef.current.querySelectorAll(
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
  }, [closePostModal, isPostModalOpen]);

  if (!isPostModalOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-4 backdrop-blur-sm sm:items-center"
      onClick={closePostModal}
      role="presentation"
    >
      <div
        aria-labelledby="post-modal-title"
        aria-modal="true"
        className="w-full max-w-2xl rounded-[32px] bg-white p-6 shadow-[0_32px_90px_rgba(15,23,42,0.28)] sm:p-7"
        onClick={(event) => event.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">Create</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950" id="post-modal-title">
              Start with one action
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700">
              Choose what you want to share. Each option opens a short form with only the details people need.
            </p>
          </div>
          <button
            aria-label="Close create menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-brand-300 hover:text-brand-700"
            onClick={closePostModal}
            ref={closeButtonRef}
            type="button"
          >
            X
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {postOptions.map((option) => (
            <button
              className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5 text-left transition hover:border-brand-300 hover:bg-brand-50"
              key={option.title}
              onClick={() => openPanel(option.panelType)}
              type="button"
            >
              <h3 className="text-lg font-semibold text-slate-950">{option.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-700">{option.description}</p>
              <span className="mt-5 inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                Open form
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostModal;
