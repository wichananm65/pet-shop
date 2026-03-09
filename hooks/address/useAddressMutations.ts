"use client"

import * as AddressService from "@/server/service/address/address-service"

// These hooks only call the API. The caller is responsible for calling
// reload() from their own useAddresses() instance after a mutation so
// that the displayed list actually updates.

export function useAddAddress() {
  return async (desc: string, phone: string, name: string) => {
    await AddressService.addAddress(desc, phone, name)
  }
}

export function useUpdateAddress() {
  return async (id: number, desc: string, phone: string, name: string) => {
    await AddressService.updateAddress(id, desc, phone, name)
  }
}

export function useDeleteAddress() {
  return async (id: number) => {
    await AddressService.deleteAddress(id)
  }
}
