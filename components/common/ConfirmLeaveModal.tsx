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
    imageSrc?: string
    message?: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmLeaveModal({
    open,
    imageSrc = "/error/error.png",
    onConfirm,
    onCancel,
}: Props) {
    const { t } = useTranslator()

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="bg-white text-center rounded-lg px-1 py-8 w-sm">
                {imageSrc && (
                    <div className="flex justify-center">
                        <Image
                            src={imageSrc}
                            alt="Warning"
                            width={64}
                            height={64}
                            className="w-16 h-16"
                        />
                    </div>
                )}
                <DialogHeader>
                    <DialogTitle className="whitespace-pre-line text-center mt-8">
                        {t("confirmLeaveModal.unsavedWarning")}
                    </DialogTitle>
                </DialogHeader>
                <DialogFooter className="flex justify-between mt-4 gap-8">
                    <div>
                        <Button
                            variant="outline"
                            className="rounded-full border-orange-500 text-orange-500 bg-white"
                            onClick={onCancel}
                        >
                            {t("confirmLeaveModal.cancel")}
                        </Button>
                    </div>

                    <div>
                        <Button variant="destructive" onClick={onConfirm} className="rounded-full py-2 px-6 bg-linear-to-r from-orange-500 to-yellow-400 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                            {t("confirmLeaveModal.confirm")}
                        </Button>
                    </div>


                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
