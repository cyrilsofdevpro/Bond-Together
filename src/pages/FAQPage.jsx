function FAQPage() {
  const faqs = [
    { question: 'How do I join a book club?', answer: 'Browse featured communities and request membership to take part in discussions and events.' },
    { question: 'Can authors host live sessions?', answer: 'Yes. Verified authors can create virtual events, book launches, and Q&A salons.' },
    { question: 'Is there a premium subscription?', answer: 'Premium membership unlocks exclusive events, curated book lists, and early author access.' },
  ]

  return (
    <div className="space-y-8 rounded-[2rem] bg-white/95 p-8 shadow-soft sm:p-10">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">FAQ</p>
        <h1 className="text-4xl font-semibold text-night">Frequently asked questions</h1>
        <p className="text-slate-600">Everything you need to know about memberships, events, author access, and community features.</p>
      </div>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <details key={faq.question} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 transition hover:border-purple-300">
            <summary className="cursor-pointer text-lg font-semibold text-night">{faq.question}</summary>
            <p className="mt-4 text-slate-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  )
}

export default FAQPage
