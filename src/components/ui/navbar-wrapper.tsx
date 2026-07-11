"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";

const NAVBAR_PATHS = [
  "/",
  "/about",
  "/services",
  "/contact",
  "/terms",
  "/privacy",
];

export function NavbarWrapper() {
  const pathname = usePathname();

  // Check if current path should show navbar
  const shouldShowNavbar = NAVBAR_PATHS.includes(pathname);

  if (!shouldShowNavbar) {
    return null;
  }

  return <Navbar />;
}
