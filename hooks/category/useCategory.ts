"use client"

import { useCallback, useEffect, useState } from "react"
import { listCategories, type CategoryDto } from "@/server/service/category/category-service"

export default function useCategory(limit = 100) {
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listCategories(limit)
      setCategories(data)
    } catch (err: any) {
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    load()
  }, [load])

  return { categories, loading, error, reload: load }
}
