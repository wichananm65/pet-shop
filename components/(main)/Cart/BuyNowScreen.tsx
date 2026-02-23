"use client"

import React, { useState, useMemo } from "react"

import { createOrder } from "@/server/service/order/order-service"
import useCart from "@/hooks/cart/useCart"
import { clearCart } from "@/server/service/cart/cart-service"
import Image from "next/image"
import useAddresses from "@/hooks/address/useAddresses"
import useProfile from "@/hooks/user/useProfile"
import useTranslator from "@/hooks/useTranslator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import SelectPaymentButton from "@/components/common/SelectPaymentButton"
import PolicyAgreement from "@/components/common/PolicyAgreement"
import OrderButton from "@/components/common/OrderButton"
import SuccessModal from "@/components/common/SuccessModal"
import { Button } from "@/components/ui/button"
import { MapPinHouse } from 'lucide-react';
import { NotepadText } from 'lucide-react';
import { useRouter } from "next/navigation";

const BuyNowScreen = () => {
    const { t } = useTranslator()
    const { items, loading, error, reload } = useCart()
    const { addresses } = useAddresses()
    const { profile } = useProfile()
    const router = useRouter()

    // address selection
    const mainAddressId = profile?.mainAddressId
    const sortedAddresses = useMemo(() => {
        if (!addresses) return []
        if (!mainAddressId) return addresses
        return [...addresses].sort((a, b) => {
            if (a.addressId === mainAddressId) return -1
            if (b.addressId === mainAddressId) return 1
            return 0
        })
    }, [addresses, mainAddressId])

    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
        () => mainAddressId ?? (sortedAddresses[0]?.addressId ?? null)
    )
    const [addressDialogOpen, setAddressDialogOpen] = useState(false)

    const [paymentMethod, setPaymentMethod] = useState<string>("cod")
    const [agreementAccepted, setAgreementAccepted] = useState(false)

    const [successOpen, setSuccessOpen] = useState(false)

    // if addresses arrive and none selected, pick first
    React.useEffect(() => {
        if (selectedAddressId == null && sortedAddresses.length > 0) {
            setSelectedAddressId(sortedAddresses[0].addressId)
        }
    }, [sortedAddresses, selectedAddressId])

    // update selection whenever mainAddressId changes
    React.useEffect(() => {
        if (mainAddressId) {
            setSelectedAddressId(mainAddressId)
        }
    }, [mainAddressId])

    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
    const itemsTotal = items.reduce((sum, i) => sum + (i.productPrice ?? 0) * i.quantity, 0)
    const shippingCost = 10
    const grandTotal = itemsTotal + shippingCost

