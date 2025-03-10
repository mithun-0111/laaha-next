"use client"

import { defaultLocale } from "@/site.config"
import Notice from "@/src/components/Paragraph/Notice"
import { drupal } from "@/src/lib/drupal"
import { getParams } from "@/src/lib/getparams"
import { useLocale } from "next-intl"
import { useState, useEffect } from "react"
import { laila } from "@/src/lib/utils"
import Video from "@/src/components/Paragraph/Video"
import Image from "next/image"
import { useTranslations } from "@/src/contexts/TranslationsContext"

const CommunityBanner = () => {
  const locale = useLocale()
  const [noticeData, setNoticeData] = useState([])
  const [bannerData, setBannerData] = useState<any>([])
  const { translations } = useTranslations()

  // Fetch banner data on component mount or when locale changes
  useEffect(() => {
    const getBannerData = async () => {
      try {
        // Fetch the banner data from Drupal API
        const bannerContent = await drupal.getResource(
          "block_content--hero_banner_one_column",
          "a6ebbae3-4540-48ac-801b-01cbc5f0508a",
          {
            locale: locale,
            defaultLocale: defaultLocale,
            params: getParams("hero_banner_community"),
          }
        )

        // Set notice and banner data if available
        if (bannerContent?.field_full_width_components?.[0]) {
          setNoticeData(bannerContent.field_full_width_components[0])
        }
        if (bannerContent?.field_components_one) {
          setBannerData(bannerContent.field_components_one)
        }
      } catch (error) {
        console.error("Error fetching banner data:", error)
        setNoticeData([])  // Set an empty array in case of error
      }
    }

    getBannerData()
  }, [locale])

  return (
    <div className="community-banner">
      {/* Render notice data if available */}
      {noticeData ? <Notice data={noticeData} /> : ""}
      
      {/* Render banner if banner data exists */}
      {bannerData.length > 0 ? (
        <div
          className="banner py-10 px-10"
          style={{
            background: `url('/assets/images/header-banner-homepage.png') no-repeat center center`,
            backgroundSize: "cover",  // Set banner background image
          }}
        >
          <div className="container">
            {/* Breadcrumb for the community page */}
            <div className="flex items-center mb-8">
              <Image
                width={20}
                height={17}
                alt="icon"
                src={"/assets/images/breadcrumb-home.png"}
              />
              <span className="text-red-wine pt-1.5 ps-2">
                {" "}
                {translations?.[locale]?.laaha_community}{" "}
              </span>
            </div>
            
            {/* Main banner title */}
            <div
              className={`${laila.className} font-semibold text-center mb-4 leading-[48px] lg:leading-[62px] text-3xl lg:text-[44px] tracking-tight max-w-[800px] m-auto`}
              dangerouslySetInnerHTML={{
                __html: bannerData[1]?.field_answer?.value || "",
              }}
            />
            
            {/* Description text */}
            <div
              className="description max-w-[800px] text-center m-auto text-xl mb-8 text-color-neutral"
              dangerouslySetInnerHTML={{
                __html: bannerData[2]?.field_service_description.value,
              }}
            ></div>
            
            {/* Video component */}
            <div className="video max-w-[800px] text-center m-auto">
              <Video data={bannerData[3]} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default CommunityBanner
