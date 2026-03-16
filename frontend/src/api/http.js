export class ApiError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

async function parseJsonSafe(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiFetch(path, { method = "GET", body, headers } = {}) {
  const res = await fetch(path, {
    method,
    credentials: "include",
    headers: {
      ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(headers ?? {}),
    },
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
  });

  const payload = await parseJsonSafe(res);
  if (!res.ok) {
    const message =
      (payload && typeof payload === "object" && payload.error) ||
      res.statusText ||
      "Request failed";
    throw new ApiError(message, { status: res.status, payload });
  }
  return payload;
}

