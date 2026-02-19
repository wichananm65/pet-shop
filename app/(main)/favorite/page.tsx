"use client"

import useTranslator from "@/hooks/useTranslator"

export default function Page() {
  const { t } = useTranslator()
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold">{t("favorite.title") ?? "Favorites"}</h1>
      <p className="mt-4 text-sm text-muted-foreground">{t("favorite.empty") ?? "No favorites yet."}</p>
    </div>
  )
}
