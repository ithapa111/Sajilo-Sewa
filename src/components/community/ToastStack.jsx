const ToastStack = ({ toasts }) => {
  if (!toasts.length) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-24 z-[80] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div key={toast.id} className="rounded-[24px] border border-white/70 bg-slate-900 px-5 py-4 text-white shadow-[0_18px_45px_rgba(15,23,42,0.32)]">
          <p className="text-sm font-semibold">{toast.title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-200">{toast.message}</p>
        </div>
      ))}
    </div>
  );
};

export default ToastStack;
