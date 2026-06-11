const ToastStack = ({ toasts }) => {
  if (!toasts.length) {
    return null;
  }

  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      className="pointer-events-none fixed bottom-24 right-4 z-50 flex w-[min(360px,calc(100%-2rem))] flex-col gap-3"
      role="status"
    >
      {toasts.map((toast) => (
        <article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_20px_45px_rgba(15,23,42,0.15)]" key={toast.id}>
          <h2 className="text-sm font-semibold text-slate-950">{toast.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{toast.message}</p>
        </article>
      ))}
    </div>
  );
};

export default ToastStack;
