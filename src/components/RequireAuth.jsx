import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useUserStore from '../store/userStore'

function RequireAuth() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  const authInitialized = useUserStore((state) => state.authInitialized)
  const location = useLocation()

  // while we are checking auth (supabase client reading session), don't redirect
  if (!authInitialized) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export default RequireAuth
