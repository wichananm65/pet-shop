export const API_BASE_URL = (process.env.API_BASE_URL ?? "").replace(/\/$/, "");

export type ApiError = {
  status: number;
  message: string;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        const data = await response.json();
        let message: string;
        if (data && typeof data === "object" && "message" in data) {
          const maybe = data as { message?: unknown };
          message = typeof maybe.message === "string" ? maybe.message : String(maybe.message ?? JSON.stringify(data));
        } else {
          message = JSON.stringify(data);
        }

        throw {
          status: response.status,
          message: message || response.statusText,
        } satisfies ApiError;
      } catch {
        const text = await response.text();
        throw {
          status: response.status,
          message: text || response.statusText,
        } satisfies ApiError;
      }
    }

    const text = await response.text();
    throw {
      status: response.status,
      message: text || response.statusText,
    } satisfies ApiError;
  }
  return (await response.json()) as T;
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const url = API_BASE_URL ? `${API_BASE_URL}${path}` : path;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);
}
