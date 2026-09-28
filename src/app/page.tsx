import type { Metadata } from 'next'
import { Suspense } from 'react'
import ChecklistApp from '@/components/ChecklistApp'

export const metadata: Metadata = {
  metadataBase: new URL('https://hit-tool.com'),
  alternates: {
    canonical: '/travel-checklist',
  },
  title: '持ち物チェックリスト | 国内外の旅行・出張・お出かけの準備を効率化',
  description:
    '旅行や出張、日帰りのお出かけに必要な持ち物をサクッと作成・管理できるチェックリストツール。忘れ物を防いで、出発前のパッキングや準備をストレスなくスムーズに完結させましょう！',
  openGraph: {
    title: '持ち物チェックリスト | 国内外の旅行・出張・お出かけの準備を効率化',
    description:
      '旅行や出張、日帰りのお出かけに必要な持ち物をサクッと作成・管理できるチェックリストツール。忘れ物を防いで、出発前のパッキングや準備をストレスなくスムーズに完結させましょう！',
    url: 'https://hit-tool.com/travel-checklist?v=1',
    siteName: 'hit-tool.com',
    images: [
      {
        url: 'https://hit-tool.com/travel-checklist/og-image.png?v=1',
        width: 1200,
        height: 630,
        alt: '持ち物チェックリスト OGP画像',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex flex-1 flex-col" />}>
      <ChecklistApp />
    </Suspense>
  )
}
