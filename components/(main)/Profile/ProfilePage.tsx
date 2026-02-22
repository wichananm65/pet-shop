

"use client"

import React, { useState, useEffect } from "react"
import useTranslator from "@/hooks/useTranslator"
import useProfile from "@/hooks/user/useProfile"
import { useAuth } from "@/components/common/AuthProvider"
import AvatarUploader from "./AvatarUploader"
import { useRouter } from "next/navigation"
import ConfirmLeaveModal from "@/components/common/ConfirmLeaveModal"
import { Button } from "@/components/ui/button"
import Sidebar from "./Sidebar"
import Radio from "@/components/common/Radio"
import Header from "./Header"

const ProfilePage = () => {
    const { t } = useTranslator()
    const { profile, loading, error, reload } = useProfile()
    const { token, user, login } = useAuth()
    const router = useRouter()

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phone, setPhone] = useState("")
    const [gender, setGender] = useState("")

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
    // when the profile object reloads (after saving or initial fetch) we clear
    // the inputs so placeholders (rendered below) continue to show the current
    // data. also reset avatar state and editing flag.
    React.useEffect(() => {
        if (profile) {
            setFirstName("")
            setLastName("")
            setPhone("")
            setGender("")
            setPendingAvatarFile(null)
            setPreviewAvatarUrl(null)
            setPendingRemoveAvatar(false)
            setEditing(false)
        }
    }, [profile])

    // determine whether any field has been modified compared to the loaded
    // profile or a new avatar has been chosen; if nothing changed the Save
    // button stays disabled.
    // only track modifications via the `editing` flag (set when user types)
    // or avatar changes; all other values are considered in flux and we don't
    // treat an empty field as a change until the user has actively edited it.
    const hasChanges =
        editing || pendingAvatarFile || pendingRemoveAvatar

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
        <div className="p-4 max-w-5xl mx-auto space-y-6">
            <Header pageName={t("profile.myProfile")} />

            <div className="flex gap-6">
                <Sidebar currentPage="profile" />

                {/* main content area */}
                <div className="flex-1 shadow-sm p-4">
                    {/* informational header above form */}
                    <div className="mb-4 border-b pb-2">
                        <div className="text-black text-lg">
                            {t("profile.infoTitle") || "ข้อมูลของฉัน"}
                        </div>
                        <div className="flex justify-between">
                            <div className="text-sm text-gray-600">
                                {t("profile.infoSubtitle") || "จัดการข้อมูลส่วนตัวเพื่อความปลอดภัยของบัญชีผู้ใช้"}
                            </div>
                            <div className="text-orange-600 font-medium">
                                {user?.email}
                            </div>
                        </div>
                    </div>
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
                                <div className="mb-4 flex items-center gap-8">
                                    <span className="block mb-1">{t("profile.gender")}</span>
                                    <div className="flex gap-6">
                                        <Radio
                                            name="gender"
                                            value="male"
                                            checked={
                                                gender
                                                    ? gender === "male"
                                                    : profile?.gender === "male"
                                            }
                                            onChange={() => { setGender("male"); setEditing(true) }}
                                            label={t("profile.male")}
                                        />
                                        <Radio
                                            name="gender"
                                            value="female"
                                            checked={
                                                gender
                                                    ? gender === "female"
                                                    : profile?.gender === "female"
                                            }
                                            onChange={() => { setGender("female"); setEditing(true) }}
                                            label={t("profile.female")}
                                        />
                                        <Radio
                                            name="gender"
                                            value="other"
                                            checked={
                                                gender
                                                    ? gender === "other"
                                                    : profile?.gender === "other"
                                            }
                                            onChange={() => { setGender("other"); setEditing(true) }}
                                            label={t("profile.other")}
                                        />
                                    </div>
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
                    <div className="mt-6 justify-end flex">
                        <Button
                            disabled={!hasChanges}
                            className="rounded-lg py-2 px-6 bg-linear-to-r from-orange-500 to-yellow-400 text-white font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={async () => {
                                if (!token) return
                                try {
                                    const form = new FormData()
                                    if (firstName !== (profile?.firstName || "")) {
                                        form.append("firstName", firstName)
                                    }
                                    if (lastName !== (profile?.lastName || "")) {
                                        form.append("lastName", lastName)
                                    }
                                    if (phone !== (profile?.phone || "")) {
                                        form.append("phone", phone)
                                    }
                                    if (gender !== (profile?.gender || "")) {
                                        form.append("gender", gender)
                                    }
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
                        </Button>
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
        </div>
    )
}

export default ProfilePage