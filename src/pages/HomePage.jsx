import BookCard from '../components/BookCard'
import TrendingBookSection from '../components/TrendingBookSection'
import PersonalizedHero from '../components/PersonalizedHero'

const featuredBooks = [
  { title: 'The Quiet Library', author: 'Ava Sinclair', category: 'Fiction', rating: '4.9' },
  { title: 'Storycraft', author: 'Milo Tate', category: 'Nonfiction', rating: '4.8' },
  { title: 'Moonlit Chapters', author: 'Nora Vale', category: 'Romance', rating: '4.7' },
]

const highlights = [
  { title: 'Curated book lists', description: 'Hand-picked selections for meaningful reading and calm exploration.' },
  { title: 'Author events', description: 'Join intimate sessions with authors and thoughtful conversations.' },
  { title: 'Personalized discovery', description: 'Recommendations tailored to your preferences and club interests.' },
]

function HomePage() {
  return (
    <main className="space-y-12 px-4 py-10 sm:px-8 lg:px-12">
      <PersonalizedHero />

      <section className="rounded-[2rem] bg-white/90 p-8 shadow-soft sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Welcome back</p>
            <h2 className="text-3xl font-semibold text-night sm:text-4xl">A cleaner homepage for your next reading journey.</h2>
            <p className="text-slate-600">Discover books, join premium clubs, and stay inspired with a calm layout designed to help you focus.</p>
          </div>
          <a href="/discover" className="inline-flex items-center justify-center rounded-full bg-night px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">
            Explore discover
          </a>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {featuredBooks.map((book) => (
          <BookCard key={book.title} book={book} />
        ))}
      </section>

      <section className="grid gap-6 rounded-[2rem] bg-slate-950/5 p-8 shadow-soft sm:p-10">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-purple-600">Why Bound Together</p>
          <h2 className="text-3xl font-semibold text-night">Reading made calm, clear, and connected.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-night">{item.title}</h3>
              <p className="mt-3 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <TrendingBookSection />

      <section className="rounded-[2rem] bg-white/90 p-8 text-center shadow-soft sm:p-10">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Join the club</p>
        <h2 className="mt-4 text-3xl font-semibold text-night sm:text-4xl">Start your next chapter with a premium community.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">Whether you want a guided reading plan, author access, or curated book recommendations, Bound Together keeps it simple.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a href="/register" className="inline-flex items-center justify-center rounded-full bg-night px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">Join now</a>
          <a href="/discover" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">Browse discover</a>
        </div>
      </section>
    </main>
  )
}

export default HomePage
