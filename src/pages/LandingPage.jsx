// src/pages/LandingPage.jsx
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight, Smartphone, Banknote, CheckCircle, Star,
  Download, Eye, Palette, Zap, Shield, Clock, ChevronRight,
  FileText,
} from 'lucide-react'
import { PublicNav } from '@/components/layout'
import { TemplatePreview } from '@/components/cv/TemplatePreview'
import { MOCK_TESTIMONIALS, MOCK_TEMPLATES } from '@/mocks'

// ── Animation variants ────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 32 },
  whileInView:{ opacity: 1, y: 0  },
  viewport:   { once: true },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
})

const stagger = {
  initial:    {},
  whileInView:{ transition: { staggerChildren: 0.1 } },
  viewport:   { once: true },
}
const staggerItem = {
  initial:    { opacity: 0, y: 24 },
  whileInView:{ opacity: 1, y: 0  },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
}

// ── Floating CV mockup ────────────────────────────────────
function FloatingCVMock() {
  return (
    <motion.div
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className="relative w-full max-w-[280px] mx-auto"
    >
      {/* Shadow */}
      <motion.div
        animate={{ scaleX: [1, 0.9, 1], opacity: [0.3, 0.15, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-brand-900/20 blur-xl rounded-full"
      />

      {/* CV Card */}
      <div className="bg-white rounded-3xl shadow-2xl shadow-brand-900/20 overflow-hidden border border-white/50">
        {/* Top bar */}
        <div className="bg-brand-600 px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white font-bold text-sm">MD</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm">Mamadou Diallo</p>
            <p className="text-brand-200 text-xs">Développeur Fullstack</p>
          </div>
          <div className="ml-auto">
            <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">Pro</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="flex gap-2 flex-wrap">
            {['React', 'Node.js', 'Figma'].map(s => (
              <span key={s} className="bg-brand-50 text-brand-700 text-[10px] font-bold px-2.5 py-1 rounded-full">{s}</span>
            ))}
          </div>
          <div className="space-y-2">
            {[90, 70, 85].map((w, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-brand-400 rounded-full flex-shrink-0" />
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${w}%` }}
                    transition={{ delay: 0.5 + i * 0.2, duration: 0.8 }}
                    className="h-full bg-brand-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
            <span className="text-xs text-slate-400">Conakry, Guinée</span>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={10} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
          </div>
        </div>

        {/* Download button */}
        <div className="px-5 pb-5">
          <div className="w-full bg-brand-600 rounded-xl py-2.5 flex items-center justify-center gap-2">
            <Download size={14} className="text-white" />
            <span className="text-white text-xs font-bold">Télécharger PDF</span>
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <motion.div
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute -left-6 top-12 bg-white rounded-2xl shadow-xl px-3 py-2 flex items-center gap-2 border border-slate-100"
      >
        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
          <CheckCircle size={12} className="text-white" />
        </div>
        <div>
          <p className="text-[9px] font-bold text-slate-800">Paiement validé</p>
          <p className="text-[8px] text-slate-400">Orange Money</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="absolute -right-4 bottom-20 bg-white rounded-2xl shadow-xl px-3 py-2 border border-slate-100"
      >
        <p className="text-[9px] font-bold text-slate-800">🎉 CV téléchargé</p>
        <p className="text-[8px] text-slate-400">Il y a 2 minutes</p>
      </motion.div>
    </motion.div>
  )
}

// ── Stats row ─────────────────────────────────────────────
const STATS = [
  { value: '12 000+', label: 'CV créés',       icon: FileText },
  { value: '4.9/5',   label: 'Note moyenne',   icon: Star     },
  { value: '5 min',   label: 'Pour créer',     icon: Clock    },
  { value: '100%',    label: 'Sécurisé',       icon: Shield   },
]

// ── Features ──────────────────────────────────────────────
const FEATURES = [
  {
    icon: Palette,
    title: 'Modèles validés par des RH',
    desc: 'Nos 4 templates ont été testés auprès de recruteurs guinéens et internationaux pour maximiser vos chances.',
    color: 'from-brand-500 to-brand-600',
  },
  {
    icon: Eye,
    title: 'Prévisualisation en direct',
    desc: 'Chaque modification se reflète instantanément. Vous savez exactement à quoi ressemblera votre CV imprimé.',
    color: 'from-violet-500 to-violet-600',
  },
  {
    icon: Banknote,
    title: 'Paiement Mobile Money',
    desc: 'Orange Money ou MTN MoMo. Payez en quelques secondes, téléchargez immédiatement. Pas de carte bancaire.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Zap,
    title: 'Prêt en 5 minutes',
    desc: 'Interface guidée, remplissage rapide, suggestions intelligentes. Votre CV est prêt avant la fin de votre café.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Shield,
    title: 'Données sécurisées',
    desc: 'Vos informations personnelles sont chiffrées et jamais partagées. Vous pouvez supprimer votre compte à tout moment.',
    color: 'from-slate-600 to-slate-700',
  },
  {
    icon: Download,
    title: 'PDF prêt à envoyer',
    desc: 'Format A4 professionnel, polices incorporées, mise en page parfaite. Lisible sur tous les appareils des recruteurs.',
    color: 'from-pink-500 to-rose-500',
  },
]

// ── Pricing ───────────────────────────────────────────────
const PRICING_ITEMS = [
  'Accès illimité à tous les modèles',
  'Modifications gratuites et illimitées',
  'Stockage sécurisé dans le cloud',
  'Support client WhatsApp (30 min)',
  'Téléchargement PDF haute qualité',
]

// ── How it works ──────────────────────────────────────────
const STEPS = [
  { step: '01', title: 'Choisissez un modèle',      desc: 'Parcourez nos 4 templates professionnels et sélectionnez celui qui vous correspond.' },
  { step: '02', title: 'Remplissez vos infos',       desc: 'Expériences, formations, compétences, langues. Notre interface guidée rend tout simple.' },
  { step: '03', title: 'Payez avec Mobile Money',    desc: 'Orange Money ou MTN — entrez votre numéro, confirmez sur votre téléphone. C\'est tout.' },
  { step: '04', title: 'Téléchargez votre PDF',      desc: 'Votre CV professionnel est prêt. Envoyez-le par email ou imprimez-le pour votre entretien.' },
]

// ── Main component ────────────────────────────────────────
export default function LandingPage() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const heroY       = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

  return (
    <div className="min-h-screen overflow-x-hidden">
      <PublicNav />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-brand-950 to-slate-900">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
          {/* Grid */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — Text */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
              Nº 1 en Guinée — Plus de 12 000 CV créés
            </motion.div>

            <motion.h1 {...fadeUp(0.1)}
              className="font-display font-black text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.05] mb-6"
            >
              Votre CV{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-violet-400">
                  professionnel
                </span>
                {/* Underline decoration */}
                <motion.svg
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none"
                >
                  <motion.path
                    d="M2 8 Q75 2 150 8 Q225 14 298 8"
                    stroke="url(#grad)" strokeWidth="3" strokeLinecap="round" fill="none"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%"   stopColor="#607aff" />
                      <stop offset="100%" stopColor="#a78bfa" />
                    </linearGradient>
                  </defs>
                </motion.svg>
              </span>
              {' '}en{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                5 minutes
              </span>
            </motion.h1>

            <motion.p {...fadeUp(0.2)} className="text-slate-300 text-xl leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
              Créez, personnalisez et téléchargez votre CV en PDF. Payez avec <strong className="text-orange-400">Orange Money</strong> ou <strong className="text-yellow-400">MTN MoMo</strong>. Sans carte bancaire.
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="btn-amber btn-xl flex items-center gap-3 shadow-2xl shadow-amber-500/30"
                >
                  Créer mon CV — Gratuit
                  <ArrowRight size={20} />
                </motion.button>
              </Link>
              <Link to="/templates">
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="btn-outline btn-xl border-white/20 text-white hover:bg-white/10"
                >
                  Voir les modèles
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust row */}
            <motion.div {...fadeUp(0.4)} className="flex items-center justify-center lg:justify-start gap-6 text-slate-400">
              <span className="flex items-center gap-2 text-sm">
                <Smartphone size={16} className="text-orange-400" />
                <span>Orange Money</span>
              </span>
              <span className="w-1 h-1 bg-slate-600 rounded-full" />
              <span className="flex items-center gap-2 text-sm">
                <Banknote size={16} className="text-yellow-400" />
                <span>MTN MoMo</span>
              </span>
              <span className="w-1 h-1 bg-slate-600 rounded-full" />
              <span className="flex items-center gap-2 text-sm">
                <Shield size={16} className="text-emerald-400" />
                <span>100% sécurisé</span>
              </span>
            </motion.div>
          </div>

          {/* Right — Floating mockup */}
          <motion.div {...fadeUp(0.3)} className="relative flex justify-center lg:justify-end">
            <FloatingCVMock />
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400"
        >
          <span className="text-xs font-medium uppercase tracking-widest">Découvrir</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronRight size={20} className="rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            variants={stagger} initial="initial" whileInView="whileInView" viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {STATS.map(({ value, label, icon: Icon }) => (
              <motion.div key={label} variants={staggerItem} className="text-center">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon size={18} className="text-brand-600" />
                </div>
                <p className="font-display font-black text-3xl text-slate-900 mb-1">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className="py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand-700 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
              Pourquoi G-Tech CV
            </span>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-slate-900 mb-4">
              Tout ce qu'il vous faut pour{' '}
              <span className="text-brand-600">décrocher le poste</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Conçu spécifiquement pour le marché de l'emploi guinéen, G-Tech CV vous donne tous les outils pour vous démarquer.
            </p>
          </motion.div>

          <motion.div
            variants={stagger} initial="initial" whileInView="whileInView" viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <motion.div
                key={title} variants={staggerItem}
                className="group bg-white rounded-2xl p-7 border border-slate-100 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-100/40 transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-800 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section className="py-28 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
              Comment ça marche
            </span>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-slate-900">
              4 étapes, 5 minutes
            </h2>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] h-0.5 bg-gradient-to-r from-brand-200 via-violet-200 to-amber-200" />

            <motion.div
              variants={stagger} initial="initial" whileInView="whileInView" viewport={{ once: true }}
              className="grid md:grid-cols-4 gap-8"
            >
              {STEPS.map(({ step, title, desc }, i) => (
                <motion.div key={step} variants={staggerItem} className="text-center">
                  <div className="relative inline-flex w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 items-center justify-center mb-5 shadow-lg shadow-brand-600/30 mx-auto">
                    <span className="font-display font-black text-2xl text-white">{step}</span>
                  </div>
                  <h3 className="font-display font-bold text-base text-slate-800 mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div {...fadeUp(0.3)} className="text-center mt-14">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="btn-primary btn-xl"
              >
                Commencer maintenant — C'est gratuit
                <ArrowRight size={20} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── TEMPLATES PREVIEW ─────────────────────────────── */}
      <section className="py-28 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-violet-100 text-violet-700 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
              Nos modèles
            </span>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-slate-900 mb-4">
              Choisissez votre style
            </h2>
            <p className="text-slate-500 text-lg">4 designs professionnels, 1 objectif : vous décrocher le poste.</p>
          </motion.div>

          <motion.div
            variants={stagger} initial="initial" whileInView="whileInView" viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {MOCK_TEMPLATES.map(({ id, name, desc, bg, popular }) => (
              <motion.div
                key={id} variants={staggerItem}
                whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300 } }}
                className="group cursor-pointer"
              >
                <Link to={`/templates`}>
                  <div className={`${bg} rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-brand-400 transition-all duration-200 shadow-md group-hover:shadow-xl group-hover:shadow-brand-200/50 relative`}>
                    {popular && (
                      <div className="absolute top-2 left-2 z-10 bg-brand-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Populaire</div>
                    )}
                    <div className="aspect-[3/4] overflow-hidden">
                      <TemplatePreview id={id} />
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="font-display font-bold text-sm text-slate-800">{name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center">
            <Link to="/templates" className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700 transition-colors">
              Voir et tester tous les modèles <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
              Témoignages
            </span>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-slate-900">
              Ils ont trouvé leur emploi
            </h2>
          </motion.div>

          <motion.div
            variants={stagger} initial="initial" whileInView="whileInView" viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {MOCK_TESTIMONIALS.map(({ id, name, role, text, avatar, stars }) => (
              <motion.div
                key={id} variants={staggerItem}
                className="bg-slate-50 rounded-3xl p-7 border border-slate-100 hover:bg-white hover:shadow-lg hover:shadow-slate-200/60 transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm">
                    {avatar}
                  </div>
                  <div>
                    <p className="font-display font-bold text-sm text-slate-800">{name}</p>
                    <p className="text-xs text-slate-400">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────── */}
      <section id="pricing" className="py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand-700 text-xs font-bold rounded-full uppercase tracking-wider mb-4">
              Tarif
            </span>
            <h2 className="font-display font-black text-4xl lg:text-5xl text-slate-900 mb-4">
              Simple, honnête, local
            </h2>
            <p className="text-slate-500 text-lg">Pas d'abonnement. Pas de surprise. Vous payez uniquement quand vous téléchargez.</p>
          </motion.div>

          <motion.div {...fadeUp(0.1)}>
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-1.5 shadow-2xl shadow-brand-600/30">
              <div className="bg-white rounded-[calc(1.5rem-6px)] p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2 flex items-center justify-center md:justify-start gap-2">
                      <Banknote size={14} />
                      Paiement Mobile Money
                    </p>
                    <div className="flex items-baseline gap-2 justify-center md:justify-start">
                      <span className="font-display font-black text-6xl text-slate-900">5 000</span>
                      <span className="text-slate-500 text-xl">GNF</span>
                    </div>
                    <p className="text-slate-400 text-sm mt-1">par téléchargement PDF</p>
                  </div>

                  <div className="flex-1 w-full">
                    <ul className="space-y-3">
                      {PRICING_ITEMS.map(item => (
                        <li key={item} className="flex items-center gap-3 text-sm text-slate-700">
                          <CheckCircle size={16} className="text-brand-600 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link to="/register" className="flex-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="btn-primary btn-lg w-full justify-center"
                    >
                      Commencer gratuitement
                      <ArrowRight size={18} />
                    </motion.button>
                  </Link>
                  <Link to="/templates">
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="btn-secondary btn-lg"
                    >
                      Voir les modèles
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────── */}
      <section className="py-28 bg-gradient-to-br from-slate-950 via-brand-950 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.03]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white"/>
              </pattern></defs>
              <rect width="100%" height="100%" fill="url(#dots)"/>
            </svg>
          </div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div {...fadeUp()}>
            <p className="text-brand-400 font-bold text-sm uppercase tracking-widest mb-6">Prêt à vous lancer ?</p>
            <h2 className="font-display font-black text-4xl lg:text-6xl text-white mb-6 leading-tight">
              Votre prochain emploi{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-violet-400">
                commence ici
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-10">
              Rejoignez plus de 12 000 professionnels guinéens qui ont fait confiance à G-Tech CV.
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 20px 60px rgba(245,158,11,0.4)' }}
                whileTap={{ scale: 0.97 }}
                className="btn-amber btn-xl inline-flex"
              >
                Créer mon CV gratuitement
                <ArrowRight size={22} />
              </motion.button>
            </Link>
            <p className="text-slate-500 text-sm mt-4">Gratuit à créer · 5 000 GNF seulement pour télécharger</p>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10 mb-10">
          <div>
            <Link to="/" className="font-display font-black text-xl text-white block mb-3">G‑Tech CV</Link>
            <p className="text-sm leading-relaxed text-slate-500">
              La plateforme leader en Guinée pour créer des CV professionnels qui font la différence.
            </p>
          </div>
          {[
            ['Produit',        [['Modèles',     '/templates'], ['Tarifs', '/#pricing'], ['Exemples', '/templates']]],
            ['Aide',           [['FAQ',         '/help'],      ['WhatsApp', 'https://wa.me/22462000000'], ['Contact', '/help']]],
            ['Légal',          [["Conditions",  '#'],          ['Confidentialité', '#'], ['Mentions légales', '#']]],
          ].map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-semibold text-white text-sm mb-4">{heading}</h4>
              <ul className="space-y-3">
                {links.map(([l, h]) => (
                  <li key={l}><a href={h} className="text-sm hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">© 2024 G-Tech CV. Tous droits réservés.</p>
          <p className="text-sm text-slate-600">Made with ❤️ en Guinée</p>
        </div>
      </footer>
    </div>
  )
}
