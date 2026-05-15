import Link from "next/link";
import { Wrench } from "lucide-react";

export default function AuthShell({
  children,
  eyebrow,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <main className="min-h-screen bg-[#f6f6f3]">
      <div className="grid min-h-screen lg:grid-cols-[1fr_560px]">
        <section className="relative hidden overflow-hidden bg-[#151817] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 opacity-25 [background:radial-gradient(circle_at_20%_20%,#f9c339_0,transparent_28%),linear-gradient(135deg,#1f2422_0%,#0f1110_100%)]" />
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15">
                <Wrench className="size-5 text-[#f9c339]" />
              </span>
              <span className="text-lg font-bold tracking-wide">Fixora</span>
            </Link>
          </div>

          <div className="relative z-10 max-w-xl pb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f9c339]">
              {eyebrow}
            </p>
            <h1 className="mt-5 text-5xl font-black leading-[1.02] tracking-tight">
              {title}
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-white/65">
              {subtitle}
            </p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
          <div className="w-full max-w-[440px]">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <span className="grid size-10 place-items-center rounded-xl bg-[#1a1e1d] text-[#f9c339]">
                <Wrench className="size-5" />
              </span>
              <span className="text-lg font-bold tracking-wide text-[#1a1e1d]">
                Fixora
              </span>
            </div>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
