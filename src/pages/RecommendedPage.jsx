import TrendingBookSection from '../components/TrendingBookSection'
import NewReleaseSection from '../components/NewReleaseSection'
import VirtualSpotlightSection from '../components/VirtualSpotlightSection'
import RecommendedSection from '../components/RecommendedSection'

function RecommendedPage() {
  return (
    <main className="space-y-10 px-6 py-10 sm:px-10 lg:px-14">
      <section className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-night px-8 py-14 text-white shadow-glow sm:px-10">
        <div className="max-w-4xl space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Recommended reading</p>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">Your curated book discovery hub</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-200">
            Explore premium recommendations, discover new releases, and meet featured authors selected for your most engaging reading journey.
          </p>
        </div>
      </section>

      <RecommendedSection />
      <NewReleaseSection />
      <TrendingBookSection />
      <VirtualSpotlightSection />
    </main>
  )
}

export default RecommendedPage
