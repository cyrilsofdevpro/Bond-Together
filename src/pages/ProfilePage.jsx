import useUserStore from '../store/userStore'

function ProfilePage() {
  const profile = useUserStore((state) => state.profile)
  const displayName = profile?.full_name || profile?.username || 'there'

  return (
    <div className="space-y-8 rounded-[2rem] bg-white/95 p-8 shadow-soft sm:p-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Profile</p>
          <h1 className="mt-3 text-4xl font-semibold text-night">Welcome back, {displayName}.</h1>
          <p className="text-slate-600">Your reading stats, saved books, communities, and notifications are all in one place.</p>
        </div>
        <button className="inline-flex items-center rounded-full bg-night px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">
          Edit profile
        </button>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { title: 'Reading streak', value: '14 days' },
          { title: 'Books saved', value: '42' },
          { title: 'Community posts', value: '18' },
        ].map((stat) => (
          <div key={stat.title} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-purple-600">{stat.title}</p>
            <p className="mt-4 text-3xl font-semibold text-night">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProfilePage
