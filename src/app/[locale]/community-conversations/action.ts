"use server"

import { createSession, deleteSession } from "@/src/lib/session"
import { redirect } from "next/navigation"
import { getAccessToken, validateUser } from "./api"
import { clientId, clientSecret } from "@/src/lib/drupal"

// Define type for user sign-in credentials.
export type SignInCreds = {
  username: string
  password: string
}

// Function to log in a user
export async function login(userDetails: SignInCreds, locale: string) {
  const { username, password } = userDetails

  // Validate the user credentials with the backend
  let res = await validateUser({ username, password }, locale)

  // If user is valid, get an access token from the backend
  let data = await getAccessToken(
    { username, password },
    locale,
    clientId,
    clientSecret
  )

  // If there's an error validating the user, return the error
  if (res.error) {
    return { error: res.error, data: null }
  }

  // If validation is successful, extract user details from the response
  let avatarUrl = res.avatar.url
  let uid = res.uid
  let accessToken = data.access_token
  let refreshToken = data.refresh_token
  let userRole = res.role["1"]

  // Create a session for the user with the fetched data
  await createSession(
    username,
    avatarUrl,
    res.uid,
    accessToken,
    refreshToken,
    userRole
  )

  // Return the successful login data
  return {
    error: null,
    data: { username, avatarUrl, uid, accessToken, refreshToken, userRole },
  }
}

// Function to log out the user
export async function logout() {
  await deleteSession()
  redirect("/community-conversations")
}

// Function to delete the session details (used for session cleanup)
export async function deleteSessionDetails() {
  await deleteSession()
}
