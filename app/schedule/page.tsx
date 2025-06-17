'use client';

const timetable = [
  ['국어', '수학', '영어', '사회', '체육'],
  ['과학', '미술', '음악', '국어', '수학'],
  ['영어', '사회', '체육', '과학', '미술'],
  ['음악', '국어', '수학', '영어', '사회'],
  ['체육', '과학', '미술', '음악', '국어'],
  ['영어', '영어', '국어', '수학', '미술'],
  ['체육', '과학', '미술', '수학', '과학'],
];

const weekdays = ['월요일', '화요일', '수요일', '목요일', '금요일'];
const periods = ['1교시', '2교시', '3교시', '4교시', '5교시', '6교시', '7교시'];
const times = [
  '09:00 - 09:50',
  '10:00 - 10:50',
  '11:00 - 11:50',
  '13:00 - 13:50',
  '14:00 - 14:50',
  '15:00 - 15:50',
  '16:00 - 16:50',
];

export default function SchedulePage() {
  return (
    <main className="max-w-lg mx-auto bg-white min-h-screen p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">한국고등학교</h1>
        <p className="text-sm text-gray-500 mt-1">2학년 2반 · 1학기</p>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-[48px_repeat(5,1fr)] mb-1">
        <div />
        {weekdays.map((day, i) => (
          <div
            key={i}
            className="bg-gray-100 text-center text-xs font-bold text-gray-700 py-2 rounded-md mx-[2px]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 시간표 */}
      {timetable.map((row, i) => (
        <div key={i} className="grid grid-cols-[48px_repeat(5,1fr)] ">
          {/* 교시 + 시간 */}
          <div className="flex flex-col items-center justify-center text-sm font-medium text-gray-700 py-3">
            <div>{periods[i]}</div>
            <div className="text-[7px] text-gray-400">{times[i]}</div>
          </div>
          {/* 과목 */}
          {row.map((subject, j) => (
            <div key={`${i}-${j}`} className="flex items-center justify-center py-3">
              <span className="px-3 py-2 text-sm font-bold bg-[#E9F0FF] text-black rounded-md">
                {subject}
              </span>
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}
