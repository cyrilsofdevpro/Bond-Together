import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    console.log('[auth] AuthCallbackPage mounted')
    navigate('/login', { replace: true })
  }, [navigate])

  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] bg-white/95 p-10 shadow-soft">
      <h1 className="text-4xl font-semibold text-night">Processing authentication...</h1>
      <p className="mt-4 text-slate-600">Please wait while we finish your login flow.</p>
    </div>
  )
}

export default AuthCallbackPage
