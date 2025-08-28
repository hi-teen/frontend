import { useEffect, useState } from 'react';
import { safeStorage, safeJsonParse } from '@/shared/utils/safeStorage';

export function useUserId(): number | null {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const userStr = safeStorage.localStorage.getItem('me');
    if (userStr) {
      const user = safeJsonParse(userStr, { id: null });
      setUserId(user.id);
    }
  }, []);

  return userId;
}
