"use client"

import { useEffect, useState } from "react"
import Card from "../Cards/Card"
import "./subcategory.scss"
import { useLocale } from "next-intl"
import { Breadcrumbs } from "../Breadcrumb"
import {
  absoluteUrl,
  getCountryCode,
  getLangCode,
  getLocaleValue,
} from "@/src/lib/utils"
import { useTranslations } from "@/src/contexts/TranslationsContext"
import { BasicPageShimmer } from "../Shimmer"

const SubCategoryPage = ({
  tid,
  breadcrumb,
}: {
  tid: number
  breadcrumb: any
}) => {
  const locale = useLocale()
  const [subcatData, setSubcatData] = useState<any>(null)
  const [subcatBanner, setSubcatBanner] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const countryCode = getCountryCode()
  const langCode = getLangCode()
  const localeValue = getLocaleValue()
  const { translations } = useTranslations()

  useEffect(() => {
    async function getSubCategoryData() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/${locale}/api/v1/sub_category_all_results/${tid}`,
          {
            headers: {
              "country-code": countryCode || "US",
              "lang-code": langCode || "en",
              locale: localeValue || "en",
            },
          }
        )
        const { data } = await response.json()
        setSubcatData(data)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    async function getSubCategoryBannerData() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/${locale}/api/v1/subcategory-hero-banner/term/${tid}`,
          {
            headers: {
              "country-code": countryCode || "US",
              "lang-code": langCode || "en",
              locale: localeValue || "en",
            },
          }
        )
        const { content } = await response.json()
        setSubcatBanner(content)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    getSubCategoryData()
    getSubCategoryBannerData()
  }, [tid, locale])

  // Loading state handling
  if (loading) {
    return (
      <BasicPageShimmer />
    )
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Error loading subcategory data: {error}</p>
      </div>
    )
  }

  const result_count = subcatData?.pager.total_items

  const subcategory_top = {
    node: {
      title: subcatBanner?.title,
      read_time: subcatBanner?.read_time || "",
      image_uri: absoluteUrl("/" + subcatBanner?.thumbnail),
      type: subcatBanner?.type,
      url: `/${locale}/` + subcatBanner?.url,
      show_link: true,
    },
  }

  return (
    <div className="subcategory-page">
      <Breadcrumbs items={breadcrumb} />
      {subcatBanner?.title && (
        <div className="subcategory-top py-32">
          <div className="container">
            <Card item={subcategory_top} variant="side" />
          </div>
        </div>
      )}

      <div className="all-results mb-10">
        {result_count && (
          <div className="container">
            <div className="result-count my-14 pb-3 border-b border-b-primary inline-block">
              {translations?.[locale]?.all_results} ({result_count})
            </div>
          </div>
        )}

        <div className="stories container">
          {subcatData?.items?.map((item: any, index: number) => {
            const transformedItem = {
              node: {
                title: item.title,
                read_time: parseInt(item.read_time, 10),
                image_uri: item.thumbnail_image,
                type: item.type,
                url: item.url,
              },
            }
            return <Card item={transformedItem} key={index} />
          })}
        </div>
      </div>
    </div>
  )
}

export default SubCategoryPage
