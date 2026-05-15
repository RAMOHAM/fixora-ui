import { Suspense } from "react";

import AuthForm from "@/app/auth/components/AuthForm";
import AuthShell from "@/app/auth/components/AuthShell";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Trusted Operations"
      title="Keep every home service booking moving."
      subtitle="Secure access for the team that schedules jobs, assigns professionals, and keeps customers updated."
    >
      <Suspense>
        <AuthForm />
      </Suspense>
    </AuthShell>
  );
}
