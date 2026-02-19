"use client"

import { useCallback, useEffect, useState } from "react"
import { getProductV1, type ProductV1Dto } from "@/server/service/product/product-service"
import { API_BASE_URL } from "@/server/service/api"

function normalizeUrl(u?: string | null) {
  if (!u) return undefined
  if (u.startsWith("http://") || u.startsWith("https://")) return u
  if (u.startsWith("/")) return u
  if (API_BASE_URL) return `${API_BASE_URL}${u}`
  return u
}

export default function useProductById(id?: number | string, initial?: ProductV1Dto | null) {
  const [product, setProduct] = useState<ProductV1Dto | null>(initial ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await getProductV1(Number(id))
      // normalize image URL for next/image
      if (data.productImg) data.productImg = normalizeUrl(data.productImg)
      setProduct(data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err ?? "failed to load product")
      setError(msg)
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    // only load if no initial data provided
    if (!product && id) load()
  }, [id, load, product])

  return { product, loading, error, reload: load }
}
