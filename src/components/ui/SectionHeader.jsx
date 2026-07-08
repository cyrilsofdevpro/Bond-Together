function SectionHeader({ pretitle, title, description, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {pretitle && <p className="text-sm uppercase tracking-[0.3em] text-amber-600">{pretitle}</p>}
      {title && <h2 className="text-3xl font-semibold text-night sm:text-4xl">{title}</h2>}
      {description && <p className="max-w-3xl text-slate-600">{description}</p>}
    </div>
  )
}

export default SectionHeader
