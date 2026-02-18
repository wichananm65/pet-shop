"use client";

import React from "react";

type ToastProps = {
  message: string;
  type?: "error" | "success";
};

export default function Toast({ message, type = "error" }: ToastProps) {
  const bg = type === "success" ? "#059669" : "#b91c1c";
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        background: bg,
        color: "white",
        padding: "8px 12px",
        borderRadius: 6,
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        zIndex: 10000,
        maxWidth: 360,
      }}
    >
      {message}
    </div>
  );
}
