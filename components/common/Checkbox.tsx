"use client"

import React from "react"

interface CheckboxProps {
  checked: boolean
  onChange: () => void
  // allow optional classnames for flexibility
  className?: string
}

// orange square checkbox with white tick when checked
export function OrangeCheckbox({ checked, onChange, className = "" }: CheckboxProps) {
  return (
    <label className={`relative inline-flex items-center justify-center w-5 h-5 bg-orange-600 rounded-sm cursor-pointer ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          e.preventDefault()
          onChange()
        }}
        className="absolute w-full h-full opacity-0 cursor-pointer"
      />
      {checked && (
        <svg
          className="w-4 h-4 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      )}
    </label>
  )
}
