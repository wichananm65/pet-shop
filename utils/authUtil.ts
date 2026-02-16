export function getAuthToken(): string | null {
  try {
    return localStorage.getItem("authToken");
  } catch {
    return null;
  }
}

export function setAuthToken(token: string) {
  try {
    localStorage.setItem("authToken", token);
  } catch {}
}

export function clearAuthToken() {
  try {
    localStorage.removeItem("authToken");
  } catch {}
}
