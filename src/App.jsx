import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './layouts/Layout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import BooksPage from './pages/BooksPage'
import DiscoverPage from './pages/DiscoverPage'
import BookDetailsPage from './pages/BooksDetailsPage'
import AuthorPage from './pages/AuthorPage'
import AuthorDetailsPage from './pages/AuthorDetailsPage'
import CommunityPage from './pages/CommunityPage'
import EventsPage from './pages/EventsPage'
import PricingPage from './pages/PricingPage'
import MembershipPaymentPage from './pages/MembershipPaymentPage'
import BlogPage from './pages/BlogPage'
import FAQPage from './pages/FAQPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import NotificationsPage from './pages/NotificationsPage'
import MessagesPage from './pages/MessagesPage'
import RecommendedPage from './pages/RecommendedPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import RequireAdmin from './components/RequireAdmin'
import NotFoundPage from './pages/NotFoundPage'
import RequireAuth from './components/RequireAuth'
import RequireMembership from './components/RequireMembership'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/books/:id" element={<BookDetailsPage />} />
        <Route path="/authors" element={<AuthorPage />} />
        <Route path="/authors/:id" element={<AuthorDetailsPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/membership-payment" element={<MembershipPaymentPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/recommended" element={<RecommendedPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route element={<RequireMembership />}>
            <Route path="/messages" element={<MessagesPage />} />
          </Route>
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>
        </Route>
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
