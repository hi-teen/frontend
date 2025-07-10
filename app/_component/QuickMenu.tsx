'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

type PeriodType = {
  period: number;
  start: string;
  end: string;
}[];

const periods: PeriodType = [
  { period: 1, start: "09:00", end: "09:50" },
  { period: 2, start: "10:00", end: "10:50" },
  { period: 3, start: "11:00", end: "11:50" },
  { period: 4, start: "13:00", end: "13:50" },
  { period: 5, start: "14:00", end: "14:50" },
  { period: 6, start: "15:00", end: "15:50" },
  { period: 7, start: "16:00", end: "16:50" }
];

const sampleTimetable = {
  월요일: ["국어", "영어", "수학", "과학", "체육", "음악", "미술"],
  화요일: ["사회", "영어", "수학", "역사", "도덕", "과학", "체육"],
  수요일: ["국어", "미술", "수학", "음악", "과학", "영어", "체육"],
  목요일: ["체육", "과학", "수학", "국어", "도덕", "영어", "미술"],
  금요일: ["음악", "국어", "수학", "과학", "체육", "영어", "미술"],
};

function getCurrentPeriodInfo(list: PeriodType) {
  const now = new Date();
  const todayStr = now.toLocaleDateString("en-CA");
  for (let i = 0; i < list.length; i++) {
    const { start, end } = list[i];
    const startDate = new Date(`${todayStr}T${start}:00`);
    const endDate = new Date(`${todayStr}T${end}:00`);
    if (now >= startDate && now < endDate) {
      return { current: i, isBreak: false };
    }
    if (i < list.length - 1) {
      const nextStart = new Date(`${todayStr}T${list[i + 1].start}:00`);
      if (now >= endDate && now < nextStart) {
        return { current: i, isBreak: true };
      }
    }
  }
  return { current: -1, isBreak: false };
}

// 학교 url 가져오기 함수 (http:// 자동 붙이기)
function getSchoolUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const profile = localStorage.getItem('signupProfile');
  if (!profile) return null;
  try {
    const parsed = JSON.parse(profile);
    let url = parsed?.school?.schoolUrl;
    if (!url) return null;
    // 프로토콜이 없으면 http://를 붙인다!
    if (!/^https?:\/\//.test(url)) {
      url = 'http://' + url;
    }
    return url;
  } catch {
    return null;
  }
}

export default function QuickMenu() {
  const [schoolUrl, setSchoolUrl] = useState<string | null>(null);

  useEffect(() => {
    setSchoolUrl(getSchoolUrl());
  }, []);

  const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const todayIndex = new Date().getDay();
  const today = days[todayIndex];

  let todaySubjects: string[] = [];
  if (
    today === "월요일" ||
    today === "화요일" ||
    today === "수요일" ||
    today === "목요일" ||
    today === "금요일"
  ) {
    todaySubjects = sampleTimetable[today as keyof typeof sampleTimetable] || [];
  }

  const { current } = getCurrentPeriodInfo(periods);

  let nowSubject = "수업 없음";
  let nextSubject = "";
  let periodLabel = "";
  let nextPeriodLabel = "";
  let nextPeriodTime = "";

  if (current >= 0 && todaySubjects[current]) {
    nowSubject = todaySubjects[current];
    periodLabel = `${current + 1}교시 · ${periods[current].start}`;
    if (current < periods.length - 1 && todaySubjects[current + 1]) {
      nextSubject = todaySubjects[current + 1];
      nextPeriodLabel = `${current + 2}교시`;
      nextPeriodTime = periods[current + 1].start;
    }
  } else if (current === -1 && todaySubjects.length > 0) {
    nowSubject = "수업 전";
    nextSubject = todaySubjects[0];
    nextPeriodLabel = `1교시`;
    nextPeriodTime = periods[0].start;
  }

  return (
    <div className='flex gap-3 px-4 py-6 items-center overflow-x-auto hide-scrollbar'>
      <button
        className='flex flex-col items-center gap-1 min-w-[4rem]'
        onClick={() => {
          if (schoolUrl) window.open(schoolUrl, '_blank');
        }}
        disabled={!schoolUrl}
      >
        <div className='w-[60px] h-[60px] bg-[#E9F0FF] rounded-[10px] flex items-center justify-center'>
          <Image src='/homeicon.png' alt='학교 홈' width={40} height={40} />
        </div>
        <span className='text-xs text-[#656565] font-semibold whitespace-nowrap'>학교 홈</span>
      </button>

      <div className='flex-1 bg-[#E9F0FF] rounded-[10px] px-4 py-3 flex justify-between items-center h-[72px] min-w-[180px]'>
        {/* 지금 수업 (왼쪽) */}
        <div className="flex flex-col justify-center">
          <span className='text-xs text-[#656565] font-semibold mb-1'>지금 수업</span>
          <span className='text-lg font-bold text-[#2269FF]'>{nowSubject}</span>
          <span className='text-xs text-gray-500'>{periodLabel}</span>
        </div>
        {/* 다음 수업 (오른쪽) */}
        {nextSubject && (
          <div className="flex flex-col items-end ml-3">
            <span className='text-xs text-[#656565] font-semibold mt-2'>다음 수업</span>
            <span className='text-xs text-[#2269FF] font-bold mt-1'>
              {nextSubject} ({nextPeriodLabel} · {nextPeriodTime})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
