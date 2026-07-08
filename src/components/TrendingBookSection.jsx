import Button from './ui/Button'

function TrendingBookSection() {
  return (
    <section className="grid gap-10 rounded-[2rem] bg-white/95 p-8 shadow-soft sm:p-10 lg:grid-cols-[0.95fr_0.8fr]">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-slate-950 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white">Spotlight</span>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-700">Fantasy</span>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-700">Book of the Month</span>
        </div>
        <div className="space-y-5">
          <h2 className="text-5xl font-semibold text-night">Witchfyre and Faerysong</h2>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <span>by Maighread MacKay</span>
            <span>4.8 ★</span>
            <span>6h 30m</span>
            <span>2.4M readers</span>
            <span>340 pages</span>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            A captivating tale of magic, fae, and destiny from a visionary fiction author. Explore an enchanting world where spiritual wisdom meets fantasy storytelling.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" size="lg">Read now</Button>
            <Button variant="secondary" size="lg">More details</Button>
            <button className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300">
              +
            </button>
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-soft">
        <div className="aspect-[3/4] rounded-[1.75rem] bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center shadow-lg" />
        <div className="absolute bottom-6 left-6 rounded-3xl bg-white/90 p-4 text-slate-900 shadow-lg backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">This week</p>
          <p className="mt-2 text-lg font-semibold">#1 Most Read</p>
        </div>
      </div>
    </section>
  )
}

export default TrendingBookSection
