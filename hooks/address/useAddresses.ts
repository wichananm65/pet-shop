"use client"

import { useEffect, useState, useCallback } from "react"
import * as AddressService from "@/server/service/address/address-service"

export type Address = AddressService.AddressDto

export default function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await AddressService.getAddresses()
      setAddresses(data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err ?? "failed to load addresses")
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    // also poll every 15 seconds to keep list in sync with server
    const interval = setInterval(() => {
      load().catch(() => {})
    }, 15000)
    return () => clearInterval(interval)
  }, [load])

  const reload = useCallback(() => {
    // forces a fresh fetch; cancel any ongoing polling
    load()
  }, [load])

  return { addresses, loading, error, reload }
}
