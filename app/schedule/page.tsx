'use client';

import { useState } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';

const timetable = [
  ['국어', '수학', '영어', '사회', '체육'],
  ['과학', '미술', '음악', '국어', '수학'],
  ['영어', '사회', '체육', '과학', '미술'],
  ['음악', '국어', '수학', '영어', '사회'],
  ['체육', '과학', '미술', '음악', '국어'],
];

const weekdays = ['월', '화', '수', '목', '금'];
const periods = ['1교시', '2교시', '3교시', '4교시', '5교시'];

export default function SchedulePage() {
  return (
    <main className="max-w-lg mx-auto bg-white min-h-screen p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">한국고등학교</h1>
        <p className="text-sm text-gray-500 mt-1">2학년 2반 · 1학기</p>
      </div>

      <div className="grid grid-cols-[60px_repeat(5,1fr)]">
        <div className="text-center text-sm font-medium py-2"> </div>
        {weekdays.map((day, i) => (
          <div
            key={i}
            className="text-center text-sm font-medium py-2"
          >
            {day}
          </div>
        ))}

        {timetable.map((row, i) => (
          <>
            <div
              key={`period-${i}`}
              className="text-center text-sm font-medium py-3"
            >
              {periods[i]}
            </div>
            {row.map((subject, j) => (
              <div
                key={`${i}-${j}`}
                className="flex items-center justify-center py-3"
              >
                <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                  {subject}
                </span>
              </div>
            ))}
          </>
        ))}
      </div>
    </main>
  );
}
