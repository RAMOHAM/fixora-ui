"use client";

import { MapPin, Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MultiStepFormProps } from "@/app/book/page";

const AddressDetailsForm = ({ onNext, onBack }: MultiStepFormProps) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
        Where and when?
      </h1>

      {/* Address Section */}
      <div className="space-y-4">
        <label className="text-sm font-bold uppercase tracking-widest text-[#B99525]">
          SERVICE ADDRESS (DUBLIN RESIDENTS)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MapPin className="text-[#847B62] stroke-[2]" size={20} />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#EBEBEB] text-gray-800 placeholder:text-[#847B62]/70 border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white outline-none transition-all text-base"
            placeholder="15 Merrion Square, Dublin 2..."
          />
        </div>
      </div>

      {/* Date & Time Window Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block text-sm font-bold uppercase tracking-widest text-[#B99525]">
            SELECT DATE
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full pl-4 pr-12 py-4 rounded-xl bg-[#EBEBEB] text-gray-800 placeholder:text-gray-800 border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white outline-none transition-all text-base cursor-pointer"
              placeholder="mm/dd/yyyy"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Calendar className="text-gray-800 stroke-[2]" size={20} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-bold uppercase tracking-widest text-[#B99525]">
            PREFERRED WINDOW
          </label>
          <div className="relative">
            <select
              className="w-full pl-4 pr-12 py-4 rounded-xl bg-[#EBEBEB] text-gray-800 border-transparent focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white outline-none transition-all text-base appearance-none cursor-pointer"
              defaultValue="morning"
            >
              <option value="morning">Morning (08:00 - 12:00)</option>
              <option value="afternoon">Afternoon (12:00 - 16:00)</option>
              <option value="evening">Evening (16:00 - 20:00)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <ChevronDown className="text-gray-500 stroke-[2]" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6 flex flex-col md:flex-row justify-end space-y-3 md:space-y-0 md:space-x-4">
        <Button 
          onClick={onBack}
          variant="outline"
          className="px-8 py-6 w-full md:w-auto text-lg rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-bold"
        >
          Back
        </Button>
        <Button 
          onClick={onNext}
          className="px-8 py-6 w-full md:w-auto text-lg rounded-xl bg-brand-gradient text-white hover:opacity-90 transition-opacity font-bold shadow-md"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default AddressDetailsForm;
