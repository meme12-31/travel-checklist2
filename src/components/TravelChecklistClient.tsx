'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle2, FolderOpen, Sparkles } from 'lucide-react'
import { isToolHomeQuery, TOOL_HOME_QUERY_KEY } from '@/constants/paths'
import Header from '@/components/Header'
import Checklist from '@/components/Checklist'
import MyListModal from '@/components/MyListModal'
import ShareModal from '@/components/ShareModal'
import { PRESETS, getPresetById } from '@/data/presets'
import {
  deleteFromMyLists,
  loadCurrent,
  loadSavedLists,
  saveCurrent,
  saveToMyLists,
} from '@/utils/storage'
import { buildShareUrl, clearUrlHash, getSharedFromUrl } from '@/utils/urlShare'
import { genId } from '@/utils/id'
import type { Checklist as ChecklistType, ChecklistItem, SharedChecklist } from '@/types/checklist'

const MAX_TITLE_LENGTH = 50

function createItem(name: string, checked = false): ChecklistItem {
  return { id: genId(), name, checked }
}

function checklistFromPreset(preset: { title: string; items: string[] }): ChecklistType {
  const now = new Date().toISOString()
  return {
    id: genId(),
    title: preset.title,
    createdAt: now,
    updatedAt: now,
    items: preset.items.map((name) => createItem(name)),
  }
}

function checklistFromShared(shared: SharedChecklist): ChecklistType {
  const now = new Date().toISOString()
  return {
    id: genId(),
    title: (shared.title || '共有リスト').slice(0, MAX_TITLE_LENGTH),
    createdAt: now,
    updatedAt: now,
    items: shared.items.map((it) => createItem(it.name, it.checked)),
  }
}

type TravelChecklistClientProps = {
  introHeader?: ReactNode
  children?: ReactNode
}

