'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

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

// 메뉴 이름에서 괄호 부분(알러지)을 제거
function cleanMenuName(menu: string) {
  return menu.replace(/\s*\([^)]+\)/g, '').replace(/\.$/, '').trim();
}

// 괄호 안 알러지 정보만 추출 (점 포함)
function extractAllergy(menu: string) {
  const match = menu.match(/\(([^)]+)\)/);
  return match ? match[1] : '';
}

export default function TodayMealCard({ monthMeals, initialIndex = 0 }: TodayMealCardProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    calories: string;
    nutrients: string;
    menus: string[];
    allergies: string[];
  }>({
    title: '',
    calories: '',
    nutrients: '',
    menus: [],
    allergies: [],
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

  const openModal = (
    title: string,
    calories: string,
    nutrients: string,
    menus: string[]
  ) => {
    setModalContent({
      title,
      calories,
      nutrients,
      menus,
      allergies: menus.map(extractAllergy),
    });
    setModalOpen(true);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalDays - 1) {
      setCurrentIndex(currentIndex + 1);
    }
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
          {/* 네비게이션 버튼들 */}
          <div className="absolute top-1/2 left-1 transform -translate-y-1/2 z-10">
            {currentIndex > 0 && (
              <button
                onClick={handlePrev}
                className="w-6 h-5 bg-white/90 hover:bg-white rounded-full shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-110 opacity-70 hover:opacity-100"
                aria-label="이전 급식"
              >
                <ChevronLeftIcon className="w-3 h-3 text-gray-500" />
              </button>
            )}
          </div>
          
          <div className="absolute top-1/2 right-1 transform -translate-y-1/2 z-10">
            {currentIndex < totalDays - 1 && (
              <button
                onClick={handleNext}
                className="w-6 h-5 bg-white/90 hover:bg-white rounded-full shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-110 opacity-70 hover:opacity-100"
                aria-label="다음 급식"
              >
                <ChevronRightIcon className="w-3 h-3 text-gray-500" />
              </button>
            )}
          </div>

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
          <div className="space-y-3 px-3">
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
                    currentMeal.lunchInfo?.nutrients || '-',
                    currentMeal.lunch
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
                    currentMeal.dinnerInfo?.nutrients || '-',
                    currentMeal.dinner
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

            {/* 칼로리 */}
            <div className="mb-2 flex items-center gap-2">
              <Image src="/calorie.png" alt="칼로리" width={18} height={18} />
              <span className="text-sm font-semibold text-gray-700">칼로리</span>
            </div>
            <p className="text-sm text-gray-800 font-semibold mb-2">{modalContent.calories}</p>
            {/* 실선 */}
            <div className="border-t border-gray-200 my-2" />

            {/* 영양성분 */}
            <div className="mb-2 flex items-center gap-2">
              <Image src="/ingredients.png" alt="영양성분" width={18} height={18} />
              <span className="text-sm font-semibold text-gray-700">영양성분</span>
            </div>
            <p className="text-sm text-gray-800 font-semibold whitespace-pre-line mb-2">
              {modalContent.nutrients}
            </p>
            {/* 실선 */}
            <div className="border-t border-gray-200 my-2" />

            {/* 메뉴(알러지) */}
            <div className="flex items-center gap-2 mb-1">
              <Image src="/menu.png" alt="메뉴" width={18} height={18} />
              <span className="text-sm font-semibold text-gray-700">메뉴 (알러지)</span>
            </div>
            <ul className="text-sm text-gray-800 font-semibold mt-1">
              {modalContent.menus.map((menu, i) => {
                const menuName = cleanMenuName(menu);
                const allergy = extractAllergy(menu);
                return (
                  <li key={i}>
                    {menuName}
                    {allergy && (
                      <span className="text-xs text-gray-500"> ({allergy})</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
