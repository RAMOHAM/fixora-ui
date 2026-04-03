import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full flex flex-col items-center">
      {/* CTA Box */}
      <div className="w-full max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="bg-secondary rounded-[2rem] p-10 md:p-16 flex flex-col items-center text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Ready to Elevate Your Living Space?
          </h2>
          <p className="text-white opacity-80 max-w-lg text-sm md:text-base">
            Join thousands of Dublin homeowners who trust FIXORA™ for uncompromised maintenance quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="bg-primary text-secondary font-semibold px-8 py-3 rounded-md hover:opacity-90 transition-opacity">
              Book Your Service Now
            </button>
            <button className="bg-white/10 text-white font-semibold px-8 py-3 rounded-md hover:bg-white/20 transition-all border border-white/10">
              Contact Our Concierge
            </button>
          </div>
        </div>
      </div>

      {/* Footer Bottom Area */}
      <div className="w-full bg-secondary py-12 px-6 lg:px-12 mt-12 md:mt-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center lg:items-end gap-10">
          
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-2">
            <h3 className="text-primary font-bold text-xl uppercase tracking-wider">
              FIXORA™
            </h3>
            <p className="text-white opacity-60 text-xs max-w-xs leading-relaxed">
              Architectural Excellence in Home Maintenance.<br />
              Serving the Greater Dublin Area with distinction.
            </p>
          </div>
          
          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-white opacity-60 text-xs">
            <Link href="#" className="hover:opacity-100 transition-opacity whitespace-nowrap">About Us</Link>
            <Link href="#" className="hover:opacity-100 transition-opacity whitespace-nowrap">Service Areas</Link>
            <Link href="#" className="hover:opacity-100 transition-opacity whitespace-nowrap">Terms of Service</Link>
            <Link href="#" className="hover:opacity-100 transition-opacity whitespace-nowrap">Privacy Policy</Link>
            <Link href="#" className="hover:opacity-100 transition-opacity whitespace-nowrap">Contact Support</Link>
          </div>

          {/* Copyright */}
          <div className="text-white opacity-60 text-xs text-center lg:text-right">
            © 2026 FIXORA™ Dublin. All rights reserved.
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;