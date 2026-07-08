import { useMemo, useState } from 'react'
import useBooksStore from '../store/booksStore'
import useUserStore from '../store/userStore'
import { supabase } from '../supabase/client'

function BooksPage() {
  const books = useBooksStore((state) => state.books)
  const addPendingBook = useBooksStore((state) => state.addPendingBook)
  const profile = useUserStore((state) => state.profile)
  const membership = useUserStore((state) => state.membership)
  const hasActiveMembership = Boolean(membership?.isActive && membership?.expiresAt && membership.expiresAt > Date.now())
  const isPremium = useMemo(() => hasActiveMembership || profile?.plan === 'premium' || profile?.isPremium === true || profile?.subscriptionStatus === 'active', [hasActiveMembership, profile?.plan, profile?.isPremium, profile?.subscriptionStatus])
  const isStandard = useMemo(() => hasActiveMembership || profile?.plan === 'standard' || profile?.isStandard === true || profile?.subscriptionStatus === 'active', [hasActiveMembership, profile?.plan, profile?.isStandard, profile?.subscriptionStatus])
  const uploadLimit = useMemo(() => {
    if (profile?.plan === 'premium' || profile?.isPremium === true || hasActiveMembership && membership?.planKey === 'premium') return Infinity
    if (profile?.plan === 'standard' || profile?.isStandard === true || hasActiveMembership && membership?.planKey === 'standard') return 100
    return 25
  }, [hasActiveMembership, membership?.planKey, profile?.isPremium, profile?.isStandard, profile?.plan])
  const uploadedCount = useMemo(() => books.filter((book) => book.addedBy === 'premium-user').length, [books])
  const remainingUploads = useMemo(() => (Number.isFinite(uploadLimit) ? uploadLimit - uploadedCount : 'Unlimited'), [uploadLimit, uploadedCount])
  const [form, setForm] = useState({ title: '', author: '', link: '', category: 'Fiction', description: '' })
  const [backCoverFile, setBackCoverFile] = useState(null)
  const [message, setMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    if (!profile?.id) {
      setMessage('Please sign in before requesting a book upload.')
      return
    }

    if (!isPremium && !isStandard) {
      setMessage('Only Standard and Premium members can submit books for review.')
      return
    }

    if (Number.isFinite(uploadLimit) && uploadedCount >= uploadLimit) {
      setMessage(`Your plan allows ${uploadLimit} uploads. You have reached your limit.`)
      return
    }

    if (!form.title || !form.author || !form.link || !form.description) {
      setMessage('Please fill in the title, author, Amazon link, and book description.')
      return
    }

    setIsUploading(true)
    setMessage('Uploading your back cover image...')

    try {
      let coverImageUrl = null

      if (backCoverFile) {
        const fileName = `${Date.now()}-${backCoverFile.name.replace(/\s+/g, '-')}`
        const { data, error } = await supabase.storage.from('book-covers').upload(fileName, backCoverFile, {
          cacheControl: '3600',
          upsert: false,
        })

        if (error) {
          throw error
        }

        const { data: publicData } = supabase.storage.from('book-covers').getPublicUrl(data.path)
        coverImageUrl = publicData.publicUrl
      }

      addPendingBook({
        title: form.title,
        author: form.author,
        link: form.link,
        category: form.category,
        description: form.description,
        managers: [],
        coverImage: coverImageUrl,
        addedBy: 'premium-user',
      })

      setMessage(`“${form.title}” was sent to admins for review.`)
      setForm({ title: '', author: '', link: '', category: 'Fiction', description: '' })
      setBackCoverFile(null)
    } catch (error) {
      console.error(error)
      setMessage('We could not upload the back cover image. Please check your Supabase storage policy for the book-covers bucket and try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="rounded-[2rem] bg-white/90 p-8 shadow-soft sm:p-10">
      <div className="max-w-4xl space-y-5">
        <p className="text-sm uppercase tracking-[0.24em] text-amber-600">Books</p>
        <h1 className="text-4xl font-semibold text-night">Explore the latest collections and premium reading lists.</h1>
        <p className="text-slate-600">Browse featured books, trending genres, and author-curated collections designed for modern communities.</p>
      </div>
      <div className="mt-10 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-purple-600">Premium upload</p>
            <h2 className="mt-2 text-2xl font-semibold text-night">Submit a book for review</h2>
            <p className="mt-2 text-sm text-slate-600">Premium members can request uploads. Admins review and publish them to the catalog.</p>
          </div>
          <div className={`rounded-full px-4 py-2 text-sm font-semibold ${isPremium || isStandard ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'}`}>
            {isPremium || isStandard ? `Upload limit: ${remainingUploads === 'Unlimited' ? 'Unlimited' : `${remainingUploads} left`}` : 'Standard or Premium required'}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Title</span>
            <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-purple-500" placeholder="Book title" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Author</span>
            <input value={form.author} onChange={(event) => setForm((current) => ({ ...current, author: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-purple-500" placeholder="Author name" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Amazon book link</span>
            <input value={form.link} onChange={(event) => setForm((current) => ({ ...current, link: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-purple-500" placeholder="https://www.amazon.com/..." />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Category</span>
            <select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-purple-500">
              <option>Fiction</option>
              <option>Non-fiction</option>
              <option>Memoir</option>
              <option>Poetry</option>
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Description</span>
            <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-purple-500" placeholder="Tell admins why this book should be featured" />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Back cover image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setBackCoverFile(event.target.files?.[0] ?? null)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-purple-500"
            />
            <p className="mt-2 text-sm text-slate-500">Upload the book back cover image. Supported: JPG, PNG, WEBP, GIF.</p>
          </label>
          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {message && <p className={`text-sm ${isUploading ? 'text-amber-600' : 'text-emerald-600'}`}>{message}</p>}
            </div>
            <button type="submit" disabled={isUploading} className="inline-flex items-center justify-center rounded-full bg-night px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70">
              {isUploading ? 'Uploading...' : 'Send for review'}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {books.length > 0 ? books.map((book) => (
          <div key={book.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
            <div className="h-48 overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-purple-600 to-amber-400">
              {book.coverImage ? (
                <img src={book.coverImage} alt={`${book.title} cover`} className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between gap-3 text-slate-500">
                <span className="rounded-full bg-white px-3 py-1 text-xs uppercase tracking-[0.24em]">{book.category}</span>
                <span className="text-sm font-semibold text-night">4.9</span>
              </div>
              <h2 className="text-xl font-semibold text-night">{book.title}</h2>
              <p className="text-sm text-slate-600">{book.description || `By ${book.author}`}</p>
              <div className="flex flex-wrap items-center gap-3">
                <a href={book.link} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full bg-night px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900">
                  View book
                </a>
                <span className="text-sm text-slate-500">By {book.author}</span>
              </div>
            </div>
          </div>
        )) : (
          <div className="md:col-span-2 xl:col-span-3 rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
            No books are available yet. Admins can publish books for the community.
          </div>
        )}
      </div>
    </div>
  )
}

export default BooksPage
