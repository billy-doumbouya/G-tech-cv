// src/store/cvStore.js
import { create } from 'zustand'
import { cvApi } from '@/api'

const useCVStore = create((set, get) => ({
  cvs:      [],
  activeCV: null,
  loading:  false,
  saving:   false,
  error:    null,

  // ── Charger tous les CVs de l'utilisateur ─────────────
  fetchCVs: async () => {
    set({ loading: true, error: null })
    try {
      const cvs = await cvApi.list()
      set({ cvs, loading: false })
    } catch (err) {
      set({ loading: false, error: err.message })
    }
  },

  // ── Charger un CV par ID ──────────────────────────────
  fetchCV: async (id) => {
    set({ loading: true, error: null })
    try {
      const cv = await cvApi.get(id)
      set({ activeCV: cv, loading: false })
      return cv
    } catch (err) {
      set({ loading: false, error: err.message })
    }
  },

  // ── Créer un CV ───────────────────────────────────────
  createCV: async (data) => {
    set({ saving: true })
    try {
      const cv = await cvApi.create(data)
      set(s => ({ cvs: [cv, ...s.cvs], activeCV: cv, saving: false }))
      return cv
    } catch (err) {
      set({ saving: false, error: err.message })
      throw err
    }
  },

  // ── Mettre à jour un CV ───────────────────────────────
  updateCV: async (id, data) => {
    set({ saving: true })
    try {
      const updated = await cvApi.update(id, data)
      set(s => ({
        saving:  false,
        activeCV: updated,
        cvs: s.cvs.map(c => c._id === id ? updated : c),
      }))
      return updated
    } catch (err) {
      set({ saving: false, error: err.message })
      throw err
    }
  },

  // ── Supprimer un CV ───────────────────────────────────
  deleteCV: async (id) => {
    try {
      await cvApi.delete(id)
      set(s => ({
        cvs:      s.cvs.filter(c => c._id !== id),
        activeCV: s.activeCV?._id === id ? null : s.activeCV,
      }))
    } catch (err) {
      set({ error: err.message })
      throw err
    }
  },

  // ── Modifier le CV actif localement (sans sauvegarder) ─
  patchActiveCV: (patch) =>
    set(s => ({ activeCV: s.activeCV ? { ...s.activeCV, ...patch } : null })),

  // ── Setters ───────────────────────────────────────────
  setActiveCV: (cv) => set({ activeCV: cv }),
  clearError:  ()  => set({ error: null }),
}))

export default useCVStore
