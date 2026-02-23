"use client"

import React from "react"
import Link from "next/link"
import useCategory from "@/hooks/category/useCategory"
import useTranslator from "@/hooks/useTranslator"
import CategoryCard from "@/components/common/CategoryCard/CategoryCard"

const AllCategory = () => {
  const { categories, loading } = useCategory(0)
  const { t, lang } = useTranslator()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6">
      {/* sidebar */}
      <aside className="w-1/4 space-y-2">
        <div className="font-semibold mb-2">{t("section.category")}</div>
        <Link
          href="/categories"
          className="block py-1 px-2 rounded hover:bg-gray-100"
        >
          {t("category.all")}
        </Link>
        {categories.map((c) => {
          const display = lang === "th" && c.categoryNameTH ? c.categoryNameTH : c.categoryName
          return (
            <Link
              key={c.categoryID}
              href={`/category/${c.categoryID}`}
              className="block py-1 px-2 rounded hover:bg-gray-100"
            >
              {display}
            </Link>
          )
        })}
      </aside>

      <main className="flex-1">
        <h1 className="text-2xl font-semibold mb-4">{t("category.all")}</h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {loading && categories.length === 0
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-md bg-gray-100 aspect-square overflow-hidden shadow-sm"
                />
              ))
            : categories.map((c) => {
                const name = lang === "th" && c.categoryNameTH ? c.categoryNameTH : c.categoryName
                return (
                  <CategoryCard
                    key={c.categoryID}
                    name={name}
                    imageSrc={c.categoryImg ?? undefined}
                    href={`/category/${c.categoryID}`}
                  />
                )
              })}
        </div>
      </main>
    </div>
  )
}

export default AllCategory
