"use client";
import { useRef, useState } from "react";
import { Video } from "lucide-react";
import { UseFormSetValue } from "react-hook-form";
import { BookingFormData } from "@/app/book/schema/formSchema";
import {Button} from "@/components/ui/button";

const MAX_SIZE = 50 * 1024 * 1024;

interface VideoUploadSectionProps {
    setValue: UseFormSetValue<BookingFormData>;
}

export function VideoUploadSection({ setValue }: VideoUploadSectionProps) {
    const [attached, setAttached] = useState<{ name: string; size: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        setError(null);
        if (!file.type.startsWith("video/")) {
            setError("Please select a video file.");
            return;
        }
        if (file.size > MAX_SIZE) {
            setError("Video must be under 50 MB.");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setValue("videoInput", reader.result as string, { shouldValidate: true, shouldDirty: true });
            setAttached({ name: file.name, size: file.size });
        };
        reader.readAsDataURL(file);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const remove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setAttached(null);
        setError(null);
        setValue("videoInput", undefined, { shouldValidate: true, shouldDirty: true });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const formatSize = (bytes: number) =>
        bytes < 1024 * 1024
            ? `${Math.round(bytes / 1024)} KB`
            : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

    return (
        <div className="space-y-4 pb-4">
            <label className="block text-sm font-bold uppercase tracking-widest text-[#B99525]">
                UPLOAD A QUICK VIDEO WALK-THROUGH (OPTIONAL)
            </label>

            {/* Hidden input — capture="environment" triggers rear cam on mobile */}
            <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                capture="environment"
                onChange={handleChange}
                className="hidden"
            />

            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
                    attached
                        ? "border-[#B99525] bg-[#fdfbf3] hover:bg-[#faf7ec]"
                        : "border-[#d8d8ce] bg-[#f5f6f4] hover:bg-[#f1f2ef]"
                }`}
            >
                <div className="text-[#847B62] mb-4 relative">
                    <Video size={48} className="stroke-[1.5]" />
                    <div className="bg-[#847B62] text-white text-[10px] w-4 h-4 rounded-sm flex items-center justify-center font-bold absolute -right-1 -top-1">
                        {attached ? "✓" : "+"}
                    </div>
                </div>

                {attached ? (
                    <>
                        <p className="text-gray-700 font-medium">{attached.name}</p>
                        <p className="text-xs text-gray-400 mt-1 mb-5">{formatSize(attached.size)}</p>
                        <div className="flex gap-3">
                            <Button
                                onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                                className="px-5 py-2.5 bg-[#e8e9e4] text-[#847B62] font-bold rounded-lg hover:bg-[#dfdcd5] transition-colors text-sm"
                            >
                                Replace
                            </Button>
                            <Button
                                type="button"
                                onClick={remove}
                                className="px-5 py-2.5 bg-[#fee2e2] text-red-600 font-bold rounded-lg hover:bg-[#fecaca] transition-colors text-sm"
                            >
                                Remove
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-gray-700 font-medium mb-1">
                            Tap to record or upload a video
                        </p>
                        <p className="text-xs text-gray-400 mb-6">
                            MP4, MOV, WEBM · Max 50 MB
                        </p>
                    </>
                )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            <p className="text-xs text-gray-400 text-center">
                On mobile, you can record directly with your camera
            </p>
        </div>
    );
}