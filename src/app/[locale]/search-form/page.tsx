"use client"

export const runtime = "edge"

// Importing necessary components and libraries
import { Breadcrumbs } from "@/src/components/Breadcrumb"
import { RightAngular, SearchIcon } from "@/src/lib/icons"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { getSearchResults } from "./api"
import { absoluteUrl } from "@/src/lib/utils"
import { useLocale } from "next-intl"
import "./../../../styles/icons.scss"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "@/src/contexts/TranslationsContext"

// Define types for search results and suggestions
interface SearchResult {
  title: string
  foundIn: string
  field_thumbnail_image: string
  category: string
  categoryIcon: string
  type: string
  url: string
}

interface SearchSuggestion {
  title: string
  foundIn: string
  type: string
  url: string
}

const SearchForm = () => {
  // Fetch search query and other states
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || ""
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([])
  const [resultsCount, setResultsCount] = useState(0)
  const [pageLimit, setPageLimit] = useState(10)
  const [totalPage, setTotalPage] = useState(0)
  const [inputValue, setInputValue] = useState<string>(query)
  const [currentPage, setCurrentPage] = useState(0)
  const searchRef = useRef<HTMLInputElement>(null)
  const searchResRef = useRef<HTMLInputElement>(null)
  const locale = useLocale()
  const { translations } = useTranslations()
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Handle form submission for search
  const handleSearch = async (e: any) => {
    e.preventDefault()

    let value = searchRef.current?.value || ""
    let page = 0
    // If search query is too short, clear suggestions
    if (value.length < 3 && value.length > 0) {
      setSearchSuggestions([])
      return
    }
    // Fetch and filter search results
    let data = await getSearchResults(value, page, locale)
    let filteredSearchResults: SearchResult[] = filterSearchResults(data.rows)
    setSearchResults(filteredSearchResults)
    setResultsCount(data.pager.total_items)
    setTotalPage(data.pager.total_pages)
    setSearchSuggestions([])
    // Clear the search input field
    if (searchRef.current) {
      searchRef.current.value = ""
    }
  }

  // Handle clicking on search suggestion
  const handleSearchSuggestionClick = async (value: string) => {
    let page = 0
    let data = await getSearchResults(value, page, locale)
    let filteredSearchResults: SearchResult[] = filterSearchResults(data.rows)
    setSearchResults(filteredSearchResults)
    setResultsCount(data.pager.total_items || "0")
    setTotalPage(data.pager.total_pages)
    setSearchSuggestions([])
    if (searchRef.current) {
      searchRef.current.value = ""
    }
  }

  // Handle search suggestions as user types
  const handleSearchSuggestion = async (e: any) => {
    let value = e.target.value
    let page = 0
    // Clear suggestions if input is too short
    if (value.length < 3) {
      setSearchSuggestions([])
      return
    }
    // Hide suggestions if escape key or empty input
    if (e.code === "Escape" || value === "") {
      setSearchSuggestions([])
      return
    }
    let data = await getSearchResults(value, page, locale)
    let filteredSearchResults: SearchResult[] = filterSearchResults(data.rows)
    setSearchSuggestions(filteredSearchResults)
  }

  // Filter search results to match required structure
  const filterSearchResults = (data: any) => {
    if (!data) {
      return []
    }
    let tempSearchResults: SearchResult[] = []
    for (let result of data) {
      tempSearchResults.push({
        title: result.title,
        url: result.url,
        type: result.type,
        foundIn: result?.type,
        field_thumbnail_image: result?.field_thumbnail_image
          ? (result?.field_thumbnail_image).split("?")[0]
          : "",
        category: result?.sub_category_parent_name,
        categoryIcon: result?.sub_category_parent_field_icon
          ? (result?.sub_category_parent_field_icon).split("?")[0]
          : "",
      })
    }
    return tempSearchResults
  }

  // Handle loading more search results
  const handleLoadMore = async () => {
    let tempCurrentPage = currentPage + 1
    setCurrentPage(tempCurrentPage)
    let data = await getSearchResults(
      searchRef.current?.value,
      tempCurrentPage,
      locale
    )
    let filteredSearchResults: SearchResult[] = filterSearchResults(data.rows)
    let tempSearchResults = [...searchResults, ...filteredSearchResults]
    setSearchResults(tempSearchResults)
    setTotalPage(data.pager.total_pages)
  }

  // Handle click outside of search container to close suggestions
  const handleClickOutside = (event: any) => {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target)
    ) {
      setSearchSuggestions([])
    }
  }

  // Fetch initial search results and set up event listeners
  useEffect(() => {
    getSearchResults(inputValue, 0, locale).then((data) => {
      let filteredSearchResults: SearchResult[] = filterSearchResults(data.rows)
      setSearchResults(filteredSearchResults)
      setTotalPage(data.pager.total_pages)
      setResultsCount(data.pager.total_items)
    })
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="container search-form-wrapper" ref={searchContainerRef}>
      <Breadcrumbs items={[{ title: "Search", url: "" }]} />
      <div className="search flex relative">
        <form className="w-full flex gap-4" onSubmit={handleSearch}>
          <input
            value={inputValue}
            ref={searchRef}
            onChange={(e: any) => setInputValue(e.target.value)}
            onKeyUp={handleSearchSuggestion}
            className="w-full search-input"
            type="text"
            placeholder={translations?.[locale]?.search_placeholder}
          />
          <button className="search-button flex bg-color-secondary uppercase py-4 px-5 rounded text-m items-center">
            <SearchIcon width={16} height={16} />
            <span className="mt-1 ml-1">{translations?.[locale]?.search}</span>
          </button>
        </form>
        <div
          className={` ${searchSuggestions.length > 0 ? "block" : "hidden"} absolute bg-white rounded-3xl top-[57px] shadow-lg z-10 search-results p-8`}
        >
          {searchSuggestions.map((result, index) => (
            <Link href={result.url} key={index}>
              <div
                ref={searchResRef}
                onClick={() => handleSearchSuggestionClick(result.title)}
                className="p-4 border-b border-gray hover:bg-light-pink cursor-pointer"
              >
                <Link
                  href={result.url}
                  className="font-medium text-xl hover:text-primary"
                >
                  {result.title}
                </Link>
                <p className="text-m text-gray">
                  in
                  <span className="text-primary">{" " + result.foundIn}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <header className="uppercase font-univers mt-2 mb-[40px]">
        <span className="result-count text-m p-4 inline-block">
          {translations?.[locale]?.all_results} ({resultsCount})
        </span>
      </header>

      <div className="global-search-results w-full ">
        {searchResults.map((result, index) => (
          <div
            key={index}
            className="result-row p-[1.125rem] md:flex gap-5 w-full mb-6"
          >
            <div className="image_wrapper w-full relative mb-4 md:mb-0 h-full md:flex-[0_0_50%] lg:flex-[0_0_20rem] lg:max-w-[20rem]">
              <Image
                width={300}
                height={200}
                className="rounded-2xl w-full h-full"
                src={absoluteUrl(result?.field_thumbnail_image)}
                objectFit={"contain"}
                alt="search-image"
              />
              <span
                className={`icon-${result.type.toLocaleLowerCase()}`}
              ></span>
            </div>
            <div className="result-details">
              <Link href={result.url}>
                <h3 className="result-title text-l my-2 font-semibold hover:text-primary">
                  {result.title}
                </h3>
              </Link>
              <div className="flex mb-4 gap-2 items-center">
                <div className="category-icon bg-color-secondary rounded-full p-1">
                  <Image
                    width={30}
                    height={30}
                    className="rounded-full w-7 h-7 object-contain"
                    src={
                      result?.categoryIcon
                        ? absoluteUrl(result?.categoryIcon)
                        : ""
                    }
                    alt="category-icon"
                  />
                </div>
                <p className="uppercase text-m">{result?.category}</p>
              </div>
            </div>
          </div>
        ))}
        {totalPage > 1 && totalPage - 1 != currentPage && (
          <div className="my-10">
            <button
              onClick={handleLoadMore}
              className="flex bg-[#ffcdd2] text-[#363e44] py-3 text-m uppercase tracking-wider px-4 rounded-md"
            >
              <span>{translations?.[locale]?.load_more}</span>
              <RightAngular
                stroke="#363e44"
                width={18}
                height={18}
                strokeWidth={3}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchForm
