"use client"

import { useRouter } from "next/navigation"
import useTranslator from "@/hooks/useTranslator"

export default function GlobalError({ error }: { error: Error }) {
  const router = useRouter()
  const { t } = useTranslator()

  // You can log the error or send it to monitoring here
  console.error(error)

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">
        {t("error.title") || "Something went wrong"}
      </h1>
      <p className="mb-6 text-center text-gray-600">
        {t("error.description") || "An unexpected error has occurred."}
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
      >
        {t("error.home") || "Go to Home"}
      </button>
    </div>
  )
}
