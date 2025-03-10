"use client"

export const runtime = "edge" // Use edge runtime for faster response times

// Importing necessary utilities
import { useEffect, useState } from "react"
import { useLocale } from "next-intl"
import dynamic from "next/dynamic"
import { drupal } from "@/src/lib/drupal"
import { getParams } from "@/src/lib/getparams"
import {
  absoluteUrl,
  getCountryCode,
  getLangCode,
  getLocaleValue,
} from "@/src/lib/utils"
import { defaultLocale } from "@/site.config"
import { HomeDynamic } from "@/src/lib/apis"
import HomePageBannerSlider from "@/src/components/Slider/HomepageBannerSlider"

// Dynamically import all components
const HomepageLearningPathSlider = dynamic(
  () => import("@/src/components/Slider/HomepageLearningPathSlider")
)
const HowLaahaCanHelpYou = dynamic(
  () => import("./components/how-laaha-can-help-you"),
  {
    loading: () => <HowCanLaahaHelpYouShimmer />,
  }
)
const StoriesOfStrength = dynamic(
  () => import("./components/stories-of-strength"),
  {
    loading: () => <StoriesShimmer />,
  }
)
const ExploreSpecialTopics = dynamic(
  () => import("./components/explore-special-topics")
)
const ContentMadeForYou = dynamic(
  () => import("./components/content-made-for-you")
)
const FindServices = dynamic(() => import("./components/find-services"))
const HomepageSearch = dynamic(
  () => import("@/src/components/Search/HomepageSearch"),
)
const HowCanLaahaHelpYouShimmer = dynamic(() =>
  import("@/src/components/Shimmer").then(
    (mod) => mod.HowCanLaahaHelpYouShimmer
  )
)
const StoriesShimmer = dynamic(() =>
  import("@/src/components/Shimmer").then((mod) => mod.StoriesShimmer)
)

interface ContentMadeForYouProps {
  title: string
  data: any[]
}

const homepageBlocksToShow = [
  "field_banner",
  "find_services",
  "field_need_help",
  "content_made_for_you",
  "learning_path",
  "field_new_modules_hub",
  "field_how_laaha_can_help_you",
  "field_stories",
]

