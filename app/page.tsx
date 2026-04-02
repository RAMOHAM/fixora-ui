import HomePageNavbar from "@/app/home/HomePageNavbar";
import Hero from "@/app/home/Hero";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <HomePageNavbar />
      <main className="flex-1 w-full flex flex-col items-center justify-start overflow-hidden">
        <Hero />
      </main>
    </div>
  );
}
