'use client';

import { useCallback, useEffect, useState } from 'react';
import { companionStorageKey } from './session';

export function useChecklist(storageKey: string, itemIds: string[]) {
  const key = companionStorageKey(storageKey);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      setChecked({});
    }
  }, [key]);

  const toggle = useCallback(
    (id: string) => {
      setChecked((prev) => {
        const next = { ...prev, [id]: !prev[id] };
        localStorage.setItem(key, JSON.stringify(next));
        return next;
      });
    },
    [key]
  );

  const done = itemIds.filter((id) => checked[id]).length;
  const total = itemIds.length;

  return { checked, toggle, done, total };
}

export function useCompanionValue<T>(storageKey: string, initial: T) {
  const key = companionStorageKey(storageKey);
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw) as T);
    } catch {
      /* keep initial */
    }
  }, [key]);

  const save = useCallback(
    (next: T) => {
      setValue(next);
      localStorage.setItem(key, JSON.stringify(next));
    },
    [key]
  );

  return [value, save] as const;
}
