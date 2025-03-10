// utils/auth.ts
import { headers } from "next/headers"
import { decrypt } from "./session"

export function getUserName(): string | null {
  const headersList = headers()
  return headersList.get("x-user-id") || null
}

export function getUserAvatar(): string | null {
  const headersList = headers()
  return headersList.get("x-avatar-url") || null
}

export function getUid(): string | null {
  const headersList = headers()
  return headersList.get("x-uid") || null
}

export function getUserRole(): string | null {
  const headersList = headers()
  return headersList.get("x-user-role") || null
}
