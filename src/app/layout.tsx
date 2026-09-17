import type { Metadata } from 'next'
import { APP_BASE_PATH, publicAssetUrl } from '@/constants/paths'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import './globals.css'

const SITE_TITLE = '持ち物リストチェッカー'
const SITE_DESCRIPTION =
  '旅行やイベントの持ち物リストを簡単に作成・チェック・共有できる無料アプリ。登録不要。'

export const metadata: Metadata = {
  metadataBase: new URL('https://hit-tool.com'),
  title: {
    default: SITE_TITLE,
    template: `%s｜${SITE_TITLE}`,
  },
  description: SITE_DESCRIPTION,
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
          <Footer />
        </div>
      </body>
    </html>
  )
}
