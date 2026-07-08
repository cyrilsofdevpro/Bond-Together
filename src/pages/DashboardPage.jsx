import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import useUserStore from '../store/userStore'

function DashboardPage() {
  const membership = useUserStore((state) => state.membership)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const quickActions = [
    { label: 'Continue reading', to: '/books' },
    { label: 'Open messages', to: '/messages' },
    { label: 'View profile', to: '/profile' },
    { label: 'Browse events', to: '/events' },
  ]

  const recentActivity = [
    { title: 'You joined the General Book Lounge', meta: 'Today · 10:20 AM' },
    { title: 'You saved 3 new books', meta: 'Yesterday · 8:45 PM' },
    { title: 'You completed a reading streak', meta: '2 days ago · 6:10 PM' },
  ]

  const recommendedBooks = [
    { title: 'The Quiet Reader', author: 'Lina Hart' },
    { title: 'Notes from the Margin', author: 'Samuel Reed' },
    { title: 'Midnight Pages', author: 'Ava Brooks' },
  ]

  const isMembershipActive = useMemo(() => Boolean(membership?.isActive && membership?.expiresAt && membership.expiresAt > Date.now()), [membership])

  useEffect(() => {
    if (!membership?.expiresAt) {
      return undefined
    }

    const updateTimer = () => {
      const remaining = Math.max(0, membership.expiresAt - Date.now())
      const seconds = Math.floor((remaining / 1000) % 60)
      const minutes = Math.floor((remaining / (1000 * 60)) % 60)
      const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24)
      const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
      setTimeLeft({ days, hours, minutes, seconds })
    }

    updateTimer()
    const timer = window.setInterval(updateTimer, 1000)
    return () => window.clearInterval(timer)
  }, [membership?.expiresAt])

  return (
    <div className="space-y-8 rounded-[2rem] bg-white/95 p-8 shadow-soft sm:p-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold text-night">Your reading journey at a glance</h1>
          <p className="text-slate-600">Track progress, review your library, and stay on top of upcoming events.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center rounded-full bg-night px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">
            View analytics
          </button>
          {isMembershipActive ? (
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700">
              Plan active · {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s left
            </div>
          ) : (
            <Link to="/pricing" className="inline-flex items-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
              Upgrade plan
            </Link>
          )}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { title: 'Books in progress', value: '5' },
          { title: 'Next event', value: 'Aug 18' },
          { title: 'Unread messages', value: '3' },
        ].map((item) => (
          <div key={item.title} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-purple-600">{item.title}</p>
            <p className="mt-4 text-3xl font-semibold text-night">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Recent activity</p>
              <h2 className="mt-2 text-2xl font-semibold text-night">Your latest moves</h2>
            </div>
            <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Live</span>
          </div>
          <div className="mt-6 space-y-4">
            {recentActivity.map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-night">{item.title}</p>
                <p className="mt-2 text-sm text-slate-500">{item.meta}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-purple-600">Quick actions</p>
          <div className="mt-6 space-y-3">
            {quickActions.map((action) => (
              <Link key={action.label} to={action.to} className="flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                <span>{action.label}</span>
                <span className="text-base text-night">→</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-slate-950/5 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-purple-600">Recommended for you</p>
            <h2 className="mt-2 text-2xl font-semibold text-night">Books worth your next reading session</h2>
          </div>
          <Link to="/discover" className="text-sm font-semibold text-night">View more</Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {recommendedBooks.map((book) => (
            <div key={book.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="h-28 rounded-[1.25rem] bg-gradient-to-br from-purple-600 to-amber-400" />
              <p className="mt-4 text-lg font-semibold text-night">{book.title}</p>
              <p className="mt-2 text-sm text-slate-500">{book.author}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
