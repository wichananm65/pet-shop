"use client"

import { useEffect, useState } from "react"
import { listShoppingMall, type ShoppingMallDto } from "@/server/service/shopping-mall/shopping-mall-service"
import { API_BASE_URL } from "@/server/service/api"

function normalizeUrl(u?: string | null) {
  if (!u) return undefined
  if (u.startsWith("http://") || u.startsWith("https://")) return u
  if (u.startsWith("/")) return u
  if (API_BASE_URL) return `${API_BASE_URL}${u}`
  return u
}

export default function useShoppingMall(limit = 100) {
  const [items, setItems] = useState<ShoppingMallDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    listShoppingMall(limit)
      .then((data) => {
        if (!mounted) return
        const norm = data.map((it) => ({ ...it, productImg: normalizeUrl(it.productImg ?? undefined) }))
        setItems(norm)
      })
      .catch((err) => setError(err?.message || String(err)))
      .finally(() => setLoading(false))
    return () => {
      mounted = false
    }
  }, [limit])

  return { items, loading, error, reload: () => listShoppingMall(limit) }
}
