import { APP_BASE_PATH } from '@/constants/paths'
import type { Checklist, SharedChecklist } from '@/types/checklist'

function toBase64(str: string): string {
  const bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1: string) =>
    String.fromCharCode(parseInt(p1, 16)),
  )
  return btoa(bytes)
}

function fromBase64(b64: string): string {
  const binary = atob(b64)
  const percentEncoded = Array.prototype.map
    .call(binary, (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
    .join('')
  return decodeURIComponent(percentEncoded)
}

function toUrlSafe(b64: string): string {
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromUrlSafe(safe: string): string {
  let b64 = safe.replace(/-/g, '+').replace(/_/g, '/')
  while (b64.length % 4 !== 0) b64 += '='
  return b64
}

export function encodeChecklist(checklist: Pick<Checklist, 'title' | 'items'>): string {
  const payload = {
    t: checklist.title,
    i: (checklist.items || []).map((item) => ({
      n: item.name,
      c: item.checked ? 1 : 0,
    })),
  }
  return toUrlSafe(toBase64(JSON.stringify(payload)))
}

export function decodeChecklist(encoded: string): SharedChecklist | null {
  try {
    const json = fromBase64(fromUrlSafe(encoded))
    const payload: unknown = JSON.parse(json)
    if (!payload || typeof payload !== 'object') return null
    const data = payload as { t?: unknown; i?: unknown }
    if (typeof data.t !== 'string' || !Array.isArray(data.i)) return null

    const items = data.i
      .filter((it): it is { n: string; c?: number } => !!it && typeof it === 'object' && typeof (it as { n?: unknown }).n === 'string')
      .map((it) => ({ name: it.n, checked: it.c === 1 }))

    return { title: data.t, items }
  } catch {
    return null
  }
}

export function buildShareUrl(checklist: Pick<Checklist, 'title' | 'items'>): string {
  const encoded = encodeChecklist(checklist)
  return `${window.location.origin}${APP_BASE_PATH}#data=${encoded}`
}

export function getSharedFromUrl(): SharedChecklist | null {
  const hash = window.location.hash || ''
  const match = hash.match(/#data=(.+)$/)
  if (!match) return null
  return decodeChecklist(match[1])
}

export function clearUrlHash(): void {
  try {
    const url = APP_BASE_PATH + window.location.search
    window.history.replaceState(null, '', url)
  } catch {
    window.location.hash = ''
  }
}
