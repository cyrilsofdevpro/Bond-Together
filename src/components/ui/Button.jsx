function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const styles = {
    primary: 'bg-night text-white hover:bg-slate-900',
    secondary: 'bg-white text-night border border-slate-200 hover:bg-slate-50',
    ghost: 'bg-transparent text-night hover:bg-slate-100',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  return (
    <button
      className={`inline-flex items-center justify-center rounded-full font-semibold transition duration-200 shadow-sm ${styles[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
