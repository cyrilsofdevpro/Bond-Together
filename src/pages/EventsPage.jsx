function EventsPage() {
  const events = [
    { title: 'Virtual Book Salon', date: 'Aug 18, 2026', host: 'Mila Hart' },
    { title: 'Reading Rituals Workshop', date: 'Sep 2, 2026', host: 'Noah Grant' },
    { title: 'Author Q&A Night', date: 'Sep 20, 2026', host: 'Elena Park' },
  ]

  return (
    <div className="space-y-8 rounded-[2rem] bg-white/95 p-8 shadow-soft sm:p-10">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Events</p>
        <h1 className="text-4xl font-semibold text-night">Upcoming virtual reading experiences</h1>
        <p className="text-slate-600">Register for immersive book club events, author meetups, and live discussions built for a premium audience.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {events.map((event) => (
          <div key={event.title} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-purple-600">{event.date}</p>
            <h2 className="mt-4 text-2xl font-semibold text-night">{event.title}</h2>
            <p className="mt-4 text-slate-600">Hosted by {event.host}, featuring guided conversation and exclusive access.</p>
            <button className="mt-6 inline-flex items-center rounded-full bg-night px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">
              Register now
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EventsPage
