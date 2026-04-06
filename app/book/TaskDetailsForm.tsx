"use client";

import { useState } from "react";
import { Brush, PaintRoller, Wrench, Plug, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MultiStepFormProps } from "@/app/book/page";
import {useFormContext} from "react-hook-form";
import { BookingFormData } from "@/app/book/schema/formSchema";

const categories = [
  { id: "cleaning", label: "Cleaning", icon: Brush },
  { id: "painting", label: "Painting", icon: PaintRoller },
  { id: "plumbing", label: "Plumbing", icon: Wrench },
  { id: "electrical", label: "Electrical", icon: Plug },
];

const TaskDetailsForm = ({ onNext }: MultiStepFormProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("cleaning");
  const { register, formState: { errors } } = useFormContext<BookingFormData>();

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
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            return (
              <button
                type="button"
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-6 border rounded-xl transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary/5 text-primarydark"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-600"
                )}
              >
                <Icon size={32} className="mb-4 stroke-[1.5]" />
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
          className="w-full min-h-[160px] p-6 rounded-xl bg-[#EBEBEB] text-gray-800 placeholder:text-gray-400 border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white outline-none transition-all resize-y text-base"
          placeholder="e.g. Deep cleaning of a 3-bedroom Victorian home in Rathmines, focusing on windows and original floorboards..."
          {...register("jobDescription")}
        />
          {errors.jobDescription && <span>{errors.jobDescription.message}</span>}
      </div>

      {/* Upload Video Section */}
      <div className="space-y-4 pb-4">
        <label className="block text-sm font-bold uppercase tracking-widest text-[#B99525]">
          UPLOAD A QUICK VIDEO WALK-THROUGH (OPTIONAL)
        </label>
        <div className="border-2 border-dashed border-[#d8d8ce] bg-[#f5f6f4] rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors hover:bg-[#f1f2ef] cursor-pointer">
          <div className="text-[#847B62] mb-4 relative">
            <Video size={48} className="stroke-[1.5]" />
            <div className="absolute -top-1 -right-1 bg-white rounded-full">
              {/* Fake small plus symbol, can use a lucide icon but keeping it simple */}
              <div className="bg-[#847B62] text-white text-[10px] w-4 h-4 rounded-sm flex items-center justify-center font-bold absolute -right-0 -top-0">
                +
              </div>
            </div>
          </div>
          <p className="text-gray-700 font-medium mb-6">
            Drag and drop your video here, or click to browse
          </p>
          <Button type="button" className="px-6 py-3 bg-[#e8e9e4] text-[#847B62] font-bold rounded-lg hover:bg-[#dfdcd5] transition-colors">
            Add Video
          </Button>
        </div>
      </div>

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