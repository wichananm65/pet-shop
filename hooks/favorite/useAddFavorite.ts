"use client"

import { useCallback, useState } from "react"
import { addFavorite as addFavoriteApi } from "@/server/service/favorite/favorite-service"
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

export default function useAddFavorite() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { token, user, login } = useAuth()

  const addFavorite = useCallback(
    async (productId: number) => {
      setLoading(true)
      setError(null)
      try {
        const res = await addFavoriteApi(productId)
        // update auth user in context/storage so UI reflects change app-wide
        try {
          const updatedUser = user ? ({ ...(user as unknown as AuthUserWithFavorites), favoriteProductId: res.favoriteProductId } as AuthUserWithFavorites) : null
          login(token ?? "", updatedUser)
        } catch {}
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

  return { addFavorite, loading, error }
}
