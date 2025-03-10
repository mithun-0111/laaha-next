import { getCountryCode, getLangCode, getLocaleValue } from "@/src/lib/utils"
import { login, SignInCreds } from "./action"

// Validate user credentials with the backend
export async function validateUser(userDetails: SignInCreds, locale: string) {
  const { username, password } = userDetails
  const countryCode = getCountryCode()
  const langCode = getLangCode()
  const localeValue = getLocaleValue()
  let url = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + `/${locale}/api/v1/login`

  let res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ name: username, pass: password }),
    headers: {
      "Content-Type": "application/json",
      "country-code": countryCode || "US",
      "lang-code": langCode || "en",
      locale: localeValue || "en",
    },
  })

  let data = await res.json()
  return data
}

// Get access token for the user using OAuth
export async function getAccessToken(
  userDetails: SignInCreds,
  locale: string,
  clientId: string,
  clientSecret: string
) {
  const { username, password } = userDetails
  const countryCode = getCountryCode()
  const langCode = getLangCode()
  const localeValue = getLocaleValue()
  let url = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + `/${locale}/oauth/token`

  let res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      username: username,
      password: password,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "password",
    }),
    headers: {
      "Content-Type": "application/json",
      "country-code": countryCode || "US",
      "lang-code": langCode || "en",
      locale: localeValue || "en",
    },
  })

  let data = await res.json()
  return data
}

// Get login form details
export async function getLoginFormDetails(locale: string) {
  let url =
    process.env.NEXT_PUBLIC_DRUPAL_BASE_URL +
    `/${locale}/api/v1/user-login-form`
  let res = await fetch(url)
  return res.json()
}

// Get user registration username form details
export async function getStepOneFormDetails(locale: string) {
  let url =
    process.env.NEXT_PUBLIC_DRUPAL_BASE_URL +
    `/${locale}/api/v1/register-username-form`
  let res = await fetch(url)
  return res.json()
}

// Get user registration password form details
export async function getStepTwoFormDetails(locale: string) {
  let url =
    process.env.NEXT_PUBLIC_DRUPAL_BASE_URL +
    `/${locale}/api/v1/register-password-form`
  let res = await fetch(url)
  return res.json()
}

/**
 * Get security questions form details
 */
export async function getStepThreeFormDetails(locale: string) {
  let url =
    process.env.NEXT_PUBLIC_DRUPAL_BASE_URL +
    `/${locale}/api/v1/register-security-question-form`
  let res = await fetch(url)
  return res.json()
}

/**
 * Get available avatar options for registration
 */
export async function getAvatars(locale: string) {
  let url =
    process.env.NEXT_PUBLIC_DRUPAL_BASE_URL +
    `/${locale}/api/v1/register-avatar-image-form`
  let res = await fetch(url)
  return res.json()
}

// Get community guidelines during registration
export async function getCommunityGuidelines(locale: string) {
  let url =
    process.env.NEXT_PUBLIC_DRUPAL_BASE_URL +
    `/${locale}/api/v1/register-comm-guide-form`
  let res = await fetch(url)
  return res.json()
}

// Create a new user and register them
export async function createUser(
  userDetails: any,
  locale: string
): Promise<{ error: any; data: any }> {
  let url =
    process.env.NEXT_PUBLIC_DRUPAL_BASE_URL +
    `/${locale}/api/v1/user-registration-edit-form`
  const countryCode = getCountryCode()
  const langCode = getLangCode()
  const localeValue = getLocaleValue()

  try {
    let res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(userDetails),
      headers: {
        "Content-Type": "application/json",
        "country-code": countryCode || "US",
        "lang-code": langCode || "en",
        locale: localeValue || "en",
      },
    })

    let data = await res.json()
    if (data && data.uid) {
      let signInRes = await login(
        { username: userDetails.name, password: userDetails.pass },
        locale
      )

      return { error: null, data: signInRes.data }
    }
  } catch (error) {
    return { error: error, data: null }
  }
  return { error: new Error("Unknown error"), data: null }
}
