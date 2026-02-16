"use client";

import React, { useState } from "react";
import { signIn } from "../../server/service/auth";
import Toast from "../ui/Toast";
import { validateEmail, validatePassword } from "../../utils/validation";
import { Field, FieldLabel, FieldContent, FieldError } from "../ui/field";
import { useAuth } from "@/components/common/AuthProvider";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: "error" | "success" } | null>(null);
  const { login } = useAuth();
  const { isAuthenticated } = useAuth();

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
      login(res.token);
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
        <div style={{ background: "white", padding: 24, borderRadius: 8, width: 360 }}>
          <h3 style={{ marginTop: 0 }}>Sign in</h3>
          <form onSubmit={handleSubmit}>
            <Field style={{ marginBottom: 8 }}>
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  required
                  style={{ width: "100%", padding: 8 }}
                />
                <FieldError>{emailError ?? undefined}</FieldError>
              </FieldContent>
            </Field>

            <Field style={{ marginBottom: 12 }}>
              <FieldLabel>Password</FieldLabel>
              <FieldContent>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError(null);
                  }}
                  required
                  style={{ width: "100%", padding: 8 }}
                />
                <FieldError>{passwordError ?? undefined}</FieldError>
              </FieldContent>
            </Field>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              {isAuthenticated && (
                <button type="button" onClick={onClose} style={{ padding: "8px 12px" }} disabled={loading}>
                  Cancel
                </button>
              )}
              <button type="submit" style={{ padding: "8px 12px" }} disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}

