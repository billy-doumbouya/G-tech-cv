// src/pages/SettingsPage.jsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { motion } from 'framer-motion'
import { User, Lock, Receipt, AlertTriangle, Camera, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '@/components/layout'
import { Button, Input, Card, Modal } from '@/components/ui'
import useAuthStore from '@/store/authStore'
import { profileApi } from '@/api'
import { formatGNF, formatDate } from '@/lib/utils'
import { MOCK_PAYMENTS } from '@/mocks'

const profileSchema = yup.object({
  name:  yup.string().min(2).required('Nom requis'),
  email: yup.string().email('Email invalide').required('Email requis'),
  phone: yup.string().optional(),
})
const passwordSchema = yup.object({
  current: yup.string().min(6).required('Mot de passe actuel requis'),
  next:    yup.string().min(6, '6 caractères minimum').required(),
})

function SectionHeader({ icon: Icon, title, color = 'text-brand-600' }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <Icon size={18} className={color} />
      <h2 className="font-display font-bold text-lg text-slate-800">{title}</h2>
    </div>
  )
}

const STATUS_STYLE = {
  confirmed: { label: 'Payé',       cls: 'badge-green' },
  pending:   { label: 'En attente', cls: 'badge-amber' },
  failed:    { label: 'Échoué',     cls: 'badge-red'   },
}

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuthStore()
  const navigate = useNavigate()
  const [savingProfile,  setSavingProfile]  = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [deleteModal,    setDeleteModal]    = useState(false)

  const profileForm = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: { name: user?.name || '', email: user?.email || '', phone: user?.phone || '' },
  })
  const passwordForm = useForm({ resolver: yupResolver(passwordSchema) })

  const onSaveProfile = async (data) => {
    setSavingProfile(true)
    try {
      const updated = await profileApi.update(data)
      updateUser(updated)
      toast.success('Profil mis à jour !')
    } catch (e) { toast.error(e.message) }
    finally { setSavingProfile(false) }
  }

  const onSavePassword = async (data) => {
    setSavingPassword(true)
    try {
      await profileApi.changePassword({ currentPassword: data.current, newPassword: data.next })
      toast.success('Mot de passe mis à jour !')
      passwordForm.reset()
    } catch (e) { toast.error(e.message || 'Erreur') }
    finally { setSavingPassword(false) }
  }

  const handleDeleteAccount = async () => {
    try {
      await profileApi.deleteAccount()
      await logout()
      toast.success('Compte supprimé')
      navigate('/')
    } catch (e) { toast.error(e.message) }
  }

  return (
    <AppShell>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 h-20 flex items-center">
        <div>
          <h1 className="font-display font-bold text-xl text-slate-900">Paramètres du compte</h1>
          <p className="text-sm text-slate-500">Gérez vos informations et préférences</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-6 space-y-10">

        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <SectionHeader icon={User} title="Mon profil" />
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-display font-black text-3xl shadow-lg">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white shadow-md hover:bg-brand-700 transition-colors">
                  <Camera size={14} />
                </button>
              </div>
              <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nom complet" error={profileForm.formState.errors.name?.message} {...profileForm.register('name')} />
                <Input label="Adresse e-mail" type="email" error={profileForm.formState.errors.email?.message} {...profileForm.register('email')} />
                <Input label="Téléphone" type="tel" placeholder="+224 620 00 00 00" {...profileForm.register('phone')} />
                <div className="flex items-end">
                  <Button type="submit" loading={savingProfile} className="w-full">Enregistrer</Button>
                </div>
              </form>
            </div>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <SectionHeader icon={Lock} title="Sécurité" />
          <Card className="p-6">
            <form onSubmit={passwordForm.handleSubmit(onSavePassword)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Mot de passe actuel" type="password" placeholder="••••••••"
                error={passwordForm.formState.errors.current?.message} {...passwordForm.register('current')} />
              <Input label="Nouveau mot de passe" type="password" placeholder="••••••••"
                error={passwordForm.formState.errors.next?.message} {...passwordForm.register('next')} />
              <div className="flex items-end">
                <Button type="submit" variant="secondary" loading={savingPassword} className="w-full">Mettre à jour</Button>
              </div>
            </form>
          </Card>
        </motion.div>

        {/* Payment history */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <SectionHeader icon={Receipt} title="Historique des paiements" />
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Date', 'CV / Service', 'Montant', 'Statut'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_PAYMENTS.map((p, i) => {
                  const { label, cls } = STATUS_STYLE[p.status] || { label: p.status, cls: 'badge-slate' }
                  return (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5 text-slate-500">{formatDate(p.createdAt)}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-800">{p.cvTitle}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-800">{formatGNF(p.amount)}</td>
                      <td className="px-5 py-3.5"><span className={cls}>{label}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
        </motion.div>

        {/* Danger zone */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <SectionHeader icon={AlertTriangle} title="Zone de danger" color="text-red-500" />
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-red-800 mb-1">Supprimer mon compte</h3>
              <p className="text-sm text-red-600">Action irréversible — tous vos CV et données seront supprimés.</p>
            </div>
            <Button variant="danger" icon={<Trash2 size={15} />} onClick={() => setDeleteModal(true)} className="flex-shrink-0">
              Supprimer le compte
            </Button>
          </div>
        </motion.div>
      </div>

      <Modal open={deleteModal} onClose={() => setDeleteModal(false)} title="Confirmer la suppression">
        <div className="p-6">
          <p className="text-slate-600 text-sm mb-6">Cette action est <strong>irréversible</strong>. Tous vos CV et données seront supprimés définitivement.</p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setDeleteModal(false)}>Annuler</Button>
            <Button variant="danger" className="flex-1" onClick={handleDeleteAccount}>Confirmer</Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  )
}
