// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import useAuthStore from '@/store/authStore'

export function ProtectedRoute({ children, adminOnly = false }) {
  const user = useAuthStore(s => s.user)
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <p className="font-display font-black text-[120px] leading-none text-slate-100 select-none">404</p>
        <h1 className="font-display font-black text-2xl text-slate-800 -mt-6 mb-3">Page introuvable</h1>
        <p className="text-slate-500 text-sm mb-8 max-w-xs">La page que vous cherchez n'existe pas ou a été déplacée.</p>
        <Link to="/" className="btn-primary btn-lg">Retour à l'accueil</Link>
      </motion.div>
    </div>
  )
}
