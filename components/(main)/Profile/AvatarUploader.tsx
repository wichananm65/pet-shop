"use client"

import React, { useRef } from "react"
import Image from "next/image"
import useTranslator from "@/hooks/useTranslator"

interface Props {
  profilePic?: string | null
  /** optional object URL for a file that has been selected locally but not
      yet uploaded; if provided this takes precedence for display */
  previewUrl?: string
  onFileSelected: (file: File) => void
  /** called when the user clicks "remove"; parent should mark the image as
      pending deletion and wait for Save. */
  onRemoveRequested: () => void
}

export default function AvatarUploader({ profilePic, previewUrl, onFileSelected, onRemoveRequested }: Props) {
  const { t } = useTranslator()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // upload responsibility is lifted to parent via onFileSelected
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) onFileSelected(f)
  }

  const requestRemove = () => {
    onRemoveRequested()
  }

  const displaySrc = previewUrl || profilePic

  return (
    <div className="flex flex-col items-center">
      {displaySrc ? (
        <Image
          src={displaySrc}
          alt="avatar"
          width={96}
          height={96}
          className="rounded-full mb-4 object-cover"
          style={{ objectFit: "cover" }}
          unoptimized={!!previewUrl}
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center">
          <span className="text-gray-500">{t("profile.noImage") || "No Image"}</span>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          className="text-sm text-orange-500 border border-orange-500 rounded px-2 py-1"
          onClick={() => fileInputRef.current?.click()}
        >
          {t("profile.chooseImage") || "เลือกรูป"}
        </button>
        {profilePic && (
          <button
            type="button"
            className="text-sm text-red-500 border border-red-500 rounded px-2 py-1"
            onClick={requestRemove}
          >
            {t("profile.removeImage") || "ลบรูป"}
          </button>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}
