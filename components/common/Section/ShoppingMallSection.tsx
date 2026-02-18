"use client"

import React from "react"
import Image from "next/image"

import Section from "./Section"
import useShoppingMall from "@/hooks/product/useShoppingMall"

const ShoppingMallSection = () => {
  const { items } = useShoppingMall()

  const visible = items.slice(0, 4)

  return (
    <Section name="Shopping Mall" seeMore href="/shopping-mall" grid={4}>
      {visible.length === 0 ? (
        // placeholders
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-md bg-gray-100 aspect-square overflow-hidden shadow-sm" />
        ))
      ) : (
        visible.map((p) => (
          <div key={p.productId} className="flex items-center justify-center p-2">
            <div className="w-full aspect-square overflow-hidden rounded-md bg-white shadow-sm">
              <Image
                src={p.productPic ?? "/shopping/placeholder.svg"}
                alt={`product-${p.productId}`}
                width={400}
                height={400}
                className="w-full h-full object-cover"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          </div>
        ))
      )}
    </Section>
  )
}
export default ShoppingMallSection