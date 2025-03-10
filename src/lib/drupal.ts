// drupal.ts
import { NextDrupal } from "next-drupal"
import { getCountryCode, getLangCode, getLocaleValue } from "./utils"

const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string
export const clientId = process.env.NEXT_PUBLIC_DRUPAL_CLIENT_ID as string
export const clientSecret = process.env
  .NEXT_PUBLIC_DRUPAL_CLIENT_SECRET as string

export const initializeDrupal = () => {
  const countryCode = getCountryCode()
  const langCode = getLangCode()
  const localeValue = getLocaleValue()

  const drupal = new NextDrupal(baseUrl, {
    auth: {
      clientId,
      clientSecret,
    },
    headers: {
      "country-code": countryCode || "US",
      "lang-code": langCode || "en",
      locale: localeValue || "en",
    },
  })

  return drupal
}

export const drupal = initializeDrupal()
