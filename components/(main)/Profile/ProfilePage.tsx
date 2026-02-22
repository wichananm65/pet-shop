

"use client"

import React, { useState, useEffect } from "react"
import useTranslator from "@/hooks/useTranslator"
import useProfile from "@/hooks/user/useProfile"
import { useAuth } from "@/components/common/AuthProvider"
import AvatarUploader from "./AvatarUploader"
import { useRouter } from "next/navigation"
import ConfirmLeaveModal from "@/components/common/ConfirmLeaveModal"

const ProfilePage = () => {
  const { t } = useTranslator()
  const { profile, loading, error, reload } = useProfile()
  const { token, user, login } = useAuth()
  const router = useRouter()

  const [firstName, setFirstName] = useState(() => profile?.firstName || "")
  const [lastName, setLastName] = useState(() => profile?.lastName || "")
  const [phone, setPhone] = useState(() => profile?.phone || "")
  const [gender, setGender] = useState(() => profile?.gender || "")

  // when user selects a new avatar we keep the File here and also a
  // temporary object URL so we can show a preview.  actual upload is
  // performed when the Save button is pressed.
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null)
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null)
  const [pendingRemoveAvatar, setPendingRemoveAvatar] = useState(false)
  const [editing, setEditing] = useState(false)

  // warning modal state
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [nextUrl, setNextUrl] = useState("")

  const handleAvatarSelected = (file: File) => {
    setPendingAvatarFile(file)
    setPreviewAvatarUrl(URL.createObjectURL(file))
    setPendingRemoveAvatar(false)
    setEditing(true)
  }

  // if the profile object reloads (after saving or initial fetch) we want to
  // reflect those values back into the inputs and reset any pending avatar
  React.useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "")
      setLastName(profile.lastName || "")
      setPhone(profile.phone || "")
      setGender(profile.gender || "")
      setPendingAvatarFile(null)
      setPreviewAvatarUrl(null)
    }
  }, [profile])

  // determine whether any field has been modified compared to the loaded
  // profile or a new avatar has been chosen; if nothing changed the Save
  // button stays disabled.
  const hasChanges = !!(
    editing ||
    pendingAvatarFile ||
    pendingRemoveAvatar ||
    firstName !== (profile?.firstName || "") ||
    lastName !== (profile?.lastName || "") ||
    phone !== (profile?.phone || "") ||
    gender !== (profile?.gender || "")
  )

  // block browser refresh/close when there are unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [hasChanges])

  // intercept clicks on links and back/forward using native events
  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (!hasChanges || showLeaveModal) return
      const target = e.target as HTMLElement
      const anchor = target.closest("a") as HTMLAnchorElement | null
      if (anchor && anchor.href && !anchor.target && anchor.rel !== "nofollow") {
        e.preventDefault()
        e.stopImmediatePropagation()
        setNextUrl(anchor.href)
        setShowLeaveModal(true)
      }
    }

    const popHandler = (e: PopStateEvent) => {
      if (!hasChanges || showLeaveModal) return
      e.preventDefault()
      // stay on page; history API will already have changed but we can push
      // take a snapshot of the location they attempted to reach before
      // reverting it back
      const attempted = document.location.href
      history.pushState(null, "", window.location.href)
      setNextUrl(attempted)
      setShowLeaveModal(true)
    }

    // use capture to run before Next.js Link handlers
    window.addEventListener("click", clickHandler, true)
    window.addEventListener("popstate", popHandler)
    return () => {
      window.removeEventListener("click", clickHandler, true)
      window.removeEventListener("popstate", popHandler)
    }
  }, [hasChanges, showLeaveModal])

  if (loading) {
    return <div>{t("loading") || "Loading..."}</div>
  }
  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">{t("profile.account")}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
        <div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block mb-1">{t("profile.firstName")}</label>
              <input
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value); setEditing(true) }}
                placeholder={profile?.firstName || t("profile.firstNamePlaceholder")}
                className="w-full px-3 py-2 border-b border-gray-200 outline-none focus:border-orange-400"
              />
            </div>
            <div>
              <label className="block mb-1">{t("profile.lastName")}</label>
              <input
                value={lastName}
                onChange={(e) => { setLastName(e.target.value); setEditing(true) }}
                placeholder={profile?.lastName || t("profile.lastNamePlaceholder")}
                className="w-full px-3 py-2 border-b border-gray-200 outline-none focus:border-orange-400"
              />
            </div>
            <div>
              <label className="block mb-1">{t("profile.phone")}</label>
              <input
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setEditing(true) }}
                placeholder={profile?.phone || t("profile.phonePlaceholder")}
                className="w-full px-3 py-2 border-b border-gray-200 outline-none focus:border-orange-400"
              />
            </div>
            <div className="mb-4 flex gap-4 items-center">
              <label className="block mb-1">{t("profile.gender")}</label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={() => setGender("male")}
                />{' '}
                {t("profile.male")}
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={() => setGender("female")}
                />{' '}
                {t("profile.female")}
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={gender === "other"}
                  onChange={() => setGender("other")}
                />{' '}
                {t("profile.other")}
              </label>
            </div>
            <div className="mt-6">
              <button
                type="button"
                disabled={!hasChanges}
                className="rounded-full py-2 px-6 bg-linear-to-r from-orange-500 to-yellow-400 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={async () => {
                  if (!token) return
                  try {
                    const form = new FormData()
                    form.append("firstName", firstName)
                    form.append("lastName", lastName)
                    form.append("phone", phone)
                    form.append("gender", gender)
                    if (pendingRemoveAvatar) {
                      form.append("removeAvatar", "true")
                    }
                    if (pendingAvatarFile) {
                      // use descriptive key so backend matches more naturally
                      form.append("avatarPic", pendingAvatarFile)
                    }

                    const res = await fetch("/api/v1/profile", {
                      method: "PUT",
                      headers: { Authorization: `Bearer ${token}` },
                      body: form,
                    })
                    const data = await res.json()
                    if (!res.ok) throw new Error(data.message || "update failed")

                    if (user) {
                      login(token, {
                        ...user,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phone: data.phone,
                        gender: data.gender,
                        avatarPic: data.avatarPic,
                      })
                    }

                    reload()
                    setPendingAvatarFile(null)
                    setPreviewAvatarUrl(null)
                    setPendingRemoveAvatar(false)
                    setEditing(false)
                  } catch (err) {
                    console.error("profile save error", err)
                  }
                }}
              >
                {t("profile.save") || "Save"}
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <AvatarUploader
            profilePic={pendingRemoveAvatar ? null : profile?.avatarPic}
            previewUrl={previewAvatarUrl || undefined}
            onFileSelected={handleAvatarSelected}
            onRemoveRequested={() => {
              setPendingAvatarFile(null)
              setPreviewAvatarUrl(null)
              setPendingRemoveAvatar(true)
              setEditing(true)
            }}
          />
        </div>
      </div>

      <ConfirmLeaveModal
        open={showLeaveModal}
        imageSrc="/error/error.png"
        message={t("profile.unsavedWarning") || "You have unsaved changes. Leave anyway?"}
        cancelText={t("cancel") || "Cancel"}
        confirmText={t("profile.leave") || "Leave"}
        onCancel={() => setShowLeaveModal(false)}
        onConfirm={() => {
          setShowLeaveModal(false)
          router.push(nextUrl)
        }}
      />
    </div>
  )
}

export default ProfilePage