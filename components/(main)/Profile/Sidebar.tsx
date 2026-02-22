"use client"

import React from "react"
import useTranslator from "@/hooks/useTranslator"
import { useAuth } from "@/components/common/AuthProvider"

interface SidebarProps {
  currentPage: string
}

export default function Sidebar({ currentPage }: SidebarProps) {
  const { t } = useTranslator()
  const { logout } = useAuth()
  // currentPage passed in from parent instead of reading pathname here

  return (
    <nav className="w-1/4 space-y-2 shadow-sm">
      <a
        href="/profile"
        className={`block py-2 px-3 rounded hover:bg-gray-100 ${
          currentPage === "profile" ? "text-orange-600 font-medium" : ""
        }`}
      >
        {t("profile.account")}
      </a>
      <a
        href="/orders"
        className={`block py-2 px-3 rounded hover:bg-gray-100 ${
          currentPage === "orders" ? "text-orange-600 font-medium" : ""
        }`}
      >
        {t("profile.recent_orders")}
      </a>
      <a
        href="/address"
        className={`block py-2 px-3 rounded hover:bg-gray-100 ${
          currentPage === "addresses" ? "text-orange-600 font-medium" : ""
        }`}
      >
        {t("profile.saved_addresses")}
      </a>
      <button
        onClick={logout}
        className="w-full text-left py-2 px-3 rounded hover:bg-gray-100"
      >
        {t("profile.logout")}
      </button>
    </nav>
  )
}
