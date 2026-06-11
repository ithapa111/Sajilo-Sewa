const SectionHeader = ({ eyebrow, title, description }) => {
  return (
    <header className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">{eyebrow}</p>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-[1.75rem]">{title}</h2>
      <p className="max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">{description}</p>
    </header>
  );
};

export default SectionHeader;
