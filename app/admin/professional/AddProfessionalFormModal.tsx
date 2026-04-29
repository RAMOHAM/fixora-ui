import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Briefcase, Calendar, MapPin, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import React from "react";

type AddProfessionalFormModalProps = {
    isOpen: boolean;
    onClose: () => void;
}

const AddProfessionalFormModal = ({isOpen, onClose} : AddProfessionalFormModalProps) => {
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
                            <Briefcase className="w-5 h-5"/>
                            <h3>Job Description</h3>
                        </div>

                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input id="category" value={"Category"} readOnly className="bg-muted"/>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Details</Label>
                                <Textarea
                                    id="description"
                                    value={"Description"}
                                    readOnly
                                    className="min-h-[100px] bg-muted"
                                />
                            </div>
                        </div>
                    </section>
                    <Separator/>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-semibold">
                            <User className="w-5 h-5"/>
                            <h3>Location and Date & Time</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                                <MapPin className="text-muted-foreground w-5 h-5"/>
                                <div>
                                    <p className="text-xs text-muted-foreground">Location</p>
                                    <p className="text-sm font-medium">{"Not specified"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                                <Calendar className="text-muted-foreground w-5 h-5"/>
                                <div>
                                    <p className="text-xs text-muted-foreground">Date and Time</p>
                                    <p className="text-sm font-medium">{"Not specified"}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddProfessionalFormModal;