function Input({ label, id, type = 'text', placeholder = '', className = '', ...props }) {
  return (
    <label className={`block ${className}`} htmlFor={id}>
      {label && <span className="text-sm font-medium text-slate-700">{label}</span>}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
        {...props}
      />
    </label>
  )
}

export default Input
