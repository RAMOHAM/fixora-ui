"use client";

import { useEffect } from "react";
import { Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MultiStepFormProps } from "@/app/book/page";
import { useFormContext } from "react-hook-form";
import { BookingFormData } from "@/app/book/schema/formSchema";
import { BOOKING_CATEGORIES } from "@/app/shared/categoryConfig";
import {VideoUploadSection} from "@/app/book/VideoUploadSection";

const TaskDetailsForm = ({ onNext }: MultiStepFormProps) => {
    const { register, watch, setValue, formState: { errors } } = useFormContext<BookingFormData>();
    const selectedCategory = watch("category");

    useEffect(() => {
        if (!selectedCategory) {
            setValue("category", "cleaning");
        }
    }, [selectedCategory, setValue]);

    return (
        <div className="space-y-10">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
                Tell us about your task
            </h1>

            {/* Category Section */}
            <div className="space-y-4">
                <label className="text-sm font-bold uppercase tracking-widest text-[#B99525]">
                    CATEGORY
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {BOOKING_CATEGORIES.map((category) => {
                        const Icon = category.icon;
                        const isSelected = selectedCategory === category.id;
                        return (
                            <button
                                type="button"
                                key={category.id}
                                onClick={() => setValue("category", category.id)}
                                className={cn(
                                    "flex flex-col items-center justify-center p-6 border rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:ring-offset-2",
                                    isSelected
                                        ? cn(
                                            category.selectedSurfaceClass,
                                            category.accentClass,
                                            "ring-2 ring-offset-2 shadow-sm",
                                            category.selectedRingClass
                                        )
                                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm hover:-translate-y-[1px]"
                                )}
                            >
                                <Icon
                                    size={32}
                                    className={cn(
                                        "mb-4 stroke-[1.5]",
                                        isSelected ? category.accentClass : "text-gray-500"
                                    )}
                                />
                                <span className="font-semibold text-sm">{category.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Detailed Description Section */}
            <div className="space-y-4">
                <label className="block text-sm font-bold uppercase tracking-widest text-[#B99525]">
                    DETAILED DESCRIPTION OF THE JOB
                </label>
                <textarea
                    className={cn("w-full min-h-[160px] p-6 rounded-xl bg-[#EBEBEB] text-gray-800 placeholder:text-gray-400 border border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white outline-none transition-all resize-y text-base", errors.jobDescription && "border-red-500 focus:border-red-500 focus:ring-red-500")}
                    placeholder="e.g. Deep cleaning of a 3-bedroom Victorian home in Rathmines, focusing on windows and original floorboards..."
                    {...register("jobDescription")}
                />
                {errors.jobDescription && <span className="text-red-500 text-sm font-medium mt-1 inline-block">{errors.jobDescription.message}</span>}
            </div>

            {/* Upload Video Section */}
            <VideoUploadSection setValue={setValue} />

            {/* Navigation Buttons */}
            <div className="pt-6 flex justify-end">
                <Button
                    type="button"
                    onClick={onNext}
                    className="px-8 py-6 w-full md:w-auto text-lg rounded-xl bg-brand-gradient text-white hover:opacity-90 transition-opacity font-bold shadow-md"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
};

export default TaskDetailsForm;