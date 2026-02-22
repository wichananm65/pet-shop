"use client"

import React from "react"

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: React.ReactNode
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
    ({ label, className = "", ...props }, ref) => {
        return (
            <label className="flex items-center gap-2 cursor-pointer relative">
                <input
                    type="radio"
                    ref={ref}
                    className="peer sr-only"
                    {...props}
                />
                <span
                    className={
                        `w-4 h-4 rounded-full border border-gray-300 bg-white shrink-0 transition-colors ${className} ` +
                        `peer-checked:border-orange-500 ` +
                        `peer-focus-visible:ring-2 peer-focus-visible:ring-orange-500 ` +
                        `hover:peer-checked:border-orange-600 `
                    }
                >
                    <span className="hidden peer-focus-visible:block absolute inset-0 m-auto w-1 h-1 rounded-full bg-orange-500" />
                </span>
                {label}
            </label>
        )
    }
)

Radio.displayName = "Radio"

export default Radio
