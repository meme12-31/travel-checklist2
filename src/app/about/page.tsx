import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPageShell from '@/components/LegalPageShell'

export const metadata: Metadata = {
  title: '運営者情報',
}

export default function AboutPage() {
  return (
    <LegalPageShell title="運営者情報">
      <h1 className="text-lg font-bold text-slate-700">運営者情報</h1>
      <p>
        持ち物リストチェッカーは、旅行やお出かけの準備をもっとかんたんに・楽しくするための無料Webサービスです。
      </p>
      <h2 className="font-bold text-slate-700">サービス名</h2>
      <p>持ち物リストチェッカー</p>
      <h2 className="font-bold text-slate-700">運営</h2>
      <p>持ち物リストチェッカー運営事務局</p>
      <h2 className="font-bold text-slate-700">お問い合わせ</h2>
      <p>
        サービスに関するお問い合わせは
        <Link href="/contact" className="mx-1 font-semibold text-sky-600 hover:underline">
          お問い合わせページ
        </Link>
        よりご連絡ください。
      </p>
    </LegalPageShell>
  )
}
