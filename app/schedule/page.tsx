'use client';

import { useEffect, useState } from 'react';

// 타입 정의
interface TimeTableItem {
  period: number;
  subject: string;
}
interface TimeTableData {
  [day: string]: TimeTableItem[];
}

// 요일 및 시간
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

// 오늘 요일이 몇 번째 인덱스인지 구하기 (월요일=0, 금요일=4, 아니면 -1)
function getTodayIndex() {
  const day = new Date().getDay();
  if (day >= 1 && day <= 5) return day - 1; // 1=월, 2=화, ..., 5=금
  return -1; // 주말(토,일)엔 표시하지 않음
}

// 내 정보 불러오기 (school, grade, class)
function getMyProfile() {
  if (typeof window === "undefined") return null;
  const profile = localStorage.getItem('signupProfile');
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
    const info = getMyProfile();
    if (!info) return;
    setSchoolInfo(info);

    const fetchTimetable = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        // 하드코딩 대신 내 정보로 API 요청!
        const params = new URLSearchParams({
          officeCode: info.eduOfficeCode,
          schoolCode: info.schoolCode,
          grade: String(info.gradeNumber),
          classNum: String(info.classNumber),
        }).toString();

        const res = await fetch(
          `https://hiteen.site/api/v1/timetable?${params}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await res.json();
        const data: TimeTableData = json.data;

        // 7교시 x 5일(월~금) 2차원 배열로 변환
        const result: string[][] = Array.from({ length: 7 }, () => Array(5).fill(''));

        weekdays.forEach((day, dayIdx) => {
          const items = data[day];
          if (items) {
            items.forEach(({ period, subject }: TimeTableItem) => {
              // period는 1부터 시작
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
    };

    fetchTimetable();
  }, []);

  return (
    <main className="max-w-lg mx-auto bg-white min-h-screen p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{schoolInfo?.schoolName ?? "우리학교"}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {schoolInfo ? `${schoolInfo.gradeNumber}학년 ${schoolInfo.classNumber}반 · 1학기` : ""}
        </p>
      </div>

      {/* 요일 헤더 */}
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

      {/* 시간표 */}
      {periods.map((period, i) => (
        <div key={i} className="grid grid-cols-[48px_repeat(5,1fr)] ">
          {/* 교시 + 시간 */}
          <div className="flex flex-col items-center justify-center text-xs font-medium text-gray-700 py-3">
            <div>{period}</div>
            <div className="text-[7px] text-gray-400">{times[i]}</div>
          </div>
          {/* 과목 */}
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