export default function Home() {
  const locale = useLocale()
  const [contenForYou, setContenForYou] = useState<ContentMadeForYouProps>({
    title: "",
    data: [],
  })
  const [homepageBannerData, setHomepageBannerData] = useState<any>([])
  const [orderOfNodes, setOrderOfNodes] = useState<string[]>([
    ...homepageBlocksToShow,
  ])
  const [findServicesData, setFindservicesData] = useState<any>([])
  const [howLahaCanHelpDataStructured, setHowLahaCanHelpDataStructured] =
    useState<any>([])
  const [exploreSpecialDataStructured, setExploreSpecialDataStructured] =
    useState<any>([])
  const [storiesOfStrengthDataStructured, setStoriesOfStrengthDataStructured] =
    useState<any>([])
  const [loading, setLoading] = useState<boolean>(true)
  const countryCode = getCountryCode()
  const langCode = getLangCode()
  const localeValue = getLocaleValue()

  // Generate a unique cache key based on the locale and country code
  const generateCacheKey = (key: string) => {
    return `homepage-${locale}-${countryCode}-${key}`
  }

  // Fetch "Content Made For You" data
  const handleContentMadeForYou = async () => {
    const cacheKey = generateCacheKey("content-made-for-you")
    const cachedData = localStorage.getItem(cacheKey)

    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData)
      const now = new Date().getTime()

      // Cache is valid for 5 minutes (300,000 milliseconds)
      if (now - timestamp < 300000) {
        setContenForYou(data)
        return
      }
    }

    const jsonRes = await HomeDynamic(locale)
    let contentMadeForYouTitle = jsonRes?.data["resource-block"]["block_title"]
    let categoryWiseData = jsonRes?.data["resource-block"]["category"]
    let contentMadeForYouData = []

    // Structure the "Content Made For You" data
    for (let [k, v] of Object.entries(categoryWiseData) as [
      string,
      { name: string; nodes: any },
    ][]) {
      let vals = Object.values(v.nodes)
      let structuredContent = {
        category: v.name,
        data: vals[(Math.random() * vals.length) | 0],
      }
      contentMadeForYouData.push(structuredContent)
    }

    const data = {
      title: contentMadeForYouTitle,
      data: contentMadeForYouData,
    }

    setContenForYou(data)

    // Cache the data with a timestamp
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        data,
        timestamp: new Date().getTime(),
      })
    )
  }

  // Fetch resource data by path
  const handleResourceByPath = async () => {
    const cacheKey = generateCacheKey("resource-by-path")
    const cachedData = localStorage.getItem(cacheKey)

    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData)
      const now = new Date().getTime()

      // Cache is valid for 5 minutes (3600,000 milliseconds)
      if (now - timestamp < 3600000) {
        setFindservicesData(data.findServicesData)
        setHowLahaCanHelpDataStructured(data.howLahaCanHelpDataStructured)
        setStoriesOfStrengthDataStructured(data.storiesOfStrengthDataStructured)
        return
      }
    }

    const layoutNodes = await drupal.getResourceByPath(`/${locale}`, {
      locale: locale,
      defaultLocale: defaultLocale,
      params: getParams("homepage").getQueryObject(),
    })

    const data = {
      findServicesData: layoutNodes?.field_need_help,
      howLahaCanHelpDataStructured: curateHowLahaCanHelpYou(layoutNodes),
      storiesOfStrengthDataStructured: curateStoriesOfStrengthData(layoutNodes),
    }

    setFindservicesData(data.findServicesData)
    setHowLahaCanHelpDataStructured(data.howLahaCanHelpDataStructured)
    setStoriesOfStrengthDataStructured(data.storiesOfStrengthDataStructured)

    // Cache the data with a timestamp
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        data,
        timestamp: new Date().getTime(),
      })
    )
  }

  // Fetch additional static data for the homepage
  const handleFetchData = async () => {
    const cacheKey = generateCacheKey("static-data")
    const cachedData = localStorage.getItem(cacheKey)

    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData)
      const now = new Date().getTime()

      // Cache is valid for 5 minutes (300,000 milliseconds)
      if (now - timestamp < 3600000) {
        setExploreSpecialDataStructured(data.exploreSpecialDataStructured)
        setHomepageBannerData(data.homepageBannerData)
        setLoading(false)
        return
      }
    }

    setLoading(true)

    const nodeData = await fetch(
      `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/${locale}/api/v1/home_static`,
      {
        headers: {
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
        },
      }
    )
    const jsonNodeData = await nodeData.json()

    const data = {
      exploreSpecialDataStructured: curateExploreSpecialData(jsonNodeData),
      homepageBannerData: curateHomepageBanner(jsonNodeData),
    }

    setExploreSpecialDataStructured(data.exploreSpecialDataStructured)
    setHomepageBannerData(data.homepageBannerData)
    setLoading(false)

    // Cache the data with a timestamp
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        data,
        timestamp: new Date().getTime(),
      })
    )
  }

  useEffect(() => {
    handleContentMadeForYou() // Fetch content made for you
    handleResourceByPath() // Fetch resource data
    handleFetchData() // Fetch static data
  }, [])

  // Structure the homepage banner data
  const curateHomepageBanner = (nodeData: any) => {
    let fieldBannerData = nodeData.banner_field_data
    let tempBannerData = []
    for (let data of fieldBannerData) {
      tempBannerData.push({
        title: data.title,
        description: data.description,
        image_uri: absoluteUrl("/" + data.banner_image),
        bg_image_uri: absoluteUrl("/" + data.banner_background_image),
        cta_uri: data?.cta?.link ?? "",
        cta_title: data?.cta?.link_text ?? "",
      })
    }
    return tempBannerData
  }

  // Structure "How Laaha Can Help You" data
  const curateHowLahaCanHelpYou = (layoutNodes: any) => {
    let howLahaCanHelpData =
      (layoutNodes as any)?.field_how_laaha_can_help_you?.field_cards ?? []
    let tempHowLahaCanHelpDataStructured = []
    for (let data of howLahaCanHelpData) {
      tempHowLahaCanHelpDataStructured.push({
        title: data?.field_label,
        description: data?.field_card_description,
        image_url: data?.field_icon.thumbnail,
      })
    }
    return tempHowLahaCanHelpDataStructured
  }

  // Structure "Explore Special Topics" data
  const curateExploreSpecialData = (nodeData: any) => {
    let exploreSpecialData = (nodeData as any)?.special_topics_data ?? []
    let tempExploreSpecialDataStructured = []
    for (let data of exploreSpecialData) {
      tempExploreSpecialDataStructured.push({
        title: data?.title,
        description: data?.description,
        image_uri: absoluteUrl("/" + data?.background_image),
        url: data?.cta?.link,
        text: data?.cta?.link_text,
      })
    }
    return tempExploreSpecialDataStructured
  }

  // Structure "Stories of Strength" data
  const curateStoriesOfStrengthData = (layoutNodes: any) => {
    let storiesOfStrengthData = (layoutNodes as any)?.field_stories ?? []
    let storiesTitleDesc = {
      title: layoutNodes?.field_stories?.field_title,
      description: layoutNodes?.field_stories?.field_card_description,
    }
    let tempStoriesOfStrengthDataStructured = []
    for (let data of storiesOfStrengthData.field_stories_images ?? []) {
      tempStoriesOfStrengthDataStructured.push({
        description: String(data.field_description.processed),
        by: String(data.field_label),
        icon: String(data?.field_icon?.thumbnail?.uri?.url),
      })
    }

    return {
      ...storiesTitleDesc,
      tempStoriesOfStrengthDataStructured,
    }
  }

  // Mapping of homepage blocks to components
  let homepageBlockComponentMapping = {
    field_banner: {
      component: () => {
        return (
          <HomePageBannerSlider
            loading={loading}
            homepageBannerData={homepageBannerData}
          />
        )
      },
      props: {},
    },
    find_services: {
      component: () => {
        return <FindServices findServicesData={findServicesData} />
      },
      props: {},
    },
    field_stories: {
      component: () => {
        return (
          <StoriesOfStrength
            title={storiesOfStrengthDataStructured.title}
            desc={storiesOfStrengthDataStructured.description}
            stories={
              storiesOfStrengthDataStructured.tempStoriesOfStrengthDataStructured
            }
            loading={loading}
          />
        )
      },
      props: {},
    },
    field_need_help: {
      component: HomepageSearch,
      props: {},
    },
    field_new_modules_hub: {
      component: () => (
        <ExploreSpecialTopics
          exploreSpecialDataStructured={exploreSpecialDataStructured}
        />
      ),
      props: {},
    },
    field_how_laaha_can_help_you: {
      component: () => (
        <HowLaahaCanHelpYou
          howLahaCanHelpDataStructured={howLahaCanHelpDataStructured}
          loading={loading}
        />
      ),
      props: {},
    },
    content_made_for_you: {
      component: () => {
        if (contenForYou.data.length > 0) {
          return (
            <ContentMadeForYou
              contentMadeForYouTitle={contenForYou.title}
              contentMadeForYouData={contenForYou.data}
            />
          )
        } else {
          return <></>
        }
      },
      props: {},
    },
    learning_path: {
      component: HomepageLearningPathSlider,
      props: {},
    },
  }

  return (
    <>
      {/* Render each homepage block component based on the order */}
      {orderOfNodes.map((node, index) => {
        let Comp =
          homepageBlockComponentMapping[
            node as keyof typeof homepageBlockComponentMapping
          ]?.component

        if (Comp) {
          return (
            <Comp
              key={index}
              {...homepageBlockComponentMapping[
                node as keyof typeof homepageBlockComponentMapping
              ].props}
            />
          )
        }
      })}
    </>
  )
}
