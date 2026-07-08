function SettingsPage() {
  return (
    <div className="space-y-8 rounded-[2rem] bg-white/95 p-8 shadow-soft sm:p-10">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Settings</p>
        <h1 className="mt-3 text-4xl font-semibold text-night">Account settings</h1>
        <p className="mt-4 text-slate-600">Update your profile, manage notifications, and configure your account preferences.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {[
          { title: 'Profile details', description: 'Edit your name, bio, and reading preferences.' },
          { title: 'Notification preferences', description: 'Manage emails, messages, and community alerts.' },
          { title: 'Security', description: 'Update your password and secure your account.' },
          { title: 'Connected accounts', description: 'Link social profiles and login methods.' },
        ].map((item) => (
          <div key={item.title} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-night">{item.title}</h2>
            <p className="mt-3 text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-night">Account activity</h2>
        <p className="mt-3 text-slate-600">Review your recent logins, connected devices, and manage active sessions.</p>
        <button className="mt-6 inline-flex items-center rounded-full bg-night px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">Manage account</button>
      </div>
    </div>
  )
}

export default SettingsPage
