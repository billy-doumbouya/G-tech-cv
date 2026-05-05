// ─────────────────────────────────────────────────────────────────────────────
// src/api/index.js
// Couche API prête à brancher au backend Express + MongoDB sessions.
// Chaque méthode appelle le vrai endpoint en production.
// En développement (ou si le serveur est absent), on retombe sur les mocks.
//
// Auth : pas de JWT — le backend utilise express-session + connect-mongo.
// Le cookie de session (httpOnly) est géré automatiquement par le navigateur.
// ─────────────────────────────────────────────────────────────────────────────

import axios from 'axios'
import {
  MOCK_SESSION, MOCK_CVS, MOCK_PAYMENTS, MOCK_STATS, MOCK_USERS,
} from '@/mocks'

// ── Instance Axios ────────────────────────────────────────
const http = axios.create({
  baseURL:        import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,    // ← obligatoire pour envoyer le cookie de session
  timeout:         10_000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Intercepteur réponse ──────────────────────────────────
http.interceptors.response.use(
  res => res,
  err => {
    // Session expirée ou non authentifié → rediriger vers /login
    if (err.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Helper : essaie le vrai API, retombe sur le mock ─────
async function call(apiFn, fallback) {
  try {
    const res = await apiFn()
    return res.data
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn('[API mock]', err.config?.url || '', '→ données fictives')
    }
    // Simule la latence réseau
    await new Promise(r => setTimeout(r, 300))
    return typeof fallback === 'function' ? fallback() : fallback
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH — sessions MongoDB (express-session + connect-mongo)
// ─────────────────────────────────────────────────────────────────────────────
export const authApi = {
  /**
   * POST /auth/login
   * Body : { email, password }
   * Réponse : { user: {...}, isAuthenticated: true }
   * Le serveur crée la session et pose le cookie.
   */
  login: (email, password) =>
    call(
      () => http.post('/auth/login', { email, password }),
      MOCK_SESSION
    ),

  /**
   * POST /auth/register
   * Body : { name, email, password, phone? }
   * Réponse : { user: {...}, isAuthenticated: true }
   */
  register: (data) =>
    call(
      () => http.post('/auth/register', data),
      MOCK_SESSION
    ),

  /**
   * POST /auth/logout
   * Détruit la session côté serveur + invalide le cookie.
   */
  logout: () =>
    call(
      () => http.post('/auth/logout'),
      { success: true }
    ),

  /**
   * GET /auth/me
   * Retourne l'utilisateur de la session courante ou 401.
   */
  me: () =>
    call(
      () => http.get('/auth/me'),
      MOCK_SESSION
    ),

  /**
   * POST /auth/forgot-password
   * Body : { email }
   */
  forgotPassword: (email) =>
    call(
      () => http.post('/auth/forgot-password', { email }),
      { success: true, message: 'Email envoyé' }
    ),
}

// ─────────────────────────────────────────────────────────────────────────────
// CV
// ─────────────────────────────────────────────────────────────────────────────
export const cvApi = {
  /** GET /cvs — liste des CVs de l'utilisateur connecté */
  list: () =>
    call(() => http.get('/cvs'), MOCK_CVS),

  /** GET /cvs/:id */
  get: (id) =>
    call(
      () => http.get(`/cvs/${id}`),
      () => MOCK_CVS.find(c => c._id === id) ?? MOCK_CVS[0]
    ),

  /** POST /cvs — crée un nouveau CV */
  create: (data) =>
    call(
      () => http.post('/cvs', data),
      () => ({ ...MOCK_CVS[0], _id: `cv_${Date.now()}`, ...data, status: 'draft', updatedAt: new Date().toISOString() })
    ),

  /** PUT /cvs/:id — met à jour un CV existant */
  update: (id, data) =>
    call(
      () => http.put(`/cvs/${id}`, data),
      () => ({ ...MOCK_CVS[0], _id: id, ...data, updatedAt: new Date().toISOString() })
    ),

  /** DELETE /cvs/:id */
  delete: (id) =>
    call(
      () => http.delete(`/cvs/${id}`),
      { success: true }
    ),

  /**
   * GET /cvs/:id/download
   * Retourne un PDF (blob).
   * Le backend génère le PDF (puppeteer / pdfkit) et le streame.
   */
  download: (id) =>
    call(
      () => http.get(`/cvs/${id}/download`, { responseType: 'blob' }),
      () => new Blob(['%PDF-mock'], { type: 'application/pdf' })
    ),
}

// ─────────────────────────────────────────────────────────────────────────────
// PAIEMENTS
// ─────────────────────────────────────────────────────────────────────────────
export const paymentApi = {
  /** GET /payments — historique de l'utilisateur */
  list: () =>
    call(() => http.get('/payments'), MOCK_PAYMENTS),

  /**
   * POST /payments/initiate
   * Body : { cvId, phone, method }
   * Réponse : { paymentId, status: 'pending', ussdCode? }
   * Le backend contacte l'opérateur (Orange / MTN) et attend le callback.
   */
  initiate: (cvId, phone, method) =>
    call(
      () => http.post('/payments/initiate', { cvId, phone, method }),
      { paymentId: `pay_${Date.now()}`, status: 'pending', message: 'Confirmez sur votre téléphone' }
    ),

  /**
   * GET /payments/:paymentId/status
   * Polling pour vérifier si le paiement a été confirmé.
   * Réponse : { status: 'confirmed' | 'pending' | 'failed', cvId }
   */
  checkStatus: (paymentId) =>
    call(
      () => http.get(`/payments/${paymentId}/status`),
      { status: 'confirmed', cvId: 'cv_001' }
    ),

  /** GET /payments/:id — détail d'un paiement */
  get: (id) =>
    call(
      () => http.get(`/payments/${id}`),
      () => MOCK_PAYMENTS.find(p => p._id === id) ?? MOCK_PAYMENTS[0]
    ),
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────────────────────────────────────
export const adminApi = {
  /** GET /admin/stats */
  stats: () =>
    call(() => http.get('/admin/stats'), MOCK_STATS),

  /** GET /admin/users?page=1&limit=20&search= */
  users: (params = {}) =>
    call(
      () => http.get('/admin/users', { params }),
      { users: MOCK_USERS, total: MOCK_USERS.length, page: 1 }
    ),

  /** PUT /admin/users/:id */
  updateUser: (id, data) =>
    call(
      () => http.put(`/admin/users/${id}`, data),
      () => ({ ...MOCK_USERS.find(u => u._id === id), ...data })
    ),

  /** DELETE /admin/users/:id */
  deleteUser: (id) =>
    call(
      () => http.delete(`/admin/users/${id}`),
      { success: true }
    ),

  /** GET /admin/payments?page=1&limit=20&status= */
  payments: (params = {}) =>
    call(
      () => http.get('/admin/payments', { params }),
      { payments: MOCK_PAYMENTS, total: MOCK_PAYMENTS.length, page: 1 }
    ),
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFIL UTILISATEUR
// ─────────────────────────────────────────────────────────────────────────────
export const profileApi = {
  /** PUT /profile — met à jour nom, email, téléphone */
  update: (data) =>
    call(
      () => http.put('/profile', data),
      () => ({ ...MOCK_SESSION.user, ...data })
    ),

  /** PUT /profile/password — { currentPassword, newPassword } */
  changePassword: (data) =>
    call(
      () => http.put('/profile/password', data),
      { success: true }
    ),

  /** DELETE /profile — supprime le compte */
  deleteAccount: () =>
    call(
      () => http.delete('/profile'),
      { success: true }
    ),
}

export default http
