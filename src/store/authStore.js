// src/store/authStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '@/api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user:    null,
      loading: false,
      error:   null,

      // ── Login ─────────────────────────────────────────
      // Pas de token à stocker — le serveur gère la session via cookie httpOnly
      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const data = await authApi.login(email, password)
          set({ user: data.user, loading: false })
          return data.user
        } catch (err) {
          const msg = err.response?.data?.message || 'Identifiants incorrects'
          set({ loading: false, error: msg })
          throw new Error(msg)
        }
      },

      // ── Register ──────────────────────────────────────
      register: async (formData) => {
        set({ loading: true, error: null })
        try {
          const data = await authApi.register(formData)
          set({ user: data.user, loading: false })
          return data.user
        } catch (err) {
          const msg = err.response?.data?.message || "Erreur lors de l'inscription"
          set({ loading: false, error: msg })
          throw new Error(msg)
        }
      },

      // ── Logout ────────────────────────────────────────
      // Appelle le backend pour détruire la session MongoDB
      logout: async () => {
        try {
          await authApi.logout()
        } catch (_) {
          // Même si le serveur échoue, on nettoie le store local
        }
        set({ user: null, error: null })
      },

      // ── Vérifier la session au démarrage ──────────────
      // Appeler au mount de l'app pour savoir si la session est toujours valide
      checkSession: async () => {
        set({ loading: true })
        try {
          const data = await authApi.me()
          set({ user: data.user, loading: false })
        } catch (_) {
          set({ user: null, loading: false })
        }
      },

      // ── Helpers ───────────────────────────────────────
      isAuthenticated: () => !!get().user,
      isAdmin:         () => get().user?.role === 'admin',
      clearError:      () => set({ error: null }),
      updateUser:      (patch) => set(s => ({ user: { ...s.user, ...patch } })),
    }),
    {
      name: 'gtech-auth',
      // On ne persiste que l'objet user (pas de token à stocker)
      partialize: (s) => ({ user: s.user }),
    }
  )
)

export default useAuthStore
