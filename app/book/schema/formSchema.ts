import { z } from "zod";

const isoDateString = z
    .string()
    .min(1, { message: "Date of job is required" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Use a valid date" });

export const taskFields = {
    category: z.string().min(1),
    jobDescription: z.string().min(1, { message: "Job description is required" }),
    videoInput: z.string().optional(),
};

export const addressFields = {
    address: z.string().min(1, { message: "Address is required" }),
    dateOfJob: isoDateString,
    preferredWindow: z.enum(["morning", "afternoon", "evening"]).optional(),
};

export const contactFields = {
    email: z
        .string()
        .trim()
        .min(1, { message: "Email Address is required" })
        .email("Invalid email"),
    phone: z
        .string()
        .trim()
        .min(1, { message: "Phone Number is required" })
        .regex(/^\+?[0-9 ()-]{7,}$/, { message: "Invalid phone number" }),
};


export const taskFormSchema = z.object(taskFields);
export const addressFormSchema = z.object(addressFields);
export const contactFormSchema = z.object(contactFields);


export const BookingFormSchema = z.object({
    ...taskFields,
    ...addressFields,
    ...contactFields,
});

export type BookingFormData = z.infer<typeof BookingFormSchema>;