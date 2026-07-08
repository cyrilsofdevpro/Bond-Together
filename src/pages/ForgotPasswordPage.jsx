import { Link } from 'react-router-dom'

function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] bg-white/95 p-10 shadow-soft">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Password reset</p>
        <h1 className="text-4xl font-semibold text-night">Recover access to your account</h1>
        <p className="text-slate-600">Enter your email and we’ll send you a secure link to reset your password.</p>
      </div>
      <form className="mt-10 space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email address</span>
          <input type="email" placeholder="you@example.com" className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100" />
        </label>
        <button type="submit" className="inline-flex items-center justify-center rounded-full bg-night px-8 py-4 text-sm font-semibold text-white transition hover:bg-slate-900">
          Send reset link
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-600">
        Back to <Link to="/login" className="font-semibold text-night">sign in</Link>
      </p>
    </div>
  )
}

export default ForgotPasswordPage
