"use client"

import React, { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useAuth } from "@/components/common/AuthProvider"
import {
  addFavorite as addFavoriteApi,
  removeFavorite as removeFavoriteApi,
  getFavorites,
} from "@/server/service/favorite/favorite-service"

type FavoritesContextType = {
  ids: Set<number>
  loading: boolean
  isFavorite: (productId: number) => boolean
  toggle: (productId: number) => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [ids, setIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(false)

  // Load favorite IDs when user logs in / changes; clear when logged out
  useEffect(() => {
    let mounted = true

    const load = async () => {
      if (!user?.userId) {
        setIds(new Set())
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const items = await getFavorites()
        if (!mounted) return
        setIds(new Set(items.map((it) => it.productID)))
      } catch {
        if (mounted) setIds(new Set())
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [user?.userId])

  const toggle = useCallback(
    async (productId: number) => {
      const alreadyFav = ids.has(productId)

      // Optimistic update
      setIds((prev) => {
        const next = new Set(prev)
        if (alreadyFav) next.delete(productId)
        else next.add(productId)
        return next
      })

      try {
        if (alreadyFav) {
          const res = await removeFavoriteApi(productId)
          // Sync with the authoritative list from server
          setIds(new Set(res.favoriteProductId))
        } else {
          const res = await addFavoriteApi(productId)
          setIds(new Set(res.favoriteProductId))
        }
      } catch {
        // Roll back on error
        setIds((prev) => {
          const next = new Set(prev)
          if (alreadyFav) next.add(productId)
          else next.delete(productId)
          return next
        })
      }
    },
    [ids]
  )

  const isFavorite = useCallback((productId: number) => ids.has(productId), [ids])

  return (
    <FavoritesContext.Provider value={{ ids, loading, isFavorite, toggle }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavoritesContext() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error("useFavoritesContext must be used within FavoritesProvider")
  return ctx
}
