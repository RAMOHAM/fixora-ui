"use client";
import { useRef, useState, useCallback } from "react";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UseFormSetValue } from "react-hook-form";
import { BookingFormData } from "@/app/book/schema/formSchema";

interface VideoUploadSectionProps {
    setValue: UseFormSetValue<BookingFormData>;
}

const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

export function VideoUploadSection({ setValue }: VideoUploadSectionProps) {
    const [modalOpen, setModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"webcam" | "upload">("webcam");
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [fileBlob, setFileBlob] = useState<{ file: File; url: string } | null>(null);
    const [attached, setAttached] = useState<string | null>(null); // video name

    const webcamRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Start webcam
    const startCam = useCallback(async () => {
        try {
            const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = s;
            if (webcamRef.current) webcamRef.current.srcObject = s;
        } catch (e) { console.warn("Camera unavailable", e); }
    }, []);

    const stopCam = useCallback(() => {
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
    }, []);

    const openModal = () => {
        setModalOpen(true);
        setActiveTab("webcam");
        setRecordedBlob(null);
        setFileBlob(null);
        setTimeout(startCam, 100);
    };

    const closeModal = () => {
        setModalOpen(false);
        stopCam();
        setRecordedBlob(null);
        setFileBlob(null);
        setIsRecording(false);
    };

    // Recording
    const startRecording = () => {
        if (!streamRef.current) return;
        chunksRef.current = [];
        const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
            ? "video/webm;codecs=vp9" : "video/webm";
        const mr = new MediaRecorder(streamRef.current, { mimeType });
        mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
        mr.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: "video/webm" });
            setRecordedBlob(blob);
        };
        mr.start();
        mediaRecorderRef.current = mr;
        setIsRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    // File pick
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("video/")) return alert("Please select a video file.");
        if (file.size > MAX_SIZE) return alert("File too large. Max 50 MB.");
        setFileBlob({ file, url: URL.createObjectURL(file) });
    };

    // Convert blob -> base64 -> call parent
    const commitBlob = (blob: Blob, name: string) => {
        if (blob.size > MAX_SIZE) { alert("Video too large. Max 50 MB."); return; }
        const reader = new FileReader();
        reader.onload = () => {
            setValue("videoInput", reader.result as string, { shouldValidate: true, shouldDirty: true });
            setAttached(name);
            closeModal();
        };
        reader.readAsDataURL(blob);
    };

    const remove = () => {
        setAttached(null);
        setValue("videoInput", undefined, { shouldValidate: true, shouldDirty: true });
    };

    const switchTab = (tab: "webcam" | "upload") => {
        setActiveTab(tab);
        if (tab === "webcam") startCam();
        else stopCam();
    };

    return (
        <>
            {/* Drop zone */}
            <div className="space-y-4 pb-4">
                <label className="block text-sm font-bold uppercase tracking-widest text-[#B99525]">
                    UPLOAD A QUICK VIDEO WALK-THROUGH (OPTIONAL)
                </label>

                <div
                    className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
                        attached
                            ? "border-[#B99525] bg-[#fdfbf3]"
                            : "border-[#d8d8ce] bg-[#f5f6f4] hover:bg-[#f1f2ef]"
                    }`}
                    onClick={openModal}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file?.type.startsWith("video/")) {
                            if (file.size > MAX_SIZE) { alert("File too large. Max 50 MB."); return; }
                            commitBlob(file, file.name);
                        }
                    }}
                >
                    <div className="text-[#847B62] mb-4 relative">
                        <Video size={48} className="stroke-[1.5]" />
                        <div className="absolute -top-1 -right-1 bg-[#847B62] text-white text-[10px] w-4 h-4 rounded-sm flex items-center justify-center font-bold">
                            {attached ? "✓" : "+"}
                        </div>
                    </div>
                    <p className="text-gray-700 font-medium mb-6">
                        {attached ? `✓ ${attached}` : "Drag and drop your video here, or click to browse"}
                    </p>
                    {attached ? (
                        <Button
                            type="button"
                            onClick={e => { e.stopPropagation(); remove(); }}
                            className="px-6 py-3 bg-[#fee2e2] text-red-600 font-bold rounded-lg hover:bg-[#fecaca] transition-colors"
                        >
                            Remove
                        </Button>
                    ) : (
                        <></>
                    )}
                </div>
                <p className="text-xs text-gray-400 text-center">Max 50 MB · MP4, MOV, WEBM</p>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
                >
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 pt-5 pb-0">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#B99525]">Add Video</span>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-[#e8e9e4] mx-6 mt-4">
                            {(["webcam", "upload"] as const).map(tab => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => switchTab(tab)}
                                    className={`flex-1 pb-3 text-xs font-bold uppercase tracking-widest border-b-2 -mb-px transition-colors ${
                                        activeTab === tab
                                            ? "text-[#847B62] border-[#847B62]"
                                            : "text-gray-400 border-transparent hover:text-gray-600"
                                    }`}
                                >
                                    {tab === "webcam" ? "Webcam" : "Upload File"}
                                </button>
                            ))}
                        </div>

                        <div className="p-6">
                            {/* Webcam tab */}
                            {activeTab === "webcam" && (
                                <div className="space-y-3">
                                    {!recordedBlob ? (
                                        <>
                                            <video
                                                ref={webcamRef}
                                                autoPlay muted playsInline
                                                className="w-full rounded-xl bg-black aspect-video object-cover"
                                            />
                                            <div className="flex gap-3 justify-center">
                                                {!isRecording ? (
                                                    <button
                                                        type="button"
                                                        onClick={startRecording}
                                                        className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg text-sm transition-colors"
                                                    >
                                                        ⏺ Record
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={stopRecording}
                                                        className="px-5 py-2.5 bg-gray-700 hover:bg-gray-800 text-white font-bold rounded-lg text-sm transition-colors flex items-center gap-2"
                                                    >
                                                        <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                                                        Stop Recording
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <video
                                                src={URL.createObjectURL(recordedBlob)}
                                                controls
                                                className="w-full rounded-xl bg-black aspect-video"
                                            />
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setRecordedBlob(null)}
                                                    className="flex-1 py-2.5 border border-[#d8d8ce] text-[#847B62] font-bold rounded-lg text-sm hover:bg-[#f5f6f4] transition-colors"
                                                >
                                                    Re-record
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => commitBlob(recordedBlob, "recording.webm")}
                                                    className="flex-1 py-2.5 bg-[#847B62] text-white font-bold rounded-lg text-sm hover:bg-[#6e6450] transition-colors"
                                                >
                                                    Use Recording
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Upload tab */}
                            {activeTab === "upload" && (
                                <div className="space-y-3">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="video/*"
                                        capture="environment"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    {!fileBlob ? (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-[#d8d8ce] rounded-xl p-10 text-center cursor-pointer hover:bg-[#f5f6f4] transition-colors"
                                        >
                                            <p className="text-gray-600 font-medium mb-1">Click to browse or drag a video here</p>
                                            <p className="text-xs text-gray-400">MP4, MOV, WEBM · Max 50 MB</p>
                                        </div>
                                    ) : (
                                        <>
                                            <video src={fileBlob.url} controls className="w-full rounded-xl bg-black aspect-video" />
                                            <div className="flex items-center justify-between text-sm text-gray-500 px-1">
                                                <span className="truncate max-w-[240px] font-medium text-gray-700">{fileBlob.file.name}</span>
                                                <span>{(fileBlob.file.size / 1024 / 1024).toFixed(1)} MB</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => commitBlob(fileBlob.file, fileBlob.file.name)}
                                                className="w-full py-3 bg-[#847B62] text-white font-bold rounded-lg hover:bg-[#6e6450] transition-colors"
                                            >
                                                Use This Video
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}