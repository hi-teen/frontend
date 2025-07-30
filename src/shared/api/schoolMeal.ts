export function getSchoolInfoFromProfile() {
    if (typeof window === 'undefined') return null;
    const profile = localStorage.getItem('signupProfile');
    if (!profile) return null;
    try {
      const parsed = JSON.parse(profile);
      // school이 없는 경우(구형 구조) 대비
      return parsed.school || parsed;
    } catch {
      return null;
    }
  }
  
  export async function fetchMonthMeals({
    eduOfficeCode,
    schoolCode,
    year,
    month,
  }: {
    eduOfficeCode: string;
    schoolCode: string;
    year: number;
    month: number;
  }) {
    const url = `/api/v1/school-meal?officeCode=${eduOfficeCode}&schoolCode=${schoolCode}&year=${year}&month=${month}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('급식 데이터 조회 실패');
    const json = await res.json();
    return json.data;
  }
  
  export interface Meal {
    date: string; // 'YYYY-MM-DD'
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
  
  export function mapMealApiToMealList(apiData: any): Meal[] {
    if (!apiData) return [];
    return Object.entries(apiData).map(([date, mealObj]) => {
      const y = date.slice(0, 4);
      const m = date.slice(4, 6);
      const d = date.slice(6, 8);
      const formattedDate = `${y}-${m}-${d}`;
  
      const mObj = mealObj as {
        중식?: { menus?: string[]; calories?: string; nutrients?: string };
        석식?: { menus?: string[]; calories?: string; nutrients?: string };
      };
  
      // 메뉴명 끝의 점만 제거 (괄호 안 점은 유지)
const cleanMenus = (arr?: string[]) =>
    arr ? arr.map(menu => menu.replace(/(\.)(?=\s*\(|$)/g, '').trim()) : [];
  
      return {
        date: formattedDate,
        lunch: cleanMenus(mObj.중식?.menus),
        dinner: cleanMenus(mObj.석식?.menus),
        lunchInfo: mObj.중식
          ? { calories: mObj.중식.calories || '', nutrients: mObj.중식.nutrients || '' }
          : undefined,
        dinnerInfo: mObj.석식
          ? { calories: mObj.석식.calories || '', nutrients: mObj.석식.nutrients || '' }
          : undefined,
      };
    });
  }
  
  