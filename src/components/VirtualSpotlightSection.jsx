function VirtualSpotlightSection() {
  const spotlightAuthors = [
    { name: 'Caroline Maguire', location: 'American', books: 4 },
    { name: 'John Murray', location: 'Canadian', books: 3 },
    { name: 'Mike Bedenbaugh', location: 'American', books: 1 },
    { name: 'Maighread MacKay', location: 'Canadian', books: 8 },
  ]

  return (
    <section className="grid gap-10 rounded-[2rem] bg-white/95 p-8 shadow-soft sm:p-10 lg:grid-cols-[0.75fr_1.25fr]">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Virtual Spotlight</p>
        <h2 className="text-4xl font-semibold text-night">Discover the brilliant minds behind your favorite stories</h2>
        <p className="max-w-2xl text-slate-600">Our featured authors share their journeys, inspirations, and upcoming works in an immersive spotlight experience.</p>
        <div className="space-y-4">
          {spotlightAuthors.map((author) => (
            <div key={author.name} className="flex items-center justify-between rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="font-semibold text-night">{author.name}</p>
                <p className="text-sm text-slate-500">{author.location} · {author.books} Books Published</p>
              </div>
              <button className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400">
                View
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-[2rem] bg-gradient-to-br from-purple-950 via-slate-900 to-night p-8 text-white shadow-soft">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[url('https://images.unsplash.com/photo-1496104679561-38d6b62a4e74?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center p-8">
          <div className="rounded-[2rem] bg-black/50 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Featured Author</p>
            <h3 className="mt-4 text-4xl font-semibold">Caroline Maguire</h3>
            <p className="mt-4 text-slate-200">A passionate author, teacher, and speaker exploring social skills, self-discovery, and meaningful storytelling.</p>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.75rem] bg-white/10 p-4 text-sm">
            <p className="text-slate-300">Books</p>
            <p className="mt-2 text-xl font-semibold">4</p>
          </div>
          <div className="rounded-[1.75rem] bg-white/10 p-4 text-sm">
            <p className="text-slate-300">Followers</p>
            <p className="mt-2 text-xl font-semibold">12k</p>
          </div>
          <div className="rounded-[1.75rem] bg-white/10 p-4 text-sm">
            <p className="text-slate-300">Events</p>
            <p className="mt-2 text-xl font-semibold">3</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VirtualSpotlightSection
