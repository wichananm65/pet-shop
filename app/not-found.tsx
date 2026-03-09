"use client"

import { useRouter } from "next/navigation"
import useTranslator from "@/hooks/useTranslator"

export default function NotFound() {
  const router = useRouter()
  const { t } = useTranslator()

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">{t("notFound.title") || "Page not found"}</h1>
      <p className="mb-6 text-center text-gray-600">
        {t("notFound.description") || "Sorry, we couldn\'t find the page you\'re looking for."}
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
      >
        {t("notFound.home") || "Go to Home"}
      </button>
    </div>
  )
}
