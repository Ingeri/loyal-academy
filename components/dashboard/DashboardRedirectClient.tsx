'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardRedirectClient({
  targetUrl,
}: {
  targetUrl: string
}) {
  const router = useRouter()

  useEffect(() => {
    router.replace(targetUrl)
    router.refresh()
  }, [router, targetUrl])

  return null
}
