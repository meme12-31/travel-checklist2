import type { Checklist, ChecklistItem } from '@/types/checklist'

const SAVED_KEY = 'saved_checklists'
const CURRENT_KEY = 'current_checklist'

function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

function isValidItem(item: unknown): item is ChecklistItem {
  if (!item || typeof item !== 'object') return false
  const it = item as Record<string, unknown>
  return typeof it.id === 'string' && typeof it.name === 'string' && typeof it.checked === 'boolean'
}

export function sanitizeChecklist(data: unknown): Checklist | null {
  if (!data || typeof data !== 'object') return null
  const raw = data as Record<string, unknown>
  if (typeof raw.id !== 'string' || typeof raw.title !== 'string') return null
  if (!Array.isArray(raw.items)) return null

  const items = raw.items.filter(isValidItem)
  return {
    id: raw.id,
    title: raw.title,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString(),
    items,
  }
}

export function saveCurrent(checklist: Checklist): { ok: true } | { ok: false; error: string } {
  if (!isStorageAvailable()) {
    return { ok: false, error: 'このブラウザではデータを保存できません。' }
  }
  try {
    window.localStorage.setItem(CURRENT_KEY, JSON.stringify(checklist))
    return { ok: true }
  } catch {
    return { ok: false, error: '保存に失敗しました。ブラウザの空き容量をご確認ください。' }
  }
}

export function loadCurrent(): Checklist | null {
  if (!isStorageAvailable()) return null
  try {
    const raw = window.localStorage.getItem(CURRENT_KEY)
    if (!raw) return null
    return sanitizeChecklist(JSON.parse(raw))
  } catch {
    try {
      window.localStorage.removeItem(CURRENT_KEY)
    } catch {
      /* noop */
    }
    return null
  }
}

export function clearCurrent(): void {
  if (!isStorageAvailable()) return
  try {
    window.localStorage.removeItem(CURRENT_KEY)
  } catch {
    /* noop */
  }
}

export function loadSavedLists(): Checklist[] {
  if (!isStorageAvailable()) return []
  try {
    const raw = window.localStorage.getItem(SAVED_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(sanitizeChecklist).filter((c): c is Checklist => c !== null)
  } catch {
    try {
      window.localStorage.removeItem(SAVED_KEY)
    } catch {
      /* noop */
    }
    return []
  }
}

function writeSavedLists(
  lists: Checklist[],
): { ok: true; lists: Checklist[] } | { ok: false; error: string } {
  try {
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(lists))
    return { ok: true, lists }
  } catch {
    return { ok: false, error: '保存に失敗しました。ブラウザの空き容量をご確認ください。' }
  }
}

export function saveToMyLists(
  checklist: Checklist,
): { ok: true; lists: Checklist[] } | { ok: false; error: string } {
  if (!isStorageAvailable()) {
    return { ok: false, error: 'このブラウザではデータを保存できません。' }
  }
  const lists = loadSavedLists()
  const idx = lists.findIndex((c) => c.id === checklist.id)
  if (idx >= 0) {
    lists[idx] = checklist
  } else {
    lists.unshift(checklist)
  }
  return writeSavedLists(lists)
}

export function deleteFromMyLists(
  id: string,
): { ok: true; lists: Checklist[] } | { ok: false; error: string } {
  if (!isStorageAvailable()) {
    return { ok: false, error: 'このブラウザではデータを操作できません。' }
  }
  const lists = loadSavedLists().filter((c) => c.id !== id)
  return writeSavedLists(lists)
}
