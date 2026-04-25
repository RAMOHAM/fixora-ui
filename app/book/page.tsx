"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import TaskDetailsForm from "./TaskDetailsForm";
import AddressDetailsForm from "./AddressDetailsForm";
import ContactsDetailsForm from "./ContactsDetailsForm";
import { FormProvider, useForm } from "react-hook-form";
import {
    addressFormSchema,
    BookingFormData,
    BookingFormSchema,
    contactFormSchema,
    taskFormSchema
} from "@/app/book/schema/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormStepper from "@/app/book/FormStepper";
import { uploadVideo } from "@/app/api/supabaseApi";

export type MultiStepFormProps = {
    onNext?: () => void;
    onBack?: () => void;
};

const STEP_SCHEMAS = [taskFormSchema, addressFormSchema, contactFormSchema]

const BookingFormPage = () => {
    const router = useRouter();
    const [step, setStep] = useState<number>(1);
    const totalSteps = STEP_SCHEMAS.length;

    const bookingForm = useForm<BookingFormData>({
        resolver: zodResolver(BookingFormSchema),
        mode: "onTouched",
        defaultValues: {
            category: "cleaning",
            preferredWindow: "morning",
            address: "",
            dateOfJob: "",
            email: "",
            phone: "",
            jobDescription: "",
            videoInput: undefined
        },
    })

    const handleNext = async () => {
        const fields = Object.keys(STEP_SCHEMAS[step - 1].shape) as (keyof BookingFormData)[]
        const valid = await bookingForm.trigger(fields)
        if (valid) {
            setStep((step) => Math.min(totalSteps, step + 1));
        }
    }
    const handlePrev = () => setStep((step) => Math.max(1, step - 1));

    const onSubmit = async (bookingFormData: BookingFormData) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { videoInput, ...formData } = bookingFormData;
            const videoId = bookingFormData.videoInput ? await uploadVideo(bookingFormData.videoInput) : undefined;
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/api/booking`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...formData, videoInput: videoId }),
                }
            );
            if (!res.ok) {
                let message = "We could not complete your booking. Please try again.";
                try {
                    const errBody = await res.json();
                    if (typeof errBody?.message === "string") message = errBody.message;
                } catch {
                    console.error("Error parsing JSON response:", res.statusText);
                }
                toast.error(message);
                return;
            }
            else {
                try {
                    await res.json();
                } catch {
                    console.error("Error parsing JSON response:", res.statusText);
                }
            }
            router.push("/?booking=success");
        } catch {
            toast.error("Something went wrong. Check your connection and try again.");
        }
    };

    return (
        <FormProvider {...bookingForm}>
            <form
                className="min-h-screen bg-slate-50/30 pb-20"
                onSubmit={bookingForm.handleSubmit(onSubmit)}
            >
                <div className="max-w-4xl mx-auto pt-16 px-4">
                    <FormStepper step={step} />
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-12">
                        {step === 1 && <TaskDetailsForm onNext={handleNext} />}
                        {step === 2 && <AddressDetailsForm onNext={handleNext} onBack={handlePrev} />}
                        {step === 3 && <ContactsDetailsForm onBack={handlePrev} />}
                    </div>
                </div>
            </form>
        </FormProvider>
    );
};

export default BookingFormPage;