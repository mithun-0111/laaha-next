"use client"

import { getSearchResults } from "@/src/app/[locale]/search-form/api"
import { useTranslations } from "@/src/contexts/TranslationsContext"
import { SearchIcon } from "@/src/lib/icons"
import { useLocale } from "next-intl"
import { useState } from "react"

interface SearchResult {
  title: string
  url: string
  foundIn: string
}

const HomepageSearch = () => {
  const [searchSuggestions, setSearchSuggestions] = useState<SearchResult[]>([])
  const [searchText, setSearchText] = useState("")
  const locale = useLocale()
  let page = 0
  const { translations } = useTranslations()

  const handleSearchSuggestion = async (e: any) => {
    let value = e.target.value
    if (value.length < 3) {
      setSearchSuggestions([])
      return
    }
    if (e.code === "Escape" || value === "") {
      setSearchSuggestions([])
      return
    }
    let data = await getSearchResults(value, page, locale)
    let filteredSearchResults: SearchResult[] = filterSearchResults(data.rows)
    setSearchSuggestions(filteredSearchResults)
  }

  const filterSearchResults = (data: any) => {
    if (!data) {
      return []
    }
    let tempSearchResults: SearchResult[] = []
    for (let result of data) {
      tempSearchResults.push({
        title: result.title,
        foundIn: result.type,
        url: result.url,
      })
    }
    return tempSearchResults.slice(0, 7)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (searchText) {
      window.location.href = `/${locale}/search-form?query=${encodeURIComponent(searchText)}`
    }
  }

  return (
    <div className="homepage-search-wrapper bg-light-pink mb-20">
      <div className="container relative  py-11">
        <div className="flex items-center gap-4 relative">
          <div className="icon-search absolute left-3 md:left-8">
            <SearchIcon />
          </div>
          <form action="" className="w-full" onSubmit={handleSubmit}>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyUp={handleSearchSuggestion}
              className="w-full text-base py-[14px] border-primary border-[3px] outline-none rounded-full md:pl-16 px-10"
              placeholder={translations?.[locale]?.home_search_placeholder}
            />
          </form>
        </div>
        <div
          className={` ${searchSuggestions.length > 0 ? "block" : "hidden"} absolute bg-white rounded-2xl top-[102px] shadow-lg z-10 search-results p-8`}
        >
          {searchSuggestions.map((result, index) => (
            <div
              key={index}
              className={`${searchSuggestions.length == index + 1 ? "" : "border-b"}  p-4 border-gray cursor-pointer hover:bg-light-pink`}
            >
              <p className="font-medium text-xl">
                <a href={result.url}>{result.title}</a>
              </p>
              <p className="text-m text-gray">
                in
                <span className="text-primary">{" " + result.foundIn}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomepageSearch
