import Image from 'next/image';
import React from 'react';

export default function Hero() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 md:px-10 py-12 md:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
      {/* Left Content */}
      <div className="flex-1 flex flex-col gap-6 z-10 w-full">
        <h1 className="text-5xl md:text-7xl lg:text-[80px] font-heading font-extrabold text-secondary leading-[1.05] tracking-tight">
          FIXORA&trade; :<br />
          <span className="text-primary">Premium</span> Home<br />
          Services in Dublin
        </h1>
        
        <p className="text-[17px] text-secondary/80 max-w-lg font-body mt-2 leading-relaxed">
          Excellence in every detail. From Georgian townhouses to modern docks, we provide curated maintenance for Dublin's finest residences.
        </p>

        {/* Search Bar */}
        <div className="flex items-center bg-[#F3F4F3] p-1.5 rounded w-full max-w-md mt-6 shadow-sm border border-gray-100">
          <div className="px-4 text-secondary/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="What can we fix for you today?" 
            className="flex-1 bg-transparent border-none outline-none text-secondary font-body placeholder:text-secondary/50 h-10"
          />
          <button className="bg-[#906d11] hover:bg-[#7e5f0e] text-white px-7 py-2.5 rounded font-semibold transition-colors text-[15px]">
            Search
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <span className="px-4 py-2 bg-[#F9F9F9] rounded-md text-[13px] font-bold text-[#8C6A1E]">
            Deep Cleaning
          </span>
          <span className="px-4 py-2 bg-[#F9F9F9] rounded-md text-[13px] font-bold text-[#8C6A1E]">
            Leak Repair
          </span>
          <span className="px-4 py-2 bg-[#F9F9F9] rounded-md text-[13px] font-bold text-[#8C6A1E]">
            Interior Painting
          </span>
        </div>
      </div>

      {/* Right Content - Image */}
      <div className="flex-1 relative w-full h-[400px] md:h-[500px] lg:h-[600px] mt-10 lg:mt-0 flex justify-center lg:justify-end">
        {/* Tilted Image Container */}
        <div className="relative w-full max-w-[550px] h-full transform rotate-[4deg] right-0 lg:right-4 z-0">
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl relative">
            <Image 
              src="/heroImage.png" 
              alt="Beautiful Dublin Residence Interior" 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 550px"
              priority
            />
          </div>
        </div>

        {/* Floating Card */}
        <div className="absolute -bottom-6 md:-bottom-12 left-2 md:left-8 lg:-left-12 bg-white px-6 py-7 rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] w-[300px] md:w-[340px] transform -rotate-[2deg] border border-gray-100 z-20">
          <div className="flex items-start gap-4 mb-3">
            <div className="p-2 bg-[#50D3A6] text-white rounded">
               <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <path d="m9 12 2 2 4-4"></path>
               </svg>
            </div>
            <div className="flex items-center h-11">
              <h3 className="font-bold text-secondary font-heading text-lg">Dublin Certified</h3>
            </div>
          </div>
          <p className="text-secondary/70 text-[14px] font-body leading-relaxed mt-4">
            Over 5,000 homes maintained across Dublin 1 to 24 with 4.9/5 star ratings.
          </p>
        </div>
      </div>
    </section>
  );
}
