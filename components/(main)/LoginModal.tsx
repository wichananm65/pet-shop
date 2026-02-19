"use client";

import React, { useState } from "react";
import { signIn } from "../../server/service/auth";
import Toast from "../ui/Toast";
import { validateEmail, validatePassword } from "../../utils/validation";
import { FieldError } from "../ui/field";
import Image from "next/image";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "@/components/common/AuthProvider";
import RegisterModal from "./RegisterModal";
import useTranslator from "@/hooks/useTranslator";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: "error" | "success" } | null>(null);
  const { login } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const { t } = useTranslator();

  function showToast(message: string, type: "error" | "success" = "error") {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // clear previous errors
    setEmailError(null);
    setPasswordError(null);

    let hasError = false;
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }
    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters");
      hasError = true;
    }
    if (hasError) return;

    setLoading(true);
    try {
      const res = await signIn({ email, password });
      login(res.token, res.user);
      showToast("Signed in successfully", "success");
      onClose();
    } catch (err: unknown) {
      let msg = "Login failed";
      if (err && typeof err === "object") {
        const maybe = err as Record<string, unknown>;
        if ("message" in maybe && typeof maybe.message === "string") {
          msg = maybe.message;
        }
      }
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
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
            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-4">
                <label className="relative block">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError(null);
                    }}
                    placeholder={t("auth.emailPlaceholder")}
                    required
                    className="w-full pl-10 pr-4 py-3 border-b border-gray-200 placeholder-muted-foreground outline-none focus:border-orange-400"
                  />
                </label>
                <FieldError className="mt-2">{emailError ?? undefined}</FieldError>
              </div>

              <div className="mb-6">
                <label className="relative block">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError(null);
                    }}
                    placeholder={t("auth.passwordPlaceholder")}
                    required
                    className="w-full pl-10 pr-4 py-3 border-b border-gray-200 placeholder-muted-foreground outline-none focus:border-orange-400"
                  />
                </label>
                <FieldError className="mt-2">{passwordError ?? undefined}</FieldError>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full py-3 bg-linear-to-r from-orange-500 to-yellow-400 text-white text-lg font-medium shadow-md"
                >
                  {loading ? t("auth.signingIn") : t("auth.signIn")}
                </button>

                <button
                  type="button"
                  onClick={() => setShowRegister(true)}
                  className="w-full rounded-full py-3 border border-orange-300 text-orange-500 bg-white"
                >
                  {t("auth.register")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}

