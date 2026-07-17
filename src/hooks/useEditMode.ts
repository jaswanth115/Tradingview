import { useCallback, useState } from 'react';
import { EDIT_PIN, EDIT_UNLOCK_KEY } from '../config/access';

function readUnlocked(): boolean {
  try {
    return localStorage.getItem(EDIT_UNLOCK_KEY) === 'true';
  } catch {
    return false;
  }
}

export function useEditMode() {
  const [canEdit, setCanEdit] = useState<boolean>(() => readUnlocked());

  const unlock = useCallback((pin: string): boolean => {
    if (pin !== EDIT_PIN) return false;

    setCanEdit(true);
    try {
      localStorage.setItem(EDIT_UNLOCK_KEY, 'true');
    } catch {
      // Storage may be unavailable; keep the in-memory unlock anyway.
    }
    return true;
  }, []);

  const lock = useCallback(() => {
    setCanEdit(false);
    try {
      localStorage.removeItem(EDIT_UNLOCK_KEY);
    } catch {
      // Ignore storage errors.
    }
  }, []);

  return { canEdit, unlock, lock };
}
