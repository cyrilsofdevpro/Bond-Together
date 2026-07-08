import Button from './ui/Button'

const newReleases = [
  { title: 'Aurora After Midnight', author: 'Lena Vale', genre: 'Fantasy' },
  { title: 'Quiet Strength', author: 'Noah Grant', genre: 'Self-help' },
  { title: 'Ink and Ashes', author: 'Mila Hart', genre: 'Literary' },
]

function NewReleaseSection() {
  return (
    <section className="space-y-6 rounded-[2rem] bg-slate-50 p-8 shadow-soft sm:p-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">New release</p>
          <h2 className="mt-2 text-4xl font-semibold text-night">Fresh books just landed</h2>
        </div>
        <Button variant="secondary" size="lg">See all releases</Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {newReleases.map((release) => (
          <div key={release.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
            <h3 className="text-2xl font-semibold text-night">{release.title}</h3>
            <p className="mt-3 text-sm text-slate-500">{release.author}</p>
            <p className="mt-4 text-slate-600">{release.genre}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default NewReleaseSection
