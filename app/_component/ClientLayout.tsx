'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNavbar =
    pathname.startsWith('/signup') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/board/') ||
    pathname.startsWith('/write') ||
    (pathname.startsWith('/messages/') && pathname !== '/messages');

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <main className="flex-1 w-full max-w-lg mx-auto overflow-auto">
        {children}
      </main>
      {!hideNavbar && <Navbar />}
    </div>
  );
}
