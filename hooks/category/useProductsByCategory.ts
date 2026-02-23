"use client"

import { useCallback, useEffect, useState } from "react"
import { listProductsByCategory, type ProductDto } from "@/server/service/category/category-service"

export default function useProductsByCategory(categoryID: number) {
  const [products, setProducts] = useState<ProductDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listProductsByCategory(categoryID)
      setProducts(data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [categoryID])

  useEffect(() => {
    load()
  }, [load])

  return { products, loading, error, reload: load }
}
