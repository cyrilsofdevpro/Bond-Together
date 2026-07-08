function PricingPage() {
  const plans = [
    {
      title: 'Basic Membership',
      price: '$200',
      billing: 'per year',
      highlight: false,
      features: [
        'Access to the members-only community',
        'Monthly Book of the Month selection',
        'Monthly virtual book discussion',
        'Reading guide and discussion questions',
        'Digital reading tracker and book journal',
        'Monthly newsletter with book recommendations',
        'Access to member polls for future book selections',
        '5% discount on club merchandise and events',
        'Digital membership certificate',
      ],
      cta: 'Choose Basic',
    },
    {
      title: 'Standard Membership',
      price: '$500',
      billing: 'per year',
      highlight: true,
      features: [
        'Everything included in Basic Membership',
        'Exclusive author Q&A sessions',
        'Priority registration for club events',
        'Quarterly exclusive book box or reading kit',
        'Access to members-only workshops and masterclasses',
        'Small-group networking sessions',
        'Early access to special events and retreats',
        'Personalized reading recommendations',
        '10% discount on merchandise and partner bookstores',
        'Welcome gift package',
      ],
      cta: 'Choose Standard',
    },
    {
      title: 'Premium Membership',
      price: '$1,000',
      billing: 'per year',
      highlight: false,
      features: [
        'Everything included in Standard Membership',
        'VIP access to all virtual and in-person events',
        'Annual luxury book gift box',
        'One-on-one reading consultation each quarter',
        'Private mastermind discussions with guest authors and experts',
        'Invitation to the annual Bound Together Members Gala',
        'Recognition as a Premium Member on the club website',
        'Ability to nominate books for exclusive club reads',
        'Complimentary premium merchandise bundle',
        '20% discount on all club merchandise and paid events',
        'Priority seating and VIP networking at every event',
        'Exclusive leadership opportunities within the club',
        'Anniversary appreciation gift every year',
      ],
      cta: 'Choose Premium',
    },
  ]

  return (
    <div className="space-y-10 rounded-[2rem] bg-white/95 p-8 shadow-soft sm:p-10">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Membership Packages</p>
        <h1 className="text-4xl font-semibold text-night">Bound Together Book Club</h1>
        <p className="text-slate-600">Choose the membership that fits your reading journey and community experience.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.title} className={`rounded-[2rem] border p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-soft ${plan.highlight ? 'border-purple-600 bg-gradient-to-b from-purple-50 to-white shadow-lg' : 'border-slate-200 bg-slate-50'}`}>
            <p className="text-sm uppercase tracking-[0.3em] text-purple-600">{plan.title}</p>
            <p className="mt-4 text-5xl font-semibold text-night">{plan.price}</p>
            <p className="mt-2 text-sm text-slate-500">{plan.billing}</p>
            <ul className="mt-6 space-y-3 text-slate-600">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-semibold text-white">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href={`/membership-payment?plan=${plan.title.toLowerCase().replace(/ membership/g, '').replace(/ /g, '-')}`}
              className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-4 text-sm font-semibold transition ${plan.highlight ? 'bg-night text-white hover:bg-slate-900' : 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-100'}`}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-slate-950/5 p-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-purple-600">Payment Support</p>
          <h2 className="text-3xl font-semibold text-night">After selecting your preferred plan, contact support to complete your payment manually.</h2>
          <p className="text-lg leading-8 text-slate-600">Please email <a href="mailto:smithtuning6@gmail.com" className="font-semibold text-purple-700 underline">smithtuning6@gmail.com</a> with your chosen membership plan and payment request.</p>
          <p className="text-lg leading-8 text-slate-600">Read. Connect. Grow. Together.</p>
        </div>
      </div>
    </div>
  )
}

export default PricingPage
