"use client"

import Image from "next/image"
import React from "react"
import useTranslator from "@/hooks/useTranslator"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Props {
    open: boolean
    message?: string
    imageSrc?: string
    buttonText?: string
    onClose: () => void
}

export default function SuccessModal({
    open,
    message,
    imageSrc = "/verified.png",
    buttonText,
    onClose,
}: Props) {
    const { t } = useTranslator()

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="bg-white text-center rounded-lg px-4 py-8 w-sm">
                {imageSrc && (
                    <div className="flex justify-center">
                        <Image
                            src={imageSrc}
                            alt="Success"
                            width={64}
                            height={64}
                            className="w-16 h-16"
                        />
                    </div>
                )}
                <DialogHeader>
                    <DialogTitle className="whitespace-pre-line text-center mt-8">
                        {message || t("successModal.message")}
                    </DialogTitle>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <Button variant="normal" onClick={onClose} className="rounded-full py-2 px-6 bg-linear-to-r from-orange-500 to-yellow-400 text-white font-medium">
                        {buttonText || t("successModal.button")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
