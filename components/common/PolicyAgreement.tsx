"use client"

import React, { useState } from "react"
import useTranslator from "@/hooks/useTranslator"
import { OrangeCheckbox } from "@/components/common/Checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Props {
  checked: boolean
  onChange: () => void
}

export default function PolicyAgreement({ checked, onChange }: Props) {
  const { t } = useTranslator()

  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div className="flex items-center space-x-2">
        <OrangeCheckbox checked={checked} onChange={onChange} />
        <span className="text-sm">
          {t("buyNowScreen.agreeTerms")}
          <Button
            variant="link"
            size="sm"
            className="underline text-blue-600"
            onClick={() => setDialogOpen(true)}
          >
            {t("buyNowScreen.termsLink")}
          </Button>
        </span>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(o) => !o && setDialogOpen(false)}
      >
        <DialogContent className="bg-white max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("buyNowScreen.termsLink")}</DialogTitle>
          </DialogHeader>
          <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">
            {t("buyNowScreen.agreementText")}
          </div>
          <DialogFooter>
            <Button variant="normal" onClick={() => setDialogOpen(false)}>
              {t("close") || "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
