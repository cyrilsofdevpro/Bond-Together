import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useUserStore from '../store/userStore'

function RequireAuth() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export default RequireAuth
