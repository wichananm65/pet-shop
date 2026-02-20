"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"

import Section from "./Section"
import useShoppingMall from "@/hooks/shoppingMall/useShoppingMall"
import useTranslator from "@/hooks/useTranslator"

const ShoppingMallSection = () => {
  const { items } = useShoppingMall()
  const { t } = useTranslator()

  const visible = items.slice(0, 4)

  return (
    <Section name={t("shoppingMall.title")} seeMore href="/shopping-mall" grid={4}>
      {visible.length === 0 ? (
        // placeholders
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-md bg-gray-100 aspect-square overflow-hidden shadow-sm" />
        ))
      ) : (
        visible.map((p) => (
          <div key={p.productID} className="flex items-center justify-center p-2">
            <Link href={`/product/${p.productID}`} className="relative w-full aspect-square overflow-hidden rounded-md bg-white shadow-sm hover:shadow-md transition">
              <Image
                src={p.productImg ?? "/shopping/placeholder.svg"}
                alt={p.productName ?? p.productNameTH ?? `product-${p.productID}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                priority
              />
            </Link>
          </div>
        ))
      )}
    </Section>
  )
}
export default ShoppingMallSection