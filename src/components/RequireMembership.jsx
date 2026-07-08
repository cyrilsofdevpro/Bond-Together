import { Link, Outlet } from 'react-router-dom'
import useUserStore from '../store/userStore'

function RequireMembership() {
  const membership = useUserStore((state) => state.membership)
  const isActive = Boolean(membership?.isActive && membership?.expiresAt && membership.expiresAt > Date.now())

  if (isActive) {
    return <Outlet />
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-soft sm:p-10">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Membership required</p>
        <h1 className="mt-3 text-3xl font-semibold text-night">Please subscribe to access this feature.</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">This part of the platform is available to subscribed members only. Choose a plan and complete the support-based payment process to unlock it.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/pricing" className="inline-flex items-center rounded-full bg-night px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">
            View plans
          </Link>
          <Link to="/" className="inline-flex items-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
            Back home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RequireMembership
