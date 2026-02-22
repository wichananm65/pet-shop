"use client"

import React from "react"
import useTranslator from "@/hooks/useTranslator"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog"

export type Address = {
    addressId: number
    addressName?: string | null
    addressDesc?: string | null
    phone?: string | null
}

interface Props {
    open: boolean
    address?: Address | null
    onClose: () => void
    onSave: (data: { desc: string; phone: string; name: string }) => void
}

export default function AddressForm({ open, address, onClose, onSave }: Props) {
    const { t } = useTranslator()

    const [firstName, setFirstName] = React.useState("")
    const [lastName, setLastName] = React.useState("")
    const [phoneInput, setPhoneInput] = React.useState("")
    const [descInput, setDescInput] = React.useState("")

    React.useEffect(() => {
        if (address) {
            const parts = (address.addressName || "").split(" ")
            setFirstName(parts[0] || "")
            setLastName(parts.slice(1).join(" "))
            setPhoneInput(address.phone || "")
            setDescInput(address.addressDesc || "")
        } else {
            setFirstName("")
            setLastName("")
            setPhoneInput("")
            setDescInput("")
        }
    }, [address])

    const handleSave = () => {
        const name = `${firstName} ${lastName}`.trim()
        onSave({ desc: descInput, phone: phoneInput, name })
    }

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="bg-white w-full">
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium">
                        {address ? t("address.edit") : t("address.addAddress")}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder={t("address.firstName") || "First name"}
                            className="w-full px-3 py-2 border-b border-gray-200 outline-none focus:border-orange-400"
                        />
                        <input
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder={t("address.lastName") || "Last name"}
                            className="w-full px-3 py-2 border-b border-gray-200 outline-none focus:border-orange-400"
                        />
                    </div>
                    <input
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder={t("address.phonePlaceholder") || "Phone number"}
                        className="w-full px-3 py-2 border-b border-gray-200 outline-none focus:border-orange-400"
                    />
                    <textarea
                        value={descInput}
                        onChange={(e) => setDescInput(e.target.value)}
                        placeholder={t("address.addressPlaceholder") || "Address"}
                        className="w-full px-3 py-2 border-b border-gray-200 outline-none focus:border-orange-400 resize-none"
                        rows={4}
                    />
                </div>
                <div className="flex justify-end items-center">
                    <DialogFooter className="flex justify-end gap-2 mt-4">
                        <Button variant="secondary" onClick={onClose} className="w-1/2">
                            {t("cancel")}
                        </Button>
                        <Button variant="normal" className="w-1/2" onClick={handleSave}>{t("save")}</Button>
                    </DialogFooter>
                </div>

            </DialogContent>
        </Dialog>
    )
}
