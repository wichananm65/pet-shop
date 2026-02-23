"use client"

import React, { useState } from "react"
import useTranslator from "@/hooks/useTranslator"
import WarningModal from "@/components/common/WarningModal"
import { Button } from "@/components/ui/button"

interface Props extends React.ComponentProps<typeof Button> {
  disabled?: boolean
  onConfirm: () => void
}

export default function OrderButton({ disabled = false, onConfirm, children, ...props }: Props) {
  const { t } = useTranslator()
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleClick = () => {
    if (disabled) return
    setDialogOpen(true)
  }

  const doConfirm = () => {
    setDialogOpen(false)
    onConfirm()
  }

  return (
    <>
      <Button
        {...props}
        disabled={disabled}
        onClick={handleClick}
        className={`${props.className ?? ""} disabled:opacity-50 disabled:cursor-not-allowed`}
        variant='normal'
      >
        {children}
      </Button>
      <WarningModal
        open={dialogOpen}
        message={t("order.confirmMessage")}
        onConfirm={doConfirm}
        onCancel={() => setDialogOpen(false)}
      />
    </>
  )
}
