"use client"

import { useEffect, useState } from "react"
import { getFavorites, type FavoriteProductDto } from "@/server/service/favorite/favorite-service"
import { API_BASE_URL } from "@/server/service/api"
import { useAuth } from "@/components/common/AuthProvider"

function normalizeUrl(u?: string | null) {
  if (!u) return undefined
  if (u.startsWith("http://") || u.startsWith("https://")) return u
  if (u.startsWith("/")) return u
  if (API_BASE_URL) return `${API_BASE_URL}${u}`
  return u
}

export default function useFavorites() {
  const [items, setItems] = useState<FavoriteProductDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()

  // derived, statically-checkable dependencies for the effect
  const userId = user?.userId ?? null
  const favsKey = user ? (user.favoriteProductId ?? user.favoriteProductIDs ?? []).join(",") : ""

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getFavorites()
        if (!mounted) return
        const norm = data.map((it) => ({ ...it, productImg: normalizeUrl(it.productImg ?? undefined) }))
        setItems(norm)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        if (mounted) setError(msg)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    // if there's no authenticated user, clear the list
    if (!userId) {
      setItems([])
      setLoading(false)
      return () => {
        mounted = false
      }
    }

    // trigger load when user changes or their favorite IDs change
    load()
    return () => {
      mounted = false
    }
    // rerun when user id or favorite arrays change
  }, [userId, favsKey])

  // expose reload that also updates local state
  const reload = async () => {
    const data = await getFavorites()
    const norm = data.map((it) => ({ ...it, productImg: normalizeUrl(it.productImg ?? undefined) }))
    setItems(norm)
    return norm
  }

  return { items, loading, error, reload }
}
