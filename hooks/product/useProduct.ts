"use client"

import { useEffect, useState, useCallback } from "react"
import * as ProductService from "@/server/service/product/product-service"

export type Product = ProductService.ProductDto

export default function useProduct() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await ProductService.listProducts()
      setProducts(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err ?? "failed to load products"))
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

  const resetAndReload = useCallback(
    async (payload?: Partial<Product>[] ) => {
      try {
        await ProductService.resetProducts(payload as Partial<ProductService.ProductDto>[] | undefined)
        await load()
      } catch (err) {
        // bubble up
        throw err
      }
    },
    [load]
  )

  return { products, loading, error, reload, resetAndReload }
}
