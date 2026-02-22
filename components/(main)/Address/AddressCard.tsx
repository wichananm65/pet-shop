"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import useTranslator from "@/hooks/useTranslator"
import { Edit } from "lucide-react"

export type Address = {
    addressId: number
    addressName?: string | null
    addressDesc?: string | null
    phone?: string | null
}

interface Props {
    address: Address
    isMain?: boolean
    onEdit?: () => void
    onDelete?: () => void
    onSetMain?: () => void
}

export default function AddressCard({
    address,
    isMain = false,
    onEdit,
    onDelete,
    onSetMain,
}: Props) {
    const { t } = useTranslator()

    return (
        <div className="mb-4 p-4 border-b border-gray-300 space-y-2">
            <div className="space-y-1">
                <div className="flex justify-between">
                    <div>
                        {address.addressName && (
                            <div className="font-medium flex items-center gap-2">
                                <div className="text-xl">
                                    {address.addressName}
                                </div>
                                <div>
                                    |
                                </div>
                                <div className="text-xl">
                                    {address.phone}
                                </div>
                                {isMain && (
                                    <span className="text-xs text-white bg-orange-400 mx-6 px-2 py-1 rounded">
                                        {t("address.mainAddress")}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    <div>
                        {onDelete && (
                            <Button size="icon" onClick={onDelete} className="text-red-500 hover:cursor-pointer justify-end">
                                {t("address.delete")}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="text-sm text-gray-500 whitespace-pre-line">
                    {address.addressDesc}
                </div>
            </div>
            <div className="flex flex-col justify-end">
                <div className="flex justify-end">
                    {onEdit && (
                        <Button size="icon" onClick={onEdit} className="p-1 hover:cursor-pointer justify-end text-orange-500">
                            <Edit className="w-4 h-4" />
                            <span className="sr-only">{t("address.edit")}</span>
                        </Button>
                    )}
                </div>
                <div className="flex justify-end">
                    {(
                        <Button onClick={onSetMain} className="hover:cursor-pointer border border-gray-500 text-gray-500">
                            {t("address.setAsMain")}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
