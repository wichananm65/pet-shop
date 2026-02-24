import { API_BASE_URL } from "../api"
import type { ProductV1Dto } from "../product/product-service"

export type OrderDto = {
  orderID: number
  userID: number
  cart: Record<string, number>
  // additional product info fetched by server based on product IDs
  cartProducts?: Record<string, ProductV1Dto>
  quantity: number
  totalPrice: number
  shippingPrice: number
  grandPrice: number
  status?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

async function handleJsonResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const contentType = res.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      try {
        const data = await res.json()
        const msg =
          data && typeof data === "object" && "message" in data
            ? ((): string => {
                const maybe = data as { message?: unknown }
                return typeof maybe.message === "string"
                  ? maybe.message
                  : String(maybe.message ?? JSON.stringify(data))
              })()
            : JSON.stringify(data)
        throw { status: res.status, message: msg || res.statusText }
      } catch {
        const text = await res.text().catch(() => res.statusText)
        throw { status: res.status, message: text || res.statusText }
      }
    }
    const text = await res.text().catch(() => res.statusText)
    throw { status: res.status, message: text || res.statusText }
  }
  return (await res.json()) as T
}

function authHeaders(): Record<string, string> {
  try {
    const token = localStorage.getItem("authToken")
    return token ? { Authorization: `Bearer ${token}` } : {}
  } catch {
    return {}
  }
}

export async function createOrder(
  cart: Record<string, number>,
  quantity: number,
  totalPrice: number,
  shippingPrice: number,
  grandPrice: number
): Promise<OrderDto> {
  const url = API_BASE_URL ? `${API_BASE_URL}/api/v1/orders` : "/api/v1/orders"
  const headers = {
      "Content-Type": "application/json",
      ...authHeaders(),
    }
  console.log("order-service headers", headers)
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ cart, quantity, totalPrice, shippingPrice, grandPrice }),
  })
  return handleJsonResponse<OrderDto>(res)
}

export async function getOrders(): Promise<OrderDto[]> {
  const url = API_BASE_URL ? `${API_BASE_URL}/api/v1/orders` : "/api/v1/orders"
  const res = await fetch(url, {
    headers: {
      ...authHeaders(),
    },
  })
  return handleJsonResponse<OrderDto[]>(res)
}
