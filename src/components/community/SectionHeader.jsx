const SectionHeader = ({ eyebrow, title, description, actionLabel, onAction }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="max-w-2xl">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-500">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.75rem]">{title}</h2>
      {description ? <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">{description}</p> : null}
    </div>

    {actionLabel ? (
      <button
        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-600"
        type="button"
        onClick={onAction}
      >
        {actionLabel}
      </button>
    ) : null}
  </div>
);

export default SectionHeader;
