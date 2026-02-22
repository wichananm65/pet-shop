"use client"

import { addToCart } from "@/server/service/cart/cart-service"
import useCart from "./useCart"

// decreases the quantity on the server then reloads the cart.  If the
// backend clamps to zero or removes the item, the subsequent fetch will reflect
// that.
export default function useDecreaseQuantity() {
  const { reload } = useCart()

  return async (productID: number, amount: number = 1) => {
    try {
      // send a negative value; server must handle properly
      await addToCart(productID, -amount)
      await reload()
    } catch {
      // ignore errors for now
    }
  }
}
