function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/70 px-4 py-10 text-slate-600 backdrop-blur-xl md:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold text-night">Bound Together</p>
          <p className="max-w-xl text-sm text-slate-500">A premium reading community for book lovers, authors, and events.</p>
        </div>
        <p className="text-sm text-slate-500">© 2026 Bound Together. Crafted for modern readers.</p>
      </div>
    </footer>
  )
}

export default Footer
