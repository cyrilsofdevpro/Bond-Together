import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUpWithEmail, getProfile } from '../supabase/authService'
import useUserStore from '../store/userStore'

function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const loginSuccess = useUserStore((state) => state.loginSuccess)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const { data, error } = await signUpWithEmail(fullName, email, password)
    if (error) {
      setError(error.message)
      return
    }

    const session = data?.session ?? null
    const user = session?.user ?? data?.user ?? null

    if (!user) {
      setError('Account created, but the session is not ready yet. Please sign in manually.')
      return
    }

    const profileResult = await getProfile(user.id)
    loginSuccess(session, profileResult.data)
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] bg-white/95 p-10 shadow-soft">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Join the club</p>
        <h1 className="text-4xl font-semibold text-night">Create your Bound Together account</h1>
        <p className="text-slate-600">Start discovering books, join premium communities, and connect with authors worldwide.</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Full name</span>
          <input
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Your name"
            className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          />
        </label>
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
        <button type="submit" className="inline-flex items-center justify-center rounded-full bg-night px-8 py-4 text-sm font-semibold text-white transition hover:bg-slate-900">
          Create account
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-600">
        Already a member? <Link to="/login" className="font-semibold text-night">Sign in</Link>
      </p>
    </div>
  )
}

export default RegisterPage
