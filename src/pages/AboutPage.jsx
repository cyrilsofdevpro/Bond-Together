function AboutPage() {
  return (
    <div className="rounded-[2rem] bg-white/90 p-8 shadow-soft sm:p-10">
      <div className="max-w-3xl space-y-6">
        <p className="text-sm uppercase tracking-[0.24em] text-amber-600">About Bound Together</p>
        <h1 className="text-4xl font-semibold text-night">A premium online book club built for modern readers and authors.</h1>
        <p className="text-base leading-8 text-slate-600">
          Bound Together is designed around premium storytelling, meaningful conversation, and immersive events. The platform connects readers with authors, curated book experiences, and private communities that celebrate reading as a shared journey.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { title: 'Curated communities', description: 'Thoughtfully crafted book circles with expert moderation and select member experiences.' },
            { title: 'Author-led events', description: 'Exclusive reading sessions, Q&A salons, and launch celebrations for new releases.' },
            { title: 'Smart recommendations', description: 'Personalized book discovery based on reading habits and curated taste profiles.' },
            { title: 'Premium design', description: 'A refined, accessible interface with glassmorphism, gentle motion, and elegant details.' },
          ].map((item) => (
            <div key={item.title} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-night">{item.title}</h2>
              <p className="mt-3 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AboutPage
