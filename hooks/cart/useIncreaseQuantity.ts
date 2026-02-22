"use client"

import { addToCart } from "@/server/service/cart/cart-service"
import useCart from "./useCart"

// returns a helper that will increase the quantity of a product by the
// specified amount, updating the server and then reloading the cart.
export default function useIncreaseQuantity() {
  const { reload } = useCart()

  return async (productID: number, amount: number = 1) => {
    try {
      await addToCart(productID, amount)
      await reload()
    } catch {
      // ignore; caller may choose to handle error state separately
    }
  }
}
