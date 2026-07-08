function RecommendedSection() {
  const recommended = [
    { title: 'The Midnight Library', author: 'Matt Haig', category: 'Magical Realism' },
    { title: 'The Power of Habit', author: 'Charles Duhigg', category: 'Self-help' },
    { title: 'The Invisible Life of Addie LaRue', author: 'V.E. Schwab', category: 'Fantasy' },
  ]

  return (
    <section className="space-y-6 rounded-[2rem] bg-slate-50 p-8 shadow-soft sm:p-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Recommended</p>
          <h2 className="mt-2 text-4xl font-semibold text-night">Staff picks and AI suggestions</h2>
        </div>
        <button className="inline-flex rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400">
          Explore recommended
        </button>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {recommended.map((item) => (
          <div key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{item.category}</p>
            <h3 className="mt-4 text-2xl font-semibold text-night">{item.title}</h3>
            <p className="mt-3 text-slate-600">by {item.author}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RecommendedSection
