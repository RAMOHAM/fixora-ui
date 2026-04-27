import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Briefcase, User, MapPin, Calendar } from "lucide-react";
import { BookingRow } from "@/app/admin/BookingsPage";

interface BookingDetailsModalProps {
    booking: BookingRow | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function BookingDetailsModal({ booking, isOpen, onClose }: BookingDetailsModalProps) {
    if (!booking) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Assignment Overview</DialogTitle>
                </DialogHeader>

                <div className="space-y-8 py-4">

                    {/* SECTION 1: JOB DESCRIPTION */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-semibold">
                            <Briefcase className="w-5 h-5" />
                            <h3>Job Description</h3>
                        </div>

                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input id="category" value={booking.category} readOnly className="bg-muted" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Details</Label>
                                <Textarea
                                    id="description"
                                    value={booking.videoInput ? `Attached Video URL: ${booking.videoInput}` : "No specific details provided."}
                                    readOnly
                                    className="min-h-[100px] bg-muted"
                                />
                            </div>

                            {booking.videoInput && (
                                <div className="space-y-2">
                                    <Label>Introduction Video</Label>
                                    <div className="aspect-video w-full overflow-hidden rounded-md border bg-muted flex items-center justify-center">
                                        <video
                                            className="w-full h-full object-cover"
                                            src={booking.videoInput}
                                            controls
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    <Separator />

                    {/* SECTION 2: LOCATION AND DATE/TIME */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-semibold">
                            <User className="w-5 h-5" />
                            <h3>Location and Date & Time</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                                <MapPin className="text-muted-foreground w-5 h-5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Location</p>
                                    <p className="text-sm font-medium">{booking.location || "Not specified"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                                <Calendar className="text-muted-foreground w-5 h-5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">Date and Time</p>
                                    <p className="text-sm font-medium">{booking.dateOfJob || "Not specified"}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => onClose()}>Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}