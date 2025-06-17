'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

interface Meal {
  date: string;
  lunch: string[];
  dinner: string[];
}

interface TodayMealCardProps {
  monthMeals: Meal[];
}

export default function TodayMealCard({ monthMeals }: TodayMealCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const startX = useRef<number | null>(null);

  const totalDays = monthMeals.length;
  const currentMeal = monthMeals[currentIndex];

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;

    const endX = e.changedTouches[0].clientX;
    const diff = startX.current - endX;

    if (diff > 50 && currentIndex < totalDays - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (diff < -50 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }

    startX.current = null;
  };

  return (
    <div className="grid grid-cols-1 gap-4 mt-4 px-4">
      <div
        className="w-full bg-white border-[1.5px] border-[#E9F0FF] p-4 rounded-xl shadow transition-transform duration-300 relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Image src="/lunchbox.png" alt="급식 아이콘" width={40} height={40} />
            <div>
              <h3 className="text-lg font-bold">오늘의 급식</h3>
              <p className="text-xs text-gray-500 mt-0.5">{currentMeal.date}</p>
            </div>
          </div>
          <span className="text-sm text-[#525252] font-semibold translate-y-2.5 -translate-x-2 block">
            이번달 급식표
          </span>
        </div>

        <div className="space-y-3 pl-4">
          <div>
            <span className="text-xs font-semibold text-[#2E71FF] border border-[#2E71FF] bg-white px-3 py-1 rounded-md inline-block mb-1">
              중식
            </span>
            <p className="text-sm text-gray-800 mt-1 font-semibold">{currentMeal.lunch.join(', ')}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#2E71FF] border border-[#2E71FF] bg-white px-3 py-1 rounded-md inline-block mb-1 mt-1">
              석식
            </span>
            <p className="text-sm text-gray-800 mt-1 font-semibold">{currentMeal.dinner.join(', ')}</p>
          </div>
        </div>

        <div className="flex justify-center gap-1 mt-4">
          {[...Array(5)].map((_, i) => {
            const midpoint = Math.floor(5 / 2);
            const distance = Math.abs(i - midpoint);
            const isEdge = currentIndex === 0 || currentIndex === totalDays - 1;
            const opacity =
              currentIndex === 0
                ? i === 0
                  ? 'opacity-100'
                  : distance === 1
                  ? 'opacity-60'
                  : 'opacity-30'
                : currentIndex === totalDays - 1
                ? i === 4
                  ? 'opacity-100'
                  : distance === 1
                  ? 'opacity-60'
                  : 'opacity-30'
                : i === midpoint
                ? 'opacity-100'
                : distance === 1
                ? 'opacity-60'
                : 'opacity-30';

            return <span key={i} className={`w-2 h-2 rounded-full bg-[#5A8FFF] ${opacity}`} />;
          })}
        </div>

        {/* 좌우 그림자 효과 */}
        {currentIndex > 0 && (
          <div className="absolute left-0 top-0 h-full w-4 bg-gradient-to-r from-gray-300/20 to-transparent pointer-events-none" />
        )}
        {currentIndex < totalDays - 1 && (
          <div className="absolute right-0 top-0 h-full w-4 bg-gradient-to-l from-gray-300/20 to-transparent pointer-events-none" />
        )}
      </div>
    </div>
  );
}
