"use client"

import React, { useMemo } from "react"
import useOrders from "@/hooks/order/useOrders"
import useTranslator from "@/hooks/useTranslator"
import Sidebar from "@/components/(main)/Profile/Sidebar"
import Header from "@/components/(main)/Profile/Header"

const LatestOrderPage = () => {
    const { orders, loading, error } = useOrders()
    const { t } = useTranslator()

    const sorted = useMemo(() => {
        return [...orders].sort((a, b) => {
            const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
            if (ta && tb) return tb - ta
            return b.orderID - a.orderID
        })
    }, [orders])

    const pending = useMemo(() => {
        return sorted.filter((o) => {
            const s = (o.status || "").toLowerCase()
            return !(s === "delivered" || s === "completed" || s === "success")
        })
    }, [sorted])

    const completed = useMemo(() => {
        return sorted.filter((o) => {
            const s = (o.status || "").toLowerCase()
            return s === "delivered" || s === "completed" || s === "success"
        })
    }, [sorted])

    if (loading) {
        return <div>{t("loading") || "Loading..."}</div>
    }
    if (error) {
        return <div className="text-red-500">{error}</div>
    }

    return (
        <div className="p-4 max-w-5xl mx-auto space-y-6">
            <Header pageName={t("profile.recent_orders") || "Latest Orders"} />
            <div className="flex gap-6">
                <Sidebar currentPage="orders" />
                <div className="flex-1 shadow-sm p-4">
                    {/* latest (pending) orders */}
                    <div className="mb-4 border-b pb-2">
                        <div className="text-black text-lg">
                            {t("latestOrder.latest")}
                        </div>
                    </div>
                    {pending.length === 0 ? (
                        <p>{t("order.noOrders")}</p>
                    ) : (
                        pending.map((ord) => (
                            <div key={ord.orderID} className="p-4 border rounded mb-4 bg-white shadow">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-500">
                                        {ord.createdAt ? new Date(ord.createdAt).toLocaleString() : ""}
                                    </div>
                                    <div className="text-lg font-semibold">
                                        {t("buyNowScreen.total") || "Total"}: {ord.grandPrice}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                        {ord.status || "-"}
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <strong>{t("order.items") || "Items"}:</strong>
                                    <div className="pl-5 mt-1">
                                        {ord.cartItems?.map((item) => (
                                            <div key={item.productID} className="text-sm">
                                                {item.productName || item.productNameTH || `Product ${item.productID}`} &times; {item.quantity}
                                            </div>
                                        )) || <div className="text-sm text-muted">No items</div>}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {/* completed/history section */}
                    {completed.length > 0 && (
                        <div className="mt-8">
                            <div className="mb-4 border-b pb-2">
                                <div className="text-black text-lg">
                                    {t("latestOrder.history")}
                                </div>
                            </div>
                            {completed.map((ord) => (
                                <div key={ord.orderID} className="border border-gray-300 rounded-lg bg-white shadow-sm mb-6">
                                    <div className="px-4 py-3 flex justify-between items-center">
                                        <div className="text-xs text-gray-500">
                                            {ord.createdAt ? new Date(ord.createdAt).toLocaleString() : ""}
                                        </div>
                                        <div className="text-lg font-bold text-gray-900">
                                            {t("buyNowScreen.total") || "Total"}: {ord.grandPrice}
                                        </div>
                                    </div>
                                    <div className="px-4">
                                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                            {ord.status || "-"}
                                        </span>
                                    </div>
                                    <div className="px-4 py-3 border-t border-gray-200">
                                        <div className="text-sm font-medium text-gray-700 mb-1">
                                            {t("order.items") || "Items"}
                                        </div>
                                        <span className="list-disc pl-6 space-y-1">
                                            {ord.cartItems?.map((item) => (
                                                <span key={item.productID} className="text-sm text-gray-600">
                                                    {item.productName || item.productNameTH || `Product ${item.productID}`} &times; {item.quantity}
                                                </span>
                                            )) || <span className="text-sm text-gray-600">No items</span>}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default LatestOrderPage