const handleOrder = async () => {
    try {
      const cartMap: Record<string, number> = {}
      items.forEach((it) => {
        cartMap[String(it.productID)] = it.quantity
      })
      const data = await createOrder(
        cartMap,
        itemCount,
        itemsTotal,
        shippingCost,
        grandTotal
      )
      console.log("order response", data)
      // clear client cart state and inform other components
      await clearCart()
      await reload()
      setSuccessOpen(true)
    } catch (e: unknown) {
      console.error(e)
      const errObj = e as { status?: number; message?: string }
      if (errObj?.status === 401) {
        alert("Please log in to complete your order")
        router.push("/auth/login")
       } else {
        alert("failed to place order")
      }
    }
    }

    const selectedAddress = sortedAddresses.find((a) => a.addressId === selectedAddressId)

    return (
        <div className="mx-40 my-8">
            <h1 className="text-2xl font-semibold">{t("buyNowScreen.title")}</h1>
            {loading && <p className="text-gray-500">Loading…</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && items.length === 0 && (
                <p className="text-center text-gray-500">{t("cart.empty")}</p>
            )}
            {/* address section */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="font-medium flex items-center gap-2">
                        <MapPinHouse className="w-5 h-5" />
                        {t("buyNowScreen.addressSection")}
                    </span>
                    <Button variant="link" size="sm" onClick={() => setAddressDialogOpen(true)}>
                        <div className="text-orange-500">
                            {t("buyNowScreen.editAddress")}
                        </div>
                    </Button>
                </div>
                <div className="py-2">
                    {selectedAddress ? (
                        <div className="space-y-1 px-8">
                            <div className="font-medium">
                                {selectedAddress.addressName} {selectedAddress.phone}
                            </div>
                            <div className="text-sm whitespace-pre-line text-gray-600">
                                {selectedAddress.addressDesc}
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-500">{t("address.empty")}</div>
                    )}
                </div>
            </div>
            {/* items list (copied from cart page style) */}
            <div className="rounded-lg overflow-hidden">
                <div className="flex items-center p-4 border-b-2 border-gray-200 gap-4">
                    <div className="w-1/3">
                        {/* empty header cell for image/name */}
                    </div>
                    <div className="flex justify-between items-center p-4 w-full">
                        <div className="text-center font-medium">{t("cart.unitPrice")}</div>
                        <div className="text-center font-medium">{t("cart.quantity")}</div>
                        <div className="text-center font-medium">{t("cart.total")}</div>
                    </div>
                </div>
                {items.map((it) => (
                    <div
                        key={it.productID}
                        className="flex items-center p-4 border-b-2 border-gray-200 gap-4"
                    >
                        <div className="flex flex-row w-1/3 gap-4 items-center">
                            <div className="w-24 h-24 relative bg-gray-100 rounded-lg border-2 border-gray-300">
                                {it.productImg && (
                                    <Image
                                        src={it.productImg}
                                        alt={it.productName ?? ""}
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="text-sm text-gray-500">{t("cart.shop")}</div>
                                <div className="font-medium">
                                    {it.productName ?? it.productNameTH ?? `#${it.productID}`}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-center w-full">
                            <div className="w-24 text-center">฿{it.productPrice ?? 0}</div>
                            <div className="w-24 text-center">{it.quantity}</div>
                            <div className="w-24 text-center">
                                ฿{(it.productPrice ?? 0) * it.quantity}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={addressDialogOpen} onOpenChange={(o) => !o && setAddressDialogOpen(false)}>
                <DialogContent className="max-w-sm bg-white p-4 rounded-lg">
                    <DialogHeader>
                        <DialogTitle>{t("buyNowScreen.addressSection")}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                        {sortedAddresses.map((a) => (
                            <div
                                key={a.addressId}
                                className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                                onClick={() => {
                                    setSelectedAddressId(a.addressId)
                                    setAddressDialogOpen(false)
                                }}
                            >
                                <div className="font-medium">
                                    {a.addressName} {a.phone}
                                    {a.addressId === mainAddressId && (
                                        <span className="ml-2 text-xs text-white bg-orange-400 px-1 rounded">
                                            {t("address.mainAddress")}
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm whitespace-pre-line text-gray-600">
                                    {a.addressDesc}
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* payment section */}
            <div className="py-10 border-b-2 border-gray-300">
                <div className="flex flex-row gap-20">
                    <div className="font-medium text-orange-500 text-xl">
                        {t("buyNowScreen.paymentSelect")}
                    </div>
                    <div>
                        <SelectPaymentButton value={paymentMethod} onChange={setPaymentMethod} />
                    </div>

                </div>

            </div>

            <div>


                {/* summary and order */}
                <div className="py-8 space-y-2 flex justify-between">
                    <div className="w-2/3 font-extrabold text-orange-500 text-xl gap-8">
                        <div><NotepadText className="inline-block mr-2 text-orange-300" />
                            {t("buyNowScreen.paymentInfo")}
                        </div>
                    </div>
                    <div className="justify-end w-1/3 font-medium text-xl">
                        <div className="flex justify-between">
                            <span>{t("buyNowScreen.itemsCount")}</span>
                            <div>
                                {itemCount} {t("buyNowScreen.order")}
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span>{t("buyNowScreen.orderLabel")}</span>
                            <span>฿{itemsTotal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{t("buyNowScreen.shipping")}</span>
                            <span>฿{shippingCost}</span>
                        </div>
                        <div className="flex justify-between">
                            <div className="text-2xl font-bold">
                                {t("buyNowScreen.total")}
                            </div>
                            <div className="text-orange-500 text-2xl font-bold">
                                ฿{grandTotal}
                            </div>

                        </div>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div>
                        {/* agreement */}
                        <PolicyAgreement
                            checked={agreementAccepted}
                            onChange={() => setAgreementAccepted((v) => !v)}
                        />
                    </div>
                    <div>
                        <OrderButton
                            className="w-full mt-4"
                            disabled={!agreementAccepted}
                            onConfirm={handleOrder}
                            size='lg'
                        >
                            {t("product.buyNow")}
                        </OrderButton>
                    </div>
                </div>

            </div>

        {/* show success dialog */}
        <SuccessModal
            open={successOpen}
            onClose={() => {
                setSuccessOpen(false)
                router.push("/orders")
            }}
        />
        </div>
    )
}

export default BuyNowScreen