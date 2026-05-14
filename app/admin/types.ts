export type BookingStatus = "PENDING" | "SCHEDULED" | "COMPLETED" | "CANCELLED";

export type BookingRow = {
  id?: string;
  _id?: string;
  category: string;
  dateOfJob: string;
  preferredWindow?: "morning" | "afternoon" | "evening" | string;
  bookingStatus: BookingStatus | string;
  jobDescription: string;
  address?: string;
  videoInput?: string;
  professionalId?: string;
  assignedProfessionalId?: string;
  professionalName?: string;
  customerName?: string;
  email?: string;
  phone?: string;
  revenueEUR?: number;
};

export type Professional = {
  id: string;
  _id?: string;
  workerName: string;
  workerEmail: string;
  category: string;
  phoneNumber: string;
  rating?: number;
  status?: "on-job" | "break" | "available" | "onboarding";
  avatarColor?: string;
};

export function getBookingId(booking: BookingRow) {
  return booking.id ?? booking._id ?? "";
}

export function getProfessionalId(professional: Professional) {
  return professional.id ?? professional._id ?? "";
}
