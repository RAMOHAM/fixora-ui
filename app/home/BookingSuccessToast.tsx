"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function BookingSuccessToast() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("booking") !== "success") return;

    toast.success("Your booking is confirmed. We will email you shortly.", {
      id: "booking-success",
      duration: 4000,
    });
    router.replace("/", { scroll: false });
  }, [searchParams, router]);

  return null;
}