export default function TravelChecklistClient({
  introHeader,
  children,
}: TravelChecklistClientProps) {
  const router = useRouter()

  const [view, setView] = useState<'home' | 'editor'>('home')
  const [checklist, setChecklist] = useState<ChecklistType | null>(null)
  const [savedLists, setSavedLists] = useState<ChecklistType[]>([])
  const [showMyList, setShowMyList] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [toast, setToast] = useState<{ id: string; message: string; type: 'success' | 'error' } | null>(null)

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const bootstrapped = useRef(false)

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ id: genId(), message, type })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }, [])

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
  }, [])

  useEffect(() => {
    if (bootstrapped.current) return
    bootstrapped.current = true

    setSavedLists(loadSavedLists())

    const searchParams = new URLSearchParams(window.location.search)
    const showToolTop = isToolHomeQuery(searchParams.get(TOOL_HOME_QUERY_KEY))

    if (showToolTop) {
      setView('home')
      setChecklist(null)
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      router.replace('/', { scroll: false })
      return
    }

    const hasHashData = /#data=/.test(window.location.hash || '')
    if (hasHashData) {
      const shared = getSharedFromUrl()
      clearUrlHash()
      if (shared) {
        const restored = checklistFromShared(shared)
        setChecklist(restored)
        setView('editor')
        showToast('共有リストを読み込みました', 'success')
        return
      }
      showToast('リストを読み込めませんでした', 'error')
    }

    const current = loadCurrent()
    if (current) {
      setChecklist(current)
      setView('editor')
    }
  }, [router, showToast])

  useEffect(() => {
    if (!checklist) return
    const res = saveCurrent(checklist)
    if (!res.ok && res.error) {
      showToast(res.error, 'error')
    }
  }, [checklist, showToast])

  const mutate = useCallback((updater: (prev: ChecklistType) => ChecklistType) => {
    setChecklist((prev) => {
      if (!prev) return prev
      const next = updater(prev)
      return { ...next, updatedAt: new Date().toISOString() }
    })
  }, [])

  const goHome = () => {
    setView('home')
    setSavedLists(loadSavedLists())
  }

  const handleSelectTemplate = (presetId: string) => {
    const preset = getPresetById(presetId)
    if (!preset) return
    setChecklist(checklistFromPreset(preset))
    setView('editor')
  }

  const handleToggle = (id: string) =>
    mutate((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)),
    }))

  const handleDelete = (id: string) =>
    mutate((prev) => ({ ...prev, items: prev.items.filter((it) => it.id !== id) }))

  const handleEditItem = (id: string, name: string) =>
    mutate((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === id ? { ...it, name } : it)),
    }))

  const handleAddItem = (name: string) =>
    mutate((prev) => ({ ...prev, items: [...prev.items, createItem(name)] }))

  const handleClearAll = () =>
    mutate((prev) => ({ ...prev, items: prev.items.map((it) => ({ ...it, checked: false })) }))

  const handleUpdateTitle = (title: string) => mutate((prev) => ({ ...prev, title }))

  const handleSaveToMyList = () => {
    if (!checklist) return
    if (!checklist.title.trim()) {
      showToast('タイトルを入力してから保存してください', 'error')
      return
    }
    const toSave = { ...checklist, updatedAt: new Date().toISOString() }
    const res = saveToMyLists(toSave)
    if (res.ok) {
      setChecklist(toSave)
      setSavedLists(res.lists)
      showToast('マイリストに保存しました', 'success')
    } else {
      showToast(res.error || '保存に失敗しました', 'error')
    }
  }

  const handleOpenShare = () => {
    if (!checklist) return
    try {
      setShareUrl(buildShareUrl(checklist))
      setShowShare(true)
    } catch {
      showToast('共有URLの生成に失敗しました', 'error')
    }
  }

  const handleLoadFromMyList = (id: string) => {
    const found = savedLists.find((c) => c.id === id)
    if (!found) return
    setChecklist({
      ...found,
      items: found.items.map((it) => ({ ...it, checked: false })),
    })
    setView('editor')
    setShowMyList(false)
    showToast(`「${found.title}」を読み込みました`, 'success')
  }

  const handleDeleteFromMyList = (id: string) => {
    const res = deleteFromMyLists(id)
    if (res.ok) {
      setSavedLists(res.lists)
      showToast('リストを削除しました', 'success')
    } else {
      showToast(res.error || '削除に失敗しました', 'error')
    }
  }

  const currentQuickAdd =
    view === 'editor' && checklist
      ? ['充電器', 'モバイルバッテリー', 'ハンカチ/ティッシュ', '常備薬', '現金/カード', 'エコバッグ']
      : []

  const isHome = view === 'home' || !checklist

  return (
    <div className="flex flex-1 flex-col">
      <Header
        view={view}
        savedCount={savedLists.length}
        onHome={goHome}
        onOpenMyList={() => setShowMyList(true)}
      />

      <main className="mx-auto w-full max-w-[600px] flex-1 px-4 py-5 pb-8">
        {isHome ? (
          <div className="space-y-10">
            <div className="space-y-6">
              {introHeader}

              <button
                type="button"
                onClick={() => setShowMyList(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 font-semibold text-emerald-600 shadow-sm transition hover:bg-emerald-100 active:scale-[0.98]"
              >
                <FolderOpen size={18} />
                保存済みマイリスト
                {savedLists.length > 0 && (
                  <span className="ml-1 rounded-full bg-emerald-500 px-2 py-0.5 text-xs text-white">
                    {savedLists.length}
                  </span>
                )}
              </button>

              <div>
                <p className="mb-3 flex items-center justify-center gap-1 text-sm font-semibold text-slate-500">
                  <Sparkles size={15} className="text-pink-400" />
                  テンプレートを選んで、はじめる
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectTemplate(preset.id)}
                      className={`group flex flex-col items-start gap-1 rounded-3xl bg-gradient-to-br ${preset.accent} p-4 text-left shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md active:scale-95`}
                    >
                      <span className="text-3xl transition group-hover:scale-110" aria-hidden="true">
                        {preset.emoji}
                      </span>
                      <span className="text-sm font-bold text-slate-700">{preset.title}</span>
                      <span className="text-[11px] leading-tight text-slate-600/80">{preset.description}</span>
                      <span className="mt-1 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                        {preset.items.length}点
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {children}
          </div>
        ) : (
          <Checklist
            checklist={checklist}
            quickAdd={currentQuickAdd}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEditItem={handleEditItem}
            onAddItem={handleAddItem}
            onClearAll={handleClearAll}
            onUpdateTitle={handleUpdateTitle}
            onSave={handleSaveToMyList}
            onShare={handleOpenShare}
          />
        )}
      </main>

      <MyListModal
        open={showMyList}
        lists={savedLists}
        onClose={() => setShowMyList(false)}
        onLoad={handleLoadFromMyList}
        onDelete={handleDeleteFromMyList}
      />
      <ShareModal
        open={showShare}
        url={shareUrl}
        onClose={() => setShowShare(false)}
        onCopied={() => showToast('共有URLをコピーしました', 'success')}
        onCopyError={() => showToast('コピーに失敗しました。URLを手動で選択してください', 'error')}
      />

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <div
            role="status"
            className={`animate-toast-in flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-lg ${
              toast.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  )
}
