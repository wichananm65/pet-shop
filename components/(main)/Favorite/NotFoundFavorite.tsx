"use client"

import useTranslator from "@/hooks/useTranslator"
import Link from "next/link"

const NotFoundFavorite = () => {
  const { t } = useTranslator()
  return (
    <div className="p-8 max-w-4xl mx-auto text-center">
      <h2 className="text-xl font-semibold">{t("favorite.emptyTitle") ?? "No favorites yet"}</h2>
      <p className="mt-3 text-sm text-muted-foreground">{t("favorite.empty") ?? "You haven't added any favorite products."}</p>
      <div className="mt-6">
        <Link href="/shopping-mall" className="inline-block px-4 py-2 bg-orange-600 text-white rounded-md">{t("favorite.browse") ?? "Browse products"}</Link>
      </div>
    </div>
  )
}
export default NotFoundFavorite