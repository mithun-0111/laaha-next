import { Laila } from "next/font/google"
import Cookies from "js-cookie"

export function formatDate(input: string): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(input: string) {
  return `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${input}`
}

export const laila = Laila({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
})

export const getCountryCode = (): string | null => {
  return Cookies.get("COUNTRY_CODE") || null
}

export const getLangCode = (): string | null => {
  return Cookies.get("BROWSER_LANG_CODE") || null
}

export const getLocaleValue = (): string | null => {
  return Cookies.get("NEXT_LOCALE") || null
}

export function highlightAndCountSensitiveWords(
  text: string,
  sensitiveWords: string[]
) {
  let wordCounts: any = {}

  const regex = new RegExp(`\\b(${sensitiveWords.join("|")})\\b`, "gi")

  const highlightedText = text.replace(regex, (match) => {
    const word = match.toLowerCase()
    wordCounts[word] = (wordCounts[word] || 0) + 1

    return `<span style="background-color: yellow; color: red; padding:4px">${match}</span>`
  })

  return { highlightedText, wordCounts }
}
