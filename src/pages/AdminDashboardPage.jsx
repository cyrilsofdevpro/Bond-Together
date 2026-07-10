import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabase/client'
import useActivationCodesStore from '../store/activationCodesStore'
import useBooksStore from '../store/booksStore'
import useUserStore from '../store/userStore'

function AdminDashboardPage() {
  const profile = useUserStore((state) => state.profile)
  const isAdmin = profile?.role === 'admin' || profile?.isAdmin === true
  const addBook = useBooksStore((state) => state.addBook)
  const pendingBooks = useBooksStore((state) => state.pendingBooks)
  const codes = useActivationCodesStore((state) => state.codes)
  const generateCodes = useActivationCodesStore((state) => state.generateCodes)
  const clearCodes = useActivationCodesStore((state) => state.clearCodes)
  const fetchCodes = useActivationCodesStore((state) => state.fetchCodes)
  const markCodeUsed = useActivationCodesStore((state) => state.markCodeUsed)
  const [approvalMessage, setApprovalMessage] = useState('')
  const [form, setForm] = useState({
    title: '',
    author: '',
    link: '',
    category: 'Fiction',
    description: '',
    managers: '',
    coverImage: '',
  })
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [codePlan, setCodePlan] = useState('basic')
  const [codeCount, setCodeCount] = useState(5)
  const [activationMessage, setActivationMessage] = useState('')

  const [adminData, setAdminData] = useState({ users: [] })
  const [summary, setSummary] = useState({ totalUsers: 0, activeMemberships: 0, premiumMembers: 0, adminUsers: 0 })
  const [loadingAdminData, setLoadingAdminData] = useState(false)
  const [adminError, setAdminError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [membershipFilter, setMembershipFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)

  const summaryCards = [
    { title: 'Total users', value: summary.totalUsers, caption: 'Registered accounts' },
    { title: 'Active memberships', value: summary.activeMemberships, caption: 'Current active plans' },
    { title: 'Premium members', value: summary.premiumMembers, caption: 'Premium subscriptions' },
    { title: 'Admin users', value: summary.adminUsers, caption: 'Platform admins' },
  ]

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    return adminData.users.filter((user) => {
      const matchesSearch =
        !query ||
        [user.email, user.full_name, user.username, user.role, user.plan_key]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query))

      const matchesMembership =
        membershipFilter === 'all' ||
        (membershipFilter === 'none' && !user.plan_key) ||
        user.plan_key === membershipFilter

      return matchesSearch && matchesMembership
    })
  }, [adminData.users, membershipFilter, searchTerm])

  const managementSections = [
    { title: 'User management', description: 'Approve accounts, review activity, and update member status.' },
    { title: 'Book management', description: 'Add, edit, or remove titles across the platform.' },
    { title: 'Author management', description: 'Approve author profiles and manage author content.' },
    { title: 'Review moderation', description: 'Monitor feedback and remove harmful reviews.' },
    { title: 'Community moderation', description: 'Review groups, enforce rules, and approve community requests.' },
    { title: 'Event management', description: 'Create and manage author events, sessions, and schedules.' },
    { title: 'Analytics', description: 'Track engagement, growth, and reading behavior.' },
    { title: 'Reports', description: 'Generate moderation and performance reports.' },
    { title: 'Announcements', description: 'Publish platform updates and community news.' },
    { title: 'Roles and permissions', description: 'Define access levels and admin user roles.' },
    { title: 'Platform settings', description: 'Configure global settings, branding, and membership options.' },
  ]

  const handleSubmit = (event) => {
    event.preventDefault()
    setSuccessMessage('')
    setErrorMessage('')

    if (!isAdmin) {
      setErrorMessage('Only admins can add books to the platform.')
      return
    }

    if (!form.title || !form.author || !form.link) {
      setErrorMessage('Please fill in the title, author, and book link.')
      return
    }

    addBook({
      title: form.title,
      author: form.author,
      link: form.link,
      category: form.category,
      description: form.description,
      managers: form.managers.split(',').map((item) => item.trim()).filter(Boolean),
      coverImage: form.coverImage || null,
      addedBy: 'admin',
    })

    setSuccessMessage(`“${form.title}” was added to the public catalog.`)
    setForm({ title: '', author: '', link: '', category: 'Fiction', description: '', managers: '', coverImage: '' })
  }

  const canManageBooks = useMemo(() => isAdmin, [isAdmin])

  const approvePendingBook = (book) => {
    addBook({
      ...book,
      addedBy: book.addedBy === 'premium-user' ? 'premium-user' : 'admin',
    })
    setApprovalMessage(`“${book.title}” was approved and added to the public catalog.`)
  }

  const handleGenerateCodes = async (event) => {
    event.preventDefault()
    setActivationMessage('')
    setErrorMessage('')
    const count = Number(codeCount) || 1
    const result = await generateCodes(codePlan, count)

    if (result?.error) {
      setActivationMessage('')
      setErrorMessage(`Failed to generate activation codes: ${result.error.message || result.error}`)
      return
    }

    setActivationMessage(`${count} activation code${count > 1 ? 's' : ''} generated for ${codePlan} membership.`)
  }

  useEffect(() => {
    if (isAdmin) {
      void fetchCodes(50)
    }
  }, [fetchCodes, isAdmin])

  useEffect(() => {
    if (!isAdmin) return
    const load = async () => {
      setLoadingAdminData(true)
      setAdminError('')
      try {
        const { data, error } = await supabase.rpc('admin_get_users_with_memberships')
        if (error) {
          setAdminError(error.message || 'Failed to load admin user data')
          return
        }

        const users = Array.isArray(data) ? data : data ? [data] : []
        setAdminData({ users })
        setSummary({
          totalUsers: users.length,
          activeMemberships: users.filter((user) => user.plan_key).length,
          premiumMembers: users.filter((user) => user.plan_key === 'premium').length,
          adminUsers: users.filter((user) => user.is_admin).length,
        })
      } catch (err) {
        setAdminError(String(err))
      } finally {
        setLoadingAdminData(false)
      }
    }

    void load()
  }, [isAdmin])

  return (
    <div className="space-y-10 px-4 py-10 sm:px-8 lg:px-12">
      <section className="rounded-[2rem] bg-white/95 p-8 shadow-soft sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Admin dashboard</p>
            <h1 className="mt-3 text-4xl font-semibold text-night">Platform moderation and management</h1>
            <p className="mt-4 max-w-2xl text-slate-600">Manage users, books, authors, reviews, communities, events, and settings from one secure console.</p>
          </div>
          <button className="inline-flex items-center rounded-full bg-night px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">
            Open admin tools
          </button>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.title} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{card.title}</p>
            <p className="mt-4 text-4xl font-semibold text-night">{card.value}</p>
            <p className="mt-2 text-sm text-slate-600">{card.caption}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {managementSections.map((section) => (
          <div key={section.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-night">{section.title}</h2>
                <p className="mt-3 text-slate-600">{section.description}</p>
              </div>
              <span className="inline-flex rounded-full bg-amber-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Manage</span>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft sm:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Book management</p>
            <h2 className="mt-3 text-3xl font-semibold text-night">Add a new book to the catalog</h2>
            <p className="mt-3 max-w-2xl text-slate-600">Only admins can publish books directly to the platform. Premium members can submit book suggestions for review.</p>
          </div>
          <div className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">Admin publishing only</div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Book title</span>
            <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-purple-500" placeholder="The Art of Quiet Reading" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Author</span>
            <input value={form.author} onChange={(event) => setForm((current) => ({ ...current, author: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-purple-500" placeholder="Ava Martin" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Book link</span>
            <input value={form.link} onChange={(event) => setForm((current) => ({ ...current, link: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-purple-500" placeholder="https://example.com/book" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Category</span>
            <select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-purple-500">
              <option>Fiction</option>
              <option>Non-fiction</option>
              <option>Memoir</option>
              <option>Poetry</option>
            </select>
          </label>
          <label className="block lg:col-span-2">
            <span className="text-sm font-medium text-slate-700">Description</span>
            <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-purple-500" placeholder="Short summary of the book" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Managers</span>
            <input value={form.managers} onChange={(event) => setForm((current) => ({ ...current, managers: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-purple-500" placeholder="manager1@example.com, manager2@example.com" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Cover image URL</span>
            <input value={form.coverImage} onChange={(event) => setForm((current) => ({ ...current, coverImage: event.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-purple-500" placeholder="https://images.example.com/cover.jpg" />
          </label>
          <div className="lg:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
              {successMessage && <p className="text-sm text-emerald-600">{successMessage}</p>}
            </div>
            <button type="submit" disabled={!canManageBooks} className="inline-flex items-center justify-center rounded-full bg-night px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60">
              Add book to catalog
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft sm:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Activation codes</p>
            <h2 className="mt-3 text-3xl font-semibold text-night">Generate random membership activation codes</h2>
            <p className="mt-3 max-w-2xl text-slate-600">Create random alphanumeric codes for Basic, Standard, or Premium memberships. These codes can be shared with customers after support confirms payment.</p>
          </div>
          <div className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">Admin only</div>
        </div>

        <form onSubmit={handleGenerateCodes} className="mt-8 grid gap-5 lg:grid-cols-[1fr_1fr_auto]">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Membership plan</span>
            <select value={codePlan} onChange={(event) => setCodePlan(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-purple-500">
              <option value="basic">Basic</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">How many codes?</span>
            <input type="number" min="1" max="50" value={codeCount} onChange={(event) => setCodeCount(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-purple-500" />
          </label>
          <div className="flex items-end gap-3">
            <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-night px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">
              Generate codes
            </button>
          </div>
        </form>

        {activationMessage && <p className="mt-4 text-sm text-emerald-600">{activationMessage}</p>}

        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={clearCodes} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
            Clear generated codes
          </button>
        </div>

        <div className="mt-8 space-y-3">
          {codes.length > 0 ? codes.slice(0, 20).map((codeItem) => (
            <div key={codeItem.id} className="flex flex-col gap-2 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-night">{codeItem.code}</p>
                <p className="text-sm text-slate-500">Plan: {codeItem.plan} · Created: {new Date(codeItem.createdAt).toLocaleString()}</p>
                <p className="text-sm text-slate-500">Used: {codeItem.used ? 'Yes' : 'No'}{codeItem.used_at ? ` · ${new Date(codeItem.used_at).toLocaleString()}` : ''}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-purple-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700">{codeItem.plan}</span>
                {!codeItem.used ? (
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await markCodeUsed(codeItem.code)
                      if (res?.error) {
                        setActivationMessage(`Failed to mark used: ${res.error.message || res.error}`)
                      } else {
                        setActivationMessage(`Marked ${codeItem.code} as used.`)
                      }
                    }}
                    className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Mark used
                  </button>
                ) : null}
              </div>
            </div>
          )) : (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">No activation codes generated yet.</div>
          )}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft sm:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-purple-600">Premium uploads</p>
            <h2 className="mt-3 text-3xl font-semibold text-night">Review premium book requests</h2>
            <p className="mt-3 max-w-2xl text-slate-600">Premium members can submit books for review. Approve them here to publish them to the community.</p>
          </div>
          <div className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">Pending review</div>
        </div>

        {approvalMessage && <p className="mt-6 text-sm text-emerald-600">{approvalMessage}</p>}

        <div className="mt-8 space-y-4">
          {pendingBooks.length > 0 ? pendingBooks.map((book) => (
            <div key={book.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-lg font-semibold text-night">{book.title}</p>
                  <p className="mt-2 text-sm text-slate-600">By {book.author} · {book.category}</p>
                  <p className="mt-2 text-sm text-slate-500">{book.description || 'No description provided.'}</p>
                  <a href={book.link} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-semibold text-purple-600">Open link</a>
                </div>
                <button type="button" onClick={() => approvePendingBook(book)} className="inline-flex items-center justify-center rounded-full bg-night px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">
                  Approve and publish
                </button>
              </div>
            </div>
          )) : (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">No premium upload requests yet.</div>
          )}
        </div>
      </section>

      <section className="rounded-[2rem] bg-slate-950/5 p-8 shadow-soft sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-purple-600">Admin insights</p>
            <h2 className="mt-3 text-3xl font-semibold text-night">Keep the platform safe, clean, and growing.</h2>
            <p className="mt-4 max-w-2xl text-slate-600">Use this dashboard to act on reports, manage roles, and communicate important platform updates.</p>
          </div>
          <button className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
            View detailed reports
          </button>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft sm:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Users</p>
            <h2 className="mt-3 text-2xl font-semibold text-night">All registered users & memberships</h2>
            <p className="mt-2 text-sm text-slate-600">Search users, filter by membership, and inspect individual account details.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by email, name, username, role, or plan"
              className="min-w-[240px] rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-500"
            />
            <select
              value={membershipFilter}
              onChange={(event) => setMembershipFilter(event.target.value)}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-500"
            >
              <option value="all">All memberships</option>
              <option value="premium">Premium</option>
              <option value="standard">Standard</option>
              <option value="basic">Basic</option>
              <option value="none">No active plan</option>
            </select>
          </div>
        </div>

        {loadingAdminData ? (
          <p className="mt-6 text-sm text-slate-600">Loading admin data…</p>
        ) : adminError ? (
          <p className="mt-6 text-sm text-red-600">{adminError}</p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Full name</th>
                  <th className="px-3 py-2">Username</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Is Admin</th>
                  <th className="px-3 py-2">Plan</th>
                  <th className="px-3 py-2">Expires</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr
                    key={u.user_id || u.id}
                    className={`border-t border-slate-100 hover:bg-slate-50 ${selectedUser?.user_id === u.user_id ? 'bg-slate-100' : ''}`}
                    onClick={() => setSelectedUser(u)}
                  >
                    <td className="cursor-pointer px-3 py-3">{u.email || '-'}</td>
                    <td className="cursor-pointer px-3 py-3">{u.full_name || '-'}</td>
                    <td className="cursor-pointer px-3 py-3">{u.username || '-'}</td>
                    <td className="cursor-pointer px-3 py-3">{u.role || '-'}</td>
                    <td className="cursor-pointer px-3 py-3">{u.is_admin ? 'Yes' : 'No'}</td>
                    <td className="cursor-pointer px-3 py-3">{u.plan_key || '-'}</td>
                    <td className="cursor-pointer px-3 py-3">{u.expires_at ? new Date(u.expires_at).toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedUser ? (
          <div className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-purple-600">User detail</p>
                <h3 className="mt-3 text-2xl font-semibold text-night">{selectedUser.full_name || selectedUser.email}</h3>
                <p className="mt-2 text-sm text-slate-600">Detailed account information for the selected user.</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Clear selection
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Email</p>
                <p className="mt-2 text-base font-semibold text-night">{selectedUser.email || '-'}</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Username</p>
                <p className="mt-2 text-base font-semibold text-night">{selectedUser.username || '-'}</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Role</p>
                <p className="mt-2 text-base font-semibold text-night">{selectedUser.role || 'user'}</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Admin access</p>
                <p className="mt-2 text-base font-semibold text-night">{selectedUser.is_admin ? 'Yes' : 'No'}</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Membership plan</p>
                <p className="mt-2 text-base font-semibold text-night">{selectedUser.plan_key || 'None'}</p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Expires</p>
                <p className="mt-2 text-base font-semibold text-night">{selectedUser.expires_at ? new Date(selectedUser.expires_at).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  )
}

export default AdminDashboardPage
