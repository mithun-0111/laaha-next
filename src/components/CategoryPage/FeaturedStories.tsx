"use client"

import React, { useEffect, useState } from "react"
import Card from "../Cards/Card"
import { useTranslations } from "@/src/contexts/TranslationsContext"
import { getCountryCode, getLangCode, getLocaleValue } from "@/src/lib/utils"
import { useLocale } from "next-intl"

interface FeaturedStoriesProps {
  tid: number // Include tid to pass taxonomy ID
}

const FeaturedStories = ({tid }: FeaturedStoriesProps) => {
  const { translations } = useTranslations()
  const [fetchedData, setFetchedData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const locale = useLocale();

  const countryCode = getCountryCode()
  const langCode = getLangCode()
  const localeValue = getLocaleValue()

  useEffect(() => {
    const fetchFeaturedStories = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/${locale}/api/v1/featured-stories/${tid}?langcode=${locale}`,
          {
            headers: {
              "country-code": countryCode || "US",
              "lang-code": langCode || "en",
              locale: localeValue || "en",
            },
          }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch featured stories.")
        }

        const data = await response.json()
        setFetchedData(data) // Update state with fetched data
      } catch (error: any) {
        setError(error.message) // Update error state
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedStories()
  }, [locale, tid, countryCode, langCode, localeValue])

  if (loading) {
    return <></> // You can add a loader component
  }

  if (error) {
    return <div>Error: {error}</div> // Handle error gracefully
  }

  if (!fetchedData || fetchedData.length === 0) {
    return null // If no data is available, return null
  }

  return (
    <div className="featured-stories mb-10">
      <h2 className="text-center pt-20 pb-10">
        {translations?.[locale]?.featured_stories || "Featured Stories"}
      </h2>
      <div className="stories container flex flex-wrap">
        {fetchedData.map((item, index) => {
          const transformedItem = {
            node: {
              title: item.title,
              read_time: parseInt(item.read_time, 10),
              image_uri: process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + "/" + item.thumbnail,
              type: item.type,
              url: item.url,
            },
          }
          return <Card key={index} item={transformedItem} /> // Render individual cards for featured stories
        })}
      </div>
    </div>
  )
}

export default FeaturedStories
