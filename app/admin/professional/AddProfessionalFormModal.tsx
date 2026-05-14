"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import React, { useEffect } from "react";
import { BOOKING_CATEGORIES } from "@/app/shared/categoryConfig";
import { cn } from "@/lib/utils";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    addProfessionalFormSchema,
    ProfessionalFormSchema,
} from "@/app/admin/professional/schema/professionalFormSchema";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getProfessionalId, Professional } from "@/app/admin/types";

/** POST body uses the same camelCase fields as the booking flow (`/api/booking`). */
const PROFESSIONAL_CREATE_PATH = "/api/professionals";

/** Mirrors `components/ui/input` styles but uses a native `<input>` so Base UI `Input` → `Field` is not bundled here. That avoids a Turbopack/RSC issue where `useFormContext` from `@base-ui/react/form` can be resolved to `react-hook-form`'s `useFormContext` in the same chunk (null → crash). */
const nativeInputClassName =
    "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

type AddProfessionalFormModalProps = {
    isOpen: boolean;
    onClose: () => void;
    mode?: "create" | "view" | "edit";
    professional?: Professional | null;
    onSaved?: (professional: Professional) => void;
};

const AddProfessionalFormModal = ({
    isOpen,
    onClose,
    mode = "create",
    professional,
    onSaved,
}: AddProfessionalFormModalProps) => {
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProfessionalFormSchema>({
        resolver: zodResolver(addProfessionalFormSchema),
        mode: "onTouched",
        defaultValues: {
            category: "",
            workerName: "",
            workerEmail: "",
            phoneNumber: "",
        },
    });

    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const category = useWatch({ control, name: "category" });
    const selected = category ? BOOKING_CATEGORIES.find((c) => c.id === category) : undefined;

    useEffect(() => {
        if (isOpen) {
            reset({
                category: professional?.category ?? "",
                workerName: professional?.workerName ?? "",
                workerEmail: professional?.workerEmail ?? "",
                phoneNumber: professional?.phoneNumber ?? "",
            });
        }
    }, [isOpen, professional, reset]);

    const onSubmit = async (data: ProfessionalFormSchema) => {
        if (isViewMode) return;

        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;
        if (!baseUrl) {
            toast.error("Backend URL is not configured (NEXT_PUBLIC_BACKEND_SERVER_URL).");
            return;
        }

        const professionalId = professional ? getProfessionalId(professional) : "";
        if (isEditMode && !professionalId) {
            toast.error("This professional is missing an id, so it cannot be updated yet.");
            return;
        }

        try {
            const res = await fetch(
                isEditMode
                    ? `${baseUrl}${PROFESSIONAL_CREATE_PATH}/${professionalId}`
                    : `${baseUrl}${PROFESSIONAL_CREATE_PATH}`,
                {
                method: isEditMode ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                },
            );
            if (!res.ok) {
                let message = `Could not ${isEditMode ? "update" : "add"} professional. Please try again.`;
                try {
                    const errBody = await res.json();
                    if (typeof errBody?.message === "string") message = errBody.message;
                } catch {
                    console.error("Error parsing JSON response:", res.statusText);
                }
                toast.error(message);
                return;
            }
            let savedProfessional: Professional | null = null;
            try {
                savedProfessional = await res.json();
            } catch {
                savedProfessional = null;
            }
            toast.success(isEditMode ? "Professional updated." : "Professional added.");
            onSaved?.(
                savedProfessional ?? ({
                    id: professionalId || crypto.randomUUID(),
                    ...professional,
                    workerName: data.workerName,
                    workerEmail: data.workerEmail,
                    category: data.category,
                    phoneNumber: data.phoneNumber,
                } as Professional),
            );
            onClose();
        } catch {
            toast.error("Something went wrong. Check your connection and try again.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="contents">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            {isViewMode ? "Professional Profile" : isEditMode ? "Update Professional" : "Add Professional"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-8 py-4">
                        <section className="space-y-4">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="workerName">Worker Name</Label>
                                    <input
                                        id="workerName"
                                        placeholder="Enter worker name"
                                        className={cn(nativeInputClassName, "bg-muted")}
                                        autoComplete="name"
                                        disabled={isViewMode}
                                        {...register("workerName")}
                                    />
                                    {errors.workerName && (
                                        <span className="text-red-500 text-sm font-medium mt-1 inline-block">
                                            {errors.workerName.message}
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="workerEmail">Worker Email</Label>
                                    <input
                                        id="workerEmail"
                                        type="email"
                                        placeholder="Enter worker email"
                                        className={cn(nativeInputClassName, "bg-muted")}
                                        autoComplete="email"
                                        disabled={isViewMode}
                                        {...register("workerEmail")}
                                    />
                                    {errors.workerEmail && (
                                        <span className="text-red-500 text-sm font-medium mt-1 inline-block">
                                            {errors.workerEmail.message}
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <input
                                        id="phoneNumber"
                                        type="tel"
                                        placeholder="Enter worker phone number"
                                        className={cn(nativeInputClassName, "bg-muted")}
                                        autoComplete="tel"
                                        disabled={isViewMode}
                                        {...register("phoneNumber")}
                                    />
                                    {errors.phoneNumber && (
                                        <span className="text-red-500 text-sm font-medium mt-1 inline-block">
                                            {errors.phoneNumber.message}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </section>
                        <Separator />
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-primary font-semibold">
                                <User className="w-5 h-5" />
                                <h3>Specialization</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <select
                                        id="category"
                                        className={cn(
                                            "h-11 w-full rounded-xl border border-input bg-white px-3 text-sm font-medium shadow-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
                                            selected && [
                                                selected.selectedSurfaceClass,
                                                selected.selectedRingClass,
                                                "ring-2",
                                            ],
                                        )}
                                        disabled={isViewMode}
                                        {...register("category")}
                                    >
                                        <option value="">Select a category</option>
                                        {BOOKING_CATEGORIES.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <span className="text-red-500 text-sm font-medium mt-1 inline-block">
                                            {errors.category.message}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                    <DialogFooter className="mt-2 sm:justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                            {isViewMode ? "Close" : "Cancel"}
                        </Button>
                        {!isViewMode && (
                            <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : isEditMode ? (
                                    "Update professional"
                                ) : (
                                    "Add professional"
                                )}
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddProfessionalFormModal;
