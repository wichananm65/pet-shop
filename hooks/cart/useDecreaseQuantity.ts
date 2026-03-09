"use client"

import { addToCart } from "@/server/service/cart/cart-service"

// addToCart already calls notifyCartChange() which triggers all subscribed
// useCart() instances (including CartPage's) to reload automatically.
export default function useDecreaseQuantity() {
  return async (productID: number, amount: number = 1) => {
    try {
      // send a negative value; server must handle properly
      await addToCart(productID, -amount)
    } catch {
      // ignore errors for now
    }
  }
}
