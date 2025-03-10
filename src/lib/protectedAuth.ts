"use client"

function getCookie(name: string): string | null {
  if (typeof document === "undefined" || !document.cookie) {
    return null
  }

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null
  }

  return null
}

// Utility function to delete a cookie
const deleteCookie = (name: string) => {
  console.log('deleting cookie');
  document.cookie = `${name}=; path=/; max-age=-1`;
};

// Utility function to set a cookie
const setCookie = (name: string, value: string, maxAge: number = 15 * 60) => {
  // Delete the old cookie first (if any)
  deleteCookie(name);
  // Now set the new cookie
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
};

// Define the type for the response from the OAuth token endpoint
interface OAuthTokenResponse {
  access_token: string;
  refresh_token: string;
}
export async function refreshTheToken() {
  const refreshToken = getCookie("REFRESH_TOKEN");

  if (refreshToken) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/oauth/token`,
        {
          method: "POST",
          body: JSON.stringify({
            client_id: process.env.NEXT_PUBLIC_DRUPAL_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_DRUPAL_CLIENT_SECRET,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data: OAuthTokenResponse = await response.json();

      if (data.access_token && data.refresh_token) {
        // Update the cookies with the new tokens
        setCookie("ACCESS_TOKEN", data.access_token);
        setCookie("REFRESH_TOKEN", data.refresh_token);

        return data?.access_token; // Update the access token
      }
    } catch (err) {
      console.error("Error refreshing token:", err);
    }
  } else {
    console.log("No refresh token found. User must log in again.");
  }
}
// Function to fetch and manage the access token
export async function getAccessToken(): Promise<string | null> {
  let accessToken:any = getCookie("ACCESS_TOKEN");

  if (accessToken && isTokenExpired(accessToken)) {
    accessToken = await refreshTheToken();
  }
  return accessToken;
}

function parseJwt(token: string | null) {
  const base64Url = token?.split(".")[1]
  const base64 = base64Url?.replace(/-/g, "+").replace(/_/g, "/")
  if (base64) {
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    )

    return JSON.parse(jsonPayload)
  }
}

function isTokenExpired(token: string | null): boolean {
  const decoded = parseJwt(token)
  const expirationDate = decoded.exp * 1000
  const currentDate = Date.now()
  return currentDate > expirationDate
}
