// src/pages/DashboardPage.jsx
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Download, Edit, Trash2, Lock, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { AppShell } from '@/components/layout'
import { Button, Card, Skeleton, StatusBadge, ProgressBar } from '@/components/ui'
import { useCVList } from '@/hooks'
import useAuthStore from '@/store/authStore'
import { formatDate } from '@/lib/utils'
import { cvApi } from '@/api'
import { downloadBlob } from '@/lib/utils'

const stagger = { animate: { transition: { staggerChildren: 0.07 } } }
const item    = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { cvs, loading, refetch, remove } = useCVList()

  const completeness = 85

  const handleDownload = async (cv) => {
    if (cv.status === 'draft') { toast.error('Payez d\'abord pour télécharger'); return }
    try {
      const blob = await cvApi.download(cv._id)
      downloadBlob(blob, `${cv.title}.pdf`)
      toast.success('Téléchargement démarré !')
    } catch {
      toast.error('Erreur lors du téléchargement')
    }
  }

  return (
    <AppShell>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 h-20 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl text-slate-900">
            Bonjour, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-500">Prêt à décrocher votre prochain emploi ?</p>
        </div>
        <Link to="/templates">
          <Button icon={<Plus size={16} />} className="hidden md:inline-flex">Nouveau CV</Button>
        </Link>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Completeness */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="p-5 mb-8 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Profil Complété</span>
                <span className="text-sm font-bold text-amber-600">{completeness}%</span>
              </div>
              <ProgressBar value={completeness} color="bg-amber-500" />
            </div>
            <p className="text-sm text-slate-500 md:max-w-xs">
              Ajoutez vos références pour atteindre 100 % et booster vos chances.
            </p>
          </Card>
        </motion.div>

        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg text-slate-800">Mes CV récents</h2>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-44 rounded-none" />
                <div className="p-5 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-9 flex-1 rounded-xl" />
                    <Skeleton className="h-9 flex-1 rounded-xl" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div variants={stagger} initial="initial" animate="animate" className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cvs.map(cv => (
              <motion.div key={cv._id} variants={item}>
                <Card className="overflow-hidden hover:shadow-lg hover:shadow-slate-200/60 transition-shadow group">
                  <div className="h-44 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                    <div className="absolute inset-0 flex flex-col gap-2 p-5">
                      <div className="h-4 bg-white/70 rounded w-3/4" />
                      <div className="h-2 bg-white/50 rounded w-full" />
                      <div className="h-2 bg-white/50 rounded w-5/6" />
                      <div className="mt-2 flex gap-2">
                        <div className="w-10 h-10 bg-brand-200/50 rounded" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-2 bg-white/40 rounded" />
                          <div className="h-2 bg-white/40 rounded w-4/5" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3"><StatusBadge status={cv.status} /></div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-slate-800 mb-1 truncate">{cv.title}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-4">
                      <Calendar size={12} />
                      {formatDate(cv.updatedAt)} · {cv.templateName}
                    </p>
                    <div className="flex gap-2">
                      <Link to={`/editor/${cv._id}`} className="flex-1">
                        <Button variant="secondary" size="sm" icon={<Edit size={14} />} className="w-full">Modifier</Button>
                      </Link>
                      {cv.status === 'draft' ? (
                        <Link to={`/payment/${cv._id}`} className="flex-1">
                          <Button size="sm" icon={<Lock size={14} />} className="w-full">Payer</Button>
                        </Link>
                      ) : (
                        <Button size="sm" icon={<Download size={14} />} className="flex-1" onClick={() => handleDownload(cv)}>
                          PDF
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600 hover:bg-red-50 px-2"
                        onClick={() => remove(cv._id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* Create CTA */}
            <motion.div variants={item}>
              <Link to="/templates">
                <div className="h-full min-h-[260px] rounded-2xl border-2 border-dashed border-slate-200 hover:border-brand-300 hover:bg-brand-50/30 transition-all flex flex-col items-center justify-center gap-3 p-6 cursor-pointer group">
                  <div className="w-14 h-14 bg-slate-100 group-hover:bg-brand-100 rounded-2xl flex items-center justify-center transition-colors">
                    <Plus size={24} className="text-slate-400 group-hover:text-brand-600 transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="font-display font-bold text-slate-600 group-hover:text-brand-700 transition-colors">Nouveau CV</p>
                    <p className="text-xs text-slate-400 mt-1">Choisir un modèle →</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Mobile FAB */}
      <Link to="/templates" className="lg:hidden fixed bottom-24 right-5 w-14 h-14 bg-brand-600 text-white rounded-full shadow-xl shadow-brand-600/40 flex items-center justify-center z-40 active:scale-90 transition-transform">
        <Plus size={24} />
      </Link>
    </AppShell>
  )
}
