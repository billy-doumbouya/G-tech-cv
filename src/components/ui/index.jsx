// src/components/ui/index.jsx
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Button ────────────────────────────────────────────────
export function Button({ variant = 'primary', size = 'md', loading, icon, children, className, disabled, ...props }) {
  const sizes   = { sm: 'btn-sm', md: 'btn-md', lg: 'btn-lg', xl: 'btn-xl' }
  const variants = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    amber:     'btn-amber',
    ghost:     'btn-ghost',
    danger:    'btn-danger',
    outline:   'btn-outline',
  }
  return (
    <button
      disabled={disabled || loading}
      className={cn(variants[variant], sizes[size], className)}
      {...props}
    >
      {loading
        ? <Loader2 size={15} className="animate-spin flex-shrink-0" />
        : icon && <span className="flex-shrink-0">{icon}</span>
      }
      {children}
    </button>
  )
}

// ── Input ─────────────────────────────────────────────────
import { forwardRef } from 'react'
export const Input = forwardRef(function Input(
  { label, error, icon, rightIcon, className, id, ...props }, ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={inputId} className="label">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref} id={inputId}
          className={cn('input-field', icon && 'pl-10', rightIcon && 'pr-10', error && 'border-red-400 focus:border-red-500 focus:ring-red-500/20', className)}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{rightIcon}</span>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="text-xs text-red-500 font-medium"
          >{error}</motion.p>
        )}
      </AnimatePresence>
    </div>
  )
})

// ── Card ──────────────────────────────────────────────────
export function Card({ children, className, ...props }) {
  return <div className={cn('card', className)} {...props}>{children}</div>
}

// ── Badge ─────────────────────────────────────────────────
export function Badge({ variant = 'slate', children, className }) {
  return <span className={cn(`badge-${variant}`, className)}>{children}</span>
}

// ── StatusBadge ───────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    draft:        { label: 'Brouillon',      v: 'amber'  },
    paid:         { label: 'Payé',           v: 'green'  },
    downloadable: { label: 'Téléchargeable', v: 'blue'   },
    pending:      { label: 'En attente',     v: 'amber'  },
    confirmed:    { label: 'Confirmé',       v: 'green'  },
    failed:       { label: 'Échoué',         v: 'red'    },
  }
  const { label, v } = map[status] || { label: status, v: 'slate' }
  return <Badge variant={v}>{label}</Badge>
}

// ── Skeleton ──────────────────────────────────────────────
export function Skeleton({ className }) {
  return <div className={cn('skeleton', className)} />
}

// ── ProgressBar ───────────────────────────────────────────
export function ProgressBar({ value = 0, color = 'bg-brand-500', className }) {
  return (
    <div className={cn('w-full h-2 bg-slate-100 rounded-full overflow-hidden', className)}>
      <motion.div
        initial={{ width: 0 }} animate={{ width: `${value}%` }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={cn('h-full rounded-full', color)}
      />
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, maxWidth = 'max-w-md' }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className={cn('bg-white rounded-3xl shadow-2xl w-full overflow-hidden', maxWidth)}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <h2 className="font-display font-bold text-lg text-slate-800">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Fermer"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Toggle ────────────────────────────────────────────────
export function Toggle({ checked, onChange, label, desc }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn('relative w-11 h-6 rounded-full transition-colors duration-200', checked ? 'bg-brand-600' : 'bg-slate-200')}
      >
        <motion.div
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  )
}
