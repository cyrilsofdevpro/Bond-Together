import { supabase, isSupabaseConfigured } from './client'

const emptyResult = { data: null, error: null }

export async function signInWithEmail(email, password) {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase is not configured') }
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signUpWithEmail(fullName, email, password) {
  const { data, error } = await supabase.auth.signUp(
    { email, password },
    { data: { full_name: fullName } }
  )

  return { data, error }
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
