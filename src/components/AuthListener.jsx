import { useEffect } from 'react'
import useUserStore from '../store/userStore'
import { getCurrentSession, getProfile } from '../supabase/authService'
import { supabase, isSupabaseConfigured } from '../supabase/client'

function AuthListener() {
  const loginSuccess = useUserStore((state) => state.loginSuccess)
  const logout = useUserStore((state) => state.logout)
  const setAuthInitialized = useUserStore((state) => state.setAuthInitialized)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return undefined
    }

    let subscription

    async function loadSession() {
      console.log('[auth] AuthListener loadSession start')
      const { data, error } = await getCurrentSession()
      console.log('[auth] AuthListener loadSession result', { data, error })

      if (error) {
        console.error('[auth] AuthListener getCurrentSession error', error)
      }

      if (data?.session?.user) {
        const profileResult = await getProfile(data.session.user.id)
        loginSuccess(data.session, profileResult.data)
      }
      // mark auth as initialized (we attempted to load session)
      try {
        setAuthInitialized(true)
      } catch (e) {
        console.error('[auth] AuthListener setAuthInitialized error', e)
      }
    }

    loadSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[auth] auth state change', { event, session })
      if (session?.user) {
        const profileResult = await getProfile(session.user.id)
        loginSuccess(session, profileResult.data)
        return
      }

      logout()
    })

    // ensure authInitialized is set when auth state changes (covers logout path)
    try {
      setAuthInitialized(true)
    } catch (e) {
      // ignore
    }

    subscription = authListener?.subscription

    return () => subscription?.unsubscribe()
  }, [loginSuccess, logout])

  return null
}

export default AuthListener
