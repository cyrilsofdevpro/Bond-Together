import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { signInWithEmail, getProfile } from '../supabase/authService'
import useUserStore from '../store/userStore'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const loginSuccess = useUserStore((state) => state.loginSuccess)

  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const { data, error } = await signInWithEmail(email, password)
    if (error) {
      setError(error.message)
      return
    }

    const session = data.session
    const profileResult = await getProfile(session.user.id)
    loginSuccess(session, profileResult.data)
    navigate(from, { replace: true })
  }

  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] bg-white/95 p-10 shadow-soft">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Welcome back</p>
        <h1 className="text-4xl font-semibold text-night">Sign in to Bound Together</h1>
        <p className="text-slate-600">Access your library, communities, events, and personalized book recommendations.</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="submit" className="inline-flex items-center justify-center rounded-full bg-night px-8 py-4 text-sm font-semibold text-white transition hover:bg-slate-900">
            Continue
          </button>
          <Link to="/forgot-password" className="text-sm font-medium text-purple-600 transition hover:text-purple-500">
            Forgot password?
          </Link>
        </div>
      </form>
      <p className="mt-6 text-sm text-slate-600">
        New to Bound Together? <Link to="/register" className="font-semibold text-night">Create an account</Link>
      </p>
    </div>
  )
}

export default LoginPage
