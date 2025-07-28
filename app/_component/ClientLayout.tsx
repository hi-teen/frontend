'use client';

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const NAVBAR_HEIGHT = 80; // 네비바 높이(px), Tailwind: h-20이면 80

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNavbar =
    pathname.startsWith("/signup") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/board/") ||
    pathname.startsWith("/write") ||
    (pathname.startsWith("/messages/") && pathname !== "/messages");

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center">
      <main
        className={`w-full max-w-lg overflow-y-auto`}
        style={{
          height: !hideNavbar
            ? `calc(100vh - ${NAVBAR_HEIGHT}px)`
            : "100vh",
        }}
      >
        {children}
      </main>
      {!hideNavbar && <Navbar />}
    </div>
  );
}
