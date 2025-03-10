"use client"
export const runtime = "edge" // Indicates the component runs on the edge runtime

import GridCard from "@/src/components/Cards/GridCard"
import { fetchIDFromPath, getContentCurationData } from "@/src/lib/apis"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useLocale } from "next-intl"
import Pagination from "@/src/components/Pagination"
import { BasicShimmer, ListingShimmer } from "@/src/components/Shimmer"
import { useTranslations } from "@/src/contexts/TranslationsContext"
import dynamic from "next/dynamic"

const ContentCurationTop = dynamic(
  () => import("./content-curation-top"), // Path to your component
  {
    loading: () => <BasicShimmer />, // Show BasicShimmer while loading
    ssr: false, // Disable server-side rendering for this component (optional)
  }
)

const ContentCuration = () => {
  const initialData = {
    pageNumber: 0,
    sortBy: "created_DESC",
    filterType: "",
  }

  const { slug } = useParams() // Get URL parameter (slug)
  const locale = useLocale() // Get current locale
  const { translations } = useTranslations() // Get translations context

  const [contentCurationData, setContentCurationData] = useState<any[]>([])
  const [contentParam, setContentParam] = useState(initialData) // For storing pagination, sorting, and filtering params
  const [loading, setLoading] = useState(true) // Loading state
  const [error, setError] = useState<string | null>(null) // Error state
  const [category, setCategory] = useState<any>(null)
  const [cachedID, setCachedID] = useState<string | null>(null) // State to store cached ID

  const tabs = [
    { name: `${translations?.[locale]?.all}`, module_type: "" },
    { name: `${translations?.[locale]?.module}`, module_type: "scorm" },
    { name: `${translations?.[locale]?.video}`, module_type: "video" },
    { name: `${translations?.[locale]?.podcast}`, module_type: "podcast" },
  ]

  const [selectedTab, setSelectedTab] = useState(tabs[0].module_type) // Default selected tab
  const { pageNumber, filterType, sortBy } = contentParam
  const [currentPage, setCurrentPage] = useState<number>(1) // Track current page
  const [totalItems, setTotalItems] = useState(0) // Track total items for pagination
  const [itemsPerPage, setItemsPerPage] = useState(0) // Items per page

  // Generate a unique cache key based on the query parameters
  const generateCacheKey = () => {
    return `contentCuration-${slug}-${locale}-${pageNumber}-${filterType}-${sortBy}`
  }

  // Handle tab selection for filtering content
  const handleClick = (module_type: string) => {
    setSelectedTab(module_type)
    setCurrentPage(1)
    setContentParam((prev: any) => ({
      ...prev,
      filterType: module_type,
      pageNumber: 0,
    }))
  }

  // Handle sort option change
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortByValue = event.target.value
    setContentParam((prev) => ({
      ...prev,
      sortBy: sortByValue,
      pageNumber: 0,
    }))
    setCurrentPage(1)
  }

  // Handle page change for pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setContentParam((prev) => ({
      ...prev,
      pageNumber: page - 1,
    }))
  }

  // Fetch content data whenever contentParam changes
  useEffect(() => {
    const fetchData = async () => {
      if (slug && locale) {
        try {
          setLoading(true)  // Start loader only when API is fetching
          const cacheKey = generateCacheKey()
          const cachedData = localStorage.getItem(cacheKey)
          const cachedIDValue = localStorage.getItem('cachedID') // Get cached ID from local storage

          // If the ID is cached and not expired, use it
          if (cachedIDValue) {
            setCachedID(cachedIDValue)
          }

          // If cached data exists and is not expired, use it
          if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData)
            const now = new Date().getTime()

            // Cache is valid for 1 hour (3,600,000 milliseconds)
            if (now - timestamp < 3600000) {
              setContentCurationData(data.rows)
              setCategory(data.categoryList)
              setItemsPerPage(data.pager?.items_per_page || 0)
              setTotalItems(data.pager?.total_items || 0)
              setLoading(false)
              return
            }
          }

          // Fetch fresh data if no valid cache exists
          const id = await fetchIDFromPath(slug as string, locale)
          const contentCuration = await getContentCurationData(
            id[0]?.tid,
            locale as string,
            pageNumber,
            filterType,
            sortBy
          )

          // Update state with fresh data
          setContentCurationData(contentCuration?.data?.rows || [])
          setCategory(contentCuration?.categoryList || null)

          // Set pagination details
          if (contentCuration?.data?.pager) {
            setItemsPerPage(contentCuration.data.pager.items_per_page)
            setTotalItems(contentCuration.data.pager.total_items)
          }

          // Cache the fresh data with a timestamp and store the ID
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: {
                rows: contentCuration?.data?.rows || [],
                categoryList: contentCuration?.categoryList || null,
                pager: contentCuration?.data?.pager || {},
              },
              timestamp: new Date().getTime(),
            })
          )

          // Cache the ID for 1 hour
          localStorage.setItem('cachedID', id[0]?.tid)
        } catch (error) {
          setError(error instanceof Error ? error.message : "An error occurred")
          console.error("Error fetching data:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [slug, locale, contentParam]) // Re-fetch data if any of these change

  return (
    <div className="content-curation container mb-8">
      <div className="content-curation-top">
        <ContentCurationTop name={slug as string} />
      </div>
      {loading && !contentParam.filterType ? ( // Prevent loader from showing on tab switch
        <div className="mt-8">
          <ListingShimmer />
        </div>
      ) : (
        <>
          {/* Tab for content filtering */}
          <div className="tabs mb-8 flex flex-wrap justify-between">
            <div className="tab-row flex gap-6 lg:gap-8 mb-4 lg:mb-0">
              {tabs.length > 0 &&
                tabs.map((tab) => (
                  <button
                    key={tab.module_type}
                    onClick={() => handleClick(tab.module_type)}
                    className={
                      tab.module_type === selectedTab
                        ? "active text-primary"
                        : "hover:text-primary"
                    }
                  >
                    {tab.name}
                  </button>
                ))}
            </div>
            <div className="sort flex items-center gap-6">
              <span> {translations?.[locale]?.sory_by} </span>
              <select className="pe-8" onChange={handleChange} value={sortBy}>
                <option value="created_DESC">
                  {translations?.[locale]?.latest}
                </option>
                <option value="created_ASC">
                  {translations?.[locale]?.oldest}
                </option>
              </select>
            </div>
          </div>

          {/* Display content cards */}
          <div className="content-cards flex flex-wrap gap-8 pb-12">
            {contentCurationData?.length > 0 &&
              contentCurationData.map((item: any, index: number) => {
                let curatedItem = {
                  title: item.title,
                  url: item.url,
                  type: item.type,
                  field_sub_category: item.field_sub_category,
                  field_thumbnail_image: item.field_thumbnail_image,
                }
                return (
                  <GridCard
                    key={index}
                    className="lg:max-w-[calc(25%-1.5rem)] md:max-w-[calc(50%-1rem)] flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_25%]"
                    item={curatedItem}
                    category={category || {}}
                  />
                )
              })}
          </div>
        </>
      )}

      {/* Pagination if needed */}
      {totalItems > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

export default ContentCuration
