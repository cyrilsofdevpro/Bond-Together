import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import useBooksStore from '../store/booksStore'

function BookDetailsPage() {
  const { id } = useParams()
  const books = useBooksStore((state) => state.books)

  const book = useMemo(() => {
    return books.find((item) => item.id === id) || {
      title: 'Book details',
      author: 'Available soon',
      category: 'General',
      rating: '4.8',
      pages: '—',
      description: 'More details for this title will be added soon.',
      amazonUrl: '#',
      link: '#',
    }
  }, [books, id])

  return (
    <div className="space-y-8 rounded-[2rem] bg-white/95 p-8 shadow-soft sm:p-10">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_0.6fr]">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Book details</p>
          <h1 className="text-5xl font-semibold text-night">{book.title}</h1>
          <p className="text-lg text-slate-600">by {book.author}</p>
          <p className="text-slate-600">{book.description}</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Genre', value: book.category },
              { label: 'Rating', value: book.rating },
              { label: 'Pages', value: book.pages },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
                <p className="mt-3 text-xl font-semibold text-night">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-night">About this book</h2>
            <p className="mt-4 text-slate-600">{book.description}</p>
            {book.amazonUrl && book.amazonUrl !== '#' ? (
              <a
                href={book.amazonUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center justify-center rounded-full border border-amber-600 bg-white px-5 py-3 text-sm font-semibold text-black shadow-sm transition hover:bg-amber-50"
              >
                Buy on Amazon
              </a>
            ) : null}
            {book.link && book.link !== '#' ? (
              <a
                href={book.link}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center justify-center rounded-full border border-night bg-night px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900"
              >
                View full book page
              </a>
            ) : null}
          </div>
        </div>
        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <div className="rounded-[1.75rem] bg-gradient-to-br from-purple-600 to-amber-400 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.3em]">Reading club</p>
            <h2 className="mt-4 text-3xl font-semibold">Next discussion</h2>
            <p className="mt-3 text-slate-100">Join the live community conversation and share your thoughts about this title.</p>
          </div>
          <button className="inline-flex w-full items-center justify-center rounded-full bg-night px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-900">
            Join this event
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookDetailsPage
