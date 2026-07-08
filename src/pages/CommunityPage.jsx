import { useMemo, useState } from 'react'
import useUserStore from '../store/userStore'

function CommunityPage() {
  const membership = useUserStore((state) => state.membership)
  const profile = useUserStore((state) => state.profile)
  const [joinedCommunities, setJoinedCommunities] = useState([])

  const communities = [
    {
      title: 'Literary Salon',
      description: 'A refined space for thematic discussions, curated reading prompts, and thoughtful conversation with members who love deep literary exploration.',
      badge: 'Premium',
      perks: ['Weekly curated prompts', 'Private discussion threads', 'Author Q&A access'],
    },
    {
      title: 'Author Roundtable',
      description: 'An elevated circle for readers who want direct access to authors, live office hours, and insider conversations about craft and storytelling.',
      badge: 'Standard +',
      perks: ['Live author sessions', 'Member-only event invites', 'Priority Q&A seating'],
    },
    {
      title: 'Fantasy Readers',
      description: 'A vivid, immersive community for fantasy lovers featuring reading challenges, worldbuilding circles, and exclusive release discussions.',
      badge: 'Open',
      perks: ['Reading streaks', 'Digital book journal', 'Community challenges'],
    },
  ]

  const isStandardOrPremium = useMemo(() => {
    const hasActiveMembership = Boolean(membership?.isActive && membership?.expiresAt && membership.expiresAt > Date.now())
    return hasActiveMembership || profile?.plan === 'standard' || profile?.plan === 'premium' || profile?.isStandard === true || profile?.isPremium === true || profile?.subscriptionStatus === 'active'
  }, [membership, profile?.plan, profile?.isStandard, profile?.isPremium, profile?.subscriptionStatus])

  const premiumFeatures = useMemo(() => [
    'Digital reading tracker and book journal',
    'Private community circles with moderated discussions',
    'VIP access to live author salons and member retreats',
    'AI-guided reading insights and personalized recommendations',
    'Exclusive quarterly reading kits and curated merch drops',
  ], [])

  const handleJoin = (title) => {
    if (!isStandardOrPremium) {
      return
    }

    setJoinedCommunities((current) => (current.includes(title) ? current : [...current, title]))
  }

  return (
    <div className="space-y-8 rounded-[2rem] bg-white/95 p-8 shadow-soft sm:p-10">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Community</p>
        <h1 className="text-4xl font-semibold text-night">Discover curated reading communities</h1>
        <p className="text-slate-600">Join vibrant circles for discussion, accountability, and elevated book experiences designed for modern readers.</p>
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-slate-950/5 p-8">
        <div className="max-w-3xl space-y-4">
          <div className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${isStandardOrPremium ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {isStandardOrPremium ? 'Community access unlocked' : 'Standard or Premium required to join communities'}
          </div>
          <p className="text-sm uppercase tracking-[0.3em] text-purple-600">Premium community experience</p>
          <h2 className="text-3xl font-semibold text-night">High-end features for Standard and Premium members</h2>
          <ul className="mt-6 space-y-3 text-slate-600">
            {premiumFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-semibold text-white">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {communities.map((community) => {
          const isJoined = joinedCommunities.includes(community.title)

          return (
            <div key={community.title} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
              <div className="mb-4 h-48 rounded-[1.75rem] bg-gradient-to-br from-purple-500 to-amber-400" />
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold text-night">{community.title}</h2>
                <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">{community.badge}</span>
              </div>
              <p className="mt-3 text-slate-600">{community.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {community.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <span className="mt-1 text-purple-600">•</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => handleJoin(community.title)}
                disabled={!isStandardOrPremium}
                className={`mt-6 inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold transition ${isJoined ? 'bg-emerald-600 text-white' : isStandardOrPremium ? 'bg-night text-white hover:bg-slate-900' : 'cursor-not-allowed border border-slate-300 bg-white text-slate-500'}`}
              >
                {isJoined ? 'Joined' : isStandardOrPremium ? 'Join community' : 'Upgrade to join'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CommunityPage
