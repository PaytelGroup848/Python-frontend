"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Users, Briefcase, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { name: "About Us", href: "/about", icon: Users },
  { name: "Services", href: "/services", icon: Briefcase },
  { name: "Contact", href: "/contact", icon: Mail },
];

// Paths where navbar should be shown
const NAVBAR_PATHS = ["/", "/about", "/services", "/contact"];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Check if navbar should be shown
  const shouldShowNavbar = NAVBAR_PATHS.includes(pathname);

  // Check if we're on home page
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Don't render navbar on non-marketing pages
  if (!shouldShowNavbar) {
    return null;
  }

  return (
    <>
      <nav
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 transition-all duration-300",
          // Home page: transparent/glass effect
          isHomePage && !isScrolled
            ? "bg-white/10 backdrop-blur-md border border-white/20"
            : // Other pages or scrolled: light mode
              "bg-white/95 backdrop-blur-xl border border-zinc-200/50 shadow-lg",
        )}
        style={{ borderRadius: "1.5rem" }}
      >
        <div className="flex items-center justify-between px-4 md:px-6 py-2 md:py-3">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <Link
              className="relative flex items-center justify-center h-10"
              href={"/"}
            >
              <motion.img
                src="/Cloudedata.svg"
                alt="Cloudedata Logo"
                className="h-12 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
                animate={{ y: [0, -2, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-all duration-200 relative flex items-center gap-1.5",
                    isActive
                      ? "text-blue-600"
                      : isHomePage && !isScrolled
                        ? "text-white/90 hover:text-white"
                        : "text-zinc-700 hover:text-zinc-900",
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-4 h-4",
                      isActive
                        ? "text-blue-600"
                        : isHomePage && !isScrolled
                          ? "text-white/80"
                          : "text-zinc-500",
                    )}
                  />
                  {item.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <Link
              href="/login"
              className={cn(
                "px-3 lg:px-4 py-1.5 lg:py-2 text-sm font-medium rounded-xl transition-all duration-200",
                isHomePage && !isScrolled
                  ? "text-white/90 hover:text-white hover:bg-white/10"
                  : "text-zinc-700 hover:bg-zinc-100",
              )}
            >
              Log In
            </Link>
            <Link
              href="/register"
              className={cn(
                "px-3 lg:px-4 py-1.5 lg:py-2 text-sm font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40",
                isHomePage && !isScrolled
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90",
              )}
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              isHomePage && !isScrolled
                ? "text-white hover:bg-white/10"
                : "text-zinc-700 hover:bg-zinc-100",
            )}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className={cn(
              "md:hidden px-4 py-4 rounded-b-2xl",
              isHomePage && !isScrolled
                ? "border-t border-white/10"
                : "border-t border-zinc-200/50",
            )}
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 text-sm font-medium py-2.5 px-3 rounded-lg transition-colors",
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : isHomePage && !isScrolled
                          ? "text-white/90 hover:bg-white/10"
                          : "text-zinc-700 hover:bg-zinc-100",
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
              <div
                className={cn(
                  "flex flex-col gap-2 mt-2 pt-2",
                  isHomePage && !isScrolled
                    ? "border-t border-white/10"
                    : "border-t border-zinc-200",
                )}
              >
                <Link
                  href="/login"
                  className={cn(
                    "px-4 py-2.5 text-sm font-medium text-center rounded-lg transition-colors",
                    isHomePage && !isScrolled
                      ? "text-white/90 hover:bg-white/10"
                      : "text-zinc-700 hover:bg-zinc-100",
                  )}
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2.5 text-sm font-medium text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
