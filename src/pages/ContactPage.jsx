function ContactPage() {
  return (
    <div className="grid gap-10 rounded-[2rem] bg-white/90 p-8 shadow-soft sm:p-10">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Contact</p>
        <h1 className="text-4xl font-semibold text-night">Get in touch with the Bound Together team</h1>
        <p className="text-slate-600">Have a question about memberships, events, or author collaborations? Our support team is here to help.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form className="space-y-5 rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Name</span>
            <input type="text" placeholder="Your full name" className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input type="email" placeholder="you@example.com" className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Message</span>
            <textarea rows="5" placeholder="Tell us how we can help" className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100" />
          </label>
          <button type="submit" className="inline-flex items-center justify-center rounded-full bg-night px-8 py-4 text-sm font-semibold text-white transition hover:bg-slate-900">
            Send message
          </button>
        </form>
        <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-night p-8 text-white shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Customer care</p>
          <h2 className="mt-4 text-3xl font-semibold">We’re here for authors, readers, and communities.</h2>
          <p className="mt-4 text-slate-200">Email us at <a href="mailto:smithtuning6@gmail.com" className="text-amber-300 underline">smithtuning6@gmail.com</a> and expect a prompt response within one business day.</p>
          <p className="mt-4 text-slate-200">Join us on X: <a href="https://x.com/bondtogether01" target="_blank" rel="noreferrer" className="text-amber-300 underline">x.com/bondtogether01</a></p>
          <div className="mt-8 grid gap-4 text-sm text-slate-300">
            <div>
              <p className="font-semibold text-white">Phone</p>
              <p className="mt-2">+1 (555) 964-2034</p>
            </div>
            <div>
              <p className="font-semibold text-white">Office hours</p>
              <p className="mt-2">Mon–Fri, 9am–6pm ET</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
