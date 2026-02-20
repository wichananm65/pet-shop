"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"

import Section from "./Section"
import { Button } from "@/components/ui/button"
import useRecommended from "@/hooks/product/useRecommended"
import useTranslator from "@/hooks/useTranslator"
import FavoriteButton from "@/components/common/FavoriteButton"
import Rating from "@/components/common/Rating"

const RecommendedSection = () => {
    const { products, loadMore, hasMore, loading } = useRecommended()
    const { t } = useTranslator()

    const [maxCards, setMaxCards] = React.useState<number>(12)

    React.useEffect(() => {
        const update = () => {
            const w = window.innerWidth
            // Tailwind breakpoints: sm:640, md:768, lg:1024
            let cols = 2
            if (w >= 1024) cols = 6
            else if (w >= 768) cols = 4
            else if (w >= 640) cols = 3

            const rows = 2 // keep two rows visible by default
            setMaxCards(cols * rows)
        }

        update()
        window.addEventListener("resize", update)
        return () => window.removeEventListener("resize", update)
    }, [])

    const visible = products.slice(0, maxCards)

    return (
        <Section name={t("section.recommended")} href="/products" grid="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6" showMore={false}>
            {visible.map((p) => (
                <Link key={p.productID} href={`/product/${p.productID}`} className="rounded-md overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                    <div className="relative w-full aspect-4/3 bg-white">
                        <div className="absolute left-2 top-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded">สินค้าใหม่</div>
                        <div className="absolute right-2 top-2 bg-pink-400 text-white text-xs px-2 py-0.5 rounded">FREE</div>
                        <Image
                            src={p.productImg ?? "/shopping/placeholder.svg"}
                            alt={p.productName ?? p.productNameTH ?? `product-${p.productID}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                            priority
                        />
                    </div>

                    <div className="p-3">
                        <div className="flex justify-between">
                            <div>
                                <div className="text-xs text-muted-foreground mb-1">{p.productNameTH ? p.productNameTH : p.productName}</div>
                                <div className="text-sm font-semibold truncate">{p.productName ?? p.productNameTH}</div>
                            </div>
                            <FavoriteButton productId={p.productID} />
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                            <div className="text-orange-600 font-semibold">{p.productPrice ? `฿${p.productPrice}` : ""}</div>
                            <div className="flex items-center gap-2">
                                <Rating score={p.score ?? 0} size="sm"/>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}

            {/* See more button at the bottom */}
            {(hasMore || visible.length > 0) && (
                <div className="col-span-full flex justify-center mt-6">
                    <Button
                        variant="default"
                        size="lg"
                        className="w-44 bg-linear-to-tr from-orange-400 via-orange-500 to-orange-600 text-white shadow-md hover:opacity-95"
                        onClick={() => loadMore()}
                        disabled={!hasMore || loading}
                    >
                        {t("section.seeMore")}
                    </Button>
                </div>
            )}
        </Section>
    )
}

export default RecommendedSection