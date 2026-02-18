"use client"

import { useCallback, useEffect, useState } from "react"
import { listBanners, type BannerDto } from "@/server/service/banner/banner-service"

export default function useBanner(limit = 10) {
  const [banners, setBanners] = useState<BannerDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listBanners(limit)
      setBanners(data)
    } catch (err: any) {
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    load()
  }, [load])

  return { banners, loading, error, reload: load }
}
