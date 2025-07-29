"use client";
import React from 'react';

// ProfileLayout: 뷰의 공통 레이아웃만 담당 (헤더는 페이지 컴포넌트에서 직접 렌더링)
export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-lg mx-auto">
        {children}
      </main>
    </div>
  );
}
