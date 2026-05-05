// src/hooks/index.js
import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { cvApi, paymentApi, adminApi } from '@/api'

export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial }
    catch { return initial }
  })
  const set = useCallback((v) => {
    setValue(v)
    localStorage.setItem(key, JSON.stringify(v))
  }, [key])
  const remove = useCallback(() => {
    setValue(initial)
    localStorage.removeItem(key)
  }, [key, initial])
  return [value, set, remove]
}

export function useAutoSave(saveFn, data, delay = 2000) {
  const timer = useRef(null)
  const isDirty = useRef(false)
  const trigger = useCallback(() => {
    isDirty.current = true
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      if (!isDirty.current) return
      try { await saveFn(data); isDirty.current = false }
      catch { toast.error('Sauvegarde automatique échouée') }
    }, delay)
  }, [saveFn, data, delay])
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  return trigger
}

export function useCVList() {
  const [cvs,     setCvs]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true); setError(null)
    try { setCvs(await cvApi.list()) }
    catch (e) { setError(e.message); toast.error('Impossible de charger les CV') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const remove = useCallback(async (id) => {
    try {
      await cvApi.delete(id)
      setCvs(prev => prev.filter(c => c._id !== id))
      toast.success('CV supprimé')
    } catch { toast.error('Erreur lors de la suppression') }
  }, [])

  return { cvs, loading, error, refetch: fetch, remove }
}

export function usePayments() {
  const [payments, setPayments] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    paymentApi.list()
      .then(setPayments)
      .catch(() => toast.error('Impossible de charger les paiements'))
      .finally(() => setLoading(false))
  }, [])

  const total = payments
    .filter(p => p.status === 'confirmed')
    .reduce((s, p) => s + p.amount, 0)

  return { payments, loading, total }
}

export function useAdminData() {
  const [stats,    setStats]    = useState(null)
  const [users,    setUsers]    = useState([])
  const [payments, setPayments] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([adminApi.stats(), adminApi.users(), adminApi.payments()])
      .then(([s, u, p]) => {
        setStats(s)
        setUsers(u.users ?? u)
        setPayments(p.payments ?? p)
      })
      .catch(() => toast.error('Erreur de chargement'))
      .finally(() => setLoading(false))
  }, [])

  return { stats, users, payments, loading }
}

export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const fn = (e) => { if (!ref.current?.contains(e.target)) handler() }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [ref, handler])
}

export function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })
  useEffect(() => {
    const fn = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return size
}
