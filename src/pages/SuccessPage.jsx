// src/pages/SuccessPage.jsx
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Download, ArrowLeft, Share2, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui'

const NEXT_STEPS = [
  'Postulez directement sur JobHouse Guinée et LinkedIn.',
  'Partagez votre CV via un lien sécurisé.',
  'Mettez-le à jour dès que vous avez de nouvelles expériences.',
]

export default function SuccessPage() {
  const navigate = useNavigate()

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.origin + '/cv/share/demo')
      .then(() => toast.success('Lien copié !'))
      .catch(() => toast.error('Impossible de copier'))
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-16 flex items-center px-6 bg-white border-b border-slate-100">
        <span className="font-display font-black text-xl text-brand-600">G‑Tech CV</span>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center max-w-4xl w-full">

          {/* Main card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 flex flex-col items-center text-center max-w-md w-full"
          >
            {/* Animated check */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-emerald-100 rounded-full scale-150 blur-2xl opacity-60" />
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}
                className="relative z-10 w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-200"
              >
                <CheckCircle size={44} className="text-white" />
              </motion.div>
              {/* Confetti */}
              {[...Array(6)].map((_, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: -50, x: (i % 2 === 0 ? 1 : -1) * (20 + i * 8) }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                  className={`absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-full ${
                    ['bg-brand-400','bg-amber-400','bg-emerald-400','bg-purple-400','bg-pink-400','bg-sky-400'][i]
                  }`}
                />
              ))}
            </div>

            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="font-display font-black text-3xl text-slate-900 mb-3">
              Paiement réussi ! 🎉
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-slate-500 text-sm mb-8 leading-relaxed">
              Votre CV est prêt. Téléchargez-le maintenant ou partagez-le directement avec les recruteurs.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="w-full space-y-3">
              <Button className="w-full py-4 text-base" icon={<Download size={18} />}
                onClick={() => { toast.success('Téléchargement démarré !'); setTimeout(() => navigate('/dashboard'), 1500) }}>
                Télécharger mon CV en PDF
              </Button>
              <Button variant="secondary" className="w-full py-3" icon={<Share2 size={16} />} onClick={handleShare}>
                Partager le lien
              </Button>
              <button onClick={() => navigate('/dashboard')}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                <ArrowLeft size={15} />
                Retour au tableau de bord
              </button>
            </motion.div>
          </motion.div>

          {/* Side card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
            className="hidden lg:flex flex-col gap-5 w-72"
          >
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Zap size={17} className="text-amber-600" />
                </div>
                <h3 className="font-display font-bold text-slate-800">Prochaines étapes</h3>
              </div>
              <ul className="space-y-3">
                {NEXT_STEPS.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white">
              <p className="font-display font-black text-lg mb-1">Boostez votre carrière</p>
              <p className="text-brand-200 text-xs leading-relaxed">
                Avec un CV G‑Tech, vous avez 3× plus de chances d'obtenir un entretien.
              </p>
              <div className="mt-4 flex -space-x-2">
                {['M','A','F','I'].map((l, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-brand-600 flex items-center justify-center text-xs font-bold">
                    {l}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-brand-600 flex items-center justify-center text-[9px] font-bold">
                  +1k
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
