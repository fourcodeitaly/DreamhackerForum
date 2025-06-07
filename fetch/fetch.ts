import { useRef, useState } from "react";

import { useEffect } from "react";

// Define the shape of the hook's return value

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useFetch<T>(url: string, options?: RequestInit): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup (optional, can be used to abort fetch on unmount)
    const controller = new AbortController();
    return () => controller.abort();
  }, []);

  return { data, loading, error };
}
