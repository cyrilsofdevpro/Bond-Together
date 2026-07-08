import { useMemo } from 'react'
import Button from './ui/Button'
import useUserStore from '../store/userStore'
import heroBackground from '../image/image.png'

function PersonalizedHero() {
  const profile = useUserStore((state) => state.profile) ?? {}

  const heroSubtitle = useMemo(() => {
    const genre = profile.favoriteGenres?.[0] || 'curated'
    return `Discover new ${genre.toLowerCase()} reads, author events, and book clubs matched to your interests.`
  }, [profile.favoriteGenres])

  return (
    <section
      style={{ backgroundImage: `url(${heroBackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-16 text-white shadow-glow sm:px-10 md:px-14"
    >
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.32),_transparent_35%),linear-gradient(180deg,_rgba(15,23,42,0.72),_transparent_60%)]" />
      <div className="relative z-10 mx-auto flex max-w-[1220px] flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-lg">
            <span className="h-5 w-5 rounded-full bg-amber-300" />
            Personalized for {profile.name ?? 'you'}
          </div>
          <div className="space-y-6">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Your next chapter starts with smart reading guidance.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-200/90">{heroSubtitle}</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button variant="primary" size="lg">Show my recommendations</Button>
            <Button variant="secondary" size="lg" className="bg-white text-night">Explore AI tools</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/10 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Top genre</p>
              <p className="mt-3 text-3xl font-semibold text-white">{profile.favoriteGenres?.[0] ?? 'recommended'}</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Active communities</p>
              <p className="mt-3 text-3xl font-semibold text-white">{profile.communities?.length ?? 0}</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Wishlist</p>
              <p className="mt-3 text-3xl font-semibold text-white">{profile.wishlist?.length ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft backdrop-blur-xl">
          <div className="space-y-6">
            <div className="rounded-[1.75rem] bg-slate-950/80 p-6 shadow-xl ring-1 ring-white/10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Reading stamina</p>
                  <p className="mt-3 text-4xl font-semibold text-white">{profile.readingHistory?.length ?? 0} books</p>
                </div>
                <div className="rounded-3xl bg-gradient-to-br from-purple-500 to-amber-400 px-4 py-3 text-white">AI</div>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
                  <p className="font-semibold text-white">Favorites</p>
                  <p className="mt-2">{profile.favoriteAuthors?.[0] ?? 'Top author'}</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
                  <p className="font-semibold text-white">Last active</p>
                  <p className="mt-2">Today</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] bg-white/10 p-5 text-slate-100">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Recommended event</p>
                <p className="mt-4 text-xl font-semibold">Virtual book salon</p>
                <p className="mt-2 text-sm text-slate-300">Tailored to your current reading preferences.</p>
              </div>
              <div className="rounded-[1.75rem] bg-white/10 p-5 text-slate-100">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Suggested author</p>
                <p className="mt-4 text-xl font-semibold">Mila Hart</p>
                <p className="mt-2 text-sm text-slate-300">A great match for your reading style.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PersonalizedHero
