"use client"

import { useEffect, useState } from "react"
import { getCart, type CartItemDto, onCartChange } from "@/server/service/cart/cart-service"
import { API_BASE_URL } from "@/server/service/api"
import { useAuth } from "@/components/common/AuthProvider"

function normalizeUrl(u?: string | null) {
  if (!u) return undefined
  if (u.startsWith("http://") || u.startsWith("https://")) return u
  if (u.startsWith("/")) return u
  if (API_BASE_URL) return `${API_BASE_URL}${u}`
  return u
}

export default function useCart() {
  const [items, setItems] = useState<CartItemDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()

  const userId = user?.userId ?? null

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getCart()
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

    if (!userId) {
      setItems([])
      setLoading(false)
      return () => {
        mounted = false
      }
    }

    load()
    // subscribe to external events so that other hook instances (navbar, etc.)
    // can be notified when someone adds to cart elsewhere
    const unsub = onCartChange(() => {
      if (mounted) load()
    })

    return () => {
      mounted = false
      unsub()
    }
  }, [userId])

  const reload = async () => {
    const data = await getCart()
    const norm = data.map((it) => ({ ...it, productImg: normalizeUrl(it.productImg ?? undefined) }))
    setItems(norm)
    return norm
  }

  return { items, loading, error, reload }
}