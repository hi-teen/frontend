"use client";

import { useState } from "react";
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import { ko } from "date-fns/locale";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

type ViewMode = "daily" | "weekly" | "monthly";
type MealType = "breakfast" | "lunch" | "dinner";

interface MealMenu {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
}

export default function MealPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("daily");
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 임시 급식 데이터
  const mealData: Record<string, MealMenu> = {
    "2024-04-01": {
      breakfast: ["흰쌀밥", "미역국", "계란말이", "김치", "깍두기"],
      lunch: ["흰쌀밥", "미역국", "제육볶음", "김치", "깍두기"],
      dinner: ["흰쌀밥", "된장찌개", "고등어구이", "시금치나물", "총각김치"],
    },
    "2024-04-02": {
      breakfast: ["흰쌀밥", "콩나물국", "닭갈비", "무생채", "배추김치"],
      lunch: ["흰쌀밥", "콩나물국", "닭갈비", "무생채", "배추김치"],
      dinner: ["흰쌀밥", "김치찌개", "계란말이", "청경채무침", "깍두기"],
    },
    "2024-04-03": {
      breakfast: ["흰쌀밥", "떡국", "불고기", "도라지무침", "총각김치"],
      lunch: ["흰쌀밥", "떡국", "불고기", "도라지무침", "총각김치"],
      dinner: ["흰쌀밥", "순두부찌개", "코다리조림", "숙주나물", "배추김치"],
    },
    "2024-04-04": {
      breakfast: ["흰쌀밥", "어묵국", "돈까스", "양배추샐러드", "깍두기"],
      lunch: ["흰쌀밥", "어묵국", "돈까스", "양배추샐러드", "깍두기"],
      dinner: ["흰쌀밥", "부대찌개", "갈치구이", "콩나물무침", "배추김치"],
    },
    "2024-04-05": {
      breakfast: ["흰쌀밥", "감자국", "닭볶음탕", "오이무침", "배추김치"],
      lunch: ["흰쌀밥", "감자국", "닭볶음탕", "오이무침", "배추김치"],
      dinner: ["흰쌀밥", "청국장", "고등어조림", "미역줄기볶음", "깍두기"],
    },
    // ... 한 달치 데이터 추가 ...
  };

  const handlePrevDate = () => {
    if (viewMode === "daily") {
      setSelectedDate(subDays(selectedDate, 1));
    } else if (viewMode === "weekly") {
      setSelectedDate(subDays(selectedDate, 7));
    } else {
      const prevMonth = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() - 1,
        1
      );
      setSelectedDate(prevMonth);
    }
  };

  const handleNextDate = () => {
    if (viewMode === "daily") {
      setSelectedDate(addDays(selectedDate, 1));
    } else if (viewMode === "weekly") {
      setSelectedDate(addDays(selectedDate, 7));
    } else {
      const nextMonth = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        1
      );
      setSelectedDate(nextMonth);
    }
  };

  const renderMealSection = (date: Date, mealType: MealType) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const menu = mealData[dateKey]?.[mealType] || ["급식 정보가 없습니다."];

    return (
      <div className='space-y-1'>
        <span className='text-xs text-hiteen-pink-400 bg-hiteen-pink-100 px-2 py-0.5 rounded-full'>
          {mealType === "breakfast"
            ? "아침"
            : mealType === "lunch"
            ? "점심"
            : "저녁"}
        </span>
        <ul className='text-sm text-gray-600 pl-2'>
          {menu.map((item, index) => (
            <li key={index} className='list-disc list-inside'>
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderDailyView = () => {
    return (
      <div className='bg-white p-4 rounded-lg shadow-sm'>
        <h3 className='font-medium mb-4'>
          {format(selectedDate, "M월 d일 (EEEE)", { locale: ko })}
        </h3>
        <div className='space-y-4'>
          {renderMealSection(selectedDate, "breakfast")}
          {renderMealSection(selectedDate, "lunch")}
          {renderMealSection(selectedDate, "dinner")}
        </div>
      </div>
    );
  };

  const renderWeeklyView = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className='overflow-x-auto'>
        <table className='w-full min-w-[640px]'>
          <thead>
            <tr>
              <th className='p-2 border-b text-left'>날짜</th>
              <th className='p-2 border-b text-left'>아침</th>
              <th className='p-2 border-b text-left'>점심</th>
              <th className='p-2 border-b text-left'>저녁</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const meals = mealData[dateKey] || {
                breakfast: ["급식 정보가 없습니다."],
                lunch: ["급식 정보가 없습니다."],
                dinner: ["급식 정보가 없습니다."],
              };

              return (
                <tr key={dateKey} className='border-b last:border-b-0'>
                  <td className='p-2'>
                    <div className='font-medium'>
                      {format(day, "M월 d일", { locale: ko })}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {format(day, "EEEE", { locale: ko })}
                    </div>
                  </td>
                  <td className='p-2'>
                    <ul className='text-sm text-gray-600'>
                      {meals.breakfast.map((item, index) => (
                        <li key={index} className='list-disc list-inside'>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className='p-2'>
                    <ul className='text-sm text-gray-600'>
                      {meals.lunch.map((item, index) => (
                        <li key={index} className='list-disc list-inside'>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className='p-2'>
                    <ul className='text-sm text-gray-600'>
                      {meals.dinner.map((item, index) => (
                        <li key={index} className='list-disc list-inside'>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderMonthlyView = () => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <div className='space-y-4'>
        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const meals = mealData[dateKey] || {
            breakfast: ["급식 정보가 없습니다."],
            lunch: ["급식 정보가 없습니다."],
            dinner: ["급식 정보가 없습니다."],
          };

          return (
            <div key={dateKey} className='bg-white p-4 rounded-lg shadow-sm'>
              <h3 className='font-medium mb-2'>
                {format(day, "M월 d일 (EEEE)", { locale: ko })}
              </h3>
              <div className='space-y-4'>
                <div>
                  <span className='text-xs text-hiteen-pink-400 bg-hiteen-pink-100 px-2 py-0.5 rounded-full'>
                    아침
                  </span>
                  <ul className='mt-1 text-sm text-gray-600'>
                    {meals.breakfast.map((item, index) => (
                      <li key={index} className='list-disc list-inside'>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className='text-xs text-hiteen-pink-400 bg-hiteen-pink-100 px-2 py-0.5 rounded-full'>
                    점심
                  </span>
                  <ul className='mt-1 text-sm text-gray-600'>
                    {meals.lunch.map((item, index) => (
                      <li key={index} className='list-disc list-inside'>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className='text-xs text-hiteen-pink-400 bg-hiteen-pink-100 px-2 py-0.5 rounded-full'>
                    저녁
                  </span>
                  <ul className='mt-1 text-sm text-gray-600'>
                    {meals.dinner.map((item, index) => (
                      <li key={index} className='list-disc list-inside'>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <main className='pb-16 max-w-lg mx-auto min-h-screen bg-gray-50'>
      <header className='px-4 py-3 flex items-center gap-4 bg-white sticky top-0 z-50 border-b'>
        <Link href='/'>
          <ArrowLeftIcon className='w-6 h-6' />
        </Link>
        <h1 className='text-xl font-bold'>급식표</h1>
      </header>

      <div className='p-4'>
        {/* 보기 모드 선택 */}
        <div className='flex gap-2 mb-4'>
          {(["daily", "weekly", "monthly"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex-1 py-2 px-4 rounded-lg ${
                viewMode === mode
                  ? "bg-hiteen-pink-400 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {mode === "daily" ? "일간" : mode === "weekly" ? "주간" : "월간"}
            </button>
          ))}
        </div>

        {/* 날짜 네비게이션 */}
        <div className='flex justify-between items-center mb-4'>
          <button
            onClick={handlePrevDate}
            className='p-2 hover:bg-gray-100 rounded-lg'
          >
            <ChevronLeftIcon className='w-5 h-5' />
          </button>
          <h2 className='font-medium'>
            {viewMode === "monthly"
              ? format(selectedDate, "yyyy년 M월", { locale: ko })
              : format(selectedDate, "yyyy년 M월", { locale: ko })}
          </h2>
          <button
            onClick={handleNextDate}
            className='p-2 hover:bg-gray-100 rounded-lg'
          >
            <ChevronRightIcon className='w-5 h-5' />
          </button>
        </div>

        {/* 급식표 내용 */}
        <div className='bg-gray-50 rounded-lg p-4'>
          {viewMode === "daily" && renderDailyView()}
          {viewMode === "weekly" && renderWeeklyView()}
          {viewMode === "monthly" && renderMonthlyView()}
        </div>
      </div>
    </main>
  );
}
