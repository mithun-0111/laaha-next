import { getCountryCode, getLangCode, getLocaleValue } from "@/src/lib/utils"

export const getSearchResults = async (
  searchTerm = "",
  page = 0,
  locale = "en"
) => {
  let countryCode = getCountryCode()
  let langCode = getLangCode()
  let localeValue = getLocaleValue()

  let searchURL = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/${locale}/api/v1/search?${`search=${searchTerm}`}${`&page=${page}`}`

  let response = await fetch(searchURL, {
    headers: {
      "country-code": countryCode || "US",
      "lang-code": langCode || "en",
      locale: localeValue || "en",
    },
  })

  let data = await response.json()
  return data
}
