"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: "How it works", href: "#how-it-works" },
    { name: "Connectors", href: "#integrations" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled 
          ? "top-4 left-4 right-4" 
          : "top-0 left-0 right-0"
      }`}
    >
      <nav 
        className={`mx-auto transition-all duration-500 ${
          isScrolled || isMenuOpen
            ? "bg-white/80 backdrop-blur-xl border border-gray-150 rounded-2xl shadow-lg max-w-[1200px]"
            : "bg-transparent max-w-[1400px]"
        }`}
      >
        <div 
          className={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${
            isScrolled ? "h-14" : "h-20"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 group">
            <span className={`font-semibold tracking-tight text-gray-900 transition-all duration-500 ${isScrolled ? "text-xl" : "text-2xl"}`}>
              GRIP
            </span>
            <span className={`text-gray-400 font-bold font-mono transition-all duration-500 ${isScrolled ? "text-[9px] mt-0.5" : "text-xs mt-1"}`}>
              TM
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-300 relative group font-medium"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gray-900 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/sign-in" 
              className={`text-gray-500 hover:text-gray-900 transition-all duration-500 font-medium ${isScrolled ? "text-xs" : "text-sm"}`}
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className={`bg-gray-900 hover:bg-gray-800 !text-white rounded-full transition-all duration-500 font-medium flex items-center justify-center ${
                isScrolled ? "px-4 h-8 text-xs" : "px-5 h-9 text-sm"
              }`}
            >
              Get started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-white z-40 transition-all duration-500 ${
          isMenuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex flex-col h-full px-8 pt-28 pb-8">
          {/* Navigation Links */}
          <div className="flex-1 flex flex-col justify-center gap-8">
            {navLinks.map((link, i) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-5xl font-semibold text-gray-900 hover:text-gray-500 transition-all duration-500 ${
                  isMenuOpen 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: isMenuOpen ? `${i * 75}ms` : "0ms" }}
              >
                {link.name}
              </a>
            ))}
          </div>
          
          {/* Bottom CTAs */}
          <div 
            className={`flex gap-4 pt-8 border-t border-gray-100 transition-all duration-500 ${
              isMenuOpen 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: isMenuOpen ? "300ms" : "0ms" }}
          >
            <Link
              href="/sign-in"
              className="flex-1 rounded-full border border-gray-200 h-14 text-base font-medium flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="flex-1 bg-gray-900 !text-white rounded-full h-14 text-base font-medium flex items-center justify-center hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
