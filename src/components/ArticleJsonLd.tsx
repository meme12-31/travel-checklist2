import type { ArticleMeta } from '@/lib/articles'

type ArticleJsonLdProps = {
  article: ArticleMeta
  url: string
  imageUrl?: string
  datePublished?: string
  dateModified?: string
}

export default function ArticleJsonLd({
  article,
  url,
  imageUrl = 'https://hit-tool.com/travel-checklist/og-image.png',
  datePublished = '2026-10-01',
  dateModified = '2026-10-01',
}: ArticleJsonLdProps) {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      image: imageUrl,
      datePublished,
      dateModified,
      author: {
        '@type': 'Organization',
        name: 'HITツールズ',
        url: 'https://hit-tool.com/',
      },
      publisher: {
        '@type': 'Organization',
        name: 'HITツールズ',
        url: 'https://hit-tool.com/',
      },
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
          name: '持ち物チェックリスト コラム一覧',
          item: 'https://hit-tool.com/travel-checklist/articles',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: article.title,
          item: url,
        },
      ],
    },
  ]

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
