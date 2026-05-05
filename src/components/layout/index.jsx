// src/components/layout/index.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText, PlusCircle, CreditCard, Settings, LogOut,
  LayoutDashboard, Users, Menu, X, Zap,
} from 'lucide-react'
import { useState } from 'react'
import useAuthStore from '@/store/authStore'
import { cn, getInitials } from '@/lib/utils'

// ── Nav items ─────────────────────────────────────────────
const USER_NAV = [
  { icon: FileText,        label: 'Mes CV',          path: '/dashboard'  },
  { icon: PlusCircle,      label: 'Créer un CV',     path: '/templates'  },
  { icon: CreditCard,      label: 'Paiements',       path: '/payments'   },
  { icon: Settings,        label: 'Paramètres',      path: '/settings'   },
]

const ADMIN_NAV = [
  { icon: LayoutDashboard, label: 'Tableau de bord', path: '/admin'              },
  { icon: Users,           label: 'Utilisateurs',    path: '/admin/users'        },
  { icon: FileText,        label: 'CV',              path: '/admin/cvs'          },
  { icon: CreditCard,      label: 'Paiements',       path: '/admin/payments'     },
  { icon: Settings,        label: 'Paramètres',      path: '/admin/settings'     },
]

function isActive(pathname, path) {
  if (path === '/admin') return pathname === '/admin'
  return pathname === path || (path !== '/dashboard' && pathname.startsWith(path))
}

// ── Public Nav ────────────────────────────────────────────
export function PublicNav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="flex items-center justify-between h-16 px-6 max-w-7xl mx-auto">
        <Link to="/" className="font-display font-black text-xl text-brand-600">G‑Tech CV</Link>
        <nav className="hidden md:flex items-center gap-8">
          {[['Modèles', '/templates'], ['Tarifs', '/#pricing'], ['Aide', '/help']].map(([l, h]) => (
            <Link key={l} to={h} className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">{l}</Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login"    className="text-sm font-medium text-slate-600 hover:text-brand-600 px-4 py-2">Se connecter</Link>
          <Link to="/register" className="btn-primary btn-md">Commencer gratuitement</Link>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-slate-600" aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <AnimPresence open={open}>
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-4">
          {[['Modèles', '/templates'], ['Tarifs', '/#pricing'], ['Aide', '/help']].map(([l, h]) => (
            <Link key={l} to={h} className="text-sm font-medium text-slate-700" onClick={() => setOpen(false)}>{l}</Link>
          ))}
          <hr className="border-slate-100" />
          <Link to="/login"    className="text-sm font-medium text-slate-700" onClick={() => setOpen(false)}>Se connecter</Link>
          <Link to="/register" className="btn-primary btn-md text-center" onClick={() => setOpen(false)}>Commencer gratuitement</Link>
        </div>
      </AnimPresence>
    </header>
  )
}

function AnimPresence({ open, children }) {
  return (
    <motion.div
      initial={false}
      animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      {children}
    </motion.div>
  )
}

// ── Sidebar ───────────────────────────────────────────────
export function Sidebar({ admin = false }) {
  const { user, logout } = useAuthStore()
  const { pathname }     = useLocation()
  const navigate         = useNavigate()
  const items = admin ? ADMIN_NAV : USER_NAV

  return (
    <aside className="hidden lg:flex flex-col gap-1 p-4 fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-100 z-40">
      {/* Brand */}
      <div className="px-4 py-5 mb-2">
        <Link to="/" className="font-display font-black text-xl text-brand-600 block">G‑Tech CV</Link>
        {admin && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 block">Admin Panel</span>}
      </div>

      {/* User card */}
      {user && (
        <div className="mx-2 mb-4 p-3 bg-gradient-to-br from-brand-50 to-brand-100/50 rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {getInitials(user.name)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
            <p className="text-[11px] text-slate-500 truncate capitalize">{user.plan}</p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-0.5" aria-label="Navigation principale">
        {items.map(({ icon: Icon, label, path }) => (
          <Link key={path} to={path} className={isActive(pathname, path) ? 'nav-item-active' : 'nav-item'}>
            <Icon size={18} aria-hidden />
            {label}
          </Link>
        ))}
      </nav>

      {/* Upgrade */}
      {!admin && user?.plan === 'free' && (
        <div className="mx-2 mb-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-amber-600" />
            <p className="text-xs font-bold text-amber-700">Passer Premium</p>
          </div>
          <p className="text-[11px] text-amber-600 mb-2">Téléchargements illimités</p>
          <Link to="/#pricing" className="btn-amber btn-sm w-full text-center block">Voir les offres</Link>
        </div>
      )}

      {/* Logout */}
      <button
        onClick={() => { logout(); navigate('/login') }}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all text-sm font-medium"
      >
        <LogOut size={18} aria-hidden />
        Déconnexion
      </button>
    </aside>
  )
}

// ── Bottom tab bar (mobile) ───────────────────────────────
export function BottomNav({ admin = false }) {
  const { pathname } = useLocation()
  const items = (admin ? ADMIN_NAV : USER_NAV).slice(0, 4)

  return (
    <nav
      className="fixed bottom-0 left-0 w-full lg:hidden z-50 bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      aria-label="Navigation mobile"
    >
      <div className="flex justify-around items-center px-2 py-2" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {items.map(({ icon: Icon, label, path }) => {
          const active = isActive(pathname, path)
          return (
            <Link key={path} to={path} className="flex flex-col items-center py-1 px-3 gap-0.5 relative">
              {active && (
                <motion.div
                  layoutId={`tab-${admin ? 'admin' : 'user'}`}
                  className="absolute inset-0 bg-brand-50 rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <Icon size={20} className={cn('relative z-10 transition-colors', active ? 'text-brand-600' : 'text-slate-400')} aria-hidden />
              <span className={cn('text-[10px] font-semibold relative z-10', active ? 'text-brand-600' : 'text-slate-400')}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

// ── App Shell ─────────────────────────────────────────────
export function AppShell({ children, admin = false }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar admin={admin} />
      <main className="lg:ml-64 pb-20 lg:pb-0 min-h-screen">{children}</main>
      <BottomNav admin={admin} />
    </div>
  )
}
