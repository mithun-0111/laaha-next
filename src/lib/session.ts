import "server-only"

import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const secretKey = process.env.NEXT_PUBLIC_DRUPAL_CLIENT_SECRET

const encodedKey = new TextEncoder().encode(secretKey)

type SessionPayload = {
  userName: string
  avatarUrl: string
  userId: string
  expiresAt: Date
  accessToken: string
  refreshToken: string
  userRole: string
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = "") {
  try {
    const payload = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (err) {
    console.log("Failed to verify session", err)
  }
}

export async function createSession(
  userName: string,
  avatarUrl: string,
  userId: string,
  accessToken: string,
  refreshToken: string,
  userRole: string
) {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  const session = await encrypt({
    userName,
    avatarUrl,
    userId,
    expiresAt,
    accessToken,
    refreshToken,
    userRole,
  })

  cookies().set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
  })
}

export async function deleteSession() {
  cookies().delete("session")
  cookies().delete("ACCESS_TOKEN")
  cookies().delete("REFRESH_TOKEN")
}
