"use client"

import { useEffect, useState } from "react"
import useCart from "@/hooks/cart/useCart"
import useTranslator from "@/hooks/useTranslator"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

import { OrangeCheckbox } from "@/components/common/Checkbox"
import useIncreaseQuantity from "@/hooks/cart/useIncreaseQuantity"
import useDecreaseQuantity from "@/hooks/cart/useDecreaseQuantity"

export default function CartPage() {
    const { items, loading, error } = useCart()
    const { t } = useTranslator()

    const [selectAll, setSelectAll] = useState(true)
    const [selected, setSelected] = useState<Record<number, boolean>>({})
    const [quantities, setQuantities] = useState<Record<number, number>>({})
    const increase = useIncreaseQuantity()
    const decrease = useDecreaseQuantity()

    useEffect(() => {
        if (items.length === 0) {
            Promise.resolve().then(() => {
                setSelected({})
                setQuantities({})
                setSelectAll(false)
            })
            return
        }

        const sel: Record<number, boolean> = {}
        const qty: Record<number, number> = {}
        items.forEach((it) => {
            sel[it.productID] = true
            qty[it.productID] = it.quantity
        })
        Promise.resolve().then(() => {
            setSelected(sel)
            setQuantities(qty)
            setSelectAll(true)
        })
    }, [items])

    const toggleAll = () => {
        const newVal = !selectAll
        setSelectAll(newVal)
        const nxt: Record<number, boolean> = {}
        items.forEach((it) => (nxt[it.productID] = newVal))
        setSelected(nxt)
    }

    const toggleOne = (id: number) => {
        const nxt = { ...selected, [id]: !selected[id] }
        setSelected(nxt)
        const all = items.every((it) => nxt[it.productID])
        setSelectAll(all)
    }


    const total = items.reduce((sum, it) => {
        const price = it.productPrice ?? 0
        const qty = quantities[it.productID] || 1
        return sum + price * qty
    }, 0)

    return (
        <div className="mx-40 my-8">
            <div className="flex items-center justify-between mb-6">
                <h1>
                    <span className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-md">
                        <ShoppingCart size={20} />
                        {t("cart.title")}
                    </span>
                </h1>
            </div>

            {loading && <p>Loading…</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && items.length === 0 && (
                <p>{t("cart.empty")}</p>
            )}

            {items.length > 0 && (
                <div className="rounded-lg overflow-hidden">
                    <div className="flex items-center p-4 border-b-2 border-gray-200 gap-4">
                        <div className="w-1/3">
                            <OrangeCheckbox checked={selectAll} onChange={toggleAll} />
                            <span className="ml-2 font-medium">{t("cart.selectAll")}</span>
                        </div>

                        <div className="flex justify-between items-center p-4 w-full">
                            <div className="text-center font-medium">
                                {t("cart.unitPrice")}
                            </div>
                            <div className="text-center font-medium">
                                {t("cart.quantity")}
                            </div>
                            <div className="text-center font-medium">
                                {t("cart.total")}
                            </div>
                        </div>


                    </div>

                    {items.map((p) => (
                        <div
                            key={p.productID}
                            className="flex items-center p-4 border-b-2 border-gray-200 gap-4 "
                        >
                            <div className="flex flex-row w-1/3 gap-4 items-center">
                                <OrangeCheckbox
                                    checked={!!selected[p.productID]}
                                    onChange={() => toggleOne(p.productID)}
                                />

                                <div className="w-24 h-24 relative bg-gray-100 rounded-lg border-2 border-gray-300">
                                    {p.productImg && (
                                        <Image
                                            src={p.productImg}
                                            alt={p.productName ?? ""}
                                            fill
                                            className="object-cover rounded-lg"

                                        />
                                    )}
                                </div>


                                <div className="flex-1">
                                    <div className="text-sm text-gray-500">{t("cart.shop")}</div>
                                    <Link
                                        href={`/product/${p.productID}`}
                                        className="font-medium hover:underline"
                                    >
                                        {p.productName ?? p.productNameTH ?? `#${p.productID}`}
                                    </Link>
                                </div>
                            </div>

                            <div className="flex flex-row justify-between items-center w-full">
                                <div className="w-24 text-center">
                                    ฿{p.productPrice ?? 0}
                                </div>

                                <div className="flex items-center justify-center space-x-2 border rounded-lg border-gray-300">
                                    <button
                                        onClick={() => decrease(p.productID, 1)}
                                        className="p-1 border-r border-gray-300"
                                    >
                                        -
                                    </button>
                                    <span className="text-center">{quantities[p.productID] || 1}</span>
                                    <button
                                        onClick={() => increase(p.productID, 1)}
                                        className="p-1 border-l border-gray-300"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="w-24 text-center">
                                    ฿{(p.productPrice ?? 0) * (quantities[p.productID])}
                                </div>
                            </div>


                        </div>
                    ))}
                </div>
            )
            }

            {
                items.length > 0 && (
                    <div className="mt-40 mb-20 flex flex-col items-end gap-4">

                        <div>
                            <div className="flex flex-row justify-between items-center text-right gap-20">
                                <span className="text-lg">{t("cart.total")}</span>
                                <span className="text-2xl font-bold text-orange-600">฿{total}</span>
                            </div>

                            <Button variant="normal" size="lg" className="w-full">
                                {t("product.buyNow") || "Buy Now"}
                            </Button>
                        </div>



                    </div>
                )
            }
        </div >
    )
}
