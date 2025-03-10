"use client"

import { useLocale } from "next-intl"
import Image from "next/image"
import { useEffect, useState } from "react"
import { ViewCountShimmer } from "../Shimmer"
import { getCountryCode, getLangCode, getLocaleValue } from "@/src/lib/utils"
import { useTranslations } from "@/src/contexts/TranslationsContext"

type Props = {
  nid: number
  uid: string
}
// Used in category detail pages. ( Scorm, Video, Podcast pages.)
const PageViewCount = ({ nid, uid }: Props) => {
  const [viewCount, setViewCount] = useState("")
  const locale = useLocale()
  const countryCode = getCountryCode()
  const langCode = getLangCode()
  const localeValue = getLocaleValue()
  const { translations } = useTranslations()

  // Get User IP
  const getUserIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json")
      const data = await response.json()
      return data.ip
    } catch (error) {
      console.error("Error fetching IP:", error)
      return null
    }
  }

  useEffect(() => {
    const fetchViewCountAndUpdate = async () => {
      const uip = await getUserIP()
      const bodyData = { uid, uip }

      // Update view count on the server
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/${locale}/api/v1/node_view_count/${nid}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "country-code": countryCode || "US",
              "lang-code": langCode || "en",
              locale: localeValue || "en",
            },
            body: JSON.stringify(bodyData),
          }
        )

        if (!response.ok) {
          throw new Error("Failed to update view count")
        }

        const data = await response.json()
      } catch (error) {
        console.error("Error sending view count to server:", error)
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/${locale}/api/node_view_count/${nid}`,
          {
            headers: {
              "Content-Type": "application/json",
              "country-code": countryCode || "US",
              "lang-code": langCode || "en",
              locale: localeValue || "en",
            },
          }
        )
        if (!response.ok) {
          throw new Error("Failed to get view count")
        }

        const data = await response.json()
        setViewCount(data.count)
      } catch (error) {
        console.error("Error getting view count from server:", error)
      }
    }

    fetchViewCountAndUpdate()
  }, [nid, uid])

  return viewCount ? (
    <div className="view-count flex items-center">
      <Image
        src={"/assets/images/view-icon.png"}
        className="me-2"
        width={21}
        loading="lazy"
        height={16}
        alt="icon"
      />
      {viewCount + ` ${translations?.[locale]?.views}`}
    </div>
  ) : (
    <ViewCountShimmer />
  )
}

export default PageViewCount
