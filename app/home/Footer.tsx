import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full flex flex-col items-center">
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