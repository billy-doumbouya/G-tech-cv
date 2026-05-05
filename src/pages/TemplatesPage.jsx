// src/pages/TemplatesPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Info } from 'lucide-react'
import { toast } from 'sonner'
import { AppShell } from '@/components/layout'
import { Button } from '@/components/ui'
import { TemplatePreview } from '@/components/cv/TemplatePreview'
import { MOCK_TEMPLATES } from '@/mocks'
import { cn } from '@/lib/utils'

export default function TemplatesPage() {
  const [selected, setSelected] = useState('modern-tech')
  const navigate = useNavigate()

  const handleApply = () => {
    const tpl = MOCK_TEMPLATES.find(t => t.id === selected)
    toast.success(`Modèle "${tpl?.name}" sélectionné !`)
    navigate(`/editor/new?template=${selected}`)
  }

  return (
    <AppShell>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 h-20 flex items-center">
        <div>
          <h1 className="font-display font-bold text-xl text-slate-900">Choisissez votre modèle</h1>
          <p className="text-sm text-slate-500">Conçus par des experts en recrutement</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {MOCK_TEMPLATES.map((tpl, i) => (
            <motion.div key={tpl.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              onClick={() => setSelected(tpl.id)}
              className={cn(
                'relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200',
                selected === tpl.id
                  ? 'border-brand-600 shadow-lg shadow-brand-600/20 scale-[1.02]'
                  : 'border-slate-200 hover:border-slate-300 hover:-translate-y-1 hover:shadow-md'
              )}
            >
              <div className={cn('aspect-[3/4] overflow-hidden', tpl.bg)}>
                <TemplatePreview id={tpl.id} />
              </div>
              {selected === tpl.id && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center shadow-md"
                >
                  <Check size={14} className="text-white" />
                </motion.div>
              )}
              {tpl.popular && (
                <div className="absolute top-3 left-3 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Populaire</div>
              )}
              <div className="p-4 bg-white border-t border-slate-100">
                <h3 className="font-display font-bold text-sm text-slate-800">{tpl.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{tpl.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sticky CTA */}
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-100 p-4 z-30">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="hidden md:flex items-center gap-2 text-slate-500 text-sm">
              <Info size={15} />
              Vous pourrez changer de modèle à tout moment.
            </div>
            <Button onClick={handleApply} size="lg" icon={<ArrowRight size={18} />} className="ml-auto">
              Appliquer ce modèle
            </Button>
          </div>
        </div>
        <div className="h-20" />
      </div>
    </AppShell>
  )
}
