export interface SchoolInfo {
    id: number;
    schoolName: string;
    schoolCode: string;
    eduOfficeCode: string;
    eduOfficeName: string;
    schoolUrl: string;
  }
  
  export interface UserInfo {
    id?: number;
    email: string;
    name: string;
    gradeNumber: number;
    classNumber: number;
    school: SchoolInfo;
    schoolId?: number;
    schoolName?: string;
  }
  