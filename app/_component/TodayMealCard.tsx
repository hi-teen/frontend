'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

interface Meal {
  date: string;
  lunch: string[];
  dinner: string[];
  lunchInfo?: {
    calories: string;
    nutrients: string;
  };
  dinnerInfo?: {
    calories: string;
    nutrients: string;
  };
}

interface TodayMealCardProps {
  monthMeals: Meal[];
  initialIndex?: number;
}

function cleanMenuName(menu: string) {
  return menu.replace(/\s*\([^)]+\)/g, '').trim();
}

export default function TodayMealCard({ monthMeals, initialIndex = 0 }: TodayMealCardProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; calories: string; nutrients: string }>({
    title: '',
    calories: '',
    nutrients: '',
  });
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
    if (diff > 50 && currentIndex < totalDays - 1) setCurrentIndex((prev) => prev + 1);
    else if (diff < -50 && currentIndex > 0) setCurrentIndex((prev) => prev - 1);
    startX.current = null;
  };

  const openModal = (title: string, calories: string, nutrients: string) => {
    setModalContent({ title, calories, nutrients });
    setModalOpen(true);
  };

  if (!currentMeal) {
    return (
      <div className="mt-4 px-4 text-sm text-gray-500">
        <div className="bg-white border p-4 rounded-xl shadow">
          이번 달 급식 정보가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <>
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
          </div>

          {/* 급식 정보 */}
          <div className="space-y-3 pl-4">
            <div>
              <span className="text-xs font-semibold text-[#2E71FF] border border-[#2E71FF] bg-white px-3 py-1 rounded-md inline-block mb-1">
                중식
              </span>
              <button
                className="ml-2 text-[10px] px-2 py-0.5 rounded-full border border-[#7ba5e6] bg-[#f3f8ff] text-[#3366cc] hover:bg-[#e4f0ff] font-semibold transition"
                onClick={() =>
                  openModal(
                    '중식 영양성분',
                    currentMeal.lunchInfo?.calories || '-',
                    currentMeal.lunchInfo?.nutrients || '-'
                  )
                }
              >
                영양성분
              </button>
              <p className="text-sm text-gray-800 mt-1 font-semibold">
                {currentMeal.lunch.length > 0
                  ? currentMeal.lunch.map((m) => cleanMenuName(m)).join(', ')
                  : '급식이 없습니다.'}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-[#2E71FF] border border-[#2E71FF] bg-white px-3 py-1 rounded-md inline-block mb-1 mt-1">
                석식
              </span>
              <button
                className="ml-2 text-[10px] px-2 py-0.5 rounded-full border border-[#7ba5e6] bg-[#f3f8ff] text-[#3366cc] hover:bg-[#e4f0ff] font-semibold transition"
                onClick={() =>
                  openModal(
                    '석식 영양성분',
                    currentMeal.dinnerInfo?.calories || '-',
                    currentMeal.dinnerInfo?.nutrients || '-'
                  )
                }
              >
                영양성분
              </button>
              <p className="text-sm text-gray-800 mt-1 font-semibold">
                {currentMeal.dinner.length > 0
                  ? currentMeal.dinner.map((m) => cleanMenuName(m)).join(', ')
                  : '급식이 없습니다.'}
              </p>
            </div>
          </div>

          {/* 페이지네이션 점 */}
          <div className="flex justify-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => {
              const midpoint = Math.floor(5 / 2);
              const distance = Math.abs(i - midpoint);
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

              return (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full bg-[#5A8FFF] ${opacity}`}
                />
              );
            })}
          </div>

          {/* 좌우 그림자 */}
          {currentIndex > 0 && (
            <div className="absolute left-0 top-0 h-full w-4 bg-gradient-to-r from-gray-300/20 to-transparent pointer-events-none" />
          )}
          {currentIndex < totalDays - 1 && (
            <div className="absolute right-0 top-0 h-full w-4 bg-gradient-to-l from-gray-300/20 to-transparent pointer-events-none" />
          )}
        </div>
      </div>

      {/* -------- 영양성분 모달 -------- */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 min-w-[270px] max-w-xs shadow-xl relative">
            <button
              className="absolute right-2 top-2 text-gray-500 hover:text-blue-500 text-lg font-bold"
              onClick={() => setModalOpen(false)}
              aria-label="닫기"
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-3 text-[#3565b9]">{modalContent.title}</h2>
            <div className="mb-2">
              <span className="text-sm font-semibold text-gray-700">칼로리</span>
              <p className="text-sm text-gray-800 mt-0.5">{modalContent.calories}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-700">영양성분</span>
              <p className="text-sm text-gray-800 mt-0.5 whitespace-pre-line">
                {modalContent.nutrients}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
