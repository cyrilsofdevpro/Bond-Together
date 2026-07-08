function ReadingInsightsCard() {
  return (
    <div className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-[0.9fr_0.8fr]">
      <div className="space-y-5">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Reading insights</p>
        <h3 className="text-3xl font-semibold text-night">Personalized reading analytics</h3>
        <p className="text-slate-600">AI identifies your reading trends, session habits, and favorite genres so you can stay on track.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { label: 'Favorite genre', value: 'Mystery' },
            { label: 'Average session', value: '20 pages' },
            { label: 'Reading streak', value: '10 days' },
            { label: 'Night reader', value: '72%' },
          ].map((item) => (
            <div key={item.label} className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
              <p className="mt-3 text-2xl font-semibold text-night">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-[2rem] bg-slate-950 p-6 text-white">
        <div className="h-72 rounded-[1.75rem] bg-gradient-to-br from-purple-600 to-amber-400 p-6">
          <p className="uppercase tracking-[0.3em] text-sm text-white/80">Insight chart</p>
          <div className="mt-8 h-40 rounded-[1.5rem] bg-white/10 p-4">
            <div className="flex h-full flex-col justify-end gap-3">
              {[72, 55, 60, 80, 90].map((value, index) => (
                <div key={index} className="flex items-end gap-2">
                  <div className="h-2 w-10 rounded-full bg-white/50" style={{ width: `${value}%` }} />
                  <span className="text-xs text-slate-200">{value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReadingInsightsCard
