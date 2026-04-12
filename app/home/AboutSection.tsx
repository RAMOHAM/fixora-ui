import Image from "next/image";
import { ShieldCheck, Award, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutSection = () => {
    return (
    <section className="w-full flex flex-col items-center justify-center">
      
      {/* 1. Why Dublin Chooses FIXORA */}
      <div className="max-w-6xl w-full px-4 py-24 grid md:grid-cols-2 gap-12 lg:gap-20 items-center bg-background">
        <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-sm">
          <Image 
            src="/home-page/about/main-aboutus.png" 
            alt="Why Dublin Chooses FIXORA" 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 576px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-10">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-[54px] font-bold tracking-tight text-foreground leading-[1.1]">
              Why Dublin Chooses<br />
              <span className="text-brand-gradient">FIXORA™</span>
            </h2>
          </div>
          
          <div className="flex flex-col gap-8 text-foreground">
            {/* Feature 1 */}
            <div className="flex gap-5">
              <div className="bg-[#FAF4E4] rounded-2xl h-14 w-14 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-7 h-7 text-[#A08122]" />
              </div>
              <div className="flex flex-col gap-1.5 pt-0.5">
                <h3 className="text-[22px] font-bold">Fully Managed Excellence</h3>
                <p className="text-muted-foreground text-[15px] leading-relaxed">
                  We don't just connect you; we manage the entire project from initial booking to the final quality inspection.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-5">
              <div className="bg-[#FAF4E4] rounded-2xl h-14 w-14 flex items-center justify-center shrink-0">
                <Award className="w-7 h-7 text-[#A08122]" />
              </div>
              <div className="flex flex-col gap-1.5 pt-0.5">
                <h3 className="text-[22px] font-bold">Vetted Technicians</h3>
                <p className="text-muted-foreground text-[15px] leading-relaxed">
                  Our professionals undergo a rigorous 20-point vetting process. Only the top 5% of Dublin's tradespeople join our fleet.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-5">
              <div className="bg-[#FAF4E4] rounded-2xl h-14 w-14 flex items-center justify-center shrink-0">
                <Leaf className="w-7 h-7 text-[#A08122]" />
              </div>
              <div className="flex flex-col gap-1.5 pt-0.5">
                <h3 className="text-[22px] font-bold">Clean Work Protocol</h3>
                <p className="text-muted-foreground text-[15px] leading-relaxed">
                  We leave your home in "showhouse" condition. Our technicians follow a strict zero-trace cleanup policy after every job.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. The FIXORA Journey */}
      <div className="w-full bg-section-bg py-24 lg:py-32 flex flex-col items-center justify-center">
        <div className="max-w-[1000px] w-full px-5 flex flex-col items-center">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">The FIXORA™ Journey</h2>
            <p className="text-gray-600 text-lg">Three steps to a perfectly maintained home.</p>
          </div>

          <div className="flex flex-col gap-32 lg:gap-40 w-full relative">
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-center">
              <div className="order-2 md:order-1 relative">
                 <div className="text-[140px] md:text-[180px] leading-[0.7] font-bold text-[#EAE6DF] relative -ml-2 mb-4 md:-mb-12 select-none tracking-tighter">01</div>
                 <div className="relative z-10">
                   <h3 className="text-3xl font-bold text-black mb-4">Curate Your Service</h3>
                   <p className="text-gray-600 leading-relaxed text-[15px]">Select from our elite range of maintenance divisions. Transparent pricing ensures you know the investment upfront.</p>
                 </div>
              </div>
              <div className="order-1 md:order-2 w-full relative">
                 <Image src="/home-page/about/step1-about.png" alt="Curate Your Service" width={600} height={400} className="rounded-xl w-full object-cover shadow-md"/>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-center">
              <div className="w-full relative">
                 <Image src="/home-page/about/step2-about.png" alt="Schedule & Sync" width={600} height={400} className="rounded-xl w-full object-cover shadow-md"/>
              </div>
              <div className="relative md:text-right flex flex-col md:items-end">
                 <div className="text-[140px] md:text-[180px] leading-[0.7] font-bold text-[#EAE6DF] relative md:-mr-4 mb-4 md:-mb-12 select-none tracking-tighter">02</div>
                 <div className="relative z-10 w-full">
                   <h3 className="text-3xl font-bold text-black mb-4">Schedule & Sync</h3>
                   <p className="text-gray-600 leading-relaxed text-[15px]">Our intelligent system matches you with the ideal technician for your specific neighborhood and needs. Real-time arrival tracking included.</p>
                 </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-center">
              <div className="order-2 md:order-1 relative">
                 <div className="text-[140px] md:text-[180px] leading-[0.7] font-bold text-[#EAE6DF] relative -ml-2 mb-4 md:-mb-12 select-none tracking-tighter">03</div>
                 <div className="relative z-10">
                   <h3 className="text-3xl font-bold text-black mb-4">Masterful Execution</h3>
                   <p className="text-gray-600 leading-relaxed text-[15px]">Watch as your home is transformed. We handle the labor, the cleanup, and the guarantee. You just enjoy the results.</p>
                 </div>
              </div>
              <div className="order-1 md:order-2 w-full relative">
                 <Image src="/home-page/about/step3-about.png" alt="Masterful Execution" width={600} height={400} className="rounded-xl w-full object-cover shadow-md"/>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Ready to book */}
      <div className="w-full px-4 py-24 flex justify-center bg-background">
        <div className="max-w-5xl w-full bg-[#1c1d1a] rounded-[2rem] py-20 px-6 flex flex-col items-center text-center shadow-xl">
          <h2 className="text-3xl md:text-[44px] font-bold tracking-tight mb-4 text-white">Ready to Elevate Your Living Space?</h2>
          <p className="text-[#a0a39f] mb-10 max-w-lg mx-auto text-[15px]">Join thousands of Dublin homeowners who trust FIXORA™ for uncompromised maintenance quality.</p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center w-full sm:w-auto">
            <Button className="bg-[#F9C339] hover:bg-[#E5B020] text-black font-semibold rounded-lg px-8 h-12 text-sm w-full sm:w-auto">
              Book Your Service Now
            </Button>
            <Button className="bg-[#41423F] hover:bg-[#525350] text-[#E0E1DF] font-medium rounded-lg px-8 h-12 text-sm w-full sm:w-auto border-0">
              Contact Our Concierge
            </Button>
          </div>
        </div>
      </div>

    </section>
  );
};

export default AboutSection;