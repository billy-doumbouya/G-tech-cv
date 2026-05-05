// src/pages/PaymentPage.jsx
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Shield, Phone, CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { AppShell } from '@/components/layout'
import { Button, Modal } from '@/components/ui'
import { paymentApi, cvApi } from '@/api'
import { formatGNF } from '@/lib/utils'

const schema = yup.object({
  phone:  yup.string().min(8, 'Numéro invalide').required('Numéro requis'),
  method: yup.string().oneOf(['orange_money', 'mtn_momo']).required(),
})

const METHODS = [
  { id: 'orange_money', label: 'Orange Money', abbr: 'OM',  bg: 'bg-orange-500',  ring: 'ring-orange-500' },
  { id: 'mtn_momo',     label: 'MTN MoMo',     abbr: 'MTN', bg: 'bg-yellow-400',  ring: 'ring-yellow-400' },
]

export default function PaymentPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cvTitle, setCvTitle] = useState('Mon CV')
  const [step,    setStep]    = useState('form') // 'form' | 'processing' | 'success'
  const pollRef = useRef(null)

  useEffect(() => {
    if (id && id !== 'new') {
      cvApi.get(id).then(cv => setCvTitle(cv.title)).catch(() => {})
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [id])

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { method: 'orange_money', phone: '' },
  })

  const selectedMethod = watch('method')

  const onSubmit = async ({ phone, method }) => {
    setStep('processing')
    try {
      const { paymentId } = await paymentApi.initiate(id || 'new', phone, method)

      // Polling toutes les 3s pendant max 60s
      let attempts = 0
      pollRef.current = setInterval(async () => {
        attempts++
        try {
          const res = await paymentApi.checkStatus(paymentId)
          if (res.status === 'confirmed') {
            clearInterval(pollRef.current)
            setStep('success')
          } else if (res.status === 'failed' || attempts >= 20) {
            clearInterval(pollRef.current)
            toast.error('Paiement échoué ou expiré.')
            setStep('form')
          }
        } catch { clearInterval(pollRef.current); setStep('form') }
      }, 3000)
    } catch (e) {
      toast.error(e.message || 'Erreur de paiement')
      setStep('form')
    }
  }

  return (
    <AppShell>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 h-20 flex items-center">
        <div>
          <h1 className="font-display font-bold text-xl text-slate-900">Télécharger votre CV</h1>
          <p className="text-sm text-slate-500 truncate max-w-xs">{cvTitle}</p>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-6 space-y-5">
        {/* Price banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-x-4 -translate-y-4" />
          <p className="text-brand-200 text-xs font-bold uppercase tracking-widest mb-2">Montant à payer</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="font-display font-black text-6xl text-white">5 000</span>
            <span className="font-display font-bold text-2xl text-brand-200">GNF</span>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <CheckCircle size={14} className="text-amber-400" />
            <span className="text-white text-xs font-medium">Accès illimité pendant 30 jours</span>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Method selector */}
            <div>
              <label className="label mb-3 block">Moyen de paiement</label>
              <div className="grid grid-cols-2 gap-3">
                {METHODS.map(m => (
                  <button key={m.id} type="button"
                    onClick={() => setValue('method', m.id)}
                    className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                      selectedMethod === m.id ? 'border-brand-600 bg-brand-50 shadow-md shadow-brand-100' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-12 h-12 ${m.bg} rounded-xl flex items-center justify-center mb-2 shadow-sm`}>
                      <span className="text-white font-black text-xs">{m.abbr}</span>
                    </div>
                    <span className={`text-xs font-bold ${selectedMethod === m.id ? 'text-brand-700' : 'text-slate-500'}`}>
                      {m.label}
                    </span>
                    {selectedMethod === m.id && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center">
                        <CheckCircle size={12} className="text-white" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone input */}
            <div>
              <label className="label">Votre numéro Mobile Money</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-500 font-semibold text-sm">+224</span>
                  <div className="w-px h-5 bg-slate-200 ml-3" />
                </div>
                <input {...register('phone')} type="tel" placeholder="620 00 00 00"
                  className="input-field pl-[72px] text-lg font-medium" />
                <Phone size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
              <p className="text-xs text-slate-400 text-center mt-2">
                Une demande de confirmation sera envoyée sur votre téléphone.
              </p>
            </div>

            <Button type="submit" variant="amber" className="w-full py-4 text-base" icon={<Lock size={16} />}>
              Payer maintenant
            </Button>

            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
              <Shield size={14} />
              Paiement sécurisé via LengoPay
            </div>
          </form>
        </motion.div>
      </div>

      {/* Processing modal */}
      <Modal open={step === 'processing'} onClose={() => {}} maxWidth="max-w-sm">
        <div className="flex flex-col items-center justify-center p-10 gap-5">
          <div className="relative flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-amber-100 rounded-full" />
            <div className="absolute w-20 h-20 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <Loader2 size={28} className="absolute text-amber-500" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="font-display font-bold text-xl text-slate-800">Traitement en cours…</h3>
            <p className="text-sm text-slate-500 px-4">Confirmez la transaction sur votre téléphone.</p>
          </div>
          <div className="w-40 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div className="h-full bg-amber-500 rounded-full"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }} />
          </div>
        </div>
      </Modal>

      {/* Success modal */}
      <Modal open={step === 'success'} onClose={() => navigate('/success')} maxWidth="max-w-sm">
        <div className="flex flex-col items-center p-10 gap-5 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-100 rounded-full scale-150 blur-xl opacity-60" />
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative z-10 w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-200">
              <CheckCircle size={40} className="text-white" />
            </motion.div>
          </div>
          <div>
            <h2 className="font-display font-black text-2xl text-slate-900 mb-2">Paiement réussi ! 🎉</h2>
            <p className="text-slate-500 text-sm">Votre CV est prêt au téléchargement.</p>
          </div>
          <div className="w-full space-y-3">
            <Button className="w-full py-3.5" icon={<CheckCircle size={16} />}
              onClick={() => navigate('/success')}>
              Télécharger mon CV en PDF
            </Button>
            <button onClick={() => navigate('/dashboard')}
              className="w-full text-sm font-semibold text-brand-600 hover:text-brand-700 py-2">
              ← Retour au tableau de bord
            </button>
          </div>
        </div>
      </Modal>
    </AppShell>
  )
}
