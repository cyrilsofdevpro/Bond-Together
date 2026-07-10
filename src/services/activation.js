import { supabase, isSupabaseConfigured } from '../supabase/client'

export async function activateMembershipCode(code) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured')
  }

  const trimmedCode = String(code || '').trim().toUpperCase()
  const { data, error } = await supabase.rpc('redeem_activation_code', { p_code: trimmedCode })

  if (error) {
    throw error
  }

  if (Array.isArray(data)) {
    return data[0] || null
  }

  return data
}
