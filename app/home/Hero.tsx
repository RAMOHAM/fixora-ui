import Image from 'next/image';
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function Hero() {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 md:px-10 py-12 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">
      {/* Left Content */}
      <div className="w-full lg:w-[55%] flex flex-col gap-6 z-10 lg:pr-8">
        <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-heading font-extrabold text-secondary leading-[1.05] tracking-tight text-center sm:text-left">
          FIXORA&trade; :<br />
          <span className="text-brand-gradient">Premium</span> Home<br />
          Services in Dublin
        </h1>
        
        <p className="text-[17px] text-secondary/80 max-w-lg font-body mt-2 leading-relaxed text-center sm:text-left mx-auto sm:mx-0">
          Excellence in every detail. From Georgian townhouses to modern docks, we provide curated maintenance for Dublin's finest residences.
        </p>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center bg-[#F3F4F3] p-2 rounded-2xl sm:rounded-[2rem] w-full max-w-lg mt-6 lg:mt-8 shadow-sm border border-gray-100 gap-2 sm:gap-0 mx-auto sm:mx-0">
          <div className="px-4 text-secondary/50 shrink-0 hidden sm:block">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <Input 
            type="text" 
            placeholder="What can we fix for you today?" 
            className="flex-1 border-none shadow-none focus-visible:ring-0 outline-none text-secondary font-body placeholder:text-secondary/50 h-12 sm:h-14 px-4 sm:px-0 rounded-xl sm:rounded-none bg-white sm:bg-transparent text-center sm:text-left w-full"
          />
          <Button className="bg-brand-gradient hover:opacity-90 w-full sm:w-auto h-12 sm:h-14 px-8 rounded-xl sm:rounded-full font-bold text-[16px] shadow-md transition-opacity shrink-0">
            Search
          </Button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-6">
          <Badge className="px-4 py-2 bg-[#F9F9F9] hover:bg-[#eeeeee] rounded-lg text-[13px] font-bold text-[#8C6A1E] border-transparent shadow-none">
            Deep Cleaning
          </Badge>
          <Badge className="px-4 py-2 bg-[#F9F9F9] hover:bg-[#eeeeee] rounded-lg text-[13px] font-bold text-[#8C6A1E] border-transparent shadow-none">
            Leak Repair
          </Badge>
          <Badge className="px-4 py-2 bg-[#F9F9F9] hover:bg-[#eeeeee] rounded-lg text-[13px] font-bold text-[#8C6A1E] border-transparent shadow-none">
            Interior Painting
          </Badge>
        </div>
      </div>

      {/* Right Content - Image */}
      <div className="w-full lg:w-[45%] relative flex flex-col items-center justify-center mt-12 lg:mt-0 pb-16 lg:pb-0">
        {/* Tilted Image Container */}
        <div className="relative w-full max-w-[480px] h-[350px] sm:h-[450px] lg:h-[500px] transform lg:rotate-[4deg] z-0">
          <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl relative">
            <Image 
              src="/heroImage.png" 
              alt="Beautiful Dublin Residence Interior" 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 480px"
              priority
            />
          </div>
        </div>

        {/* Floating Card */}
        <Card className="relative lg:absolute -mt-16 lg:-mt-0 lg:-bottom-12 lg:-left-12 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] w-[90%] sm:w-[340px] transform lg:-rotate-[2deg] border-gray-100 bg-white z-20 mx-auto">
          <CardContent className="p-6 md:p-7">
            <div className="flex items-start gap-4 mb-3">
              <div className="p-2 sm:p-3 bg-[#50D3A6] text-white rounded-lg shrink-0 flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-7 sm:h-7">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                 </svg>
              </div>
              <div className="flex flex-col justify-center min-h-[44px]">
                <h3 className="font-bold text-secondary font-heading text-[18px] md:text-xl leading-none">Dublin Certified</h3>
              </div>
            </div>
            <p className="text-secondary/70 text-[14px] md:text-[15px] font-body leading-relaxed mt-4">
              Over 5,000 homes maintained across Dublin 1 to 24 with 4.9/5 star ratings.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
