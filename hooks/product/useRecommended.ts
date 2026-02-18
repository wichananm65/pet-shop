"use client"

import { useEffect, useState, useCallback } from "react"
import { listRecommended, type RecommendedDto } from "@/server/service/recommended/recommended-service"

const PAGE_SIZE = 12

export default function useRecommended() {
  const [products, setProducts] = useState<RecommendedDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const loadPage = useCallback(
    async (off = 0) => {
      setLoading(true)
      setError(null)
      try {
        const data = await listRecommended(PAGE_SIZE, off)
        if (off === 0) setProducts(data)
        else setProducts((prev) => [...prev, ...data])
        setHasMore(data.length === PAGE_SIZE)
        setOffset(off + data.length)
      } catch (err: any) {
        setError(err?.message || String(err))
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    let mounted = true
    if (!mounted) return
    loadPage(0)
    return () => { mounted = false }
  }, [loadPage])

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    await loadPage(offset)
  }, [loading, hasMore, offset, loadPage])

  return { products, loading, error, loadMore, hasMore }
}
