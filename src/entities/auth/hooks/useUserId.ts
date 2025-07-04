import { useEffect, useState } from 'react';

export function useUserId(): number | null {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('me');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserId(user.id);
      } catch {
        setUserId(null);
      }
    }
  }, []);

  return userId;
}
