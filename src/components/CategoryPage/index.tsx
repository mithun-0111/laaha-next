"use client"

import React, { useState, useEffect } from "react"
import SimpleCard from "../Cards/SimpleCard"
import {
  absoluteUrl,
  getCountryCode,
  getLangCode,
  getLocaleValue,
} from "@/src/lib/utils"
import Image from "next/image"
import "./taxonomy.scss"
import { useLocale } from "next-intl"
import { getCategoriesData } from "@/src/lib/apis"
import { Breadcrumbs } from "../Breadcrumb"
import dynamic from "next/dynamic"
import { BasicPageShimmer, BasicShimmer } from "../Shimmer"

const FeaturedStories = dynamic(() => import("./FeaturedStories"), {
  loading: () => <BasicShimmer />,
  ssr: false,
});

const CategoryPage = ({
  tid,
  breadcrumb,
}: {
  tid: number
  breadcrumb: any
}) => {
  const locale = useLocale()
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const countryCode = getCountryCode()
  const langCode = getLangCode()
  const localeValue = getLocaleValue()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        // Parallel API calls to fetch category and featured data
        const [catData] = await Promise.allSettled([
          getCategoriesData(locale, tid), // Fetch category data
        ])
        
        // Handle the successful response for category data
        if (catData.status === "fulfilled") {
          setData(catData.value)
        }
      } catch (error: any) {
        setError(error.message) // Set error message if something goes wrong
      } finally {
        setLoading(false)
      }
    }

    fetchData() // Call the fetchData function
  }, [locale, tid, countryCode, langCode, localeValue])

  if(loading) {
    return <BasicPageShimmer />
  }

  return (
    loading ? <BasicPageShimmer /> :
    <div className="category-page">
      <Breadcrumbs items={breadcrumb} /> {/* Display breadcrumbs */}
      
      {data && (
        <>
          {/* Category Top Section */}
          <div
            className="category-top pb-10"
            style={{ backgroundColor: "#" + data?.category?.cat_color }}
          >
            <div className="cat-header container flex justify-center items-center py-10">
              <Image
                alt={data?.category?.cat_alt}
                loading="lazy"
                src={absoluteUrl("/" + data?.category?.cat_icon)}
                width={48}
                height={48}
              />
              <h1>{data?.category?.cat_name}</h1>
            </div>
            
            {/* Display Simple Cards for each sub-category */}
            <div className="simple-card__wrapper container flex flex-wrap gap-6">
              {Object.values(data.content).map((item: any, index: any) => {
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
        </>
      )}

      <FeaturedStories tid={tid} />
    </div>
  )
}

export default CategoryPage
