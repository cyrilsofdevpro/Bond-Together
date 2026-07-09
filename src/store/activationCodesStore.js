import { create } from 'zustand'
import { supabase } from '../supabase/client'

const STORAGE_KEY = 'bondtogether_activation_codes'

const getStoredCodes = () => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const data = window.localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

const saveStoredCodes = (codes) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(codes))
  }
}

const useActivationCodesStore = create((set, get) => ({
  codes: getStoredCodes(),

  // Fetch recent activation codes via a server-side RPC (admin-only function)
  fetchCodes: async (limit = 50) => {
    try {
      const { data, error } = await supabase.rpc('admin_list_activation_codes', { p_limit: limit })
      if (error) {
        // fallback to stored codes
        return { error }
      }

      // data is expected to be an array of rows with id, code, plan_key, created_at
      const mapped = (Array.isArray(data) ? data : []).map((r) => ({
        id: r.id || r.code,
        plan: r.plan_key || r.plan,
        code: r.code,
        createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
        used: Boolean(r.used),
        used_at: r.used_at || null,
      }))

      saveStoredCodes(mapped)
      set({ codes: mapped })
      return { codes: mapped }
    } catch (err) {
      return { error: err }
    }
  },

  // Generate activation codes via server-side RPC
  generateCodes: async (plan, count = 1, duration = '30 days') => {
    try {
      const { data, error } = await supabase.rpc('generate_activation_codes', { p_plan: plan, p_count: count, p_duration: duration })
      if (error) {
        return { error }
      }

      const rows = Array.isArray(data) ? data : data ? [data] : []

      // RPC returns rows with `code` field
      const codes = rows.map((r) => ({
        id: r.code,
        plan,
        code: r.code,
        createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
      }))

      set((state) => {
        const next = [...codes, ...state.codes]
        saveStoredCodes(next)
        return { codes: next }
      })

      return { codes }
    } catch (err) {
      return { error: err }
    }
  },

  // Mark a code as used (admin RPC)
  markCodeUsed: async (code) => {
    try {
      const { data, error } = await supabase.rpc('admin_mark_code_used', { p_code: code })
      if (error) return { error }

      // refresh cached codes
      await get().fetchCodes(50)
      return { data }
    } catch (err) {
      return { error: err }
    }
  },

  clearCodes: () => {
    saveStoredCodes([])
    set({ codes: [] })
  },
}))

export default useActivationCodesStore
