"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MultiStepFormProps } from "@/app/book/page";
import { useFormContext } from "react-hook-form";
import { BookingFormData } from "@/app/book/schema/formSchema";

const ContactsDetailsForm = ({ onBack }: MultiStepFormProps) => {
  const { register, formState: { errors } } = useFormContext<BookingFormData>();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
        Contact & Review
      </h1>

      {/* Contact Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block text-sm font-bold uppercase tracking-widest text-[#B99525]">
            EMAIL ADDRESS
          </label>
          <input
            type="email"
            className="w-full px-5 py-4 rounded-xl bg-[#EBEBEB] text-gray-800 placeholder:text-[#847B62]/70 border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white outline-none transition-all text-base"
            placeholder="name@domain.com"
            {...register("email")}
          />
          {errors.email && <span className="text-red-500 text-sm mt-1 inline-block">{errors.email.message}</span>}
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-bold uppercase tracking-widest text-[#B99525]">
            PHONE NUMBER
          </label>
          <input
            type="tel"
            className="w-full px-5 py-4 rounded-xl bg-[#EBEBEB] text-gray-800 placeholder:text-[#847B62]/70 border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white outline-none transition-all text-base"
            placeholder="+353 00 000 0000"
            {...register("phone")}
          />
          {errors.phone && <span className="text-red-500 text-sm mt-1 inline-block">{errors.phone.message}</span>}
        </div>
      </div>

      {/* Verified Pro Guarantee */}
      <div className="bg-[#f0f8f5] border border-[#d6ede4] rounded-xl p-6 flex flex-col md:flex-row gap-4 items-start pb-4">
        <CheckCircle2 className="text-[#0D7A5F] w-6 h-6 flex-shrink-0 mt-0.5 fill-[#0D7A5F]/20" />
        <div>
          <h3 className="font-bold text-[#0D7A5F] text-lg mb-1">
            Verified Pro Guarantee
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our Dublin professionals are fully vetted, background checked, and come with a 100% architectural quality guarantee.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6 flex flex-col md:flex-row justify-end space-y-3 md:space-y-0 md:space-x-4">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="px-8 py-6 w-full md:w-auto text-lg rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-bold"
        >
          Back
        </Button>
        <Button
            type="submit"
            className="px-8 py-6 w-full md:w-auto text-lg rounded-xl bg-brand-gradient text-white hover:opacity-90 transition-opacity font-bold shadow-md"
        >
          Complete Booking
        </Button>
      </div>
    </div>
  );
};

export default ContactsDetailsForm;
