import { QueryClient } from "@tanstack/react-query";

/**
 * Utility function to validate HTTP response status
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage = `API Error: ${res.status}`;
    
    try {
      const data = await res.json();
      if (data?.message) errorMessage = data.message;
      if (data?.error) errorMessage = data.error;
    } catch (e) {
      // If we can't parse the error as JSON, use the status text
      errorMessage = `API Error: ${res.statusText || res.status}`;
    }
    
    throw new Error(errorMessage);
  }
  
  return res;
}

/**
 * Helper for making API requests with proper error handling
 */
export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });
  
  await throwIfResNotOk(res);
  
  return res.json();
}

/**
 * Behavior options for unauthorized requests
 */
type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * Factory function to create query functions with consistent error handling
 */
export const getQueryFn = <T>(options: {
  on401: UnauthorizedBehavior;
}) => {
  return async ({ queryKey }: { queryKey: string[] }): Promise<T | null> => {
    const [url] = queryKey;
    
    try {
      const res = await fetch(url);
      
      if (res.status === 401) {
        if (options.on401 === "throw") {
          throw new Error("Unauthorized");
        } else {
          return null;
        }
      }
      
      await throwIfResNotOk(res);
      
      return res.json();
    } catch (error) {
      console.error(`Query error for ${url}:`, error);
      throw error;
    }
  };
};

/**
 * Query client instance with default configuration
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      queryFn: getQueryFn<any>({ on401: "throw" }),
    },
  },
});