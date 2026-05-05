// src/pages/AdminPaymentsPage.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Download, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { AppShell } from '@/components/layout'
import { Card, Skeleton, StatusBadge } from '@/components/ui'
import { useAdminData, useDebounce } from '@/hooks'
import { formatGNF, formatDate } from '@/lib/utils'

const METHOD_INFO = {
  orange_money: { label: 'Orange Money', abbr: 'OM',  cls: 'bg-orange-100 text-orange-700' },
  mtn_momo:     { label: 'MTN MoMo',     abbr: 'MTN', cls: 'bg-yellow-100 text-yellow-700' },
}

export default function AdminPaymentsPage() {
  const { payments, stats, loading } = useAdminData()
  const [search,       setSearch]  = useState('')
  const [statusFilter, setFilter]  = useState('all')
  const q = useDebounce(search, 300)

  const filtered = payments.filter(p => {
    const matchText   = p.cvTitle.toLowerCase().includes(q.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchText && matchStatus
  })

  const total     = payments.filter(p => p.status === 'confirmed').reduce((s, p) => s + p.amount, 0)
  const confirmed = payments.filter(p => p.status === 'confirmed').length
  const pending   = payments.filter(p => p.status === 'pending').length
  const failed    = payments.filter(p => p.status === 'failed').length

  const handleExport = () => {
    const csv = [
      'Date,CV,Montant,Méthode,Statut',
      ...filtered.map(p => `${p.createdAt},"${p.cvTitle}",${p.amount},${p.method},${p.status}`),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'paiements.csv'; a.click()
    URL.revokeObjectURL(url)
    toast.success('Export CSV téléchargé')
  }

  return (
    <AppShell admin>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 h-20 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl text-slate-900">Gestion des paiements</h1>
          <p className="text-sm text-slate-500">{payments.length} transactions</p>
        </div>
        <button onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          <Download size={15} />Exporter CSV
        </button>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: TrendingUp,  label: 'Revenus confirmés', value: formatGNF(total),   from: 'from-brand-600',   to: 'to-brand-800'   },
            { icon: CheckCircle, label: 'Confirmés',          value: String(confirmed), from: 'from-emerald-500', to: 'to-emerald-700' },
            { icon: Clock,       label: 'En attente',          value: String(pending),   from: 'from-amber-400',   to: 'to-amber-600'   },
            { icon: XCircle,     label: 'Échoués',             value: String(failed),    from: 'from-red-500',     to: 'to-red-700'     },
          ].map(({ icon: Icon, label, value, from, to }) => (
            <div key={label} className={`bg-gradient-to-br ${from} ${to} rounded-2xl p-5 flex items-center gap-4`}>
              <Icon size={22} className="text-white opacity-80 flex-shrink-0" />
              <div>
                <p className="text-white opacity-70 text-xs font-semibold uppercase tracking-wide">{label}</p>
                <p className="text-white font-display font-black text-lg leading-tight mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un CV ou client…"
              className="input-field pl-9 py-2.5 text-sm" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'all',       label: 'Tous'       },
              { id: 'confirmed', label: 'Confirmés'  },
              { id: 'pending',   label: 'En attente' },
              { id: 'failed',    label: 'Échoués'    },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => setFilter(id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === id
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Méthode','CV / Service','Montant','Statut','Date'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? [1,2,3,4].map(i => (
                  <tr key={i}><td colSpan={5} className="px-5 py-4"><Skeleton className="h-8 rounded-xl" /></td></tr>
                )) : filtered.map((p, i) => {
                  const m = METHOD_INFO[p.method] || { label: p.method, abbr: '?', cls: 'bg-slate-100 text-slate-600' }
                  return (
                    <motion.tr key={p._id}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black ${m.cls}`}>
                          {m.abbr}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800 truncate max-w-[200px]">{p.cvTitle}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{m.label}</p>
                      </td>
                      <td className="px-5 py-4 font-display font-bold text-slate-800">{formatGNF(p.amount)}</td>
                      <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                      <td className="px-5 py-4 text-slate-400 text-xs whitespace-nowrap">{formatDate(p.createdAt)}</td>
                    </motion.tr>
                  )
                })}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-400 text-sm">Aucun paiement trouvé</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
