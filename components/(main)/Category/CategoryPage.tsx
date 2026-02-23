"use client"

import React, { useState } from "react"

import Link from "next/link"
import CarouselSpacing from "@/components/common/Carousel"
import ProductCard from "@/components/common/ProductCard"
import { useParams } from "next/navigation"
import useCategory from "@/hooks/category/useCategory"
import useProductsByCategory from "@/hooks/category/useProductsByCategory"
import useTranslator from "@/hooks/useTranslator"
// TODO: Uncomment and update the import path below if Carousel exists elsewhere
// import CarouselSpacing from "../../common/Carousel"
import Section from "../../common/Section/Section"
import { BreadCrumb } from "@/components/common/BreadCrumb"

const CategoryPage = () => {
  const params = useParams() as { id?: string }
  const idParam = params?.id ?? ""
  const catID = parseInt(idParam, 10)
  const { categories } = useCategory(100)
  const { products, loading: prodLoading, error: prodError } = useProductsByCategory(catID)
  const { t } = useTranslator()

  const { lang } = useTranslator()
  const categoryName = React.useMemo(() => {
    const cat = categories.find((c) => c.categoryID === catID)
    if (!cat) return t("section.category")
    if (lang === "th" && cat.categoryNameTH) {
      return cat.categoryNameTH
    }
    return cat.categoryName
  }, [categories, catID, t, lang])

  // pagination
  const pageSize = 20 // 5 per row x4 rows
  const [page, setPage] = useState(1)
  const pageCount = Math.ceil(products.length / pageSize) || 1
  const paged = products.slice((page - 1) * pageSize, page * pageSize)


  if (isNaN(catID)) {
    return <div className="p-8">Invalid category ID</div>
  }

  return (
    <>
      <div className="flex justify-center items-center mb-6">
        <CarouselSpacing />
      </div>

      <div className="max-w-6xl mx-auto px-4 flex gap-6">
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
              className={`block py-1 px-2 rounded hover:bg-gray-100 ${
                c.categoryID === catID ? "text-orange-600 font-medium" : ""
              }`}
            >
              {display}
            </Link>
          )
        })}
      </aside>

      {/* main content area */}
      <main key={catID} className="flex-1">
        <div className="pt-4">
          <BreadCrumb
            items={[
              { label: t("home"), href: "/" },
              { label: categoryName || t("section.category"), current: true },
            ]}
            size="lg"
            className="mb-4"
          />
        </div>


        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">{categoryName}</h1>
          <span className="text-sm text-muted-foreground">
            {t("categoryPage.items", { count: products.length })}
          </span>
        </div>

        <Section name={categoryName} grid={5} className="relative">
          {prodLoading && paged.length === 0 ? (
            Array.from({ length: pageSize }).map((_, i) => (
              <div
                key={i}
                className="rounded-md bg-gray-100 aspect-4/3 overflow-hidden shadow-sm"
              />
            ))
          ) : (
            paged.map((p) => (
              <ProductCard
                key={p.productId}
                id={p.productId}
                name={p.productName}
                nameTH={p.productNameEn}
                price={p.productPrice}
                img={p.productPic}
                href={`/product/${p.productId}`}
              />
            ))
          )}
        </Section>

        {/* pagination controls */}
        {pageCount > 1 && (
          <div className="flex justify-start items-center mt-4">
            <button
              onClick={() => setPage((q) => Math.max(1, q - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded mr-2"
            >
              Prev
            </button>
            <span className="text-sm">
              {t("categoryPage.page", { page, total: pageCount })}
            </span>
            <button
              onClick={() => setPage((q) => Math.min(pageCount, q + 1))}
              disabled={page === pageCount}
              className="px-3 py-1 border rounded ml-2"
            >
              Next
            </button>
          </div>
        )}

        {prodError && <div className="text-red-500 mt-4">{prodError}</div>}
      </main>
    </div>
    </>
  );
};

export default CategoryPage;