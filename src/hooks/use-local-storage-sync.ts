import { useState, useEffect } from "react";

export const useLocalStorageSync = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(
            `Error parsing localStorage value for key "${key}":`,
            error
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  // Verificar mudanças no localStorage a cada 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          setValue(parsed);
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [key]);

  return [value, setValue] as const;
};
