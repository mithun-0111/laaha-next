import { getCountryCode, getLangCode, getLocaleValue } from "@/src/lib/utils"

// Fetch facets for filtering services based on country, state, city, and locale
export const getFacets = async (
  country = "",
  state = "",
  city = "",
  locale: string
) => {
  // Build the base URL for the facets API
  let facetsUrl =
    process.env.NEXT_PUBLIC_DRUPAL_BASE_URL +
    `/${locale}/api/v1/find_services_facets`

  // Retrieve the country, language, and locale values from utility functions
  const countryCode = getCountryCode()
  const langCode = getLangCode()
  const localeValue = getLocaleValue()

  // Add filters to the URL if specific values are provided
  if (country !== "") {
    facetsUrl += "?filter[field_country]=" + country
  }
  if (state !== "" && country !== "") {
    facetsUrl += "&filter[field_state]=" + state
  }
  if (city !== "" && country !== "" && state !== "") {
    facetsUrl += "&filter[field_city]=" + city
  }

  // Make the request to fetch facets data
  let response = await fetch(facetsUrl, {
    headers: {
      "country-code": countryCode || "US",
      "lang-code": langCode || "en",
      locale: localeValue || "en",
    },
  })
  let data = await response.json()
  return data
}

// Fetch country name data from the API
export const getCountryNameData = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + "/en/api/v1/country"}`
  )
  const data = await response.json()
  return data
}

// Fetch services data with filters for country, state, city, titles, and pagination
export const getServices = async (
  country = "",
  state = "",
  city = "",
  titles: string[] = [],
  pageLimit = 10,
  pageOffset = 0,
  locale: string
) => {
  const countryCode = getCountryCode()
  const langCode = getLangCode()
  const localeValue = getLocaleValue()

  // Build the base URL for fetching services
  let url =
    process.env.NEXT_PUBLIC_DRUPAL_BASE_URL +
    `/${locale}/jsonapi/index/find_services?filter[langcode]=${locale}`

  // Add filters to the URL if specific values are provided
  if (country !== "") {
    url += "&filter[field_country]=" + country
  }
  if (state !== "" && country !== "") {
    url += "&filter[field_state]=" + state
  }
  if (city !== "" && country !== "" && state !== "") {
    url += "&filter[field_city]=" + city
  }
  if (titles.length > 0) {
    // Loop through titles if there are multiple
    if (titles.length === 1) {
      url += "&filter[title]=" + titles[0]
    } else {
      for (let i = 1; i <= titles.length; i++) {
        url += `&filter[title]=${titles[i - 1]}`
      }
    }
  }

  // Add pagination parameters to the URL
  url += "&page[limit]=" + pageLimit + "&page[offset]=" + pageOffset

  // Make the request to fetch services data
  let response = await fetch(url, {
    headers: {
      "country-code": countryCode || "US",
      "lang-code": langCode || "en",
      locale: localeValue || "en",
    },
  })
  let data = await response.json()
  return data
}

// Fetch configuration message data for services based on the locale
export const getConfigMessageData = async (locale: string) => {
  const countryCode = getCountryCode()
  const langCode = getLangCode()
  const localeValue = getLocaleValue()

  // Request to fetch configuration message for services
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/${locale}/api/v1/find-services-config`,
    {
      headers: {
        "country-code": countryCode || "US",
        "lang-code": langCode || "en",
        locale: localeValue || "en",
      },
    }
  )
  const data = await response.json()
  return data
}
