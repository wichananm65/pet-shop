"use client";

import { useState } from "react";
import { postJson } from "@/server/service/api";
import useTranslator from "@/hooks/useTranslator";

type LoginResponse = {
  message: string;
  token: string;
  user: {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    gender?: string;
  };
};

export default function LoginTestPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const data = await postJson<LoginResponse>("/api/v1/sign-in", {
        email,
        password,
      });
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      const message =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Unknown error";
      setResult(message);
    } finally {
      setLoading(false);
    }
  };

  const { t } = useTranslator()

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="mx-auto max-w-lg rounded-2xl bg-slate-900 p-8 shadow-lg">
        <h1 className="text-2xl font-semibold">{t("test.loginTitle")}</h1>
        <p className="mt-2 text-sm text-slate-400">
          POST /api/v1/sign-in
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm text-slate-300">{t("auth.email")}</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              placeholder={t("auth.emailPlaceholder") || "you@example.com"}
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">{t("auth.password")}</span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              placeholder={t("auth.passwordPlaceholder") || "••••••••"}
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-70"
          >
            {loading ? t("auth.signingIn") : t("auth.signIn")}
          </button>
        </form>

        <div className="mt-6">
          <h2 className="text-sm font-medium text-slate-300">{t("test.response")}</h2>
          <pre className="mt-2 max-h-60 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-300">
            {result || t("test.noResponse")}
          </pre>
        </div>
      </div>
    </div>
  );
}
