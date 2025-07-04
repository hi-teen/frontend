export const signUp = async (payload: {
    email: string;
    password: string;
    passwordConfirm: string;
    name: string;
    nickname: string;
    schoolId: number;
    gradeNumber: number;
    classNumber: number;
  }) => {
    const res = await fetch('https://hiteen.site/api/v1/members/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  
    if (!res.ok) throw new Error('회원가입 실패');
    return res.json(); // 사용자 정보 반환
  };
  