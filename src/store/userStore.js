import { create } from 'zustand'
import { supabase } from '../supabase/client'
import { activateMembershipCode } from '../services/activation'

const MEMBERSHIP_STORAGE_KEY = 'bondtogether_membership'

const readStoredMembership = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const stored = window.localStorage.getItem(MEMBERSHIP_STORAGE_KEY)
    if (!stored) {
      return null
    }

    const parsed = JSON.parse(stored)

    if (!parsed?.isActive || !parsed?.expiresAt || parsed.expiresAt <= Date.now()) {
      window.localStorage.removeItem(MEMBERSHIP_STORAGE_KEY)
      return null
    }

    return parsed
  } catch {
    return null
  }
}

const persistMembership = (membership) => {
  if (typeof window === 'undefined') {
    return
  }

  if (membership) {
    window.localStorage.setItem(MEMBERSHIP_STORAGE_KEY, JSON.stringify(membership))
  } else {
    window.localStorage.removeItem(MEMBERSHIP_STORAGE_KEY)
  }
}

const useUserStore = create((set, get) => ({
  profile: null,
  session: null,
  isAuthenticated: false,
  authInitialized: false,
  membership: readStoredMembership(),
  setAuthInitialized: (v) => set({ authInitialized: v }),
  setSession: (session) => set({ session, isAuthenticated: Boolean(session?.user), profile: null }),
  setUserProfile: (profile) => set({ profile }),
  loginSuccess: (session, profile) => {
    set({ session, isAuthenticated: Boolean(session?.user), profile })
    // fetch server-side membership on login
    try {
      get().fetchMyMembership()
    } catch (e) {
      // ignore
    }
  },
  logout: () => {
    persistMembership(null)
    set({ session: null, isAuthenticated: false, profile: null, membership: null })
  },
  updateProfile: (updates) => set((state) => ({ profile: { ...(state.profile ?? {}), ...updates } })),
  // Redeem an activation code via Supabase RPC
  redeemActivationCode: async (code) => {
    if (!code) return { error: { message: 'empty_code' } }

    const normalizedCode = String(code).trim().toUpperCase()

    // verify server session explicitly (handles cases where client session wasn't persisted)
    let sess = null
    try {
      const sessionRes = await supabase.auth.getSession()
      sess = sessionRes?.data?.session || null
      if (!sess || !sess.user) {
        return { error: { message: 'not_authenticated' } }
      }
    } catch (e) {
      return { error: { message: 'auth_check_failed', details: e?.message || String(e) } }
    }

    try {
      const membershipRow = await activateMembershipCode(normalizedCode)

      if (!membershipRow) {
        return { error: { message: 'no_data' } } }

      const planTitles = {
        basic: 'Basic Membership',
        standard: 'Standard Membership',
        premium: 'Premium Membership',
      }

      const rawPlanKey = membershipRow.plan_key || membershipRow.planKey || 'basic'
      const planKey = String(rawPlanKey).toLowerCase()
      const membership = {
        planKey,
        planTitle: planTitles[planKey] || String(rawPlanKey),
        activationCode: normalizedCode,
        isActive: true,
        activatedAt: new Date(membershipRow.activated_at || membershipRow.activatedAt).getTime(),
        expiresAt: new Date(membershipRow.expires_at || membershipRow.expiresAt).getTime(),
      }

      persistMembership(membership)
      set({ membership })

      return { membership }
    } catch (err) {
      const message = err?.error || err?.message || String(err)
      return { error: { message } }
    }
  },

  // Fetch active membership for current user from server
  fetchMyMembership: async () => {
    try {
      const { data, error } = await supabase.rpc('get_my_active_membership')
      if (error) {
        return { error }
      }

      const row = Array.isArray(data) ? data[0] : data
      if (!row) {
        // clear any stored membership
        persistMembership(null)
        set({ membership: null })
        return { membership: null }
      }

      const planTitles = {
        basic: 'Basic Membership',
        standard: 'Standard Membership',
        premium: 'Premium Membership',
      }

      const rawPlanKey = row.plan_key || row.planKey || 'basic'
      const planKey = String(rawPlanKey).toLowerCase()
      const membership = {
        planKey,
        planTitle: planTitles[planKey] || String(rawPlanKey),
        activationCode: row.activation_code_id || row.activationCodeId || null,
        isActive: true,
        activatedAt: new Date(row.activated_at || row.activatedAt).getTime(),
        expiresAt: new Date(row.expires_at || row.expiresAt).getTime(),
      }

      persistMembership(membership)
      set({ membership })
      return { membership }
    } catch (err) {
      return { error: err }
    }
  },
}))

export default useUserStore
