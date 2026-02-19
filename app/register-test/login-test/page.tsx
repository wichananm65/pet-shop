"use client";

import { useState } from "react";
import { postJson } from "@/server/service/api";

type RegisterResponse = {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
};

import useTranslator from "@/hooks/useTranslator"

export default function RegisterTestPage() {
  const { t } = useTranslator()
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const data = await postJson<RegisterResponse>("/api/v1/sign-up", form);
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

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="mx-auto max-w-lg rounded-2xl bg-slate-900 p-8 shadow-lg">
        <h1 className="text-2xl font-semibold">{t("test.registerTest")}</h1>
        <p className="mt-2 text-sm text-slate-400">
          POST /api/v1/sign-up
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm text-slate-300">Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              placeholder="you@example.com"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Password</span>
            <input
              type="password"
              required
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              placeholder="Create a strong password"
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm text-slate-300">First name</span>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={(event) => updateField("firstName", event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm text-slate-300">Last name</span>
              <input
                type="text"
                required
                value={form.lastName}
                onChange={(event) => updateField("lastName", event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-sm text-slate-300">Phone</span>
            <input
              type="text"
              required
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              placeholder="081234567890"
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Gender</span>
            <input
              type="text"
              required
              value={form.gender}
              onChange={(event) => updateField("gender", event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
              placeholder="female / male / other"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-70"
          >
            {loading ? t("test.creatingAccount") : t("test.createAccount")}
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
