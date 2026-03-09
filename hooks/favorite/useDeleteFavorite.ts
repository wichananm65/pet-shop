"use client"

import { useCallback, useState } from "react"
import { removeFavorite as removeFavoriteApi } from "@/server/service/favorite/favorite-service"
import { useAuth } from "@/components/common/AuthProvider"

type AuthUserWithFavorites = {
  userId: number
  email: string
  firstName?: string
  lastName?: string
  avatarPic?: string
  favoriteProductId?: number[]
  favoriteProductIDs?: number[]
}

export default function useDeleteFavorite() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { token, user, login } = useAuth()

  const removeFavorite = useCallback(
    async (productId: number) => {
      setLoading(true)
      setError(null)
      try {
        const res = await removeFavoriteApi(productId)
        // favorites are now handled separately, no need to update user object
        return res
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        setError(msg)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [token, user, login]
  )

  return { removeFavorite, loading, error }
}
