function Badge({ children, variant = 'primary', className = '' }) {
  const variants = {
    primary: 'bg-purple-600 text-white',
    secondary: 'bg-slate-100 text-slate-700',
    accent: 'bg-amber-400 text-night',
  }

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

export default Badge
