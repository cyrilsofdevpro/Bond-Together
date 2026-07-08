import { useEffect, useState } from 'react'
import { getDiscussionQuestions } from '../services/ai'
import Button from './ui/Button'

function AiDiscussionPanel() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDiscussionQuestions('Moonlit Chapters')
      .then((data) => setQuestions(data))
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="rounded-[2rem] bg-white/95 p-8 shadow-soft sm:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">AI discussion</p>
          <h2 className="mt-2 text-3xl font-semibold text-night">Discussion questions for your next club meeting</h2>
        </div>
        <Button variant="primary" size="md">Generate new set</Button>
      </div>
      <div className="mt-8 grid gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((index) => (
            <div key={index} className="h-20 rounded-[1.75rem] bg-slate-100 animate-pulse" />
          ))
        ) : (
          questions.map((question) => (
            <div key={question} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 text-slate-700">
              {question}
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default AiDiscussionPanel
