function NotificationsPage() {
  return (
    <div className="space-y-8 rounded-[2rem] bg-white/95 p-8 shadow-soft sm:p-10">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Notifications</p>
        <h1 className="text-4xl font-semibold text-night">Your latest activity and alerts</h1>
        <p className="text-slate-600">Stay updated with messages, event reminders, and community replies.</p>
      </div>
      <div className="space-y-4">
        {[
          { title: 'New event reminder', description: 'Your virtual book salon starts in 2 hours.' },
          { title: 'Message from author', description: 'Mila Hart replied to your discussion post.' },
          { title: 'Community highlight', description: 'Your post received 12 likes and 3 replies.' },
        ].map((notification) => (
          <div key={notification.title} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-night">{notification.title}</h2>
            <p className="mt-2 text-slate-600">{notification.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationsPage
