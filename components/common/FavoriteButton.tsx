"use client"

import React from "react"
import { Heart } from "lucide-react"
import useAddFavorite from "@/hooks/favorite/useAddFavorite"
import useDeleteFavorite from "@/hooks/favorite/useDeleteFavorite"
import { useAuth } from "@/components/common/AuthProvider"
import LoginModal from "@/components/(main)/LoginModal"

export default function FavoriteButton({ productId }: { productId: number }) {
  const { user, isAuthenticated } = useAuth()
  const [showLogin, setShowLogin] = React.useState(false)
  const [localError, setLocalError] = React.useState<string | null>(null)

  const { addFavorite, loading: adding, error: addErr } = useAddFavorite()
  const { removeFavorite, loading: removing, error: removeErr } = useDeleteFavorite()

  React.useEffect(() => {
    if (addErr) setLocalError(addErr)
    else if (removeErr) setLocalError(removeErr)
    else setLocalError(null)
  }, [addErr, removeErr])

  type UserWithFavs = { favoriteProductId?: number[]; favoriteProductIDs?: number[] }
  const userWithFavs = user as unknown as UserWithFavs | null
  const isFav = !!(
    userWithFavs?.favoriteProductId?.includes(productId) ||
    userWithFavs?.favoriteProductIDs?.includes(productId)
  )

  const onToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLocalError(null)
    if (!isAuthenticated) {
      setShowLogin(true)
      return
    }

    try {
      if (isFav) {
        await removeFavorite(productId)
      } else {
        await addFavorite(productId)
      }
    } catch (err: unknown) {
      setLocalError(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={onToggle}
        aria-label={isFav ? "Remove favorite" : "Add favorite"}
        title={isFav ? "Remove favorite" : "Add favorite"}
        className={`p-2 rounded-full bg-white hover:shadow-sm transition ${isFav ? "" : ""}`}
        disabled={adding || removing}
      >
        <Heart className={`w-4 h-4 ${isFav ? "text-orange-500 fill-orange-500" : "text-orange-500"}`} />
      </button>

      {localError && <div className="text-xs text-red-500">{localError}</div>}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  )
}
