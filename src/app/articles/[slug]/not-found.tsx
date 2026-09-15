import Link from 'next/link'

export default function ArticleNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <p className="text-4xl" aria-hidden="true">
        📚
      </p>
      <h1 className="text-lg font-bold text-slate-700">記事が見つかりません</h1>
      <p className="text-sm text-slate-500">指定されたコラムは存在しないか、移動した可能性があります。</p>
      <Link href="/articles" className="text-sm font-semibold text-sky-600 hover:underline">
        コラム一覧へ戻る
      </Link>
    </div>
  )
}
