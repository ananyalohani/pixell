interface ApiResponse<T> {
  error?: string;
  data?: T;
}

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

export const fetcher = async <T = any>(
  endpoint: string,
  method?: RequestMethod,
  body?: Record<string, any>
): Promise<{ data?: T | undefined; error?: string }> => {
  const options: RequestInit = {
    method,
  };

  if (method !== "GET" && body) {
    options.body = JSON.stringify(body);
    options.headers = {
      "Content-Type": "application/json",
    };
  }

  try {
    const res = await fetch(endpoint, { ...options });
    const jsonReponse = (await res.json()) as ApiResponse<T>;
    return {
      data: jsonReponse.data,
    };
  } catch (err) {
    console.error(err);
    return {
      error: "An error occured while making the request. Please try again.",
    };
  }
};
