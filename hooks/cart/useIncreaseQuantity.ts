"use client"

import { addToCart } from "@/server/service/cart/cart-service"

// addToCart already calls notifyCartChange() which triggers all subscribed
// useCart() instances (including CartPage's) to reload automatically.
export default function useIncreaseQuantity() {
  return async (productID: number, amount: number = 1) => {
    try {
      await addToCart(productID, amount)
    } catch {
      // ignore; caller may choose to handle error state separately
    }
  }
}
