"use client"

import { useEffect, useState, useCallback } from "react"
import * as OrderService from "@/server/service/order/order-service"

export type Order = OrderService.OrderDto

export default function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await OrderService.getOrders()
      setOrders(data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err ?? "failed to load orders")
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(() => {
      load().catch(() => {})
    }, 15000)
    return () => clearInterval(interval)
  }, [load])

  const reload = useCallback(() => {
    load()
  }, [load])

  return { orders, loading, error, reload }
}