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
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
    onCancel: () => void
}

export default function WarningModal({
    open,
    message,
    imageSrc = "/error/error.png",
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
}: Props) {
    const { t } = useTranslator()

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
            <DialogContent className="bg-white text-center rounded-lg px-4 py-8 w-sm">
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
                        {message || t("warningModal.message")}
                    </DialogTitle>
                </DialogHeader>
                <DialogFooter className="flex justify-between mt-4 gap-4">
                    <div>
                        <Button
                            variant="secondary"
                            className="rounded-full border-orange-500 text-orange-500 bg-white"
                            onClick={onCancel}
                        >
                            {cancelText || t("warningModal.cancel")}
                        </Button>
                    </div>

                    <div>
                        <Button variant="normal" onClick={onConfirm} className="rounded-full py-2 px-6 bg-linear-to-r from-orange-500 to-yellow-400 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                            {confirmText || t("warningModal.confirm")}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
