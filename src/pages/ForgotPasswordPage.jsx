// src/pages/ForgotPasswordPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button, Input } from '@/components/ui'
import { authApi } from '@/api'

const schema = yup.object({ email: yup.string().email('Email invalide').required('Email requis') })

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ resolver: yupResolver(schema) })
  const email = watch('email')

  const onSubmit = async ({ email }) => {
    setLoading(true)
    try {
      await authApi.forgotPassword(email)
      setSent(true)
      toast.success(`Instructions envoyées à ${email}`)
    } catch (e) {
      toast.error(e.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-16 flex items-center px-6 bg-white border-b border-slate-100">
        <Link to="/" className="font-display font-black text-xl text-brand-600">G‑Tech CV</Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', duration: 0.5 }} className="w-full max-w-md">
          <div className="card-lg p-8">
            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mb-4">
                      <Mail size={24} className="text-brand-600" />
                    </div>
                    <h1 className="font-display font-black text-2xl text-slate-900 mb-2">Mot de passe oublié ?</h1>
                    <p className="text-sm text-slate-500">Entrez votre email pour recevoir les instructions de réinitialisation.</p>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input label="Adresse email" type="email" placeholder="votre@email.gn"
                      icon={<Mail size={16} />} error={errors.email?.message}
                      {...register('email')} />
                    <Button type="submit" loading={loading} className="w-full py-3.5">
                      Envoyer les instructions
                    </Button>
                  </form>
                  <div className="text-center mt-6">
                    <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700">
                      <ArrowLeft size={14} /> Retour à la connexion
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-4">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-emerald-100 rounded-full scale-150 blur-xl opacity-60" />
                    <div className="relative z-10 w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
                      <CheckCircle size={36} className="text-white" />
                    </div>
                  </div>
                  <h2 className="font-display font-black text-2xl text-slate-900 mb-3">Email envoyé !</h2>
                  <p className="text-slate-500 text-sm mb-2">Instructions envoyées à :</p>
                  <p className="font-bold text-brand-600 mb-6">{email}</p>
                  <p className="text-xs text-slate-400 mb-8">Vérifiez vos spams si vous ne le trouvez pas.</p>
                  <Link to="/login" className="btn-primary btn-lg w-full justify-center">Retour à la connexion</Link>
                  <button onClick={() => setSent(false)} className="text-xs text-slate-400 hover:text-slate-600 mt-4 transition-colors">Renvoyer l'email</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
