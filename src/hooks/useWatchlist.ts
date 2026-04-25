import { useState, useEffect } from 'react';
import type { ListEntry } from '../types';

const STORAGE_KEY = 'mml_watchlist';

function loadFromStorage(): ListEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as ListEntry[];
  } catch {
    return [];
  }
}

export function useWatchlist() {
  const [entries, setEntries] = useState<ListEntry[]>(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  function addOrUpdate(entry: ListEntry) {
    setEntries((prev) => {
      const idx = prev.findIndex((e) => e.id === entry.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = entry;
        return next;
      }
      return [...prev, entry];
    });
  }

  function remove(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function getEntry(id: string): ListEntry | null {
    return entries.find((e) => e.id === id) ?? null;
  }

  return { entries, addOrUpdate, remove, getEntry };
}
