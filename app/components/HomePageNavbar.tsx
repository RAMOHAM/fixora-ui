import Link from 'next/link';
import React from 'react';

export default function HomePageNavbar() {
  return (
    <header className="w-full py-6 px-4 md:px-10 flex flex-col md:flex-row items-center justify-between mx-auto max-w-7xl gap-4 md:gap-0">
      <div className="flex items-center">
        <Link href="/" className="text-3xl font-extrabold font-heading tracking-tighter text-secondary">
          FIXORA&trade;
        </Link>
      </div>
      
      <nav className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
        <Link href="#" className="text-[15px] font-semibold text-secondary relative">
          Cleaning
          <span className="absolute -bottom-1.5 left-0 right-0 h-[3px] bg-primary"></span>
        </Link>
        <Link href="#" className="text-[15px] font-medium text-secondary hover:text-primary transition-colors">
          Painting
        </Link>
        <Link href="#" className="text-[15px] font-medium text-secondary hover:text-primary transition-colors">
          Plumbing
        </Link>
        <Link href="#" className="text-[15px] font-medium text-secondary hover:text-primary transition-colors">
          Electrical
        </Link>
        <Link href="#" className="text-[15px] font-medium text-secondary hover:text-primary transition-colors">
          Repairs
        </Link>
      </nav>

      <div className="flex items-center">
        <button className="bg-[#B99525] hover:bg-[#a68420] text-white px-7 py-2.5 rounded justify-center items-center text-[15px] font-semibold transition-colors shadow-sm">
          Book Now
        </button>
      </div>
    </header>
  );
}
