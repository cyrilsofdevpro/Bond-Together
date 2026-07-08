function AuthorPage() {
  return (
    <div className="space-y-8 rounded-[2rem] bg-white/95 p-8 shadow-soft sm:p-10">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Authors</p>
        <h1 className="text-4xl font-semibold text-night">Meet authors shaping the Bound Together community</h1>
        <p className="text-slate-600">Browse verified author profiles, featured books, and upcoming author events.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {['Mila Hart', 'Noah Grant', 'Elena Park'].map((author) => (
          <div key={author} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
            <div className="h-52 rounded-[1.75rem] bg-gradient-to-br from-purple-500 to-amber-400" />
            <h2 className="mt-5 text-2xl font-semibold text-night">{author}</h2>
            <p className="mt-3 text-slate-600">Verified author with premium community events, bestselling books, and curated reading insights.</p>
            <button className="mt-6 inline-flex items-center rounded-full bg-night px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">
              View profile
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AuthorPage
