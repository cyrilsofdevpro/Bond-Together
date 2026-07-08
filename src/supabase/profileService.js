import { supabase } from './client'

export async function loadUserProfile(userId) {
  if (!userId) return { data: null, error: null }
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return { data, error }
}
