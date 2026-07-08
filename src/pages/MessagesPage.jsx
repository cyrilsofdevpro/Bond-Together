import { useEffect, useMemo, useState } from 'react'
import { HiOutlineSearch, HiOutlinePaperAirplane } from 'react-icons/hi'
import { fetchMessages, sendMessage } from '../supabase/chatService'
import useUserStore from '../store/userStore'

const conversations = [
  { id: 'general', title: 'General Book Lounge', subtitle: 'Daily discussions and community chatter' },
  { id: 'author', title: 'Author Q&A', subtitle: 'Ask questions directly to featured writers' },
  { id: 'recommendations', title: 'Book Recommendations', subtitle: 'Share and discover new reads' },
  { id: 'events', title: 'Event Planning', subtitle: 'Coordinate upcoming club sessions and meetups' },
]

function MessagesPage() {
  const [activeRoom, setActiveRoom] = useState('general')
  const [messageText, setMessageText] = useState('')
  const [messages, setMessages] = useState({})
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const profile = useUserStore((state) => state.profile)

  useEffect(() => {
    async function loadMessages() {
      setError('')
      const { data, error } = await fetchMessages(activeRoom)
      if (error) {
        setError(error.message)
        return
      }
      setMessages((current) => ({ ...current, [activeRoom]: data }))
    }

    loadMessages()
  }, [activeRoom])

  const activeConversation = messages[activeRoom] ?? []

  const visibleConversations = useMemo(() => {
    return conversations.filter((conversation) =>
      conversation.title.toLowerCase().includes(search.toLowerCase()) ||
      conversation.subtitle.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  const handleSendMessage = async () => {
    if (!messageText.trim()) return
    if (!profile?.id) {
      setError('Please sign in to send messages.')
      return
    }

    setError('')
    const { data, error } = await sendMessage(activeRoom, profile.id, messageText.trim())
    if (error) {
      setError(error.message)
      return
    }

    setMessages((current) => ({
      ...current,
      [activeRoom]: [...(current[activeRoom] ?? []), data[0]],
    }))
    setMessageText('')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-6 rounded-[2rem] bg-white/95 p-6 shadow-soft sm:p-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Messages</p>
          <h1 className="mt-3 text-3xl font-semibold text-night">Community chat</h1>
          <p className="mt-3 text-slate-600">A shared space for every member to talk books, events, and recommendations.</p>
        </div>

        <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-3 text-slate-500">
            <HiOutlineSearch className="h-5 w-5" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search chats"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          {visibleConversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => setActiveRoom(conversation.id)}
              className={`w-full rounded-[1.75rem] border px-4 py-4 text-left transition ${
                activeRoom === conversation.id ? 'border-night bg-night/10' : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <p className="text-base font-semibold text-night">{conversation.title}</p>
              <p className="mt-2 text-sm text-slate-500">{conversation.subtitle}</p>
            </button>
          ))}
          {visibleConversations.length === 0 && (
            <p className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">No chats found.</p>
          )}
        </div>
      </aside>

      <section className="rounded-[2rem] bg-white/95 p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-purple-600">Live chat</p>
            <h2 className="mt-2 text-3xl font-semibold text-night">{conversations.find((room) => room.id === activeRoom)?.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{conversations.find((room) => room.id === activeRoom)?.subtitle}</p>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Online now: 42</div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 h-[640px] overflow-y-auto rounded-[2rem] bg-slate-50 p-6 shadow-inner">
          <div className="space-y-5">
            {activeConversation.map((message) => {
              const isMine = message.profile_id === profile?.id
              const senderName = isMine
                ? profile?.full_name || profile?.username || 'You'
                : message.profiles?.full_name || 'Member'

              return (
                <div
                  key={message.id}
                  className={`rounded-[1.75rem] px-5 py-4 ${isMine ? 'bg-night text-white self-end' : 'bg-white text-slate-800'}`}
                >
                  <div className="flex items-center justify-between gap-4 text-sm tracking-[0.02em] text-slate-500">
                    <span>{senderName}</span>
                    <span>{message.sent_at ? new Date(message.sent_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'Now'}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6">{message.content ?? message.text}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              placeholder="Write a message to the group"
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-night focus:ring-2 focus:ring-night/10"
            />
            <button
              type="button"
              onClick={handleSendMessage}
              className="inline-flex items-center justify-center rounded-full bg-night px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-900"
            >
              <HiOutlinePaperAirplane className="mr-2 h-5 w-5" />
              Send
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MessagesPage
