"use client"

import React, { useEffect, useState } from "react"
import LoginModal from "@/components/(main)/LoginModal"
import { useAuth } from "@/components/common/AuthProvider"

export default function AuthGate() {
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(id)
  }, [])

  if (!mounted) return null

  if (isAuthenticated) return null

  return <LoginModal onClose={() => { /* LoginModal will call login via context */ }} />
}
