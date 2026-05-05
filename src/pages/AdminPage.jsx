// src/pages/AdminPage.jsx
import { motion } from 'framer-motion'
import { Users, FileText, Wallet, Clock, Download } from 'lucide-react'
import { AppShell } from '@/components/layout'
import { Card, Skeleton, StatusBadge } from '@/components/ui'
import { useAdminData } from '@/hooks'
import { formatGNF, formatDate } from '@/lib/utils'

const stagger = { animate: { transition: { staggerChildren: 0.07 } } }
const item    = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }

export default function AdminPage() {
  const { stats, users, payments, loading } = useAdminData()

  const KPI_CARDS = stats ? [
    { icon: Users,    label: 'Total Utilisateurs', value: stats.totalUsers.toLocaleString('fr'), growth: '+12%', positive: true,  color: 'bg-brand-50 text-brand-600' },
    { icon: FileText, label: 'CV Créés',           value: stats.totalCVs.toLocaleString('fr'),   growth: '+5%',  positive: true,  color: 'bg-purple-50 text-purple-600' },
    { icon: Wallet,   label: 'Revenus (GNF)',       value: (stats.revenue / 1_000_000).toFixed(1) + 'M', growth: '+24%', positive: true, color: 'bg-amber-50 text-amber-600' },
    { icon: Clock,    label: 'Paiements Attente',   value: String(stats.pendingPayments), growth: '8 alertes', positive: false, color: 'bg-red-50 text-red-500' },
  ] : []

  return (
    <AppShell admin>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 h-20 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl text-slate-900">Tableau de bord analytique</h1>
          <p className="text-sm text-slate-500">Performances de G‑Tech CV</p>
        </div>
        <button className="btn-primary btn-sm flex items-center gap-2">
          <Download size={15} />Rapport
        </button>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-8">

        {/* KPI */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        ) : (
          <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {KPI_CARDS.map(({ icon: Icon, label, value, growth, positive, color }) => (
              <motion.div key={label} variants={item}>
                <Card className="p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                      <Icon size={18} />
                    </div>
                    <span className={`text-xs font-bold ${positive ? 'text-emerald-600' : 'text-red-500'}`}>{growth}</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-0.5">{label}</p>
                    <p className="font-display font-black text-2xl text-slate-900">{value}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Charts */}
        {stats && (
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-slate-800">Croissance des utilisateurs</h3>
                <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">7 derniers jours</span>
              </div>
              <div className="flex items-end justify-between gap-2 h-40 px-2">
                {stats.userGrowth.map((v, i) => {
                  const max = Math.max(...stats.userGrowth)
                  const pct = `${(v / max) * 100}%`
                  return (
                    <motion.div key={i} initial={{ height: 0 }} animate={{ height: pct }}
                      transition={{ delay: i * 0.06, ease: 'easeOut' }}
                      className={`flex-1 rounded-t-lg ${i === stats.userGrowth.length - 2 ? 'bg-brand-500' : 'bg-brand-100'} hover:bg-brand-400 transition-colors cursor-pointer`}
                      title={`${v} utilisateurs`}
                    />
                  )
                })}
              </div>
              <div className="flex justify-between mt-3 px-2 text-xs text-slate-400 font-medium">
                {['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'].map(d => <span key={d}>{d}</span>)}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-display font-bold text-slate-800 mb-6">Répartition des Forfaits</h3>
              <div className="flex flex-col gap-5">
                {[
                  { label: 'Standard (Gratuit)', pct: stats.planDistribution.free,       color: 'bg-slate-400' },
                  { label: 'Premium (Payant)',    pct: stats.planDistribution.premium,    color: 'bg-brand-500' },
                  { label: 'Entreprise',          pct: stats.planDistribution.enterprise, color: 'bg-amber-500' },
                ].map(({ label, pct, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm font-medium mb-1.5">
                      <span className="text-slate-700">{label}</span>
                      <span className="text-slate-500">{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full ${color} rounded-full`} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Users table */}
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-display font-bold text-slate-800">Utilisateurs récents</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Utilisateur','Plan','Inscription'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? [1,2,3].map(i => (
                  <tr key={i}><td colSpan={3} className="px-5 py-4"><Skeleton className="h-8 rounded-xl" /></td></tr>
                )) : users.slice(0, 5).map((u, i) => (
                  <motion.tr key={u._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {u.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={u.plan === 'premium' ? 'badge-blue' : u.plan === 'enterprise' ? 'badge-green' : 'badge-slate'}>
                        {u.plan}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">{formatDate(u.createdAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Payments table */}
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-display font-bold text-slate-800">Paiements Récents</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['CV / Service','Montant','Statut','Date'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? [1,2,3].map(i => (
                  <tr key={i}><td colSpan={4} className="px-5 py-3"><Skeleton className="h-7 rounded-xl" /></td></tr>
                )) : payments.slice(0, 5).map((p, i) => (
                  <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{p.cvTitle}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-800">{formatGNF(p.amount)}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">{formatDate(p.createdAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
