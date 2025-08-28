'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hideNavbar =
    pathname.startsWith('/signup') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/board/') ||
    pathname.startsWith('/write') ||
    (pathname.startsWith('/messages/') && pathname !== '/messages');

  // 서버 사이드 렌더링 중에는 기본 레이아웃만 표시
  if (!mounted) {
    return (
      <div className="flex flex-col min-h-[100dvh] overflow-hidden bg-gray-50">
        <main className="flex-1 w-full max-w-lg mx-auto overflow-auto">
          {children}
        </main>
        {/* Navbar 높이(h-16) 자리 예약 */}
        <div className="h-16 shrink-0" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] overflow-hidden bg-gray-50">
      <main className="flex-1 w-full max-w-lg mx-auto overflow-auto">
        {children}
      </main>
      {!hideNavbar && <Navbar />}
    </div>
  );
}
