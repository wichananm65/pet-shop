"use client"

import React from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import useTranslator from "@/hooks/useTranslator"

interface Props {
    value: string
    onChange: (v: string) => void
}

export default function SelectPaymentButton({ value, onChange }: Props) {
    const { t } = useTranslator()

    const label =
        value === "cod"
            ? t("buyNowScreen.cod")
            : value === "bank"
                ? t("buyNowScreen.bankTransfer")
                : t("buyNowScreen.qrCode")

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="bg-orange-500 text-white hover:cursor-pointer size-xl">
                    {label}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
                <div className="flex flex-col space-y-2 bg-orange-500">
                    {[
                        { key: "cod", label: t("buyNowScreen.cod") },
                        { key: "bank", label: t("buyNowScreen.bankTransfer") },
                        { key: "qr", label: t("buyNowScreen.qrCode") },
                    ].map((opt) => (
                        <Button
                            key={opt.key}
                            className="bg-orange-500 text-white hover:cursor-pointer border-b border-black"
                            onClick={() => onChange(opt.key)}
                        >
                            {opt.label}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}
