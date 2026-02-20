"use client"

import Link from "next/link"
import Image from "next/image"
import useTranslator from "@/hooks/useTranslator"
import useFavorites from "@/hooks/favorite/useFavorites"
import FavoriteButton from "@/components/common/FavoriteButton"
import NotFoundFavorite from "./NotFoundFavorite"
import Rating from "@/components/common/Rating"

const FavoritePage = () => {
  const { t } = useTranslator()
  const { items, loading } = useFavorites()

  if (!loading && items.length === 0) {
    return <NotFoundFavorite />
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold">{t("favorite.title") ?? "Favorites"}</h1>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading && items.length === 0
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-md bg-gray-100 aspect-[4/1.2] overflow-hidden shadow-sm" />
            ))
          : items.map((p) => (
              <Link key={p.productID} href={`/product/${p.productID}`} className="flex gap-4 items-center p-4 rounded-md bg-white shadow-sm hover:shadow-md transition">
                <div className="w-36 h-28 bg-gray-50 rounded-md overflow-hidden shrink-0">
                  <Image src={p.productImg ?? "/shopping/placeholder.svg"} alt={p.productName ?? p.productNameTH ?? `product-${p.productID}`} width={400} height={300} className="object-cover w-full h-full" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground">{p.productNameTH ? p.productNameTH : p.productName}</div>
                      <div className="text-sm font-semibold truncate">{p.productName ?? p.productNameTH}</div>
                    </div>
                    <div className="shrink-0">
                      <FavoriteButton productId={p.productID} />
                    </div>
                  </div>

                  <div className="mt-2 flex items-end justify-between gap-4">
                    <div className="text-orange-600 font-semibold">{p.productPrice ? `฿${p.productPrice}` : ""}</div>
                    <Rating score={p.score ?? 0} size="sm" />
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  )
}
export default FavoritePage