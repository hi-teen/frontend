'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchTimeTable, getMySchoolInfo } from "@/shared/api/timetable";
import type { UserInfo } from "@/entities/auth/types";

const periods = [
  { period: 1, start: "09:00", end: "09:50" },
  { period: 2, start: "10:00", end: "10:50" },
  { period: 3, start: "11:00", end: "11:50" },
  { period: 4, start: "13:00", end: "13:50" },
  { period: 5, start: "14:00", end: "14:50" },
  { period: 6, start: "15:00", end: "15:50" },
  { period: 7, start: "16:00", end: "16:50" }
];

const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

function getCurrentPeriodInfo() {
  const now = new Date();
  const todayStr = now.toLocaleDateString("en-CA");
  for (let i = 0; i < periods.length; i++) {
    const { start, end } = periods[i];
    const startDate = new Date(`${todayStr}T${start}:00`);
    const endDate = new Date(`${todayStr}T${end}:00`);
    if (now >= startDate && now < endDate) return { current: i, isBreak: false };
    if (i < periods.length - 1) {
      const nextStart = new Date(`${todayStr}T${periods[i + 1].start}:00`);
      if (now >= endDate && now < nextStart) return { current: i, isBreak: true };
    }
  }
  return { current: -1, isBreak: false };
}

function getLastPeriodEndTime(todaySubjects: string[]) {
  if (!todaySubjects || todaySubjects.length === 0) return null;
  const lastIdx = todaySubjects.length - 1;
  const lastPeriod = periods[lastIdx];
  const todayStr = new Date().toLocaleDateString("en-CA");
  return new Date(`${todayStr}T${lastPeriod.end}:00`);
}

function getSchoolUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const profileStr = localStorage.getItem('signupProfile');
  if (!profileStr) return null;
  try {
    const profile: Partial<UserInfo> = JSON.parse(profileStr);
    let url = profile.school?.schoolUrl;
    if (!url) return null;
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
  const [timeTable, setTimeTable] = useState<{ [day: string]: { period: number, subject: string }[] }>({});
  const [todaySubjects, setTodaySubjects] = useState<string[]>([]);
  const [nextDayFirstSubject, setNextDayFirstSubject] = useState<{ subject: string; period: number } | null>(null);

  useEffect(() => {
    setSchoolUrl(getSchoolUrl());
    const info = getMySchoolInfo();
    if (!info) return;

    fetchTimeTable({
      eduOfficeCode: info.eduOfficeCode,
      schoolCode: info.schoolCode,
      gradeNumber: info.gradeNumber,
      classNumber: info.classNumber,
    })
      .then((data) => {
        setTimeTable(data || {});
        const todayIndex = new Date().getDay();
        const today = days[todayIndex];

        const subjectsArr = (data[today] || [])
          .sort((a: { period: number; subject: string }, b: { period: number; subject: string }) => a.period - b.period)
          .map((row: any) => row.subject || "수업 없음");
        setTodaySubjects(subjectsArr);

        let nextIdx = todayIndex + 1;
        let searched = false;
        while (!searched) {
          if (nextIdx > 6) nextIdx = 1;
          const nextDay = days[nextIdx];
          const nextDayArr: { period: number; subject: string }[] = data[nextDay] || [];
          if (nextDayArr.length > 0) {
            const sorted = [...nextDayArr].sort((a, b) => a.period - b.period);
            setNextDayFirstSubject({ subject: sorted[0].subject, period: sorted[0].period });
            searched = true;
            break;
          }
          nextIdx++;
          if (nextIdx === todayIndex + 1) break;
        }
      })
      .catch((e) => {
        console.error('시간표 불러오기 실패', e);
        setTodaySubjects([]);
        setNextDayFirstSubject(null);
      });
  }, []);

  const { current } = getCurrentPeriodInfo();
  const now = new Date();
  const lastPeriodEndTime = getLastPeriodEndTime(todaySubjects);

  const isTodayAllFinished =
    lastPeriodEndTime && now > lastPeriodEndTime;

  let nowSubject = "수업 없음";
  let nextSubject = "";
  let periodLabel = "";
  let nextPeriodLabel = "";
  let nextPeriodTime = "";

  if (isTodayAllFinished && nextDayFirstSubject) {
    nowSubject = "수업 전";
    nextSubject = nextDayFirstSubject.subject;
    nextPeriodLabel = `${nextDayFirstSubject.period}교시`;
    nextPeriodTime = periods[nextDayFirstSubject.period - 1].start;
  } else if (current >= 0 && todaySubjects[current]) {
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
        <div className='w-[64px] h-[72px] bg-[#E9F0FF] rounded-[10px] flex items-center justify-center'>
          <Image src='/homeicon.png' alt='학교 홈' width={44} height={44} />
        </div>
      </button>

      <div className='flex-1 bg-[#E9F0FF] rounded-[10px] px-4 py-3 flex justify-between items-center h-[72px] min-w-[180px]'>
        <div className="flex flex-col justify-center">
          <span className='text-xs text-[#656565] font-semibold'>지금 수업</span>
          <span className='text-lg font-bold text-[#2269FF]'>{nowSubject}</span>
          <span className='text-xs text-gray-500'>{periodLabel}</span>
        </div>
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
