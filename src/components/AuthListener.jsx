import { useEffect } from 'react'
import { supabase } from '../supabase/client'
import useUserStore from '../store/userStore'
import { getCurrentSession, getProfile } from '../supabase/authService'

function AuthListener() {
  const loginSuccess = useUserStore((state) => state.loginSuccess)
  const logout = useUserStore((state) => state.logout)

  useEffect(() => {
    let subscription

    async function loadSession() {
      const { data, error } = await getCurrentSession()
      if (error) return

      if (data?.session?.user) {
        const profileResult = await getProfile(data.session.user.id)
        loginSuccess(data.session, profileResult.data)
      }
    }

    loadSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profileResult = await getProfile(session.user.id)
        loginSuccess(session, profileResult.data)
        return
      }

      logout()
    })

    subscription = authListener?.subscription

    return () => subscription?.unsubscribe()
  }, [loginSuccess, logout])

  return null
}

export default AuthListener
