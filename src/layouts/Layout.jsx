import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AuthListener from '../components/AuthListener'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-950">
      <AuthListener />
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        className="mx-auto max-w-[1400px] px-4 pb-16 pt-24 md:px-8"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  )
}

export default Layout
