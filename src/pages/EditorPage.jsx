// src/pages/EditorPage.jsx
import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Briefcase, GraduationCap, Zap, Globe, Plus, Trash2, ChevronDown, ChevronUp, Cloud, Download, Eye, Camera, CheckSquare } from 'lucide-react'
import { toast } from 'sonner'
import { AppShell } from '@/components/layout'
import { Button, Input, ProgressBar, Modal } from '@/components/ui'
import { TemplatePreview } from '@/components/cv/TemplatePreview'
import useCVStore from '@/store/cvStore'
import { MOCK_TEMPLATES } from '@/mocks'

const LANG_LEVELS = [
  { label: 'Natal',         pct: 100 },
  { label: 'Avancé',        pct: 80  },
  { label: 'Intermédiaire', pct: 55  },
  { label: 'Débutant',      pct: 25  },
]

const schema = yup.object({
  title: yup.string().required('Titre requis'),
  personalInfo: yup.object({
    firstName: yup.string().required('Prénom requis'),
    lastName:  yup.string().required('Nom requis'),
    jobTitle:  yup.string().required('Poste requis'),
    email:     yup.string().email('Email invalide').required(),
    phone:     yup.string().required('Téléphone requis'),
  }),
})

function Section({ icon: Icon, title, open, onToggle, children, count }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <button type="button" onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3 font-display font-semibold text-slate-800">
          <Icon size={18} className="text-brand-600" aria-hidden />
          {title}
          {!!count && <span className="text-xs bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded-full">{count}</span>}
        </span>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-5 pb-5 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function LivePreview({ data, templateId }) {
  const p = data.personalInfo || {}
  if (templateId !== 'modern-tech') {
    return (
      <div className="bg-white shadow-2xl rounded-xl overflow-hidden w-full aspect-[1/1.414]">
        <TemplatePreview id={templateId} />
      </div>
    )
  }
  return (
    <div className="bg-white shadow-2xl rounded-xl overflow-hidden w-full aspect-[1/1.414] flex text-[10px]">
      <div className="w-[36%] bg-brand-700 text-white p-3 flex flex-col gap-3 overflow-hidden">
        {p.photo ? (
          <img src={p.photo} alt="Photo" className="w-12 h-12 rounded-full object-cover mx-auto border-2 border-brand-300" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-brand-500 mx-auto flex items-center justify-center font-bold text-base">
            {p.firstName?.charAt(0) || '?'}
          </div>
        )}
        <div>
          <p className="text-[7px] font-bold uppercase tracking-widest text-brand-300 mb-0.5">Contact</p>
          <p className="text-brand-100 truncate">{p.email || '—'}</p>
          <p className="text-brand-100 mt-0.5">{p.phone || '—'}</p>
        </div>
        {data.skills?.length > 0 && (
          <div>
            <p className="text-[7px] font-bold uppercase tracking-widest text-brand-300 mb-1">Compétences</p>
            <div className="flex flex-wrap gap-0.5">
              {data.skills.slice(0, 5).map((s, i) => (
                <span key={i} className="bg-brand-600 text-brand-100 px-1 py-0.5 rounded text-[7px]">{s}</span>
              ))}
            </div>
          </div>
        )}
        {data.languages?.length > 0 && (
          <div>
            <p className="text-[7px] font-bold uppercase tracking-widest text-brand-300 mb-1">Langues</p>
            {data.languages.map((l, i) => (
              <div key={i} className="mb-1">
                <div className="flex justify-between text-[7px] mb-0.5">
                  <span className="font-semibold">{l.name}</span>
                  <span className="text-brand-300">{l.level}</span>
                </div>
                <div className="h-0.5 bg-brand-600 rounded-full">
                  <div className="h-full bg-brand-200 rounded-full" style={{ width: `${l.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 p-3 flex flex-col gap-2 overflow-hidden">
        <div>
          <h2 className="font-black text-slate-900 text-xs">{p.firstName || 'Prénom'} {p.lastName || 'Nom'}</h2>
          <p className="text-brand-600 font-semibold text-[9px]">{p.jobTitle || 'Poste souhaité'}</p>
        </div>
        {p.summary && <p className="text-slate-500 leading-relaxed line-clamp-2">{p.summary}</p>}
        {data.experiences?.length > 0 && (
          <div>
            <p className="text-[7px] font-bold uppercase tracking-widest text-brand-700 border-b border-slate-100 pb-0.5 mb-1">Expériences</p>
            {data.experiences.slice(0, 2).map((e, i) => (
              <div key={i} className="mb-1.5">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-800">{e.title}</span>
                  <span className="text-slate-400 text-[7px]">{e.startDate}{e.current ? ' – Présent' : e.endDate ? ` – ${e.endDate}` : ''}</span>
                </div>
                <p className="text-brand-600 text-[8px]">{e.company}</p>
              </div>
            ))}
          </div>
        )}
        {data.educations?.length > 0 && (
          <div>
            <p className="text-[7px] font-bold uppercase tracking-widest text-brand-700 border-b border-slate-100 pb-0.5 mb-1">Formation</p>
            {data.educations.map((e, i) => (
              <div key={i} className="flex justify-between mb-1">
                <div>
                  <span className="font-bold text-slate-800">{e.degree}</span>
                  <span className="text-slate-400 ml-1">{e.school}</span>
                </div>
                <span className="text-slate-400 text-[7px]">{e.year}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function EditorPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { fetchCV } = useCVStore()

  const [openSection,   setOpenSection]   = useState('personal')
  const [saving,        setSaving]        = useState(false)
  const [newSkill,      setNewSkill]      = useState('')
  const [showPreview,   setShowPreview]   = useState(false)
  const [templateModal, setTemplateModal] = useState(false)
  const photoInputRef = useRef(null)

  const defaultTemplate = searchParams.get('template') || 'modern-tech'

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: 'Mon nouveau CV',
      templateId: defaultTemplate,
      personalInfo: { firstName: '', lastName: '', jobTitle: '', email: '', phone: '', summary: '', photo: '' },
      experiences: [], educations: [], skills: [], languages: [],
    },
  })

  const { fields: expFields,  append: appendExp,  remove: removeExp  } = useFieldArray({ control, name: 'experiences' })
  const { fields: eduFields,  append: appendEdu,  remove: removeEdu  } = useFieldArray({ control, name: 'educations' })
  const { fields: langFields, append: appendLang, remove: removeLang } = useFieldArray({ control, name: 'languages' })

  const values = watch()
  const activeTemplate = values.templateId || defaultTemplate

  useEffect(() => { if (id && id !== 'new') fetchCV(id) }, [id])

  const toggle = (s) => setOpenSection(o => o === s ? '' : s)

  const addSkill = () => {
    if (!newSkill.trim()) return
    setValue('skills', [...(values.skills || []), newSkill.trim()])
    setNewSkill('')
  }
  const removeSkill = (i) => {
    const s = [...(values.skills || [])]; s.splice(i, 1); setValue('skills', s)
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('Photo trop lourde (max 2 Mo)'); return }
    const reader = new FileReader()
    reader.onload = ev => { setValue('personalInfo.photo', ev.target.result); toast.success('Photo ajoutée !') }
    reader.readAsDataURL(file)
  }

  const onSave = async (data) => {
    setSaving(true)
    try {
      const { cvApi } = await import('@/api')
      if (id && id !== 'new') await cvApi.update(id, data)
      else await cvApi.create({ ...data, templateId: activeTemplate })
      toast.success('CV sauvegardé !')
    } catch { toast.error('Erreur lors de la sauvegarde') }
    finally { setSaving(false) }
  }

  const completeness = (() => {
    let s = 0
    const p = values.personalInfo || {}
    if (p.firstName && p.lastName) s += 15; if (p.jobTitle) s += 10
    if (p.email && p.phone) s += 10; if (p.summary) s += 10; if (p.photo) s += 5
    if (values.experiences?.length) s += 20; if (values.educations?.length) s += 15
    if (values.skills?.length) s += 10; if (values.languages?.length) s += 5
    return s
  })()

  const photo = values.personalInfo?.photo

  return (
    <AppShell>
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <input {...register('title')}
            className="font-display font-bold text-slate-800 bg-transparent outline-none text-base focus:bg-slate-50 px-2 py-1 rounded-lg transition-colors truncate max-w-[200px]"
            aria-label="Titre du CV" />
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
            <Cloud size={12} />{saving ? 'Sauvegarde…' : 'Sauvegardé'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowPreview(!showPreview)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <Eye size={15} />{showPreview ? 'Formulaire' : 'Aperçu'}
          </button>
          <Button variant="secondary" size="sm" icon={<Eye size={15} />} className="hidden lg:inline-flex" onClick={() => setTemplateModal(true)}>
            Changer de modèle
          </Button>
          <Button size="sm" icon={<Download size={15} />} onClick={() => navigate(`/payment/${id || 'new'}`)}>
            Télécharger · 5 000 GNF
          </Button>
        </div>
      </header>

      {/* Progress */}
      <div className="px-6 py-2 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-3 max-w-6xl mx-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Complété {completeness}%</span>
          <ProgressBar value={completeness} color="bg-amber-500" />
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)] overflow-hidden">
        {/* Form */}
        <div className={`w-full lg:w-[45%] overflow-y-auto px-5 py-6 space-y-3 ${showPreview ? 'hidden' : 'block'} lg:block`}>
          <form onSubmit={handleSubmit(onSave)} className="space-y-3">

            {/* Personal */}
            <Section icon={User} title="Informations personnelles" open={openSection === 'personal'} onToggle={() => toggle('personal')}>
              <div className="flex items-center gap-4 mb-4 p-3 bg-slate-50 rounded-xl">
                <div className="relative flex-shrink-0">
                  {photo ? (
                    <img src={photo} alt="Photo de profil" className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400"><User size={24} /></div>
                  )}
                  <button type="button" onClick={() => photoInputRef.current?.click()}
                    className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center shadow hover:bg-brand-700 transition-colors"
                    aria-label="Changer la photo">
                    <Camera size={13} className="text-white" />
                  </button>
                  <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Photo de profil</p>
                  <p className="text-xs text-slate-400 mt-0.5">JPG, PNG – max 2 Mo</p>
                  {photo && <button type="button" className="text-xs text-red-500 hover:text-red-600 mt-1" onClick={() => setValue('personalInfo.photo', '')}>Supprimer</button>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Prénom" placeholder="Mamadou" error={errors.personalInfo?.firstName?.message} {...register('personalInfo.firstName')} />
                <Input label="Nom" placeholder="Diallo" error={errors.personalInfo?.lastName?.message} {...register('personalInfo.lastName')} />
                <div className="col-span-2"><Input label="Poste souhaité" placeholder="Développeur Fullstack" error={errors.personalInfo?.jobTitle?.message} {...register('personalInfo.jobTitle')} /></div>
                <Input label="Email" type="email" placeholder="mamadou@email.gn" {...register('personalInfo.email')} />
                <Input label="Téléphone" type="tel" placeholder="+224 620 00 00 00" {...register('personalInfo.phone')} />
                <div className="col-span-2">
                  <label className="label" htmlFor="summary">Résumé professionnel</label>
                  <textarea id="summary" rows={3} placeholder="Développeur passionné avec 3 ans d'expérience…" className="input-field resize-none" {...register('personalInfo.summary')} />
                </div>
              </div>
            </Section>

            {/* Experiences */}
            <Section icon={Briefcase} title="Expériences professionnelles" open={openSection === 'exp'} onToggle={() => toggle('exp')} count={expFields.length}>
              <div className="space-y-4">
                {expFields.map((field, i) => (
                  <motion.div key={field.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Expérience {i + 1}</span>
                      <button type="button" onClick={() => removeExp(i)} aria-label="Supprimer" className="p-1 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input label="Titre du poste" placeholder="Développeur Junior" {...register(`experiences.${i}.title`)} />
                      <Input label="Entreprise" placeholder="Star-Tech Guinea" {...register(`experiences.${i}.company`)} />
                      <Input label="Date début" placeholder="Jan 2022" {...register(`experiences.${i}.startDate`)} />
                      <Input label="Date fin" placeholder="Déc 2023" {...register(`experiences.${i}.endDate`)} />
                    </div>
                    <div className="flex items-center gap-2">
                      <input id={`cur-${i}`} type="checkbox" className="w-4 h-4 accent-brand-600" {...register(`experiences.${i}.current`)} />
                      <label htmlFor={`cur-${i}`} className="text-xs text-slate-600 font-medium cursor-pointer">Poste actuel</label>
                    </div>
                    <div>
                      <label className="label">Description</label>
                      <textarea rows={2} placeholder="Développement d'interfaces React…" className="input-field resize-none" {...register(`experiences.${i}.description`)} />
                    </div>
                  </motion.div>
                ))}
                <Button type="button" variant="secondary" size="sm" icon={<Plus size={14} />} className="w-full"
                  onClick={() => appendExp({ id: Date.now().toString(), title: '', company: '', startDate: '', endDate: '', current: false, description: '' })}>
                  Ajouter une expérience
                </Button>
              </div>
            </Section>

            {/* Education */}
            <Section icon={GraduationCap} title="Formation" open={openSection === 'edu'} onToggle={() => toggle('edu')} count={eduFields.length}>
              <div className="space-y-4">
                {eduFields.map((field, i) => (
                  <motion.div key={field.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Formation {i + 1}</span>
                      <button type="button" onClick={() => removeEdu(i)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="col-span-2"><Input label="Diplôme" placeholder="Licence en Informatique" {...register(`educations.${i}.degree`)} /></div>
                      <Input label="École / Université" placeholder="UGAN – Conakry" {...register(`educations.${i}.school`)} />
                      <Input label="Année" placeholder="2021" {...register(`educations.${i}.year`)} />
                    </div>
                  </motion.div>
                ))}
                <Button type="button" variant="secondary" size="sm" icon={<Plus size={14} />} className="w-full"
                  onClick={() => appendEdu({ id: Date.now().toString(), degree: '', school: '', year: '' })}>
                  Ajouter une formation
                </Button>
              </div>
            </Section>

            {/* Skills */}
            <Section icon={Zap} title="Compétences" open={openSection === 'skills'} onToggle={() => toggle('skills')} count={(values.skills || []).length}>
              <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
                <AnimatePresence>
                  {(values.skills || []).map((s, i) => (
                    <motion.span key={`${s}-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 rounded-full text-xs font-semibold border border-brand-100">
                      {s}
                      <button type="button" onClick={() => removeSkill(i)} aria-label={`Supprimer ${s}`} className="hover:text-red-500 transition-colors"><Trash2 size={11} /></button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
              <div className="flex gap-2">
                <input value={newSkill} onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
                  placeholder="Ex: React.js, Gestion de projet…" className="input-field flex-1" aria-label="Nouvelle compétence" />
                <Button type="button" size="sm" icon={<Plus size={14} />} onClick={addSkill}>Ajouter</Button>
              </div>
            </Section>

            {/* Languages */}
            <Section icon={Globe} title="Langues" open={openSection === 'languages'} onToggle={() => toggle('languages')} count={langFields.length}>
              <div className="space-y-3">
                {langFields.map((field, i) => (
                  <motion.div key={field.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-end gap-2 mb-2">
                      <div className="flex-1"><Input placeholder="Français" {...register(`languages.${i}.name`)} /></div>
                      <div className="w-36">
                        <Controller control={control} name={`languages.${i}.level`}
                          render={({ field: f }) => (
                            <select {...f} className="input-field py-2.5 text-sm"
                              onChange={e => { f.onChange(e); const lvl = LANG_LEVELS.find(l => l.label === e.target.value); if (lvl) setValue(`languages.${i}.percent`, lvl.pct) }}>
                              {LANG_LEVELS.map(l => <option key={l.label} value={l.label}>{l.label}</option>)}
                            </select>
                          )} />
                      </div>
                      <button type="button" onClick={() => removeLang(i)} className="p-2 mb-0.5 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                    <ProgressBar value={values.languages?.[i]?.percent ?? 80} />
                  </motion.div>
                ))}
                <Button type="button" variant="secondary" size="sm" icon={<Plus size={14} />} className="w-full"
                  onClick={() => appendLang({ id: Date.now().toString(), name: '', level: 'Avancé', percent: 80 })}>
                  Ajouter une langue
                </Button>
              </div>
            </Section>

            <Button type="submit" loading={saving} className="w-full py-3.5">Sauvegarder le CV</Button>
          </form>
        </div>

        {/* Preview */}
        <div className={`flex-1 bg-slate-200/50 overflow-y-auto p-8 items-start justify-center ${showPreview ? 'flex' : 'hidden'} lg:flex`}>
          <div className="w-full max-w-md sticky top-4">
            <LivePreview data={values} templateId={activeTemplate} />
          </div>
        </div>
      </div>

      {/* Template modal */}
      <Modal open={templateModal} onClose={() => setTemplateModal(false)} title="Changer de modèle" maxWidth="max-w-lg">
        <div className="p-5 grid grid-cols-2 gap-4">
          {MOCK_TEMPLATES.map(({ id: tid, name }) => (
            <button key={tid} type="button"
              onClick={() => { setValue('templateId', tid); setTemplateModal(false); toast.success('Modèle mis à jour !') }}
              className={`rounded-xl overflow-hidden border-2 transition-all text-left ${activeTemplate === tid ? 'border-brand-600 shadow-md' : 'border-slate-200 hover:border-brand-300'}`}>
              <div className="aspect-[3/4] bg-slate-100 overflow-hidden"><TemplatePreview id={tid} /></div>
              <div className="p-2 bg-white flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">{name}</span>
                {activeTemplate === tid && <CheckSquare size={13} className="text-brand-600" />}
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </AppShell>
  )
}
