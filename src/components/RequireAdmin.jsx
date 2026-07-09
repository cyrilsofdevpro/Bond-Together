import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useUserStore from '../store/userStore'

function RequireAdmin() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  const profile = useUserStore((state) => state.profile)
  const location = useLocation()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const isAdmin = profile?.role === 'admin' || profile?.isAdmin === true

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  const confirmed = sessionStorage.getItem('admin_confirmed') === 'true'
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || ''

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!ADMIN_PASSWORD) {
      setError('Admin password not configured.')
      return
    }

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_confirmed', 'true')
      window.location.reload()
      return
    }

    setError('Incorrect password')
  }

  if (confirmed) {
    return <Outlet />
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[1rem] border border-slate-200 bg-white p-6 text-center shadow-soft">
        <h2 className="text-xl font-semibold text-night">Admin confirmation</h2>
        <p className="mt-2 text-slate-600">Please enter the admin password to continue.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Admin password" className="w-full rounded-lg border border-slate-200 px-4 py-2" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-center">
            <button type="submit" className="inline-flex items-center justify-center rounded-full bg-night px-6 py-2 text-sm font-semibold text-white">Confirm</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RequireAdmin
