export async function apiRequest(endpoint, options = {}) {
  const rawBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const baseUrl = rawBaseUrl.replace(/\/$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${baseUrl}${cleanEndpoint}`, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });


    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}