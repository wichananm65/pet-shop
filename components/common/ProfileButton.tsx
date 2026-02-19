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
import Image from 'next/image'
import { LanguageSwitch } from "./LanguageSwitch"
import { CircleUserRound } from 'lucide-react';


export default function ProfileButton() {
    const { t, lang, setLang } = useTranslator()
    const { logout, user } = useAuth()
    const router = useRouter()

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
                  {user?.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={`${user.firstName ?? user.email ?? 'User'}'s avatar`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full rounded-full"
                      priority={false}
                    />
                  ) : (
                    <CircleUserRound className="size-10 w-full h-full" color="white" />
                  )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                    <div className="flex justify-between mx-2 my-4">
                        <div>
                            <CircleUserRound size={48} color="orange" />
                        </div>
                        <div className="w-full ml-4 mt-3">
                            {user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email : t("profile.account")}
                        </div>
                        <div>
                        </div>
                    </div>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        {t("profile.account")}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        {t("profile.recent_orders")}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        {t("profile.saved_addresses")}
                    </DropdownMenuItem>
                    <div className="flex justify-between">
                        <Button onClick={() => setLang(lang === "en" ? "th" : "en")}>
                            {t("profile.change_language")}
                            <LanguageSwitch />
                        </Button>
                    </div>

                </DropdownMenuGroup>
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOutIcon />
                    {t("profile.logout")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
