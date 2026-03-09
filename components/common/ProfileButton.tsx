"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import {
    LogOutIcon,
} from "lucide-react"
import useTranslator from "@/hooks/useTranslator"
import { useAuth } from "@/components/common/AuthProvider"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { LanguageSwitch } from "./LanguageSwitch"
import { CircleUserRound } from 'lucide-react';



export default function ProfileButton() {
    const { t, lang, setLang } = useTranslator()
    const { logout, user } = useAuth()
    const router = useRouter()

    // no special mount guard needed anymore - auth provider now starts with
    // null user on both server and client and populates itself in an effect.
    // that keeps the rendered output consistent until auth state is hydrated.

    const handleLogout = () => {
        try {
            logout()
        } catch { }
        router.push("/")
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full w-16 h-16 overflow-hidden">
                    {user?.avatarPic ? (
                        <Image
                            src={user.avatarPic}
                            alt={`${user.firstName ?? user.email ?? 'User'}'s avatar`}
                            className="object-cover w-full h-full rounded-full"
                            width={64}
                            height={64}
                        />
                    ) : (
                        <CircleUserRound className="size-10 w-full h-full" color="white" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                    <div className="flex justify-between mx-2 my-4">
                        {user?.avatarPic ? (
                            <Image
                                src={user.avatarPic}
                                alt={`${user.firstName ?? user.email ?? 'User'}'s avatar`}
                                className="object-cover w-full h-full rounded-full"
                                width={64}
                                height={64}
                            />
                        ) : (
                            <CircleUserRound className="size-10 w-full h-full" color="white" />
                        )}
                        <div className="w-full ml-4 mt-3">
                            {user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email : t("profile.account")}
                        </div>
                        <div>
                        </div>
                    </div>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Button onClick={() => router.push("/profile")}>
                            {t("profile.account")}
                        </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Button onClick={() => router.push("/latest-order")}>
                            {t("profile.recent_orders")}
                        </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Button onClick={() => router.push("/address")}>
                            {t("profile.saved_addresses")}
                        </Button>
                    </DropdownMenuItem>
                    <DropdownMenu>
                        <Button onClick={() => setLang(lang === "en" ? "th" : "en")}>
                            {t("profile.change_language")}
                            <LanguageSwitch />
                        </Button>
                    </DropdownMenu>
                </DropdownMenuGroup>
                <DropdownMenuItem onClick={handleLogout}>
                    <Button>
                        <LogOutIcon />
                        {t("profile.logout")}
                    </Button>

                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}
