'use client'

import React from "react"
import { BreadCrumb } from "../common/BreadCrumb"
import Section from "../common/Section/Section"
import Image from "next/image"
import Link from "next/link"
import useShoppingMall from "@/hooks/shoppingMall/useShoppingMall"
import useTranslator from "@/hooks/useTranslator"
import FavoriteButton from "@/components/common/FavoriteButton"
import Rating from "@/components/common/Rating"


const ShoppingMall = () => {
    const { items, loading } = useShoppingMall(100)
    const { t } = useTranslator()

    return (
        <div className="flex flex-col gap-6">
            <div className="max-w-6xl mx-auto w-full mt-10">
                <div className="my-4">
                    <BreadCrumb
                        items={[
                            { label: t("home"), href: "/" },
                            { label: t("shoppingMall.title"), current: true },
                        ]}
                        size="lg"
                        className="font-semibold"
                    />
                </div>
                <Section
                    name={<span className="text-orange-600 font-bold text-2xl">Shopping Mall</span>}
                    headerRight={<div>{t("shoppingMall.totalItems", { count: items.length })}</div>}
                    seeMore={false}
                    grid="grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {/* Local FavoriteButton component placed below for clarity */}
                    {loading && items.length === 0 ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="rounded-md bg-gray-100 aspect-[4/1.2] overflow-hidden shadow-sm" />
                        ))
                    ) : (
                        items.map((p) => (
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
                                        <div className="text-orange-600 font-semibold">{p.price ? `฿${p.price}` : ""}</div>
                                        <Rating score={p.score ?? 0} size="sm" />
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </Section>
            </div>
        </div>
    )
}



export default ShoppingMall