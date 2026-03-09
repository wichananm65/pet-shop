"use client"

import React from "react"
import { Heart } from "lucide-react"
import { useAuth } from "@/components/common/AuthProvider"
import { useFavoritesContext } from "@/components/common/FavoritesContext"
import LoginModal from "@/components/(main)/LoginModal"

export default function FavoriteButton({ productId }: { productId: number }) {
  const { isAuthenticated } = useAuth()
  const { isFavorite, toggle, loading } = useFavoritesContext()
  const [showLogin, setShowLogin] = React.useState(false)
  const [localError, setLocalError] = React.useState<string | null>(null)

  const isFav = isFavorite(productId)

  const onToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLocalError(null)

    if (!isAuthenticated) {
      setShowLogin(true)
      return
    }

    try {
      await toggle(productId)
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
        className="p-2 rounded-full bg-white hover:shadow-sm transition"
        disabled={loading}
      >
        <Heart className={`w-4 h-4 ${isFav ? "text-orange-500 fill-orange-500" : "text-orange-500"}`} />
      </button>

      {localError && <div className="text-xs text-red-500">{localError}</div>}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  )
}
