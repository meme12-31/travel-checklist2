export type ChecklistItem = {
  id: string
  name: string
  checked: boolean
}

export type Checklist = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  items: ChecklistItem[]
}

export type SharedChecklist = {
  title: string
  items: { name: string; checked: boolean }[]
}

export type StorageResult<T = void> = T extends void
  ? { ok: true } | { ok: false; error: string }
  : { ok: true; lists: T } | { ok: false; error: string; lists?: T }
