import { dateQuery } from "@/utils/dateFormatter";

export enum StorageKey {
  DATE_FROM_CACHE = "date_from_cache",
  DATE_TO_CACHE = "date_to_cache",
  CATEGORY_FILTER = "category_filter",
}

export class LocalStorageService {
  private static isBrowser(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
  }

  static set<T>(key: StorageKey, value: T): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`[LocalStorageService] Failed to set ${key}`, err);
    }
  }

  static get<T>(key: StorageKey): T | null {
    if (!this.isBrowser()) return null;
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (err) {
      console.error(`[LocalStorageService] Failed to parse ${key}`, err);
      return null;
    }
  }

  static remove(key: StorageKey): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(key);
  }

  static clear(): void {
    if (!this.isBrowser()) return;
    localStorage.clear();
  }
}

export const setDateFromCache = (date: string) => {
  LocalStorageService.set<string>(StorageKey.DATE_FROM_CACHE, date);
};

export const getDateFromCache = (): Date => {
  const date = LocalStorageService.get<string>(StorageKey.DATE_FROM_CACHE);

  if (!date) {
    const { dateFrom } = dateQuery();
    return dateFrom;
  }

  return new Date(date);
};

export const setDateToCache = (date: string) => {
  LocalStorageService.set<string>(StorageKey.DATE_TO_CACHE, date);
};

export const getDateToCache = (): Date => {
  const date = LocalStorageService.get<string>(StorageKey.DATE_TO_CACHE);
  if (!date) {
    const { dateTo } = dateQuery();
    return dateTo;
  }
  return new Date(date);
};

export const setCategoryFilter = (categories: string[]) => {
  LocalStorageService.set<string[]>(StorageKey.CATEGORY_FILTER, categories);
};

export const getCategoryFilter = (): string[] | null => {
  return LocalStorageService.get<string[]>(StorageKey.CATEGORY_FILTER);
};
