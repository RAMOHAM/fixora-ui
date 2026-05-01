import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { Select, SelectTrigger, SelectItem, SelectValue, SelectContent } from "@/components/ui/select";
import { BOOKING_CATEGORIES, BookingCategoryId, BookingCategoryMeta } from "@/app/shared/categoryConfig";
import { cn } from "@/lib/utils";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    addProfessionalFormSchema,
    ProfessionalFormSchema
} from "@/app/admin/professional/schema/professionalFormSchema";

type AddProfessionalFormModalProps = {
    isOpen: boolean;
    onClose: () => void;
}

function ServiceOption({ cat }: { cat: BookingCategoryMeta }) {
    return (
        <span className="flex items-center gap-2.5">
      <span
          className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
              cat.surfaceClass,
              cat.accentClass
          )}
      >
        <cat.icon className="h-3.5 w-3.5" />
      </span>
            {cat.label}
    </span>
    );
}

const AddProfessionalFormModal = ({ isOpen, onClose } : AddProfessionalFormModalProps) => {
    const { register, setValue, formState: { errors } } = useFormContext<ProfessionalFormSchema>();
    const addProfessionalForm = useForm<ProfessionalFormSchema>({
        resolver: zodResolver(addProfessionalFormSchema),
        mode: "onTouched",
        defaultValues: {
            category: "",
            workerName: "",
            workerEmail: "",
            phoneNumber: ""
        },
    })
    const [category, setCategory] = React.useState<BookingCategoryId | "">("");
    const selected = category ? BOOKING_CATEGORIES.find((c) => c.id === category) : undefined;
    return (
        <FormProvider {...addProfessionalForm}>
            <form>
                <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Add Professional</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-8 py-4">
                            <section className="space-y-4">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Worker Name</Label>
                                        <Input id="workerName" placeholder={"Enter worker name"} className="bg-muted" {...register("workerName")}/>
                                        {errors.workerName && <span className="text-red-500 text-sm font-medium mt-1 inline-block">{errors.workerName.message}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Worker Email</Label>
                                        <Input id="workerEmail" placeholder={"Enter worker email"} className="bg-muted" {...register("workerEmail")}/>
                                        {errors.workerEmail && <span className="text-red-500 text-sm font-medium mt-1 inline-block">{errors.workerEmail.message}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Phone Number</Label>
                                        <Input id="phoneNumber" placeholder={"Enter worker phone number"} className="bg-muted" {...register("phoneNumber")}/>
                                        {errors.phoneNumber && <span className="text-red-500 text-sm font-medium mt-1 inline-block">{errors.phoneNumber.message}</span>}
                                    </div>
                                </div>
                            </section>
                            <Separator/>
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 text-primary font-semibold">
                                    <User className="w-5 h-5"/>
                                    <h3>Specialization</h3>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <Select value={category} onValueChange={() => {setCategory(category)}}>
                                        <SelectTrigger
                                            className={cn(
                                                "h-11 gap-2.5 border-1.5 rounded-xl bg-white font-medium text-sm transition-all",
                                                "focus:ring-2 focus:ring-offset-0",
                                                selected && [
                                                    selected.selectedSurfaceClass,
                                                    selected.selectedRingClass,
                                                    "ring-2",
                                                ]
                                            )}
                                        >
                                            {selected ? (
                                                <span
                                                    className={cn(
                                                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                                                        selected.surfaceClass,
                                                        selected.accentClass
                                                    )}
                                                ><selected.icon className="h-3.5 w-3.5" />
                                        </span>
                                            ) : null}
                                            <SelectValue placeholder={"Select a category"} />
                                        </SelectTrigger>

                                        <SelectContent className="rounded-xl border-1.5 shadow-lg">
                                            {BOOKING_CATEGORIES.map((cat) => (
                                                <SelectItem
                                                    key={cat.id}
                                                    value={cat.id}
                                                    className="flex cursor-pointer items-center gap-2.5 rounded-lg py-2.5 font-medium focus:bg-muted"
                                                >
                                                    <ServiceOption cat={cat} />
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && <span className="text-red-500 text-sm font-medium mt-1 inline-block">{errors.category.message}</span>}
                                </div>
                            </section>
                        </div>
                    </DialogContent>
                </Dialog>
            </form>
        </FormProvider>
    )
}

export default AddProfessionalFormModal;