import Button from './ui/Button'

function ReadingGoalPanel() {
  return (
    <section className="rounded-[2rem] bg-white/95 p-8 shadow-soft sm:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Goal coach</p>
          <h2 className="mt-2 text-3xl font-semibold text-night">Track your reading goal</h2>
        </div>
        <Button variant="secondary" size="md">Update goal</Button>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[
          { label: 'Daily goal', value: '100 pages' },
          { label: 'Remaining today', value: '15 pages' },
          { label: 'Streak', value: '10 days' },
        ].map((item) => (
          <div key={item.label} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
            <p className="mt-4 text-3xl font-semibold text-night">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-[1.75rem] bg-gradient-to-r from-purple-600 to-amber-400 p-6 text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-white/80">Motivation</p>
        <p className="mt-3 text-xl font-semibold">You have only 15 pages left to hit today&apos;s goal — keep the momentum going.</p>
      </div>
    </section>
  )
}

export default ReadingGoalPanel
