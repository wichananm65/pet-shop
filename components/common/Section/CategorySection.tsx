"use client"

import Section from "./Section"
import CategoryCard from "../CategoryCard/CategoryCard"
import useCategory from "@/hooks/category/useCategory"
import useTranslator from "@/hooks/useTranslator"

function slugify(s: string) {
  return encodeURIComponent(s.toLowerCase().replace(/\s+/g, "-"))
}

const CategorySection = () => {
  const { categories, loading } = useCategory(100)
  const { t } = useTranslator()

  // render only server-provided categories (no static fallback)
  const items = (categories || []).map((c) => ({ name: c.categoryName, imageSrc: c.categoryImg ? encodeURI(c.categoryImg) : undefined }))

  return (
    <Section name={t("section.category")} href="/categories" grid="grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4" seeMore={false}>
      {loading && items.length === 0 ? (
        Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-md bg-gray-100 aspect-square overflow-hidden shadow-sm" />
        ))
      ) : (
        items.map((c) => (
          <CategoryCard key={c.name} name={c.name} imageSrc={c.imageSrc} href={`/shopping-mall/${slugify(c.name)}`} />
        ))
      )}
    </Section>
  )
}
export default CategorySection