"use client"

import Section from "./Section"
import CategoryCard from "../CategoryCard/CategoryCard"
import useCategory from "@/hooks/category/useCategory"
import useTranslator from "@/hooks/useTranslator"


const CategorySection = () => {
  const { categories, loading } = useCategory(100)
  const { t, lang } = useTranslator()

  // render only server-provided categories (no static fallback)

  return (
    <Section name={t("section.category")} href="/categories" grid="grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4" seeMore={false}>
      {loading && categories.length === 0 ? (
        Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-md bg-gray-100 aspect-square overflow-hidden shadow-sm" />
        ))
      ) : (
        categories.map((c) => (
          <CategoryCard
            key={c.categoryID}
            name={lang === "th" && c.categoryNameTH ? c.categoryNameTH : c.categoryName}
            imageSrc={c.categoryImg ?? undefined}
            href={`/category/${c.categoryID}`}
          />
        ))
      )}
    </Section>
  )
}
export default CategorySection