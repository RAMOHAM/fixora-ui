import Link from 'next/link';
import React from 'react';
import { Button } from "@/components/ui/button";

export default function HomePageNavbar() {
  return (
    <header className="w-full py-6 px-4 md:px-10 flex flex-col md:flex-row items-center justify-between mx-auto max-w-7xl gap-6 md:gap-0">
      <div className="flex items-center w-full md:w-auto justify-center md:justify-start">
        <Link href="/" className="text-4xl md:text-3xl font-extrabold font-heading tracking-tighter text-secondary">
          FIXORA&trade;
        </Link>
      </div>
      
      <nav className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 md:gap-8 w-full md:w-auto">
        <Link href="#" className="text-[15px] md:text-[16px] font-semibold text-secondary relative">
          Cleaning
          <span className="absolute -bottom-1.5 left-0 right-0 h-[3px] bg-primary"></span>
        </Link>
        <Link href="#" className="text-[15px] md:text-[16px] font-medium text-secondary hover:text-primary transition-colors">
          Painting
        </Link>
        <Link href="#" className="text-[15px] md:text-[16px] font-medium text-secondary hover:text-primary transition-colors">
          Plumbing
        </Link>
        <Link href="#" className="text-[15px] md:text-[16px] font-medium text-secondary hover:text-primary transition-colors">
          Electrical
        </Link>
        <Link href="#" className="text-[15px] md:text-[16px] font-medium text-secondary hover:text-primary transition-colors">
          Repairs
        </Link>
      </nav>

      <div className="flex items-center w-full md:w-auto justify-center md:justify-end mt-2 md:mt-0">
          <Link href="/book">
              <Button className="bg-brand-gradient hover:opacity-90 text-white h-[46px] px-8 rounded-xl text-[16px] font-bold shadow-md transition-opacity w-full md:w-auto">
                  Book Now
              </Button>
          </Link>
      </div>
    </header>
  );
}
