import * as React from "react";
import { ArrowRight, Sparkles, Paintbrush, Wrench, Plug } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ServicesListSection() {
  return (
    <section className="w-full bg-section-bg py-16 md:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col items-start gap-3">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Architectural Service Categories
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-medium">
            Select a specialized division to begin your home curation.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Master Cleaning (span 2) */}
          <Card className="col-span-1 md:col-span-2 flex flex-col md:flex-row overflow-hidden border-none shadow-[0_4px_30px_rgba(0,0,0,0.03)] bg-card rounded-[32px] p-0 ring-0">
            <div className="flex-1 p-6 md:p-10 flex flex-col justify-center order-2 md:order-1 relative z-10 w-full md:w-auto bg-card">
              <div className="text-primarydark mb-5">
                <Sparkles className="h-8 w-8" strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Master Cleaning
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-section-bg text-secondary-foreground text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm">Deep Clean</span>
                <span className="bg-section-bg text-secondary-foreground text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm">Airbnb Elite</span>
                <span className="bg-section-bg text-secondary-foreground text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm">End of Tenancy</span>
              </div>
              <p className="text-muted-foreground max-w-sm text-base md:text-[17px] mb-8 leading-relaxed font-medium">
                Hospital-grade hygiene standards for Dublin's most discerning homeowners.
              </p>
              <div>
                <a href="#" className="inline-flex items-center text-sm font-bold text-primary hover:text-primary/80 transition-colors gap-2">
                  Explore Cleaning Division <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </a>
              </div>
            </div>
            
            <div className="w-full md:w-[45%] h-64 md:h-auto order-1 md:order-2 overflow-hidden relative hidden md:block">
              {/* Fade gradient overlay for smooth blend. The mock has a faded image. */}
              <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-transparent z-10 pointer-events-none w-1/2" />
              <div className="absolute inset-y-0 right-0 w-[120%] h-full bg-muted flex items-center justify-center">
                 <Image src="/cleaning-service.png" width={800} height={800} alt="Cleaning" className="w-full h-full object-cover opacity-50 mix-blend-multiply" />
              </div>
            </div>
            <div className="w-full h-48 order-1 overflow-hidden relative md:hidden">
                 <Image src="/cleaning-service.png" width={800} height={800} alt="Cleaning" className="w-full h-full object-cover opacity-50" />
            </div>
          </Card>

          {/* Card 2: Interior Painting (span 1) */}
          <Card className="col-span-1 flex flex-col overflow-hidden border-none shadow-[0_4px_30px_rgba(0,0,0,0.03)] bg-card rounded-[32px] ring-0">
            <div className="p-6 md:p-8 pb-3">
               <div className="text-primarydark mb-5">
                 <Paintbrush className="h-8 w-8" strokeWidth={2.5} />
               </div>
               <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">Interior Painting</h3>
               <p className="text-muted-foreground text-sm md:text-[15px] font-medium leading-relaxed">
                 Precision finishes using premium Irish and international pigments.
               </p>
            </div>
            <div className="p-4 md:p-6 pt-2 flex-1 w-full flex flex-col">
               <div className="relative w-full h-48 md:h-52 rounded-[20px] overflow-hidden shadow-sm bg-muted">
                 <Image src="/painting-service.png" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="Painting brushes" className="object-cover object-center" />
               </div>
            </div>
          </Card>

          {/* Card 3: Plumbing (span 1) */}
          <Card className="col-span-1 flex flex-col overflow-hidden border-none shadow-[0_4px_30px_rgba(0,0,0,0.03)] bg-card rounded-[32px] ring-0">
            <div className="p-6 md:p-8 pb-3">
               <div className="text-primarydark mb-5">
                 <Wrench className="h-8 w-8" strokeWidth={2.5} />
               </div>
               <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight">Plumbing</h3>
               <p className="text-muted-foreground text-sm md:text-[15px] font-medium leading-relaxed">
                 Immediate response for leaks, upgrades, and architectural fixture installs.
               </p>
            </div>
            <div className="p-4 md:p-6 pt-2 flex-1 w-full flex flex-col">
               <div className="relative w-full h-48 md:h-52 rounded-[20px] overflow-hidden shadow-sm bg-muted">
                 <Image src="/plumbing-service.png" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="Plumbing Faucet" className="object-cover object-center" />
               </div>
            </div>
          </Card>

          {/* Card 4: Electrical Engineering (span 2) */}
          <Card className="col-span-1 md:col-span-2 flex flex-col md:flex-row overflow-hidden border-none shadow-[0_4px_30px_rgba(0,0,0,0.03)] bg-card rounded-[32px] p-0 ring-0">
            <div className="flex-1 p-6 md:p-10 flex flex-col justify-center w-full md:w-auto">
              <div className="text-primarydark mb-5">
                <Plug className="h-8 w-8" strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Electrical Engineering
              </h3>
              <p className="text-muted-foreground max-w-sm text-base md:text-[17px] mb-8 leading-relaxed font-medium">
                From smart home integration to designer lighting installation.
              </p>
              <div>
                <Button variant="outline" className="border-border text-foreground font-semibold rounded-[8px] px-6 h-12 text-sm bg-transparent hover:bg-accent hover:text-accent-foreground">
                  Book Electrician
                </Button>
              </div>
            </div>
            <div className="w-full md:w-[45%] h-64 md:h-auto overflow-hidden p-4 lg:p-5 pl-0 relative">
               <div className="w-full h-full rounded-[20px] overflow-hidden ml-4 md:ml-0 shadow-sm relative">
                 <Image src="/ceiling-image.png" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="Electrical Chandelier" className="object-cover object-center" />
               </div>
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
}