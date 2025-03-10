import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/navigation"
import { useEffect, useState } from "react"
import { drupal } from "@/src/lib/drupal"
import { useTranslations } from "@/src/contexts/TranslationsContext"

const CACHE_KEY_PREFIX = "lang-data-"

const LanguageSwitcher = () => {
  const [lang, setLanguage] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const locale = useLocale()
  const router = useRouter()
  const pathName = usePathname()
  const [isPageValid, setIsPageValid] = useState<boolean>(false)
  const { translations } = useTranslations()

  // Fetch the language data and validate page for supported languages
  useEffect(() => {
    const langData = async () => {
      setLoading(true) // Set loading to true when request starts

      const cacheKey = `${CACHE_KEY_PREFIX}${locale}${pathName}`
      const cachedData = localStorage.getItem(cacheKey)

      if (cachedData) {
        // If data is cached, use it
        const parsedData = JSON.parse(cachedData)
        setLanguage(parsedData)
        setIsPageValid(true)
        setLoading(false)
        return
      }

      try {
        const path = await drupal.translatePath(`/${locale}${pathName}`)
        const id = path?.entity.id

        if (path === null) {
          const response = await fetch(
            `https://edit-dev.laaha.org/${locale}/api/v1/vss-lang-api?url=${pathName}`
          )
          const data = await response.json()

          if (data) {
            setLanguage(data)
            setIsPageValid(true)
            // Cache the data
            localStorage.setItem(cacheKey, JSON.stringify(data))
          }
        }

        if (path && id) {
          setIsPageValid(true)
          const entityType =
            path?.entity.type === "taxonomy_term" ? "taxonomy/term" : "node"

          const response = await fetch(
            `https://edit-dev.laaha.org/${locale}/api/v1/vss-lang-api?url=/${entityType}/${id}`
          )
          const data = await response.json()
          setLanguage(data)
          // Cache the data
          localStorage.setItem(cacheKey, JSON.stringify(data))
        }
      } catch (error) {
        console.error("Error fetching language data:", error)
      } finally {
        setLoading(false) // Set loading to false after the request finishes
      }
    }

    langData()
  }, [pathName, locale])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.options[e.target.selectedIndex]
    const alias = selectedOption.getAttribute("data-alias")

    if (alias) {
      const newPath = alias.replace(`/${e.target.value}/`, "/")
      router.push(newPath, { locale: e.target.value })
    }
  }

  const pathAlias = lang?.alias
  const languages = lang?.locales

  return (
    <>
      <label htmlFor="language-selector" className="sr-only">
        {translations?.[locale]?.choose_language || "Choose Language"}
      </label>
      {loading ? (
        <select value={"Loading..."}>
          <option> Loading... </option>
        </select>
      ) : (
        <select
          id="language-selector"
          value={locale}
          onChange={handleChange}
          aria-label={
            translations?.[locale]?.choose_language || "Select a language"
          }
          className="language-selector"
        >
          {isPageValid &&
            languages &&
            Object.entries(languages).map(([item, index]: any) => (
              <option key={item} value={item} data-alias={pathAlias[item]}>
                {index}
              </option>
            ))}
        </select>
      )}
    </>
  )
}

export default LanguageSwitcher
