// src/pages/LoginPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import useAuthStore from '@/store/authStore'
import { Button, Input } from '@/components/ui'

const schema = yup.object({
  email:    yup.string().email('Email invalide').required('Email requis'),
  password: yup.string().min(6, '6 caractères minimum').required('Mot de passe requis'),
})

export default function LoginPage() {
  const { login, loading } = useAuthStore()
  const navigate = useNavigate()
  const [showPwd, setShowPwd] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password)
      toast.success('Connexion réussie !')
      navigate('/dashboard')
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-100">
        <Link to="/" className="font-display font-black text-xl text-brand-600">G‑Tech CV</Link>
        <Link to="/register" className="btn-primary btn-sm">S'inscrire</Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="card-lg p-8">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-brand-600/30">
                <Lock size={24} className="text-white" />
              </div>
              <h1 className="font-display font-black text-2xl text-slate-900 mb-1">Bienvenue</h1>
              <p className="text-sm text-slate-500">Connectez-vous pour continuer votre carrière</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <Input label="Email" type="email" placeholder="nom@exemple.com"
                icon={<Mail size={16} />} error={errors.email?.message}
                {...register('email')} />

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="label">Mot de passe</label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                    Oublié ?
                  </Link>
                </div>
                <Input type={showPwd ? 'text' : 'password'} placeholder="••••••••"
                  icon={<Lock size={16} />}
                  rightIcon={
                    <button type="button" onClick={() => setShowPwd(!showPwd)} aria-label="Afficher le mot de passe">
                      {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                  error={errors.password?.message}
                  {...register('password')} />
              </div>

              <Button type="submit" loading={loading} className="w-full py-3.5 text-base mt-1">
                Se connecter
              </Button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-xs text-slate-400 font-medium">ou</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              <Button type="button" variant="secondary" className="w-full py-3"
                icon={
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                }
              >
                Continuer avec Google
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Pas de compte ?{' '}
              <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">S'inscrire</Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
