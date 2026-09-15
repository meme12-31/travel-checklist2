import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <p className="text-4xl" aria-hidden="true">
        🧳
      </p>
      <h1 className="text-lg font-bold text-slate-700">ページが見つかりません</h1>
      <p className="text-sm text-slate-500">指定されたページは存在しないか、移動した可能性があります。</p>
      <Link
        href="/"
        className="rounded-2xl bg-gradient-to-r from-sky-400 to-blue-400 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:from-sky-500 hover:to-blue-500 active:scale-95"
      >
        トップへ戻る
      </Link>
    </div>
  )
}
