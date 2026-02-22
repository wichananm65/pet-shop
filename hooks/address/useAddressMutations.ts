"use client"

import useAddresses from "./useAddresses"
import * as AddressService from "@/server/service/address/address-service"

export function useAddAddress() {
  const { reload } = useAddresses()
  return async (desc: string, phone: string, name: string) => {
    await AddressService.addAddress(desc, phone, name)
    await reload()
  }
}

export function useUpdateAddress() {
  const { reload } = useAddresses()
  return async (id: number, desc: string, phone: string, name: string) => {
    await AddressService.updateAddress(id, desc, phone, name)
    await reload()
  }
}

export function useDeleteAddress() {
  const { reload } = useAddresses()
  return async (id: number) => {
    await AddressService.deleteAddress(id)
    await reload()
  }
}
