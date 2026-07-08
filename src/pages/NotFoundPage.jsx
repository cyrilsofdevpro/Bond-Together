import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-24">
      <div className="max-w-xl rounded-[2rem] border border-slate-200 bg-white/95 p-10 text-center shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">404 error</p>
        <h1 className="mt-6 text-5xl font-semibold text-night">Page not found</h1>
        <p className="mt-4 text-slate-600">The page you’re looking for doesn’t exist yet. Let’s get you back to the reading community.</p>
        <Link to="/" className="mt-8 inline-flex rounded-full bg-night px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-900">
          Return home
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
