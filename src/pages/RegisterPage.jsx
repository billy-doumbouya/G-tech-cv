// src/pages/RegisterPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Shield, Zap } from 'lucide-react'
import { toast } from 'sonner'
import useAuthStore from '@/store/authStore'
import { Button, Input } from '@/components/ui'

const schema = yup.object({
  name:     yup.string().min(2, '2 caractères minimum').required('Nom requis'),
  email:    yup.string().email('Email invalide').required('Email requis'),
  password: yup.string().min(6, '6 caractères minimum').required('Mot de passe requis'),
  confirm:  yup.string().oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas').required('Confirmation requise'),
  terms:    yup.boolean().oneOf([true], 'Vous devez accepter les conditions').required(),
})

export default function RegisterPage() {
  const { register: authRegister, loading } = useAuthStore()
  const navigate = useNavigate()
  const [showPwd, setShowPwd] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = async (data) => {
    try {
      await authRegister({ name: data.name, email: data.email, password: data.password })
      toast.success('Compte créé avec succès !')
      navigate('/dashboard')
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-100">
        <Link to="/" className="font-display font-black text-xl text-brand-600">G‑Tech CV</Link>
        <Link to="/login" className="text-sm font-semibold text-brand-600 hover:text-brand-700 px-4 py-2 rounded-xl hover:bg-brand-50 transition-colors">Se connecter</Link>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-6 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-100/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="card-lg p-8"
          >
            <div className="text-center mb-8">
              <h1 className="font-display font-black text-3xl text-slate-900 mb-2">Créer un compte</h1>
              <p className="text-slate-500 text-sm">Votre carrière commence ici.</p>
            </div>

            <Button type="button" variant="secondary" className="w-full py-3 mb-6"
              icon={
                <svg viewBox="0 0 24 24" className="w-5 h-5">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              }
            >
              S'inscrire avec Google
            </Button>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-xs text-slate-400 font-medium">Ou avec votre email</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Input label="Nom complet" type="text" placeholder="Ex: Mamadou Diallo"
                icon={<User size={16} />} error={errors.name?.message}
                {...register('name')} />
              <Input label="Adresse Email" type="email" placeholder="votre@email.com"
                icon={<Mail size={16} />} error={errors.email?.message}
                {...register('email')} />

              <div className="grid grid-cols-2 gap-3">
                <Input label="Mot de passe" type={showPwd ? 'text' : 'password'} placeholder="••••••••"
                  icon={<Lock size={16} />}
                  rightIcon={
                    <button type="button" onClick={() => setShowPwd(!showPwd)} aria-label="Afficher">
                      {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                  error={errors.password?.message} {...register('password')} />
                <Input label="Confirmer" type={showPwd ? 'text' : 'password'} placeholder="••••••••"
                  icon={<Lock size={16} />} error={errors.confirm?.message}
                  {...register('confirm')} />
              </div>

              <div className="flex items-start gap-3 pt-1">
                <input type="checkbox" id="terms" className="mt-0.5 w-4 h-4 accent-brand-600 cursor-pointer" {...register('terms')} />
                <label htmlFor="terms" className="text-xs text-slate-500 leading-relaxed cursor-pointer">
                  J'accepte les{' '}
                  <a href="#" className="text-brand-600 font-semibold hover:underline">Conditions d'utilisation</a>
                  {' '}et la{' '}
                  <a href="#" className="text-brand-600 font-semibold hover:underline">Politique de confidentialité</a>.
                </label>
              </div>
              {errors.terms && <p className="text-xs text-red-500 -mt-2">{errors.terms.message}</p>}

              <Button type="submit" loading={loading} className="w-full py-3.5 text-base mt-1">
                Créer mon compte
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Déjà un compte ?{' '}
              <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">Se connecter</Link>
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-4 mt-4"
          >
            {[
              { icon: Shield, label: 'Données Sécurisées', color: 'text-brand-600' },
              { icon: Zap,    label: 'Prêt en 5 min',      color: 'text-amber-600' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col items-center text-center">
                <Icon size={20} className={`${color} mb-1.5`} />
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
