"use client"

import useAddresses from "@/hooks/address/useAddresses"
import useTranslator from "@/hooks/useTranslator"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/(main)/Profile/Sidebar"
import Header from "@/components/(main)/Profile/Header"
import { useAuth } from "@/components/common/AuthProvider"

export default function AddressPage() {
  const { t } = useTranslator()
  const { addresses, loading, error } = useAddresses()
  const { user } = useAuth()

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      <Header pageName={t("address.title") || "My Addresses"} />
      <div className="flex gap-6">
        <Sidebar currentPage="addresses" />
        <div className="flex-1 shadow-sm p-4">
          <div className="mb-4 border-b pb-2">
            <div className="text-black text-lg">
              {t("address.header") || "ที่อยู่ของฉัน"}
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {t("address.subtitle") || "จัดการข้อมูลที่อยู่สำหรับการจัดส่งของคุณ"}
              </div>
              <div className="text-orange-600 font-medium">
                {user?.email}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{t("address.myAddresses")}</h2>
            <Button variant="normal" size="sm">
              {t("address.addAddress")}
            </Button>
          </div>

          {loading && <p>{t("loading") || "Loading..."}</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && addresses.length === 0 && (
            <p>{t("address.empty") || "You have no saved addresses."}</p>
          )}

          {addresses.map((a) => (
            <div
              key={a.addressId}
              className="mb-4 p-4 border rounded space-y-2"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  {a.addressName && (
                    <div className="font-medium">{a.addressName}</div>
                  )}
                  <div className="text-sm whitespace-pre-line">
                    {a.addressDesc}
                  </div>
                  {a.phone && (
                    <div className="text-sm">{a.phone}</div>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  {t("address.edit")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}