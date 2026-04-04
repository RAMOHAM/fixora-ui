"use client";

import { useState } from "react";
import TaskDetailsForm from "./TaskDetailsForm";
import AddressDetailsForm from "./AddressDetailsForm";
import ContactsDetailsForm from "./ContactsDetailsForm";

const BookingFormPage = () => {
  const [step, setStep] = useState(1);

  const handleNext = () => setStep((s) => Math.min(3, s + 1));
  const handlePrev = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20">
      <div className="max-w-4xl mx-auto pt-16 px-4">
        {/* Stepper */}
        <div className="flex items-center justify-center mb-16 max-w-2xl mx-auto">
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-all ${
                step >= 1
                  ? "bg-brand-gradient text-white shadow-md"
                  : "bg-gray-100/80 text-gray-400"
              }`}
            >
              1
            </div>
            <span
              className={`text-xs font-bold mt-3 tracking-widest ${
                step >= 1 ? "text-primarydark" : "text-gray-400"
              }`}
            >
              TASK
            </span>
          </div>

          <div
            className={`flex-1 h-[2px] mx-4 -mt-6 transition-all ${
              step >= 2 ? "bg-primarydark" : "bg-gray-200"
            }`}
          ></div>

          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-all ${
                step >= 2
                  ? "bg-brand-gradient text-white shadow-md"
                  : "bg-gray-100/80 text-gray-400"
              }`}
            >
              2
            </div>
            <span
              className={`text-xs font-bold mt-3 tracking-widest ${
                step >= 2 ? "text-primarydark" : "text-gray-400"
              }`}
            >
              DETAILS
            </span>
          </div>

          <div
            className={`flex-1 h-[2px] mx-4 -mt-6 transition-all ${
              step >= 3 ? "bg-primarydark" : "bg-gray-200"
            }`}
          ></div>

          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-all ${
                step >= 3
                  ? "bg-brand-gradient text-white shadow-md"
                  : "bg-gray-100/80 text-gray-400"
              }`}
            >
              3
            </div>
            <span
              className={`text-xs font-bold mt-3 tracking-widest ${
                step >= 3 ? "text-primarydark" : "text-gray-400"
              }`}
            >
              REVIEW
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-12">
          {step === 1 && <TaskDetailsForm onNext={handleNext} />}
          {step === 2 && <AddressDetailsForm onNext={handleNext} onBack={handlePrev} />}
          {step === 3 && <ContactsDetailsForm onBack={handlePrev} />}
        </div>
      </div>
    </div>
  );
};

export default BookingFormPage;