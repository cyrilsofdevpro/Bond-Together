import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { HiOutlineMenu, HiOutlineX, HiOutlineChevronDown, HiOutlineUser, HiOutlineMail, HiOutlineCog, HiOutlineLogout } from 'react-icons/hi'
import { motion, AnimatePresence } from 'framer-motion'
import useUserStore from '../store/userStore'
import { signOut } from '../supabase/authService'
import logoImage from '../image/image.png'

const primaryNavItems = (isAuthenticated) => [
  { label: isAuthenticated ? 'Dashboard' : 'Home', to: isAuthenticated ? '/dashboard' : '/' },
  { label: 'Discover', to: '/discover' },
  { label: 'Books', to: '/books' },
  { label: 'Community', to: '/community' },
  { label: 'Events', to: '/events' },
]

const secondaryNavItems = [
  { label: 'About', to: '/about' },
  { label: 'Recommended', to: '/recommended' },
  { label: 'Authors', to: '/authors' },
  { label: 'Blog', to: '/blog' },
]

const accountItems = [
  { label: 'Messages', to: '/messages', icon: HiOutlineMail },
  { label: 'Profile', to: '/profile', icon: HiOutlineUser },
  { label: 'Settings', to: '/settings', icon: HiOutlineCog },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-soft' : 'bg-transparent'}`}>
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-3 text-lg font-semibold uppercase tracking-[0.22em] text-night">
          <img src={logoImage} alt="Bound Together logo" className="h-10 w-10 rounded-3xl object-cover shadow-soft" />
          Bound Together
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {primaryNavItems(isAuthenticated).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-night' : 'text-slate-600 hover:text-night'}`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMore((current) => !current)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-night"
            >
              More
              <HiOutlineChevronDown className="h-4 w-4" />
            </button>
            <AnimatePresence>
              {showMore && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 z-50 mt-3 w-56 rounded-[1.5rem] border border-slate-200 bg-white shadow-soft"
                >
                  <div className="flex flex-col p-2">
                    {secondaryNavItems.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setShowMore(false)}
                        className="rounded-[1.5rem] px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAccount((current) => !current)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-night"
              >
                Account
                <HiOutlineChevronDown className="h-4 w-4" />
              </button>
              <AnimatePresence>
                {showAccount && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 z-50 mt-3 w-56 rounded-[1.5rem] border border-slate-200 bg-white shadow-soft"
                  >
                    <div className="flex flex-col p-2">
                      {accountItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setShowAccount(false)}
                            className="flex items-center gap-3 rounded-[1.5rem] px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </NavLink>
                        )
                      })}
                      <button
                        type="button"
                        onClick={async () => {
                          await signOut()
                          window.location.href = '/'
                        }}
                        className="mt-2 flex items-center gap-3 rounded-[1.5rem] px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
                      >
                        <HiOutlineLogout className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-night">
                Login
              </Link>
              <Link to="/register" className="inline-flex rounded-full bg-night px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-slate-900">
                Join Now
              </Link>
            </>
          )}
        </div>

        <button
          className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white p-2 text-slate-700 shadow-sm md:hidden"
          onClick={() => setIsOpen((current) => !current)}
          aria-label="Toggle menu"
        >
          {isOpen ? <HiOutlineX size={22} /> : <HiOutlineMenu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden"
          >
            <div className="border-t border-slate-200 bg-white/95 px-4 py-5 shadow-soft backdrop-blur-xl">
              <nav className="flex flex-col gap-4">
                {primaryNavItems(isAuthenticated).map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-100 text-night' : 'text-slate-700 hover:bg-slate-50'}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                {secondaryNavItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-100 text-night' : 'text-slate-700 hover:bg-slate-50'}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                {isAuthenticated ? (
                  accountItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-100 text-night' : 'text-slate-700 hover:bg-slate-50'}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="rounded-2xl bg-night px-4 py-3 text-sm font-semibold text-white">
                      Join Now
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
