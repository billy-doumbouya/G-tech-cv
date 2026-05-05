// src/pages/AdminSettingsPage.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Bell, Globe, Palette, Lock, Save } from 'lucide-react'
import { toast } from 'sonner'
import { AppShell } from '@/components/layout'
import { Card, Button, Input, Toggle } from '@/components/ui'

function Section({ icon: Icon, title, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-2 mb-4">
        <Icon size={18} className="text-brand-600" />
        <h2 className="font-display font-bold text-lg text-slate-800">{title}</h2>
      </div>
      <Card className="p-6">{children}</Card>
    </motion.div>
  )
}

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false)
  const [notifs, setNotifs] = useState({ payments: true, users: true, pending: false, report: true })
  const [security, setSecurity] = useState({ twofa: false, multiSession: true, audit: true })

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success('Paramètres sauvegardés')
    setSaving(false)
  }

  return (
    <AppShell admin>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 h-20 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl text-slate-900">Paramètres de la plateforme</h1>
          <p className="text-sm text-slate-500">Configuration globale de G‑Tech CV</p>
        </div>
        <Button icon={<Save size={15} />} loading={saving} onClick={handleSave}>
          Sauvegarder
        </Button>
      </header>

      <div className="max-w-3xl mx-auto p-6 space-y-8">

        <Section icon={Settings} title="Général">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nom de la plateforme" defaultValue="G-Tech CV" />
            <Input label="Email de support" defaultValue="support@gtech-cv.gn" type="email" />
            <Input label="Numéro WhatsApp" defaultValue="+224 620 00 00 00" type="tel" />
            <div>
              <label className="label">Devise</label>
              <select className="input-field">
                <option>GNF – Franc guinéen</option>
                <option>USD – Dollar américain</option>
                <option>EUR – Euro</option>
              </select>
            </div>
          </div>
        </Section>

        <Section icon={Globe} title="Tarification">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Prix par téléchargement (GNF)</label>
              <input type="number" defaultValue={5000} className="input-field" />
            </div>
            <div>
              <label className="label">Prix Premium mensuel (GNF)</label>
              <input type="number" defaultValue={25000} className="input-field" />
            </div>
            <div>
              <label className="label">Prix Entreprise (GNF)</label>
              <input type="number" defaultValue={100000} className="input-field" />
            </div>
          </div>
        </Section>

        <Section icon={Bell} title="Notifications">
          <Toggle label="Alertes paiements"      desc="Notifier lors de nouveaux paiements"           checked={notifs.payments} onChange={v => setNotifs(n => ({ ...n, payments: v }))} />
          <Toggle label="Nouveaux utilisateurs"  desc="Alerte à chaque inscription"                   checked={notifs.users}    onChange={v => setNotifs(n => ({ ...n, users: v }))} />
          <Toggle label="Paiements en attente"   desc="Rappel quotidien des transactions pendantes"   checked={notifs.pending}  onChange={v => setNotifs(n => ({ ...n, pending: v }))} />
          <Toggle label="Rapport hebdomadaire"   desc="Résumé envoyé chaque lundi"                    checked={notifs.report}   onChange={v => setNotifs(n => ({ ...n, report: v }))} />
        </Section>

        <Section icon={Palette} title="Apparence">
          <div className="mb-4">
            <Toggle label="Animations de l'interface" desc="Transitions et effets animés" checked={true} onChange={() => {}} />
          </div>
          <div>
            <label className="label">Couleur principale</label>
            <div className="flex gap-3 mt-2">
              {['#1e2ef5','#7c3aed','#059669','#d97706','#dc2626'].map(c => (
                <button key={c} className="w-9 h-9 rounded-full border-2 border-white shadow-md ring-2 ring-transparent hover:ring-slate-300 transition-all" style={{ background: c }} aria-label={`Couleur ${c}`} />
              ))}
            </div>
          </div>
        </Section>

        <Section icon={Lock} title="Sécurité">
          <Toggle label="Double authentification (2FA)" desc="Exiger la 2FA pour les admins"                checked={security.twofa}       onChange={v => setSecurity(s => ({ ...s, twofa: v }))} />
          <Toggle label="Sessions multiples"             desc="Autoriser plusieurs connexions simultanées" checked={security.multiSession} onChange={v => setSecurity(s => ({ ...s, multiSession: v }))} />
          <Toggle label="Audit des actions admin"        desc="Logger toutes les actions administrateur"   checked={security.audit}        onChange={v => setSecurity(s => ({ ...s, audit: v }))} />
          <div className="mt-4 pt-4 border-t border-slate-100">
            <label className="label">Durée de session (minutes)</label>
            <input type="number" defaultValue={60} min={15} max={480} className="input-field max-w-xs" />
          </div>
        </Section>
      </div>
    </AppShell>
  )
}
