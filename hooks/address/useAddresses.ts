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
  }, [load])

  const reload = useCallback(() => {
    load()
  }, [load])

  return { addresses, loading, error, reload }
}
