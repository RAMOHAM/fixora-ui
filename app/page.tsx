import { Suspense } from "react";
import HomePageNavbar from "@/app/home/HomePageNavbar";
import Hero from "@/app/home/Hero";
import ServicesListSection from "@/app/home/ServicesListSection";
import AboutSection from "@/app/home/AboutSection";
import Footer from "@/app/home/Footer";
import { BookingSuccessToast } from "@/app/home/BookingSuccessToast";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
        <Suspense fallback={null}>
          <BookingSuccessToast />
        </Suspense>
        <HomePageNavbar />
        <main className="flex-1 w-full flex flex-col items-center justify-start overflow-hidden">
            <Hero />
            <ServicesListSection />
            <AboutSection />
        </main>
        <Footer />
    </div>
  );
}