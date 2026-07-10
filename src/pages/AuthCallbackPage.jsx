import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSessionFromUrl, getProfile } from '../supabase/authService'
import useUserStore from '../store/userStore'

function AuthCallbackPage() {
  const navigate = useNavigate()
  const loginSuccess = useUserStore((state) => state.loginSuccess)

  useEffect(() => {
    const finishAuth = async () => {
      console.log('[auth] AuthCallbackPage mounted')
      const { data, error } = await getSessionFromUrl()
      console.log('[auth] AuthCallbackPage getSessionFromUrl', { data, error })

      if (error) {
        console.error('[auth] AuthCallbackPage error', error)
        navigate('/login', { replace: true })
        return
      }

      const session = data?.session
      if (session?.user) {
        const profileResult = await getProfile(session.user.id)
        loginSuccess(session, profileResult.data)
        navigate('/dashboard', { replace: true })
        return
      }

      navigate('/login', { replace: true })
    }

    void finishAuth()
  }, [loginSuccess, navigate])

  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] bg-white/95 p-10 shadow-soft">
      <h1 className="text-4xl font-semibold text-night">Processing authentication...</h1>
      <p className="mt-4 text-slate-600">Please wait while we finish your login flow.</p>
    </div>
  )
}

export default AuthCallbackPage
