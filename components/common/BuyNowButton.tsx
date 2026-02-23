"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Props extends React.ComponentProps<typeof Button> {
  href?: string
  onClick?: () => void
}

export default function BuyNowButton({ href = "/cart/buy-now-screen", onClick, ...props }: Props) {
  const router = useRouter()
  const handle = () => {
    if (onClick) {
      onClick()
    } else {
      router.push(href)
    }
  }
  return <Button {...props} onClick={handle} />
}
