// src/pages/AdminUsersPage.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MoreVertical, Mail, UserCheck, UserX, Filter } from 'lucide-react'
import { toast } from 'sonner'
import { AppShell } from '@/components/layout'
import { Card, Skeleton, Modal, Button } from '@/components/ui'
import { useAdminData, useDebounce } from '@/hooks'
import { adminApi } from '@/api'
import { formatDate } from '@/lib/utils'

const PLAN_STYLE = {
  premium:    'badge-blue',
  free:       'badge-slate',
  enterprise: 'badge-green',
}

export default function AdminUsersPage() {
  const { users, loading } = useAdminData()
  const [search,  setSearch]  = useState('')
  const [selected, setSelected] = useState(null)
  const q = useDebounce(search, 300)

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(q.toLowerCase()) ||
    u.email.toLowerCase().includes(q.toLowerCase())
  )

  const handleSuspend = async () => {
    try {
      await adminApi.updateUser(selected._id, { suspended: true })
      toast.success(`${selected.name} suspendu`)
    } catch (e) { toast.error(e.message) }
    setSelected(null)
  }

  const handleEmail = () => {
    toast.success(`Email envoyé à ${selected?.email}`)
    setSelected(null)
  }

  const handleUpgrade = async () => {
    try {
      await adminApi.updateUser(selected._id, { plan: 'premium' })
      toast.success(`${selected.name} passé en Premium`)
    } catch (e) { toast.error(e.message) }
    setSelected(null)
  }

  return (
    <AppShell admin>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 h-20 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl text-slate-900">Gestion des utilisateurs</h1>
          <p className="text-sm text-slate-500">{users.length} comptes enregistrés</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total',     value: users.length,                                   cls: 'bg-slate-100 text-slate-700' },
            { label: 'Premium',   value: users.filter(u => u.plan === 'premium').length,   cls: 'bg-brand-50 text-brand-700'  },
            { label: 'Gratuit',   value: users.filter(u => u.plan === 'free').length,      cls: 'bg-slate-100 text-slate-600' },
          ].map(({ label, value, cls }) => (
            <div key={label} className={`${cls} rounded-2xl px-5 py-4 text-center`}>
              <p className="font-display font-black text-2xl">{value}</p>
              <p className="text-xs font-semibold uppercase tracking-wide mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou email…"
              className="input-field pl-9 py-2.5 text-sm" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={15} />Filtres
          </button>
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Utilisateur','Plan','Rôle','Inscription','Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? [1,2,3,4].map(i => (
                  <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="flex items-center gap-3"><Skeleton className="w-9 h-9 rounded-full flex-shrink-0" /><div className="flex-1 space-y-2"><Skeleton className="h-3 w-40" /><Skeleton className="h-2.5 w-28" /></div></div></td></tr>
                )) : filtered.map((u, i) => (
                  <motion.tr key={u._id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {u.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><span className={PLAN_STYLE[u.plan] || 'badge-slate'}>{u.plan}</span></td>
                    <td className="px-5 py-4"><span className={u.role === 'admin' ? 'badge-blue' : 'badge-slate'}>{u.role}</span></td>
                    <td className="px-5 py-4 text-slate-500 text-xs">{formatDate(u.createdAt)}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => setSelected(u)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                        <MoreVertical size={15} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-400 text-sm">Aucun utilisateur trouvé</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Actions · ${selected?.name}`}>
        <div className="p-6 space-y-2">
          {[
            { icon: Mail,      label: 'Envoyer un email',   fn: handleEmail,   cls: 'hover:bg-brand-50 hover:text-brand-700',  iconcls: 'text-brand-500' },
            { icon: UserCheck, label: 'Passer en Premium',  fn: handleUpgrade, cls: 'hover:bg-emerald-50 hover:text-emerald-700', iconcls: 'text-emerald-500' },
            { icon: UserX,     label: 'Suspendre le compte',fn: handleSuspend, cls: 'hover:bg-red-50 hover:text-red-600',       iconcls: 'text-red-500' },
          ].map(({ icon: Icon, label, fn, cls, iconcls }) => (
            <button key={label} onClick={fn}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 transition-colors text-sm font-medium ${cls}`}>
              <Icon size={16} className={iconcls} />{label}
            </button>
          ))}
        </div>
      </Modal>
    </AppShell>
  )
}
