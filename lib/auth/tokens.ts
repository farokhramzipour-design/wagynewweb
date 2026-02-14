export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

const ACCESS_KEY = "pcm.access";
const REFRESH_KEY = "pcm.refresh";

export function readTokens(): AuthTokens | null {
  if (typeof window === "undefined") return null;
  const accessToken = window.localStorage.getItem(ACCESS_KEY);
  const refreshToken = window.localStorage.getItem(REFRESH_KEY);
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

export function writeTokens(tokens: AuthTokens) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_KEY, tokens.accessToken);
  window.localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
}
