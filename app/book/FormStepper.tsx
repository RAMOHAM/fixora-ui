export type StepperProps = {
    step: number;
}

const FormStepper = ({step} : StepperProps) => {
    return(
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
    )
}

export default FormStepper