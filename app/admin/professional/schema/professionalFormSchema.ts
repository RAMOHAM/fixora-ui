import { z } from "zod";

export const professionalFormFields = {
    category: z.string().min(1),
    workerName: z.string().min(1, { message: "Name is required" }),
    workerEmail: z.string().trim().min(1, { message: "Email Address is required" }).email("Invalid email"),
    phoneNumber: z.string().trim().min(1, { message: "Phone Number is required" }).regex(/^\+?[0-9 ()-]{7,}$/, { message: "Invalid phone number" }),
};

export const addProfessionalFormSchema = z.object(professionalFormFields);

export type ProfessionalFormSchema = z.infer<typeof addProfessionalFormSchema>;