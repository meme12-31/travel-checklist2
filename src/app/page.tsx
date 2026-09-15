import { Suspense } from 'react'
import ChecklistApp from '@/components/ChecklistApp'

export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex flex-1 flex-col" />}>
      <ChecklistApp />
    </Suspense>
  )
}
