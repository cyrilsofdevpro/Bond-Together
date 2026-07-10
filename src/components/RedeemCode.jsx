import { useState } from 'react'
import useUserStore from '../store/userStore'

export default function RedeemCode({ onSuccess }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const redeemActivationCode = useUserStore((s) => s.redeemActivationCode)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    const trimmed = code.trim()
    if (!trimmed) {
      setMessage('Please enter your activation code.')
      return
    }

    setLoading(true)
    const { error, membership } = await redeemActivationCode(trimmed)
    setLoading(false)

    if (error) {
      // map error messages to friendly text
      const msg = (error?.message || '').toLowerCase()
      if (msg.includes('invalid_activation_code')) setMessage('Invalid activation code. Please check with support.')
      else if (msg.includes('activation_code_already_used')) setMessage('This activation code has already been used.')
      else if (msg.includes('not_authenticated')) setMessage('Please sign in before redeeming a code.')
      else setMessage(error?.message || 'Failed to redeem code. Try again later.')
      return
    }

    setMessage('Membership activated successfully.')
    setCode('')
    if (onSuccess) onSuccess(membership)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">Activation code</label>
      <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter activation code" className="w-full rounded-[1rem] border px-3 py-2" />
      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="rounded-full bg-black px-4 py-2 text-white hover:bg-slate-900">
          {loading ? 'Activating...' : 'Activate code'}
        </button>
        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      </div>
    </form>
  )
}
