'use client';

import { useEffect, useState } from 'react';

interface TimeTableItem {
  period: number;
  subject: string;
}
interface TimeTableData {
  [day: string]: TimeTableItem[];
}

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

function getTodayIndex() {
  const day = new Date().getDay();
  if (day >= 1 && day <= 5) return day - 1; // 1=월, 2=화, ..., 5=금
  return -1; // 주말(토,일)엔 표시하지 않음
}

// 내 정보 불러오기 (항상 서버에서, 실패시 localStorage fallback)
async function fetchMyProfile() {
  const token = typeof window !== "undefined" ? localStorage.getItem('accessToken') : null;
  if (!token) return null;
  try {
    const res = await fetch('/api/v1/members/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (json?.data?.school?.eduOfficeCode && json?.data?.school?.schoolCode) {
      // 최신 정보 localStorage에도 저장
      localStorage.setItem('signupProfile', JSON.stringify(json.data));
      return {
        schoolName: json.data.school.schoolName || "",
        eduOfficeCode: json.data.school.eduOfficeCode,
        schoolCode: json.data.school.schoolCode,
        gradeNumber: json.data.gradeNumber,
        classNumber: json.data.classNumber,
        name: json.data.name
      };
    }
    return null;
  } catch {
    // 서버 요청 실패시 localStorage fallback
    const profile = typeof window !== "undefined" ? localStorage.getItem('signupProfile') : null;
    if (!profile) return null;
    try {
      const { school, gradeNumber, classNumber, name } = JSON.parse(profile);
      if (!school?.eduOfficeCode || !school?.schoolCode) return null;
      return {
        schoolName: school.schoolName || "",
        eduOfficeCode: school.eduOfficeCode,
        schoolCode: school.schoolCode,
        gradeNumber,
        classNumber,
        name
      };
    } catch {
      return null;
    }
  }
}

export default function SchedulePage() {
  const [timetable, setTimetable] = useState<string[][]>([]);
  const [schoolInfo, setSchoolInfo] = useState<null | {
    schoolName: string;
    gradeNumber: number;
    classNumber: number;
    name: string;
  }>(null);
  const todayIdx = getTodayIndex();

  useEffect(() => {
    async function load() {
      const info = await fetchMyProfile();
      if (!info) return;
      setSchoolInfo(info);

      try {
        const token = typeof window !== "undefined" ? localStorage.getItem('accessToken') : null;
        const params = new URLSearchParams({
          officeCode: info.eduOfficeCode,
          schoolCode: info.schoolCode,
          grade: String(info.gradeNumber),
          classNum: String(info.classNumber),
        }).toString();

        const res = await fetch(
          `/api/v1/timetable?${params}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await res.json();
        const data: TimeTableData = json.data;

        const result: string[][] = Array.from({ length: 7 }, () => Array(5).fill(''));

        weekdays.forEach((day, dayIdx) => {
          const items = data[day];
          if (items) {
            items.forEach(({ period, subject }: TimeTableItem) => {
              if (period >= 1 && period <= 7) {
                result[period - 1][dayIdx] = subject;
              }
            });
          }
        });

        setTimetable(result);
      } catch (e) {
        console.error('시간표 불러오기 실패', e);
      }
    }
    load();
  }, []);

  return (
    <main className="max-w-lg mx-auto bg-white min-h-screen p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{schoolInfo?.schoolName ?? "우리학교"}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {schoolInfo ? `${schoolInfo.gradeNumber}학년 ${schoolInfo.classNumber}반 · 1학기` : ""}
        </p>
      </div>
      <div className="grid grid-cols-[48px_repeat(5,1fr)] mb-1">
        <div />
        {weekdays.map((day, i) => (
          <div
            key={i}
            className={
              "text-center text-xs font-bold py-2 rounded-md mx-[2px] " +
              (i === todayIdx
                ? "bg-[#2563eb] text-white shadow-sm"
                : "bg-gray-100 text-gray-700")
            }
          >
            {day}
          </div>
        ))}
      </div>
      {periods.map((period, i) => (
        <div key={i} className="grid grid-cols-[48px_repeat(5,1fr)] ">
          <div className="flex flex-col items-center justify-center text-xs font-medium text-gray-700 py-3">
            <div>{period}</div>
            <div className="text-[7px] text-gray-400">{times[i]}</div>
          </div>
          {timetable[i]?.map((subject, j) => (
            <div
              key={`${i}-${j}`}
              className="flex items-center justify-center py-2"
            >
              <span
                className={
                  "flex items-center justify-center text-xs font-bold rounded-md " +
                  (j === todayIdx
                    ? "bg-[#bed1fa] text-gray-800"
                    : "bg-[#E9F0FF] text-gray-700")
                }
                style={{
                  width: 50,
                  height: 34,
                  minWidth: 20,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontWeight: 700,
                  fontSize: '9px',
                  letterSpacing: '-0.5px',
                }}
                title={subject}
              >
                {subject || ''}
              </span>
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}
