"use client"

import React from "react"
import { Check } from "lucide-react"

export default function SuccessfullyRegisterMoadl({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.4)",
        zIndex: 9999,
      }}
    >
      <div className="bg-white rounded-xl w-72 p-8 shadow-lg flex flex-col items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-linear-to-r from-orange-400 to-yellow-400 flex items-center justify-center shadow-lg">
          <Check className="text-white" size={36} />
        </div>
        <div className="text-orange-500 font-semibold text-lg">ลงทะเบียนสำเร็จ</div>
        <button
          className="w-36 rounded-full py-2 border border-orange-300 text-orange-500"
          onClick={onClose}
        >
          ปิด
        </button>
      </div>
    </div>
  )
}
