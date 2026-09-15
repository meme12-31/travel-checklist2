import type { Metadata } from 'next'
import LegalPageShell from '@/components/LegalPageShell'

export const metadata: Metadata = {
  title: 'お問い合わせ',
}

export default function ContactPage() {
  return (
    <LegalPageShell title="お問い合わせ">
      <h1 className="text-lg font-bold text-slate-700">お問い合わせ</h1>
      <p>
        持ち物リストチェッカーをご利用いただきありがとうございます。サービスに関するご質問・不具合のご報告・ご要望などがございましたら、下記までご連絡ください。
      </p>
      <p>
        <span className="font-semibold text-slate-700">メール：</span>
        <a
          href="mailto:contact@example.com"
          className="font-semibold text-sky-600 underline-offset-2 hover:underline"
        >
          contact@example.com
        </a>
      </p>
      <p className="text-xs text-slate-500">※返信にはお時間をいただく場合があります。あらかじめご了承ください。</p>
    </LegalPageShell>
  )
}
