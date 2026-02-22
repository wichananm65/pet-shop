"use client"

import Image from "next/image"
import { useState } from "react"
import useProductById from "@/hooks/product/useProductById"
import useTranslator from "@/hooks/useTranslator"
import FavoriteButton from "@/components/common/FavoriteButton"
import { Button } from "@/components/ui/button"
import Toast from "@/components/ui/Toast"
import { BreadCrumb } from "@/components/common/BreadCrumb"
import type { ProductV1Dto } from "@/server/service/product/product-service"
import Rating from "../common/Rating"

import { addToCart as apiAddToCart } from "@/server/service/cart/cart-service"
import useCart from "@/hooks/cart/useCart"

type Props = { id: number; initial?: ProductV1Dto | null }

export default function ProductDetail({ id, initial }: Props) {
    const { product, loading, error } = useProductById(id, initial)
    const { t, lang } = useTranslator()
    const [qty, setQty] = useState(1)
    const [toast, setToast] = useState<{ message: string; type?: "error" | "success" } | null>(null)


    if (loading && !product) {
        return <div className="p-8">Loading product…</div>
    }
    if (error) {
        return <div className="p-8 text-red-600">{error}</div>
    }
    if (!product) return <div className="p-8">Product not found</div>

    const dec = () => setQty((s) => Math.max(1, s - 1))
    const inc = () => setQty((s) => s + 1)

    function showToast(message: string, type: "error" | "success" = "success") {
        setToast({ message, type })
        window.setTimeout(() => setToast(null), 3000)
    }

    // localized product title for breadcrumb (prefer TH when user lang is 'th')
    const displayName = lang === "th" ? (product.productNameTH ?? product.productName) : (product.productName ?? product.productNameTH)

    const crumbs = [
        { label: t("home"), href: "/" },
        ...(product.category ? [{ label: product.category, href: `/category/${product.category}` }] : []),
        { label: displayName || product.productName || `#${product.productID}`, current: true },
    ]


    const { reload } = useCart()

    const addToCart = async () => {
        try {
            await apiAddToCart(product.productID, qty)
            await reload()
            showToast(`${t("product.addToCart")} — ${product.productName} × ${qty}`, "success")
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err)
            showToast(msg, "error")
        }
    }
    const buyNow = () => {
        // still a placeholder / could open cart or checkout flow later
        showToast(`${t("product.buyNow")} — ${product.productName} × ${qty}`, "success")
    }

    return (
        <>
            <div className="max-w-6xl mx-auto px-4">
                <div className="pt-4">
                    <BreadCrumb items={crumbs} size="lg" className="mb-4" />
                </div>

                <div className="max-w-4xl mx-auto bg-white rounded-md shadow-sm p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="relative w-full aspect-4/3 bg-gray-50 rounded-md overflow-hidden">
                            <Image src={product.productImg ?? "/shopping/placeholder.svg"} alt={product.productName ?? product.productNameTH ?? `product-${product.productID}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                        </div>

                        <div className="col-span-2">
                            <div className="flex justify-between">
                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">{product.productNameTH ?? product.productName}</div>
                                    <h1 className="text-2xl font-semibold mb-3">{product.productName ?? product.productNameTH}</h1>
                                </div>

                                <FavoriteButton productId={product.productID} />
                            </div>


                            <div className="flex items-center gap-4 mb-4">
                                <div className="text-2xl text-orange-600 font-bold">{product.productPrice ? `฿${product.productPrice}` : ""}</div>
                                <div className="text-sm text-muted-foreground">{product.category}</div>
                                <div className="ml-auto flex items-center gap-3">
                                    <Rating score={product.score ?? 0} size="md"/>

                                </div>
                            </div>

                            {/* show description based on current language (lang) — fall back if missing */}
                            {(() => {
                                const desc = lang === "th" ? (product.productDescTH ?? product.productDesc) : (product.productDesc ?? product.productDescTH)
                                return desc ? <div className="prose prose-sm text-sm text-muted-foreground mb-4">{desc}</div> : null
                            })()}
                        </div>
                    </div>

                    {/* Actions */}

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="text-sm text-muted-foreground">{t("product.quantity")}</div>
                            <div className="inline-flex items-center border rounded-md overflow-hidden">
                                <button className="px-3 py-1 text-sm" onClick={dec} aria-label="decrease">−</button>
                                <div className="px-4 py-1 text-sm bg-white">{qty}</div>
                                <button className="px-3 py-1 text-sm" onClick={inc} aria-label="increase">+</button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="outline" onClick={addToCart} size="lg">{t("product.addToCart")}</Button>
                            <Button onClick={buyNow} size="lg">{t("product.buyNow")}</Button>
                        </div>
                    </div>
                </div>

                {toast && <Toast message={toast.message} type={toast.type} />}
            </div>
        </>
    )
}
