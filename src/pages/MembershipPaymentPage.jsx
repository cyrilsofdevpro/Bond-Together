import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import useUserStore from '../store/userStore'
import RedeemCode from '../components/RedeemCode'

const planDetails = {
  basic: {
    key: 'basic',
    title: 'Basic Membership',
    price: '$200',
    durationDays: 365,
    description: 'ideal for readers who want to stay connected and enjoy the core club experience.',
  },
  standard: {
    key: 'standard',
    title: 'Standard Membership',
    price: '$500',
    durationDays: 365,
    description: 'for readers who want extra events, networking, and richer club perks.',
  },
  premium: {
    key: 'premium',
    title: 'Premium Membership',
    price: '$1,000',
    durationDays: 365,
    description: 'for members who want the full VIP experience, leadership access, and premium perks.',
  },
}

function MembershipPaymentPage() {
  const [searchParams] = useSearchParams()
  const selectedPlan = searchParams.get('plan') || 'basic'
  const [message, setMessage] = useState('')
  const membership = useUserStore((state) => state.membership)
  const fetchMyMembership = useUserStore((state) => state.fetchMyMembership)

  // fetch membership on mount in case server-side membership exists
  useMemo(() => {
    fetchMyMembership()
  }, [])

  const plan = planDetails[selectedPlan] || planDetails.basic

  const isActive = useMemo(() => Boolean(membership?.isActive && membership?.expiresAt && membership.expiresAt > Date.now()), [membership])

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedCode = activationCode.trim()

    if (!trimmedCode) {
      setMessage('Please enter the activation code provided by support.')
      return
    }

    const codePrefix = plan.title.split(' ')[0].toUpperCase()
    const isValidCode = trimmedCode.toUpperCase().startsWith(codePrefix) || trimmedCode.length >= 4

    if (!isValidCode) {
      setMessage('That code does not match this plan. Please contact support for the correct activation code.')
      return
    }

    activateMembership({
      planKey: plan.key,
      planTitle: plan.title,
      activationCode: trimmedCode,
      durationDays: plan.durationDays,
    })

    setMessage(`Your ${plan.title} is now active. Your membership countdown has started.`)
    setActivationCode('')
  }

  return (
    <div className="space-y-8 rounded-[2rem] bg-white/95 p-8 shadow-soft sm:p-10">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Membership payment</p>
        <h1 className="text-4xl font-semibold text-night">Complete your membership through support</h1>
        <p className="text-slate-600">Choose the plan you want, contact support to complete payment, then enter the activation code they send you to unlock your membership.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-purple-600">Selected plan</p>
          <h2 className="mt-3 text-3xl font-semibold text-night">{plan.title}</h2>
          <p className="mt-3 text-slate-600">{plan.description}</p>
          <div className="mt-6 rounded-[1.5rem] border border-purple-200 bg-white p-5">
            <p className="text-4xl font-semibold text-night">{plan.price}</p>
            <p className="mt-2 text-sm text-slate-500">One-time annual membership</p>
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-700">Support payment step</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">Contact our support team to confirm payment. Once payment is complete, support will send you the activation code for this plan.</p>
            <a href="mailto:smithtuning6@gmail.com?subject=Membership%20Payment%20Request%20for%20Bound%20Together" className="mt-4 inline-flex items-center rounded-full bg-night px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">
              Chat support
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Activation code</p>
          <h2 className="mt-3 text-2xl font-semibold text-night">Enter the code from support</h2>
          <p className="mt-3 text-slate-600">After support confirms payment, paste the code they provided here to activate your membership and start the countdown.</p>

          <div className="mt-6">
            <RedeemCode onSuccess={() => setMessage(`Your ${plan.title} is now active.`)} />
          </div>

          {message ? (
            <div className={`mt-5 rounded-[1.25rem] border p-4 text-sm ${isActive ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
              {message}
            </div>
          ) : null}

          {membership?.isActive ? (
            <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Active membership</p>
              <p className="mt-3 text-lg font-semibold text-night">{membership.planTitle}</p>
              <p className="mt-2 text-sm text-emerald-700">Activated on {new Date(membership.activatedAt).toLocaleString()}</p>
              <p className="mt-2 text-sm text-emerald-700">Expires on {new Date(membership.expiresAt).toLocaleString()}</p>
            </div>
          ) : null}

          <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            <p className="font-semibold text-slate-700">Need help?</p>
            <p className="mt-2">If the support team has already confirmed payment, you can still enter your code here to activate the plan instantly.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/pricing" className="text-sm font-semibold text-night">← Back to plans</Link>
      </div>
    </div>
  )
}

export default MembershipPaymentPage
