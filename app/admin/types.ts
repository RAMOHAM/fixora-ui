export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export type BookingRow = {
  id?: string | number;
  _id?: string | number;
  category: string;
  dateOfJob: string;
  preferredWindow?: "morning" | "afternoon" | "evening" | string;
  bookingStatus: BookingStatus | string;
  jobDescription: string;
  address?: string;
  videoInput?: string;
  professionalId?: string | number;
  assignedProfessionalId?: string | number;
  professionalName?: string;
  customerName?: string;
  email?: string;
  phone?: string;
  revenueEUR?: number;
};

export type Professional = {
  id: string | number;
  _id?: string | number;
  workerName: string;
  workerEmail: string;
  category: string;
  phoneNumber: string;
  rating?: number;
  status?: "on-job" | "break" | "available" | "onboarding";
  avatarColor?: string;
};

export function getBookingId(booking: BookingRow) {
  const id = booking.id ?? booking._id;
  return id == null ? "" : String(id);
}

export function getBookingProfessionalId(booking: BookingRow) {
  const id = booking.professionalId ?? booking.assignedProfessionalId;
  return id == null ? "" : String(id);
}

export function getProfessionalId(professional: Professional) {
  const id = professional.id ?? professional._id;
  return id == null ? "" : String(id);
}
