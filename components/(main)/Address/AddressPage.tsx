"use client"

import React from "react"
import useAddresses from "@/hooks/address/useAddresses"
import useTranslator from "@/hooks/useTranslator"
import { Button } from "@/components/ui/button"
import { useAddAddress, useUpdateAddress, useDeleteAddress } from "@/hooks/address/useAddressMutations"
import Sidebar from "@/components/(main)/Profile/Sidebar"
import Header from "@/components/(main)/Profile/Header"
import AddressForm, { Address } from "@/components/(main)/Address/AddressForm"
import AddressCard from "@/components/(main)/Address/AddressCard"
import { useAuth } from "@/components/common/AuthProvider"
import useProfile from "@/hooks/user/useProfile"
import * as ProfileService from "@/server/service/user/profile-service"
import WarningModal from "@/components/common/WarningModal"
import { MapPinHouse } from 'lucide-react';


export default function AddressPage() {
    const { t } = useTranslator()
    const { addresses, loading, error, reload } = useAddresses()
    const addAddr = useAddAddress()
    const updateAddr = useUpdateAddress()
    const deleteAddr = useDeleteAddress()
    const { user, token, login } = useAuth()
    const { profile, reload: reloadProfile } = useProfile()

    // reload whenever the profile or user context changes in a way that
    // might affect address data (e.g. main address updated in profile)
    React.useEffect(() => {
        reload()
    }, [profile?.mainAddressId, user?.userId, reload])

    // modal state and currently editing address
    const [formOpen, setFormOpen] = React.useState(false)
    const [editing, setEditing] = React.useState<Address | null>(null)
    // deletion confirmation
    const [toDelete, setToDelete] = React.useState<Address | null>(null)

    const openAdd = () => {
        setEditing(null)
        setFormOpen(true)
    }
    const openEdit = (a: Address) => {
        setEditing(a)
        setFormOpen(true)
    }

    const handleSave = async (data: { desc: string; phone: string; name: string }) => {
        try {
            if (editing) {
                await updateAddr(editing.addressId, data.desc, data.phone, data.name)
            } else {
                await addAddr(data.desc, data.phone, data.name)
            }
            await reload()
        } catch (e) {
            console.error(e)
        }
        setFormOpen(false)
    }

    const closeForm = () => setFormOpen(false)
    const confirmDelete = (a: Address) => setToDelete(a)
    const cancelDelete = () => setToDelete(null)
    const doDelete = async () => {
        if (toDelete) {
            try {
                await deleteAddr(toDelete.addressId)
                await reload()
            } catch (e) { console.error(e) }
        }
        setToDelete(null)
    }

    const setMainAddress = async (id: number) => {
        try {
            const updated = await ProfileService.updateProfile({ mainAddressId: id })
            if (login && token) {
                login(token, { ...user!, mainAddressId: updated.mainAddressId })
            }
            reloadProfile()
        } catch (e) {
            console.error("failed to set main address", e)
        }
    }

    // ensure main address appears first in the list
    const mainAddressId = profile?.mainAddressId

    const sortedAddresses = React.useMemo(() => {
        if (!addresses) return []
        if (!mainAddressId) return addresses
        return [...addresses].sort((a, b) => {
            if (a.addressId === mainAddressId) return -1
            if (b.addressId === mainAddressId) return 1
            return 0
        })
    }, [addresses, mainAddressId])

    return (
        <div className="p-4 max-w-5xl mx-auto space-y-6">
            <Header pageName={t("address.title")} />
            <div className="flex gap-6">
                <Sidebar currentPage="addresses" />
                <div className="flex-1 shadow-sm p-4">
                    <div className="mb-4 border-b pb-2">
                        <div className="text-black text-lg">
                            {t("address.header")}
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                {t("address.subtitle")}
                            </div>
                            <Button variant="secondary" size="lg" onClick={openAdd}>
                                <div className="text-xl">
                                    + {t("address.addAddress")}
                                </div>
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-md font-semibold flex items-center gap-2">
                            <MapPinHouse className="text-orange-500" />
                            {t("address.title")}
                        </h2>
                    </div>

                    {loading && <p>{t("loading") || "Loading..."}</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    {/* add/edit modal */}
                    <AddressForm
                        open={formOpen}
                        address={editing ?? undefined}
                        onClose={closeForm}
                        onSave={handleSave}
                    />

                    {!loading && addresses.length === 0 && (
                        <p>{t("address.empty") || "You have no saved addresses."}</p>
                    )}

                    {sortedAddresses.map((a: Address) => (
                        <AddressCard
                            key={a.addressId}
                            address={a}
                            isMain={profile?.mainAddressId === a.addressId}
                            onEdit={() => openEdit(a)}
                            onDelete={() => confirmDelete(a)}
                            onSetMain={() => setMainAddress(a.addressId)}
                        />
                    ))}
                    <WarningModal
                        open={!!toDelete}
                        message={t("warningModal.message")}
                        confirmText={t("warningModal.confirm")}
                        cancelText={t("warningModal.cancel")}
                        onConfirm={doDelete}
                        onCancel={cancelDelete}
                    />
                </div>
            </div>
        </div>
    )
}