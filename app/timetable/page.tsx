"use client";

import { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface TimeTableData {
  subject: string;
  teacher: string;
  room: string;
}

type WeekDay = "월" | "화" | "수" | "목" | "금";

export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState("2-3");

  // 임시 시간표 데이터
  const timetableData: Record<WeekDay, TimeTableData[]> = {
    월: [
      { subject: "국어", teacher: "김선생", room: "2-3" },
      { subject: "수학", teacher: "이선생", room: "2-3" },
      { subject: "영어", teacher: "박선생", room: "어학실" },
      { subject: "과학", teacher: "정선생", room: "과학실" },
      { subject: "체육", teacher: "최선생", room: "체육관" },
      { subject: "음악", teacher: "한선생", room: "음악실" },
    ],
    화: [
      { subject: "수학", teacher: "이선생", room: "2-3" },
      { subject: "영어", teacher: "박선생", room: "어학실" },
      { subject: "국어", teacher: "김선생", room: "2-3" },
      { subject: "미술", teacher: "정선생", room: "미술실" },
      { subject: "과학", teacher: "최선생", room: "과학실" },
      { subject: "사회", teacher: "한선생", room: "2-3" },
    ],
    수: [
      { subject: "영어", teacher: "박선생", room: "어학실" },
      { subject: "수학", teacher: "이선생", room: "2-3" },
      { subject: "체육", teacher: "최선생", room: "체육관" },
      { subject: "국어", teacher: "김선생", room: "2-3" },
      { subject: "과학", teacher: "정선생", room: "과학실" },
      { subject: "사회", teacher: "한선생", room: "2-3" },
    ],
    목: [
      { subject: "과학", teacher: "정선생", room: "과학실" },
      { subject: "국어", teacher: "김선생", room: "2-3" },
      { subject: "수학", teacher: "이선생", room: "2-3" },
      { subject: "영어", teacher: "박선생", room: "어학실" },
      { subject: "음악", teacher: "한선생", room: "음악실" },
      { subject: "체육", teacher: "최선생", room: "체육관" },
    ],
    금: [
      { subject: "사회", teacher: "한선생", room: "2-3" },
      { subject: "과학", teacher: "정선생", room: "과학실" },
      { subject: "국어", teacher: "김선생", room: "2-3" },
      { subject: "수학", teacher: "이선생", room: "2-3" },
      { subject: "영어", teacher: "박선생", room: "어학실" },
      { subject: "미술", teacher: "정선생", room: "미술실" },
    ],
  };

  return (
    <main className='pb-16 max-w-lg mx-auto min-h-screen bg-gray-50'>
      <header className='px-4 py-3 flex items-center gap-4 bg-white sticky top-0 z-50 border-b'>
        <Link href='/'>
          <ArrowLeftIcon className='w-6 h-6' />
        </Link>
        <h1 className='text-xl font-bold'>시간표</h1>
      </header>

      <div className='p-4'>
        {/* 반 선택 */}
        <div className='flex gap-2 mb-4 overflow-x-auto hide-scrollbar'>
          {["2-1", "2-2", "2-3", "2-4"].map((className) => (
            <button
              key={className}
              onClick={() => setSelectedClass(className)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedClass === className
                  ? "bg-hiteen-pink-400 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {className}반
            </button>
          ))}
        </div>

        {/* 시간표 */}
        <div className='overflow-x-auto bg-white rounded-lg shadow-sm'>
          <table className='w-full min-w-[640px]'>
            <thead>
              <tr className='bg-gray-50'>
                <th className='p-2 border-b border-r text-center w-16'>교시</th>
                {(Object.keys(timetableData) as WeekDay[]).map((day) => (
                  <th key={day} className='p-2 border-b text-center'>
                    {day}요일
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6].map((period) => (
                <tr key={period}>
                  <td className='p-2 border-b border-r text-center bg-gray-50'>
                    {period}
                  </td>
                  {(Object.keys(timetableData) as WeekDay[]).map((day) => {
                    const lesson = timetableData[day][period - 1];
                    return (
                      <td
                        key={day}
                        className='p-2 border-b hover:bg-gray-50 transition-colors'
                      >
                        <div className='text-center'>
                          <div className='font-medium'>{lesson.subject}</div>
                          <div className='text-xs text-gray-500'>
                            {lesson.teacher}
                          </div>
                          <div className='text-xs text-gray-400'>
                            {lesson.room}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 시간 안내 */}
        <div className='mt-4 bg-white rounded-lg p-4 shadow-sm'>
          <h3 className='font-medium mb-2'>수업 시간</h3>
          <div className='space-y-1 text-sm'>
            <div className='flex justify-between'>
              <span>1교시</span>
              <span className='text-gray-500'>09:00 - 09:50</span>
            </div>
            <div className='flex justify-between'>
              <span>2교시</span>
              <span className='text-gray-500'>10:00 - 10:50</span>
            </div>
            <div className='flex justify-between'>
              <span>3교시</span>
              <span className='text-gray-500'>11:00 - 11:50</span>
            </div>
            <div className='flex justify-between'>
              <span>4교시</span>
              <span className='text-gray-500'>12:00 - 12:50</span>
            </div>
            <div className='flex justify-between'>
              <span>5교시</span>
              <span className='text-gray-500'>14:00 - 14:50</span>
            </div>
            <div className='flex justify-between'>
              <span>6교시</span>
              <span className='text-gray-500'>15:00 - 15:50</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
