import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useUserStore from '../store/userStore'

function RequireAdmin() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  const profile = useUserStore((state) => state.profile)
  const session = useUserStore((state) => state.session)
  const location = useLocation()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const isAdmin =
    profile?.role === 'admin' ||
    profile?.isAdmin === true ||
    session?.user?.app_metadata?.role === 'admin' ||
    session?.user?.role === 'admin'

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!isAdmin) {
    return <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[1rem] border border-slate-200 bg-white p-6 text-center shadow-soft">
        <h2 className="text-xl font-semibold text-night">Unauthorized</h2>
        <p className="mt-2 text-slate-600">You must sign in with an admin account to access this area.</p>
      </div>
    </div>
  }

  return <Outlet />
}

export default RequireAdmin
