// src/pages/PaymentsPage.jsx
import { motion } from 'framer-motion'
import { CreditCard, Calendar, TrendingUp } from 'lucide-react'
import { AppShell } from '@/components/layout'
import { Card, Skeleton, StatusBadge } from '@/components/ui'
import { usePayments } from '@/hooks'
import { formatGNF, formatDate } from '@/lib/utils'

const METHOD_LABEL = { orange_money: 'Orange Money', mtn_momo: 'MTN MoMo' }
const METHOD_COLOR  = { orange_money: 'bg-orange-100 text-orange-600', mtn_momo: 'bg-yellow-100 text-yellow-700' }
const METHOD_ABBR   = { orange_money: 'OM', mtn_momo: 'MTN' }

export default function PaymentsPage() {
  const { payments, loading, total } = usePayments()

  return (
    <AppShell>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 h-20 flex items-center">
        <div>
          <h1 className="font-display font-bold text-xl text-slate-900">Historique des paiements</h1>
          <p className="text-sm text-slate-500">Toutes vos transactions</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Summary */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 text-white flex items-center justify-between">
          <div>
            <p className="text-brand-200 text-xs font-bold uppercase tracking-widest mb-1">Total dépensé</p>
            <p className="font-display font-black text-3xl">{formatGNF(total)}</p>
            <p className="text-brand-200 text-sm mt-1">
              {payments.filter(p => p.status === 'confirmed').length} transaction(s) confirmée(s)
            </p>
          </div>
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
            <TrendingUp size={28} className="text-white" />
          </div>
        </motion.div>

        {/* List */}
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-display font-bold text-slate-800">Transactions</h2>
          </div>

          {loading ? (
            <div className="divide-y divide-slate-100">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          ) : payments.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-slate-400">
              <CreditCard size={36} className="mb-3 opacity-40" />
              <p className="font-medium">Aucune transaction</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {payments.map((p, i) => (
                <motion.div key={p._id}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${METHOD_COLOR[p.method] || 'bg-slate-100 text-slate-600'}`}>
                    <span className="text-xs font-black">{METHOD_ABBR[p.method] || '?'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{p.cvTitle}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar size={11} />
                      {formatDate(p.createdAt)} · {METHOD_LABEL[p.method] || p.method}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-display font-bold text-slate-800 text-sm">{formatGNF(p.amount)}</p>
                    <div className="mt-1"><StatusBadge status={p.status} /></div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  )
}
