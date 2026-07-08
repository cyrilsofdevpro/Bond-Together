import { Link } from 'react-router-dom'

function BookCard({ book }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950/5 p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-glow">
      <div className="rounded-[1.75rem] p-0 text-white">
        <div className="mb-4 h-44 relative overflow-hidden rounded-[1.5rem] bg-white/10">
          {book.coverImage ? (
            <>
              <img src={book.coverImage} alt={`${book.title} cover`} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
            </>
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-purple-600 to-amber-400" />
          )}
        </div>
        <div className="space-y-2 px-2">
          <p className="text-sm uppercase tracking-[0.24em] text-white/70">{book.category}</p>
          <h3 className="text-2xl font-semibold text-white">{book.title}</h3>
          <p className="text-sm text-white/80">by {book.author}</p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
          {book.rating} ★
        </span>
        <Link
          to={`/books/${book.id || book.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
          className="rounded-full bg-night px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900"
        >
          View details
        </Link>
      </div>
    </article>
  )
}

export default BookCard
