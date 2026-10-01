import type { Metadata } from 'next'
import TravelChecklistClient from '@/components/TravelChecklistClient'
import ArticlesSection from '@/components/ArticlesSection'

export const metadata: Metadata = {
  metadataBase: new URL('https://hit-tool.com'),
  alternates: {
    canonical: '/travel-checklist',
  },
  title: '持ち物チェックリスト | 国内外の旅行・出張・お出かけの準備を効率化',
  description:
    '旅行や出張、日帰りのお出かけに必要な持ち物を簡単に作成・管理できるチェックリストツールです。必要な持ち物を確認しながら準備できるので、出発前のパッキングや忘れ物防止に便利。忙しい朝の準備にも役立ち、無料・登録不要で使えます。',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: '持ち物チェックリスト | 国内外の旅行・出張・お出かけの準備を効率化',
    description:
      '旅行や出張、日帰りのお出かけに必要な持ち物を簡単に作成・管理できるチェックリストツールです。必要な持ち物を確認しながら準備できるので、出発前のパッキングや忘れ物防止に便利。忙しい朝の準備にも役立ち、無料・登録不要で使えます。',
    url: 'https://hit-tool.com/travel-checklist?v=1',
    siteName: 'hit-tool.com',
    locale: 'ja_JP',
    type: 'website',
    images: [
      {
        url: 'https://hit-tool.com/travel-checklist/og-image.png?v=1',
        width: 1200,
        height: 630,
        alt: '持ち物チェックリスト OGP画像',
      },
    ],
  },
}

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '持ち物チェックリスト｜旅行・出張・推し活の忘れ物防止ツール',
    url: 'https://hit-tool.com/travel-checklist',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    description:
      '旅行、ビジネス出張、推し活、コミケ、アウトドアなど用途に合わせて持ち物を簡単にチェックできるWeb便利ツールです。',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'HITツールズ',
        item: 'https://hit-tool.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '持ち物チェックリスト',
        item: 'https://hit-tool.com/travel-checklist',
      },
    ],
  },
]

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TravelChecklistClient
        introHeader={
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-5xl" aria-hidden="true">
              🧳
            </span>
            <h1 className="text-xl font-bold text-slate-700">持ち物チェックリスト</h1>
            <h2 className="max-w-md text-sm font-normal text-slate-500">
              旅行・お出かけ・イベントの持ち物を、テンプレートから
              <br className="hidden sm:block" />
              サッと作って、チェック・保存・共有できる無料アプリ。登録不要！
            </h2>
          </div>
        }
      >
        <ArticlesSection />
      </TravelChecklistClient>
    </>
  )
}
