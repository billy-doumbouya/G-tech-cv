// src/lib/utils.js
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs) => twMerge(clsx(inputs))

export const formatGNF = (n) =>
  new Intl.NumberFormat('fr-GN').format(n) + ' GNF'

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

export const formatDateShort = (d) =>
  new Date(d).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })

export const sleep = (ms) => new Promise(r => setTimeout(r, ms))

export const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

export const clamp = (n, min, max) => Math.min(Math.max(n, min), max)

export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const a   = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
