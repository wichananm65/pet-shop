"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Mail, Lock } from "lucide-react"
import { FieldError } from "@/components/ui/field"
import { signUp } from "../../server/service/auth"
import SuccessfullyRegisterMoadl from "./SuccessfullyRegisterMoadl"

export default function RegisterModal({ onClose }: { onClose: () => void }) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [gender, setGender] = useState("male")

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function validate() {
    const e: Record<string, string> = {}
    if (!firstName) e.firstName = "กรุณากรอกชื่อ"
    if (!lastName) e.lastName = "กรุณากรอกนามสกุล"
    if (!email || !email.includes("@")) e.email = "กรุณากรอกอีเมลที่ถูกต้อง"
    if (!password || password.length < 6) e.password = "รหัสผ่านต้องอย่างน้อย 6 ตัวอักษร"
    if (!phone) e.phone = "กรุณากรอกหมายเลขโทรศัพท์"
    if (!gender) e.gender = "กรุณาเลือกเพศ"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await signUp({
        email,
        password,
        firstName,
        lastName,
        phone,
        gender,
      })
      setSuccess(true)
    } catch (err: unknown) {
      let msg = "Registration failed"
      if (err instanceof Error) msg = err.message
      else if (err && typeof err === "object" && "message" in err && typeof (err as { message?: unknown }).message === "string") {
        msg = String((err as { message?: unknown }).message)
      }
      setErrors({ form: msg })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return <SuccessfullyRegisterMoadl onClose={() => { setSuccess(false); onClose(); }} />
  }

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
      <div className="bg-white rounded-xl w-90 sm:w-105 p-8 shadow-lg">
        <div className="flex flex-col items-center">
          <Image src="/logo.png" alt="Meow Meow" width={160} height={120} className="mb-6" />

          <form onSubmit={handleRegister} className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="ชื่อ"
                className="w-full px-3 py-2 border-b border-gray-200 outline-none focus:border-orange-400"
              />
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="นามสกุล"
                className="w-full px-3 py-2 border-b border-gray-200 outline-none focus:border-orange-400"
              />
            </div>

            <div className="mb-4">
              <label className="relative block">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="อีเมล"
                  required
                  className="w-full pl-10 pr-4 py-3 border-b border-gray-200 placeholder-muted-foreground outline-none focus:border-orange-400"
                />
              </label>
              {errors.email && <FieldError className="mt-2">{errors.email}</FieldError>}
            </div>

            <div className="mb-4">
              <label className="relative block">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="รหัสผ่าน"
                  required
                  className="w-full pl-10 pr-4 py-3 border-b border-gray-200 placeholder-muted-foreground outline-none focus:border-orange-400"
                />
              </label>
              {errors.password && <FieldError className="mt-2">{errors.password}</FieldError>}
            </div>

            <div className="mb-4">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="เบอร์โทรศัพท์"
                className="w-full px-3 py-2 border-b border-gray-200 outline-none focus:border-orange-400"
              />
              {errors.phone && <FieldError className="mt-2">{errors.phone}</FieldError>}
            </div>

            <div className="mb-4 flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="gender" value="male" checked={gender === "male"} onChange={() => setGender("male")} /> ชาย
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="gender" value="female" checked={gender === "female"} onChange={() => setGender("female")} /> หญิง
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="gender" value="other" checked={gender === "other"} onChange={() => setGender("other")} /> อื่นๆ
              </label>
            </div>

            {errors.form && <FieldError className="mb-4">{errors.form}</FieldError>}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full py-3 bg-linear-to-r from-orange-500 to-yellow-400 text-white text-lg font-medium shadow-md"
              >
                {loading ? "Processing..." : "ลงทะเบียน"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-full py-3 border border-orange-300 text-orange-500 bg-white"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
