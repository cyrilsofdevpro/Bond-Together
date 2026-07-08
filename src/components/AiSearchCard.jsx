function AiSearchCard() {
  return (
    <div className="rounded-[2rem] bg-white p-8 shadow-soft border border-slate-200">
      <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Smart search</p>
      <h3 className="mt-3 text-3xl font-semibold text-night">Natural language book discovery</h3>
      <p className="mt-3 text-slate-600">Ask for books using themes, moods, or comparison queries and get smarter recommendations instantly.</p>
      <div className="mt-6 space-y-4 rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
        <input
          type="text"
          placeholder="I want a romance book with a sad ending"
          className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-slate-900 outline-none"
        />
        <input
          type="text"
          placeholder="Recommend books about entrepreneurship"
          className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-slate-900 outline-none"
        />
      </div>
    </div>
  )
}

export default AiSearchCard
