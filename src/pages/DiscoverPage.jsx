import { useMemo, useState } from 'react'
import BookCard from '../components/BookCard'
import useBooksStore from '../store/booksStore'

const sampleBooks = [
  {
    id: 'camilles-gift',
    title: "CAMILLE'S GIFT: A book on Buddhism for children. (CAMILLE the ART DETECTIVE)",
    author: 'Mary Jane',
    category: 'Children',
    rating: '4.9',
  },
  {
    id: 'what-the-heart-wants',
    title: 'What the Heart Wants',
    author: 'Layla Stevens',
    category: 'Fiction',
    rating: '4.8',
  },
  {
    id: 'redefining-talent',
    title: 'Redefining Talent :: Skillsets Needed To Become Better In The New Workplace.',
    author: 'Charles Umeh',
    category: 'Business',
    rating: '4.7',
  },
  {
    id: 'one-hundred-sins',
    title: 'One Hundred Sins: 100 Word Stories for Atheists',
    author: 'Daniel Ramal',
    category: 'Short Stories',
    rating: '4.6',
  },
]

const categories = ['All', 'Children', 'Fiction', 'Business', 'Short Stories', 'Self-Help', 'Spirituality', 'Motivation', 'Political']

function DiscoverPage() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const books = useBooksStore((state) => state.books)

  const discoverBooks = useMemo(() => {
    const storedBooks = books.map((book) => ({
      id: book.id || book.slug || book.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: book.title,
      author: book.author,
      category: book.category,
      rating: '4.9',
      link: book.link,
      coverImage: book.coverImage,
    }))

    return [...storedBooks, ...sampleBooks]
  }, [books])

  const filteredBooks = useMemo(() => {
    return discoverBooks.filter((book) => {
      const matchesQuery = [book.title, book.author, book.category]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase())

      const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory

      return matchesQuery && matchesCategory
    })
  }, [discoverBooks, query, selectedCategory])

  return (
    <main className="space-y-10 px-6 py-10 sm:px-10 lg:px-14">
      <section className="space-y-6 rounded-[2rem] bg-white/90 p-8 shadow-soft sm:p-10">
        <div className="max-w-4xl space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Discover</p>
          <h1 className="text-5xl font-semibold text-night">Explore our curated collection of exceptional literature.</h1>
          <p className="text-lg leading-8 text-slate-600">Search, filter, and discover books from genres, featured authors, and hand-picked collections designed for meaningful reading journeys.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
            <label className="block text-sm font-medium text-slate-700">Search for books</label>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, author, or category"
              className="mt-3 w-full rounded-[1.5rem] border border-slate-200 bg-white px-5 py-4 text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-700">Filter by category</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCategory === category ? 'bg-night text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-500">Showing {filteredBooks.length} of {discoverBooks.length} books</p>
            <p className="text-sm text-slate-500">Query: {query || 'None'} • Category: {selectedCategory}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => <BookCard key={book.title} book={book} />)
        ) : (
          <div className="col-span-full rounded-[2rem] border border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
            No books matched your search. Try another title, author, or category.
          </div>
        )}
      </section>
    </main>
  )
}

export default DiscoverPage
