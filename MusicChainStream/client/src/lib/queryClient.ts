import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest<T = any>(
  url: string,
  method: string = 'GET',
  data?: unknown | undefined,
): Promise<T> {
  console.log(`API Request: ${method} ${url}`, data);
  
  try {
    const res = await fetch(url, {
      method,
      headers: data ? { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    console.log(`API Response status: ${res.status} ${res.statusText}`);
    
    // Clone the response so we can log it (reading the body consumes it)
    const resClone = res.clone();

    try {
      const responseBody = await resClone.text();
      console.log('API Response body:', responseBody ? JSON.parse(responseBody) : '[empty]');
    } catch (e) {
      console.log('Could not parse response body', e);
    }

    await throwIfResNotOk(res);
    return await res.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
