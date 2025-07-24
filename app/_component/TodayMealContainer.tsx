'use client';

import { useEffect, useState } from 'react';
import TodayMealCard from './TodayMealCard';
import {
  getSchoolInfoFromProfile,
  fetchMonthMeals,
  mapMealApiToMealList,
  Meal,
} from '@/shared/api/schoolMeal';

export default function TodayMealContainer() {
  const [monthMeals, setMonthMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialIndex, setInitialIndex] = useState(0);

  useEffect(() => {
    async function loadMeals() {
      setLoading(true);
      const school = getSchoolInfoFromProfile();
      if (!school) {
        setMonthMeals([]);
        setLoading(false);
        return;
      }
      const today = new Date();
      try {
        const apiData = await fetchMonthMeals({
          eduOfficeCode: school.eduOfficeCode,
          schoolCode: school.schoolCode,
          year: today.getFullYear(),
          month: today.getMonth() + 1,
        });
        const meals = mapMealApiToMealList(apiData);
        setMonthMeals(meals);

        // 오늘 날짜 (yyyy-mm-dd)
        const todayStr = today.toISOString().slice(0, 10);
        // 오늘 급식 인덱스 찾기
        let idx = meals.findIndex(m => m.date === todayStr);
        // 오늘 급식이 없다면 그 다음 날짜 인덱스
        if (idx === -1) {
          idx = meals.findIndex(m => m.date > todayStr);
          if (idx === -1) idx = 0; // 그마저도 없으면 첫 번째
        }
        setInitialIndex(idx);
      } catch (e) {
        setMonthMeals([]);
        setInitialIndex(0);
      } finally {
        setLoading(false);
      }
    }
    loadMeals();
  }, []);

  if (loading) {
    return (
      <div className="mt-4 px-4 text-sm text-gray-500">
        <div className="bg-white border p-4 rounded-xl shadow">급식 정보를 불러오는 중...</div>
      </div>
    );
  }

  return <TodayMealCard monthMeals={monthMeals} initialIndex={initialIndex} />;
}
