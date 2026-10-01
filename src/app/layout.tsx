import type { Metadata } from 'next'
import { APP_BASE_PATH, publicAssetUrl } from '@/constants/paths'
import Footer from '@/components/Footer'
import RelatedToolsFooter from '@/components/RelatedToolsFooter'
import ScrollToTop from '@/components/ScrollToTop'
import './globals.css'

const SITE_TITLE = '持ち物リストチェッカー'
const SITE_DESCRIPTION =
  '旅行や出張、日帰りのお出かけに必要な持ち物を簡単に作成・管理できるチェックリストツールです。必要な持ち物を確認しながら準備できるので、出発前のパッキングや忘れ物防止に便利。忙しい朝の準備にも役立ち、無料・登録不要で使えます。'

export const metadata: Metadata = {
  metadataBase: new URL('https://hit-tool.com'),
  alternates: {
    canonical: '/travel-checklist',
  },
  title: {
    default: SITE_TITLE,
    template: `%s｜${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: [{ url: publicAssetUrl('favicon.svg'), type: 'image/svg+xml' }],
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: APP_BASE_PATH,
    siteName: SITE_TITLE,
    locale: 'ja_JP',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-KXFP18WL67" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-KXFP18WL67');
            `,
          }}
        />
      </head>
      <body>
        <ScrollToTop />
        <div className="flex min-h-svh flex-col">
          {children}
          <RelatedToolsFooter currentAppId="travel-checklist" />
          <Footer />
        </div>
      </body>
    </html>
  )
}
