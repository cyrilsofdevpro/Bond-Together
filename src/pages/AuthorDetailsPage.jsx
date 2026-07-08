function AuthorDetailsPage() {
  return (
    <div className="space-y-8 rounded-[2rem] bg-white/95 p-8 shadow-soft sm:p-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Author profile</p>
          <h1 className="mt-3 text-4xl font-semibold text-night">Sofia Reed</h1>
          <p className="mt-4 text-slate-600">Award-winning author and community leader. Discover her books, upcoming events, and behind-the-scenes reading notes.</p>
        </div>
        <div className="rounded-[2rem] bg-slate-950/90 p-8 text-white shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Verified author</p>
          <p className="mt-4 text-2xl font-semibold">8 published books</p>
          <p className="mt-2 text-slate-300">12k followers</p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-night">Biography</h2>
          <p className="mt-4 text-slate-600">Sofia writes contemporary literary fiction that explores community, memory, and the rituals of reading. Her work has been featured in modern literary salons and premium book clubs worldwide.</p>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-night">Upcoming event</h2>
          <p className="mt-4 text-slate-600">Join her next live author discussion on September 6th, with a guided reading of her newest novel.</p>
          <button className="mt-6 inline-flex items-center rounded-full bg-night px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">
            Reserve a seat
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthorDetailsPage
