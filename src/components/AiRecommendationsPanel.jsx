import { useEffect, useState } from 'react'
import { getPersonalizedBookRecommendations } from '../services/ai'
import Button from './ui/Button'

const sampleProfile = {
  favoriteGenres: ['Personal development', 'Leadership', 'Productivity'],
  favoriteAuthors: ['James Clear', 'Cal Newport'],
  readingHistory: ['Atomic Habits', 'Deep Work'],
  wishlist: ['The Power of Habit'],
}

function AiRecommendationsPanel() {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPersonalizedBookRecommendations(sampleProfile)
      .then((data) => {
        setRecommendations(data)
      })
      .catch(() => setRecommendations([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="grid gap-6 rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-night p-8 text-white shadow-glow sm:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Personalized AI</p>
          <h2 className="mt-2 text-4xl font-semibold">Recommendations shaped by your reading habits</h2>
          <p className="mt-4 max-w-2xl text-slate-300">AI creates a custom book list based on your favorite authors, ratings, and activity.</p>
        </div>
        <Button variant="secondary" className="bg-white text-night" size="lg">
          Refresh suggestions
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-[1.75rem] bg-white/10 p-6" />
          ))
        ) : (
          recommendations.map((book) => (
            <div key={book.title} className="rounded-[1.75rem] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.24em] text-amber-200">{book.author}</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{book.title}</h3>
              <p className="mt-3 text-sm text-slate-300">{book.reason}</p>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default AiRecommendationsPanel
