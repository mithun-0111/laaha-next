"use client"

import GridCard from "@/src/components/Cards/GridCard"
import { laila } from "@/src/lib/utils"
import { getResourceData } from "@/src/lib/apis"
import { useEffect, useState } from "react"
import { useLocale } from "next-intl"
import Pagination from "@/src/components/Pagination"
import "./resources.scss"
import { Filter, SearchIcon } from "@/src/lib/icons"
import { ResourceListingShimmer } from "@/src/components/Shimmer"
import { useTranslations } from "@/src/contexts/TranslationsContext"

// Define types for content parameters and resource data structure
interface ContentParam {
  pageNumber: number
  sortBy: string
  filterType: string
  catID: string[]
  searchParam: string
}

interface ChildTerm {
  tid: string
}

interface CategoryData {
  tid: string
  child_terms: Record<string, ChildTerm>
}

interface Category {
  [key: string]: CategoryData
}

interface ResourceData {
  data: any[]
  categoryList: Category
}

const ResourcePage = () => {
  // Initial data setup for content parameters
  const initialData: ContentParam = {
    pageNumber: 0,
    sortBy: "created_DESC",
    filterType: "",
    catID: [],
    searchParam: "",
  }

  const locale = useLocale() // Get current locale
  const { translations } = useTranslations() // Fetch translations

  // State management for resource data, filters, pagination, etc.
  const [resourceData, setResourceData] = useState<any[]>([])
  const [contentParam, setContentParam] = useState<ContentParam>(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(0)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<{
    [key: string]: boolean
  }>({})
  const [showFilters, setShowFilters] = useState(false)

  const tabs = [
    { name: "All", module_type: "" },
    { name: "Modules", module_type: "scorm" },
    { name: "Videos", module_type: "video" },
    { name: "Podcasts", module_type: "podcast" },
  ]

  const [selectedTab, setSelectedTab] = useState<string>(tabs[0].module_type)
  const { pageNumber, catID, filterType, sortBy, searchParam } = contentParam

  // Handle tab click (filter by module type)
  const handleClick = (module_type: string) => {
    setSelectedTab(module_type)
    setCurrentPage(1)
    setContentParam((prev) => ({
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
  }

  // Handle category filter selection
  const handleCategoryClick = (
    id: string,
    checked: boolean,
    parentId?: string
  ) => {
    setContentParam((prev) => ({
      ...prev,
      catID: checked
        ? [...prev.catID, id]
        : prev.catID.filter((catId) => catId !== id),
    }))

    // Update selected categories for filtering
    setSelectedCategories((prev) => {
      const newSelection = { ...prev }

      if (checked) {
        newSelection[parentId || id] = true
      } else if (parentId) {
        const parentSubcategories = document.querySelectorAll<HTMLInputElement>(
          `input[data-parent-id="${parentId}"]:checked`
        )
        if (parentSubcategories.length === 0) {
          delete newSelection[parentId]
        }
      } else {
        delete newSelection[id]
      }

      return newSelection
    })
  }

  // Toggle category expansion (expand/collapse categories)
  const handleMainCatClick = (categoryId: string) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId))
  }

  // Handle page change for pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setContentParam((prev) => ({
      ...prev,
      pageNumber: page - 1,
    }))
  }

  // Remove category filter when chip is closed
  const handleChipClose = (parentId: string) => {
    setSelectedCategories((prev) => {
      const newSelection = { ...prev }
      delete newSelection[parentId]
      return newSelection
    })

    const parentCheckbox = document.getElementById(parentId) as HTMLInputElement
    if (parentCheckbox) {
      parentCheckbox.checked = false
    }

    const subcategoryCheckboxes = document.querySelectorAll<HTMLInputElement>(
      `input[data-parent-id="${parentId}"]`
    )
    subcategoryCheckboxes.forEach((checkbox) => {
      checkbox.checked = false
    })

    setContentParam((prev) => ({
      ...prev,
      catID: prev.catID.filter(
        (catId) =>
          ![
            parentId,
            ...Array.from(subcategoryCheckboxes).map((cb) => cb.id),
          ].includes(catId)
      ),
    }))
  }

  const handleSearchChange = (e: any) => {
    setCurrentPage(1)
    setTimeout(() => {
      setContentParam((prev) => ({
        ...prev,
        searchParam: e.target.value, // Update search parameter
      }))
    }, 700)
  }

  // Fetch data on page load or when content parameters change
  useEffect(() => {
    const fetchData = async () => {
      if (locale) {
        const cacheKey = `${locale}-${JSON.stringify(contentParam)}`

        // Check if cached data exists
        const cachedData = localStorage.getItem(cacheKey)
        if (cachedData) {
          const parsedData = JSON.parse(cachedData)
          setResourceData(parsedData.data)
          setCategory(parsedData.categoryList)
          setTotalItems(parsedData.totalItems)
          setItemsPerPage(parsedData.itemsPerPage)
          setLoading(false)
          return
        }

        try {
          const resource = await getResourceData(
            locale as string,
            catID,
            pageNumber,
            filterType,
            sortBy,
            searchParam
          )
          setResourceData(resource?.data?.rows || [])
          setCategory(resource?.categoryList || null)

          const pagination = resource?.data?.pager
          if (pagination) {
            setItemsPerPage(pagination.items_per_page)
            setTotalItems(pagination.total_items)
          }

          // Cache the fetched data in localStorage
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: resource?.data?.rows,
              categoryList: resource?.categoryList,
              totalItems: pagination?.total_items,
              itemsPerPage: pagination?.items_per_page,
            })
          )
        } catch (error) {
          console.error(error)
          setError("Failed to fetch resources")
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [locale, contentParam])

  // Display loading state while fetching data
  if (loading) return <ResourceListingShimmer />
  // Display error message if there is an issue with fetching data
  if (error) return <div>Error: {error}</div>

  return (
    <div className="content-resources container mb-8">
      <div className="resources-block py-8 mb-6 flex flex-wrap gap-6 items-center">
        <div className={`resources-info 'mx-auto text-center'}`}>
          <h1 className={`title mb-2 tracking-tight ${laila.className}`}>
            {translations?.[locale]?.all_resources}{" "}
            {/* Display all resources title */}
          </h1>
          <div className="resource-count">
            {totalItems} {translations?.[locale]?.resources_available}{" "}
            {/* Show resource count */}
          </div>
        </div>
      </div>

      <div className="content__wrapper flex flex-wrap">
        <div className={`sidebar lg:pr-8 flex-[0_0_100%] lg:flex-[0_0_25%]`}>
          {/* Search bar for resources */}
          <div className="resource-search relative">
            <input
              type="text"
              placeholder="Search..."
              onChange={handleSearchChange}
              className="py-2 mb-8 pe-4 ps-9 w-full rounded-3xl border border-primary"
            />
            <span className="absolute left-2 top-2">
              <SearchIcon /> {/* Search icon */}
            </span>
          </div>

          {/* Filter section with categories */}
          <div
            className={`${showFilters ? "block" : "hidden"} lg:block fixed left-0 right-0 top-0 bottom-0 bg-white lg:bg-transparent z-50 h-full w-full lg:static`}
          >
            {/* Display selected filters */}
            {Object.keys(selectedCategories).length > 0 && (
              <div className="selected-filters hidden lg:flex flex-wrap gap-2 mb-8">
                {Object.keys(selectedCategories).map((id) => {
                  let categoryName = ""

                  Object.entries(category ?? {}).forEach(
                    ([parentName, cat]) => {
                      if (cat.tid === id) {
                        categoryName = parentName
                      } else if (cat.child_terms) {
                        Object.entries(cat.child_terms).forEach(
                          ([childName, child]) => {
                            if (child.tid === id) {
                              categoryName = childName
                            }
                          }
                        )
                      }
                    }
                  )

                  return (
                    <div
                      key={id}
                      className="chip p-2 rounded-3xl inline-block bg-gray-200"
                    >
                      {categoryName}
                      <button
                        className="close-icon ms-2 text-primary"
                        onClick={() => handleChipClose(id)} // Close selected filter
                      >
                        ×
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Mobile filter header */}
            <div className="filter-header lg:hidden flex justify-between bordre-b border-gray p-4">
              <h3 className="font-bold text-xl">
                {translations?.[locale]?.filters} {/* Filters title */}
              </h3>
              <span onClick={() => location.reload()}>
                {translations?.[locale]?.clear_all} {/* Clear all filters */}
              </span>
            </div>

            {/* Categories list with child categories */}
            <div className="categories max-h-[calc(100vh-7rem)] lg:max-h-none overflow-y-auto">
              <ul className="list-none ps-0">
                {Object.entries(category ?? {}).map(
                  ([categoryName, categoryData]) => (
                    <li
                      key={categoryData.tid}
                      className="border first:rounded-t-xl last:rounded-b-xl border-gray-200"
                    >
                      {/* Main category */}
                      <div
                        className={`cat-item cursor-pointer relative w-full p-4 ps-6 ${
                          expandedCategory === categoryData.tid ? "active" : ""
                        }`}
                        onClick={() => handleMainCatClick(categoryData.tid)} // Toggle category expansion
                      >
                        <div className="cursor-pointer">
                          {categoryName} {/* Display category name */}
                        </div>
                        <span
                          className={`w-2.5 h-2.5 border-t-2 border-r-2 transition-all duration-200 ease-in-out border-color-neutral border-solid inline-block absolute right-3 top-5 transform ${
                            expandedCategory === categoryData.tid
                              ? "rotate-[315deg]"
                              : "rotate-[135deg]"
                          }`}
                        ></span>
                      </div>

                      {/* Subcategories */}
                      <ul
                        className={`list-none bg-gray-100 subcategories ${
                          expandedCategory === categoryData.tid
                            ? "expanded"
                            : "collapsed"
                        }`}
                      >
                        {Object.entries(categoryData.child_terms).map(
                          ([childKey, child]) => (
                            <li key={childKey} className="p-4">
                              <input
                                type="checkbox"
                                className="me-3 cursor-pointer"
                                id={child.tid}
                                name={categoryName}
                                data-parent-id={categoryData.tid}
                                onChange={(event) =>
                                  handleCategoryClick(
                                    event.target.id,
                                    event.target.checked,
                                    categoryData.tid
                                  )
                                } // Handle subcategory selection
                              />
                              <label
                                htmlFor={child.tid}
                                className="cursor-pointer"
                              >
                                {childKey} {/* Display subcategory name */}
                              </label>
                            </li>
                          )
                        )}
                      </ul>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Bottom filter buttons for mobile */}
            <div className="flex bg-white fixed border-t border-shadow-dark-gray w-full p-4 bottom-0 justify-between lg:hidden">
              <span onClick={() => setShowFilters(false)}>
                {translations?.[locale]?.cancel} {/* Cancel filter */}
              </span>
              <span onClick={() => setShowFilters(false)}>
                {translations?.[locale]?.apply} {/* Apply filter */}
              </span>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="content-area flex-[0_0_100%] lg:flex-[0_0_75%]">
          {/* Tabs for filtering by content type */}
          <div className="tabs mb-8 flex flex-wrap justify-between">
            <div className="tab-row flex gap-6 lg:gap-8 mb-4 lg:mb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.module_type}
                  onClick={() => handleClick(tab.module_type)} // Switch tab for content type
                  className={
                    tab.module_type === selectedTab ? "active text-primary" : ""
                  }
                >
                  {tab.name} {/* Display tab name */}
                </button>
              ))}
            </div>
            {/* Filter and sort section */}
            <div className="filter-sections flex w-full lg:w-auto items-center justify-between">
              <div
                className="filter lg:hidden flex items-center"
                onClick={() => setShowFilters(true)} // Open filter on mobile
              >
                <span className="me-1">{translations?.[locale]?.filters}</span>
                <span>
                  <Filter /> {/* Filter icon */}
                </span>
              </div>

              {/* Sort options */}
              <div className="sort flex items-center gap-6">
                <span>{translations?.[locale]?.sory_by} </span>
                <select className="pe-8" onChange={handleChange} value={sortBy}>
                  <option value="created_DESC">
                    {translations?.[locale]?.latest} {/* Sort by latest */}
                  </option>
                  <option value="created_ASC">
                    {translations?.[locale]?.oldest} {/* Sort by oldest */}
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Resource cards */}
          <div className="content-cards flex flex-wrap gap-8 pb-12">
            {resourceData.length > 0 ? (
              resourceData.map((item: any, index: any) => {
                let curatedItem = {
                  title: item.title,
                  url: item.url || "",
                  type: item.type,
                  field_sub_category: item.field_sub_category,
                  field_thumbnail_image: item.field_thumbnail_image,
                }
                return (
                  <GridCard
                    key={index}
                    className="lg:max-w-[calc(25%-1.5rem)] md:max-w-[calc(50%-1rem)] flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_25%]"
                    item={curatedItem} // Display resource card
                    category={category || {}}
                  />
                )
              })
            ) : (
              <div className="view-empty">
                {translations?.[locale]?.no_resource_found}{" "}
                {/* No resources found */}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalItems > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange} // Handle page change
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ResourcePage
