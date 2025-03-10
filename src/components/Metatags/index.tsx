"use client"

import { getCountryCode, getLangCode } from "@/src/lib/utils"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const MetaTags = ({ locale }: { locale: string }) => {
  const [metaData, setMetaData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const countryCode = getCountryCode()
  const langCode = getLangCode();
  const pathname = usePathname()
  let slug = pathname.split(`/${locale}/`)[1];

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const path = `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/${locale}/api/v1/metatags?alias=/${slug}`
        const response = await fetch(path, {
          headers: {
            "country-code": countryCode || "US",
            "lang-code": langCode || "en",
            "locale": locale || "en",
          },
        })
        const data = await response.json();
        setMetaData(data)
        setLoading(false)
      } catch (err) {
        setError("Failed to load metadata")
        setLoading(false)
      }
    }

    fetchMetadata()
  }, [locale, countryCode, pathname])

  if (loading) {
    return <></>
  }

  if (error) {
    return <></>
  }

  const title = metaData?.title || "Home"
  const description =
    metaData?.description ||
    "Find the support you need. Laaha is a safe space for women and girls to discuss health, safety, violence, and relationships."

  return (
    <>
      <title>{title.charAt(0).toUpperCase() + title.slice(1) + ' | Laaha'}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content="Laaha" />
    </>
  )
}

export default MetaTags
