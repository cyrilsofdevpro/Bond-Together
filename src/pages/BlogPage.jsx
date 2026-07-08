function BlogPage() {
  const posts = [
    { title: 'How to build a premium reading ritual', author: 'Avery Lane', summary: 'Design a modern reading routine that supports focus, conversation, and sustained joy.' },
    { title: 'Author spotlight: shaping stories', author: 'Camila Scott', summary: 'An inside look at the process and community behind a bestselling author’s new release.' },
  ]

  return (
    <div className="space-y-8 rounded-[2rem] bg-white/95 p-8 shadow-soft sm:p-10">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Blog</p>
        <h1 className="text-4xl font-semibold text-night">Insights for readers, authors, and community builders</h1>
        <p className="text-slate-600">Explore editorial stories, book recommendations, and author interviews crafted for the Bound Together audience.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {posts.map((post) => (
          <article key={post.title} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-purple-600">{post.author}</p>
            <h2 className="mt-4 text-2xl font-semibold text-night">{post.title}</h2>
            <p className="mt-4 text-slate-600">{post.summary}</p>
            <button className="mt-6 inline-flex items-center rounded-full bg-night px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">
              Read article
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}

export default BlogPage
