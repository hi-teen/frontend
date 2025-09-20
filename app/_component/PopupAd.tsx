'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function PopupAd() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 오늘 팝업이 이미 표시되었는지 확인
    const today = new Date().toDateString();
    const lastSeenDate = localStorage.getItem('popupAdLastSeen');
    
    if (lastSeenDate !== today) {
      // 1초 후에 팝업 표시 (페이지 로딩 완료 후)
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // 오늘 날짜를 저장하여 오늘은 더 이상 표시하지 않음
    const today = new Date().toDateString();
    localStorage.setItem('popupAdLastSeen', today);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-3xl shadow-xl max-w-md mx-4">
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <XMarkIcon className="w-5 h-5 text-gray-600" />
        </button>
        
        {/* 팝업 이미지 */}
        <div className="relative">
          <Image
            src="/popup.png"
            alt="팝업 광고"
            width={400}
            height={300}
            className="rounded-lg"
            priority
          />
        </div>
      </div>
    </div>
  );
}
