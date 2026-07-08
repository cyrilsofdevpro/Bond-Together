function AiSummaryPanel() {
  return (
    <section className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-glow sm:p-10">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">AI summaries</p>
        <h2 className="text-4xl font-semibold">Review analysis without the noise</h2>
        <p className="max-w-2xl text-slate-300">AI condenses reader sentiment into quick insights so you can know the pulse of every book without reading every review.</p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Positive reception', value: '87% love the character development' },
          { label: 'Common praise', value: 'Rich atmosphere and thoughtful pacing' },
          { label: 'Criticism', value: 'Slow first third of the book' },
          { label: 'Conclusion', value: 'A deeply moving ending with strong themes' },
        ].map((item) => (
          <div key={item.label} className="rounded-[1.75rem] bg-white/10 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-300">{item.label}</p>
            <p className="mt-4 text-lg font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AiSummaryPanel
