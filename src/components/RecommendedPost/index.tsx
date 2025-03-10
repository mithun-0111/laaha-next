"use client"

import { useEffect, useState, useCallback } from "react"
import Card from "../Cards/Card"
import { useLocale } from "next-intl"
import SimpleCard from "../Cards/SimpleCard"
import {
  absoluteUrl,
  getCountryCode,
  getLangCode,
  getLocaleValue,
} from "@/src/lib/utils"
import { ListingShimmer3col } from "../Shimmer"
import { useTranslations } from "@/src/contexts/TranslationsContext"

const RecommendedPosts = ({ nid }: any) => {
  const locale = useLocale()
  const [recommendedData, setRecommendedData] = useState<any[]>([])
  const [subcategoryData, setSubcategoryData] = useState<any[]>([])
  const [loadingRecommended, setLoadingRecommended] = useState<boolean>(true)
  const [loadingSubcategory, setLoadingSubcategory] = useState<boolean>(true)
  const countryCode = getCountryCode()
  const langCode = getLangCode()
  const localeValue = getLocaleValue()
  const { translations } = useTranslations()

  // Fetch recommended data
  const fetchRecommendedData = useCallback(async () => {
    setLoadingRecommended(true)

    try {
      const recommendedResponse = await fetch(
        `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/${locale}/api/v1/related-content-json/${nid}`,
        {
          headers: {
            "country-code": countryCode || "US",
            "lang-code": langCode || "en",
            locale: localeValue || "en",
          },
        }
      )
      if (!recommendedResponse.ok) {
        throw new Error("Failed to fetch recommended data")
      }
      const { data } = await recommendedResponse.json()
      setRecommendedData(Object.values(data.content))
    } catch (err) {
      setRecommendedData([])
    } finally {
      setLoadingRecommended(false)
    }
  }, [nid, locale])

  // Fetch subcategory data
  const fetchSubcategoryData = useCallback(async () => {
    setLoadingSubcategory(true)

    try {
      const subcategoryResponse = await fetch(
        `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/${locale}/api/related-subcategories/node/${nid}`,
        {
          headers: {
            "country-code": countryCode || "US",
            "lang-code": langCode || "en",
            locale: localeValue || "en",
          },
        }
      )
      if (!subcategoryResponse.ok) {
        throw new Error("Failed to fetch subcategory data")
      }
      const subcategoryData = Object.values(
        (await subcategoryResponse.json()).content
      )
      setSubcategoryData(subcategoryData)
    } catch (err) {
      setSubcategoryData([])
    } finally {
      setLoadingSubcategory(false)
    }
  }, [nid, locale])

  useEffect(() => {
    fetchRecommendedData()
    fetchSubcategoryData()
  }, [fetchRecommendedData, fetchSubcategoryData])

  // Loading states for both
  if (loadingRecommended || loadingSubcategory) {
    return <ListingShimmer3col />
  }

  return (
    <>
      {/* Recommended Posts Section */}
      {recommendedData.length > 0 && (
        <div className="recommended-posts mb-20">
          <h3 className="font-bold text-xxxl mb-8 text-center">
            {translations?.[locale].aanya_recommends}
          </h3>
          <div className="recommended-data flex gap-6 flex-wrap">
            {recommendedData.map((item, index) => {
              const transformedItem = {
                node: {
                  title: item.title,
                  read_time: parseInt(item.read_time, 10),
                  image_uri:
                    process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + "/" + item.uri,
                  type: item.type,
                  url: item.link,
                },
              }
              return (
                <Card
                  key={index}
                  item={transformedItem}
                  className="flex-[0_0_100%] max-w-full lg:flex-[0_0_33.33%] lg:max-w-[calc(33.33%-1.5rem)]"
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Related Subcategories Section */}
      {subcategoryData.length > 0 && (
        <div className="related-categories mb-10">
          <h2 className="text-center mb-6">
            {translations?.[locale]?.other_subcategories}
          </h2>
          <div className="simple-card__wrapper flex flex-wrap gap-6">
            {subcategoryData.map((item, index) => {
              const transformedItem = {
                title: item.subcat_name,
                url: item.url,
                image: absoluteUrl("/" + item.sub_category_thumbnail),
                alt: item.sub_category_alt || item.subcat_name,
              }
              return (
                <SimpleCard
                  key={index}
                  data={transformedItem}
                  classes="md:flex-[0_0_50%] md:max-w-[calc(50%-1rem)] mb-6 lg:mb-0 lg:flex-[0_0_25%] lg:max-w-[calc(25%-1.5rem)]"
                />
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

export default RecommendedPosts
