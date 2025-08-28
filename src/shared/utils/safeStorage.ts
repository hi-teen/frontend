// 안전한 스토리지 접근을 위한 유틸리티 함수들

export const safeStorage = {
  // localStorage 관련
  localStorage: {
    getItem: (key: string): string | null => {
      if (typeof window === 'undefined') return null;
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    
    setItem: (key: string, value: string): boolean => {
      if (typeof window === 'undefined') return false;
      try {
        localStorage.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    },
    
    removeItem: (key: string): boolean => {
      if (typeof window === 'undefined') return false;
      try {
        localStorage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    },
    
    clear: (): boolean => {
      if (typeof window === 'undefined') return false;
      try {
        localStorage.clear();
        return true;
      } catch {
        return false;
      }
    }
  },
  
  // sessionStorage 관련
  sessionStorage: {
    getItem: (key: string): string | null => {
      if (typeof window === 'undefined') return null;
      try {
        return sessionStorage.getItem(key);
      } catch {
        return null;
      }
    },
    
    setItem: (key: string, value: string): boolean => {
      if (typeof window === 'undefined') return false;
      try {
        sessionStorage.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    },
    
    removeItem: (key: string): boolean => {
      if (typeof window === 'undefined') return false;
      try {
        sessionStorage.removeItem(key);
        return true;
      } catch {
        return false;
      }
    },
    
    clear: (): boolean => {
      if (typeof window === 'undefined') return false;
      try {
        sessionStorage.clear();
        return true;
      } catch {
        return false;
      }
    }
  }
};

// 안전한 JSON 파싱
export const safeJsonParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

// 안전한 JSON 문자열화
export const safeJsonStringify = (value: any): string | null => {
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
};

// 쿠키 관련 헬퍼 함수들
export const cookieStorage = {
  getCookie: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    } catch {
      return null;
    }
  },
  
  setCookie: (name: string, value: string, options: {
    path?: string;
    maxAge?: number;
    sameSite?: 'Strict' | 'Lax' | 'None';
    secure?: boolean;
  } = {}): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      const {
        path = '/',
        maxAge = 2592000, // 30일
        sameSite = 'Lax',
        secure = true
      } = options;
      
      let cookie = `${name}=${value}; Path=${path}; Max-Age=${maxAge}; SameSite=${sameSite}`;
      if (secure) cookie += '; Secure';
      
      document.cookie = cookie;
      return true;
    } catch {
      return false;
    }
  },
  
  removeCookie: (name: string, path: string = '/'): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      document.cookie = `${name}=; Path=${path}; Max-Age=0; SameSite=Lax; Secure`;
      return true;
    } catch {
      return false;
    }
  }
};

// 토큰 관련 헬퍼 함수들
export const tokenStorage = {
  getAccessToken: (): string | null => {
    return safeStorage.localStorage.getItem('accessToken');
  },
  
  setAccessToken: (token: string): boolean => {
    const success = safeStorage.localStorage.setItem('accessToken', token);
    if (success) {
      // localStorage와 쿠키 동기화
      cookieStorage.setCookie('token', token);
    }
    return success;
  },
  
  getRefreshToken: (): string | null => {
    return safeStorage.localStorage.getItem('refreshToken');
  },
  
  setRefreshToken: (token: string): boolean => {
    return safeStorage.localStorage.setItem('refreshToken', token);
  },
  
  clearTokens: (): void => {
    safeStorage.localStorage.removeItem('accessToken');
    safeStorage.localStorage.removeItem('refreshToken');
    cookieStorage.removeCookie('token');
  },
  
  hasValidToken: (): boolean => {
    const token = safeStorage.localStorage.getItem('accessToken');
    return !!token && token.length > 0;
  }
};
