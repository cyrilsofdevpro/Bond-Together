import { supabase, isSupabaseConfigured } from './client'

const emptyResult = { data: null, error: null }

export async function signInWithEmail(email, password) {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase is not configured') }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error(JSON.stringify(error)) }
  }
}

export async function signUpWithEmail(fullName, email, password) {
  if (!isSupabaseConfigured) {
    console.error('[auth] signUp request blocked: Supabase is not configured')
    return { data: null, error: new Error('Supabase is not configured') }
  }

  const redirectUrl = `${window.location.origin}/auth/callback`
  const signUpOptions = {
    emailRedirectTo: redirectUrl,
    data: { full_name: fullName },
  }

  console.log('[auth] signUp request', {
    email,
    signUpOptions,
  })

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: signUpOptions,
    })
    console.log('[auth] signUp response', { data, error })

    if (error) {
      console.error('[auth] signUp error', error)
    }

    return { data, error }
  } catch (error) {
    const normalizedError = error instanceof Error ? error : new Error(JSON.stringify(error))
    console.error('[auth] signUp exception', normalizedError)
    return { data: null, error: normalizedError }
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentSession() {
  if (!isSupabaseConfigured) {
    return emptyResult
  }

  const { data, error } = await supabase.auth.getSession()
  return { data, error }
}

export async function getSessionFromUrl() {
  if (!isSupabaseConfigured) {
    return emptyResult
  }

  try {
    const { data, error } = await supabase.auth.getSessionFromUrl()
    return { data, error }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error(JSON.stringify(error)) }
  }
}

export async function sendResetPasswordEmail(email) {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase is not configured') }
  }

  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error(JSON.stringify(error)) }
  }
}

export async function getProfile(userId) {
  if (!userId || !isSupabaseConfigured) {
    return { data: null, error: null }
  }

  const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle()
  if (error?.code === 'PGRST116') {
    return { data: null, error: null }
  }

  return { data, error }
}

export function onAuthStateChange(callback) {
  if (!isSupabaseConfigured) {
    return { subscription: { unsubscribe: () => {} } }
  }

  return supabase.auth.onAuthStateChange((event, session) => callback(event, session))
}
