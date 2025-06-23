'use client';

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar =
    pathname.startsWith("/signup") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/board/");

  return (
    <div className="min-h-[100dvh] bg-gray-50">
      <div className="max-w-lg mx-auto">
        {children}
      </div>
      {!hideNavbar && <Navbar />}
    </div>
  );
}
