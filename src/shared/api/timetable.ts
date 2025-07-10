export function getMySchoolInfo() {
    if (typeof window === 'undefined') return null;
    const profile = localStorage.getItem('signupProfile');
    if (!profile) return null;
    try {
      const parsed = JSON.parse(profile);
      return {
        eduOfficeCode: parsed.school.eduOfficeCode,
        schoolCode: parsed.school.schoolCode,
        gradeNumber: parsed.gradeNumber,
        classNumber: parsed.classNumber,
        schoolName: parsed.school.schoolName,
      };
    } catch {
      return null;
    }
  }
  
  // 시간표 API 호출
  export async function fetchTimeTable({
    eduOfficeCode,
    schoolCode,
    gradeNumber,
    classNumber,
  }: {
    eduOfficeCode: string;
    schoolCode: string;
    gradeNumber: number | string;
    classNumber: number | string;
  }) {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('토큰 없음');
  
    const res = await fetch(
      `https://hiteen.site/api/v1/timetable?officeCode=${eduOfficeCode}&schoolCode=${schoolCode}&grade=${gradeNumber}&classNum=${classNumber}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  
    if (!res.ok) throw new Error('시간표 조회 실패');
    const json = await res.json();
    return json.data;
  }
  