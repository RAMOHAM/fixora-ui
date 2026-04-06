import { z } from "zod";

export const taskFields = {
    jobDescription: z.string().min(1, { message: "Job description is required" }),
    videoInput: z.string().optional(),
};

export const addressFields = {
    address: z.string().min(1, { message: "Address is required" }),
    dateOfJob: z.string().min(1, { message: "Date of job is required" }),
    preferredWindow: z.string().optional(),
};

export const contactFields = {
    email: z
        .string()
        .min(1, { message: "Email Address is required" })
        .email("Invalid email"),
    phone: z.string().min(1, { message: "Phone Number is required" }),
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