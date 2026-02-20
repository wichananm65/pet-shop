"use client"

import { useEffect, useState } from "react"
import { listShoppingMall, type ShoppingMallItem } from "@/server/service/product/product-service"
import { API_BASE_URL } from "@/server/service/api"

function normalizeUrl(u?: string | null) {
  if (!u) return undefined
  if (u.startsWith("http://") || u.startsWith("https://")) return u
  // If path is already absolute-to-app (starts with '/'), keep it *relative*
  // so `next/image` treats it as same-origin and won't resolve to a private IP.
  if (u.startsWith("/")) return u
  // Otherwise, if an explicit backend URL is configured, prefix it.
  if (API_BASE_URL) return `${API_BASE_URL}${u}`
  return u
}

export default function useShoppingMall() {
  const [items, setItems] = useState<ShoppingMallItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await listShoppingMall()
        if (!mounted) return
        const norm = data.map((it) => ({
          ...it,
          productPic: normalizeUrl(it.productPic ?? undefined) as string | undefined,
        }))
        setItems(norm)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        if (mounted) setError(msg)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  return { items, loading, error }
}
