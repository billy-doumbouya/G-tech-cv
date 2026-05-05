// src/pages/HelpPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Mail, Phone, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { PublicNav } from '@/components/layout'
import { useDebounce } from '@/hooks'

const FAQS = [
  { q: 'Comment créer un CV sur G-Tech CV ?',            a: 'Inscrivez-vous gratuitement, choisissez un modèle, remplissez vos informations. Votre CV se met à jour en temps réel. Téléchargez en PDF après paiement.' },
  { q: 'Comment payer avec Orange Money ou MTN ?',        a: "Cliquez sur « Télécharger », entrez votre numéro de mobile money et confirmez sur votre téléphone. Le téléchargement démarre automatiquement après validation." },
  { q: 'Puis-je modifier mon CV après téléchargement ?',  a: "Oui, les modifications sont toujours gratuites. Vous ne payez que lorsque vous souhaitez télécharger une nouvelle version en PDF." },
  { q: 'Mes données sont-elles sécurisées ?',             a: "Toutes vos données sont chiffrées et jamais partagées. Vous pouvez supprimer votre compte à tout moment depuis les paramètres." },
  { q: 'Combien de CV puis-je créer ?',                   a: "Autant que vous voulez ! La création et l'édition sont illimitées et gratuites. Chaque téléchargement PDF coûte 5 000 GNF." },
  { q: "Que faire si le paiement ne passe pas ?",         a: "Vérifiez que votre numéro est correct et que vous avez un solde suffisant. Contactez notre support WhatsApp si le problème persiste." },
  { q: 'Puis-je changer de modèle en cours de rédaction ?',a: "Oui, le bouton « Changer de modèle » dans l'éditeur vous permet de changer à tout moment sans perdre vos données." },
]

const CONTACTS = [
  { icon: MessageCircle, label: 'WhatsApp',  value: '+224 620 00 00 00', desc: 'Réponse en moins de 30 min', href: 'https://wa.me/22462000000',        color: 'bg-emerald-50 text-emerald-600' },
  { icon: Mail,          label: 'Email',      value: 'support@gtech-cv.gn', desc: 'Réponse sous 24h',         href: 'mailto:support@gtech-cv.gn',     color: 'bg-brand-50 text-brand-600'    },
  { icon: Phone,         label: 'Téléphone', value: '+224 620 00 00 00', desc: 'Lun–Ven, 8h–18h',            href: 'tel:+22462000000',                color: 'bg-amber-50 text-amber-600'    },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} aria-expanded={open}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors">
        <span className="font-display font-semibold text-slate-800 text-sm pr-4">{q}</span>
        {open ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="overflow-hidden">
            <p className="px-5 pb-4 text-sm text-slate-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function HelpPage() {
  const [search, setSearch] = useState('')
  const q = useDebounce(search, 200)
  const filtered = FAQS.filter(f =>
    f.q.toLowerCase().includes(q.toLowerCase()) ||
    f.a.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-600 to-brand-800 py-16 px-6 text-center">
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="font-display font-black text-3xl text-white mb-3">
          Comment pouvons-nous vous aider ?
        </motion.h1>
        <p className="text-brand-200 mb-8">Trouvez des réponses à vos questions</p>
        <div className="relative max-w-xl mx-auto">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher dans la FAQ…"
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-800 outline-none shadow-xl text-sm font-medium" />
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-16">
        {/* FAQ */}
        <section>
          <h2 className="font-display font-bold text-2xl text-slate-900 mb-6">Questions fréquentes</h2>
          <div className="space-y-3">
            {filtered.length > 0
              ? filtered.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)
              : <p className="text-center text-slate-400 py-8">Aucun résultat pour « {search} »</p>
            }
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="font-display font-bold text-2xl text-slate-900 mb-6">Contactez-nous</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {CONTACTS.map(({ icon: Icon, label, value, desc, href, color }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex flex-col gap-3">
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-display font-bold text-slate-800 text-sm">{label}</p>
                  <p className="text-brand-600 font-medium text-xs mt-0.5">{value}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>

      <footer className="border-t border-slate-100 py-8 text-center text-slate-400 text-sm">
        <Link to="/" className="font-display font-black text-brand-600">G‑Tech CV</Link>
        <span className="mx-2">·</span>© 2024 Tous droits réservés
      </footer>
    </div>
  )
}
