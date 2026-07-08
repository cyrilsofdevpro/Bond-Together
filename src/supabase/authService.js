import { supabase } from './client'

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signUpWithEmail(fullName, email, password) {
  const { data, error } = await supabase.auth.signUp(
    { email, password },
    { data: { full_name: fullName } }
  )

  if (error) {
    return { error }
  }

  const { data: userData } = await supabase.auth.getUser()
  const userId = userData?.user?.id ?? data.user?.id ?? data.session?.user?.id

  if (!userId) {
    return { data, error: null }
  }

  const usernameBase = (email || '')
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .slice(0, 20)

  const username = `${usernameBase || 'user'}_${userId.slice(0, 8)}`
  const profile = {
    user_id: userId,
    full_name: fullName,
    username,
    bio: '',
  }

  const { data: existingProfile, error: existingError } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (existingError && existingError.code !== 'PGRST116') {
    return { error: existingError }
  }

  if (existingProfile) {
    return { data, error: null }
  }

  const { error: profileError } = await supabase.from('profiles').insert(profile)
  if (profileError) {
    const message = profileError.message?.toLowerCase() ?? ''
    if (
      profileError.code === '23505' ||
      message.includes('duplicate') ||
      message.includes('conflict') ||
      message.includes('already exists')
    ) {
      return { data, error: null }
    }

    if (profileError.code === '23503') {
      const schemaHint = new Error(
        'Your Supabase profiles table is misconfigured. Run the SQL in src/supabase/fix-profiles.sql in the Supabase SQL editor, then try again.'
      )
      return { data, error: schemaHint }
    }

    return { error: profileError }
  }

  return { data, error: null }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession()
  return { data, error }
}

export async function getProfile(userId) {
  if (!userId) {
    return { data: null, error: null }
  }

  const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle()
  if (error?.code === 'PGRST116') {
    return { data: null, error: null }
  }

  return { data, error }
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((event, session) => callback(event, session))
}
