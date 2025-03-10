"use client"

import { laila } from "@/src/lib/utils"
import { useEffect, useState, useRef } from "react"
import Search from "./CommunitySearch"
import CategoryDropdown from "./CategoryDropdown"
import { getQuestionData, getSubCategory } from "@/src/lib/apis"
import Questionlist from "./QuestionList"
import "./Community.scss"
import { ListingShimmer } from "../Shimmer"
import AskQuestion from "./AskQuestion"
import Image from "next/image"
import { useSignUp } from "@/src/contexts/SignUpProvider"
import { useLocale } from "next-intl"
import { getAccessToken } from "@/src/lib/protectedAuth"
import { useTranslations } from "@/src/contexts/TranslationsContext"
import { useValidUser } from "@/src/contexts/ValidCountryUser"

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState("all") // Active tab for filtering questions
  const [questionParams, setQuestionParams] = useState<any>({
    searchParam: "",
    category: "",
    subcategory: "",
    selectedTab: "all",
    pageNumber: 1,
    pageLimit: 10,
  })
  const [questionData, setQuestionData] = useState<any>([]) // Store question data
  const [questionCount, setQuestionCount] = useState<any>(0) // Store total question count
  const [subcategoryList, setSubcategoryList] = useState<any>() // Store available subcategories
  const [activeSubcat, setActiveSubcat] = useState<string>("") // Active subcategory for filtering
  const [loading, setLoading] = useState(false) // Loading state for fetching data
  const [hasMore, setHasMore] = useState<boolean>(true) // Check if there are more questions to load
  const { userName, userAvatarUrl, isUserLoggedIn } = useSignUp()
  const { isAuthUser, isValidUser } = useValidUser();
  const locale = useLocale()
  // const token = getAccessToken()
  const { translations } = useTranslations()

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch questions based on current params
  const fetchResources = async (questionParams: any) => {
    let token = await getAccessToken();
    setLoading(true)
    try {
      const {
        searchParam,
        category,
        subcategory,
        selectedTab,
        pageNumber,
        pageLimit,
      } = questionParams

      const response = await getQuestionData(
        locale,
        searchParam,
        category,
        subcategory,
        selectedTab,
        pageNumber,
        pageLimit,
        token
      )
      const newData = response.data

      setQuestionData((prevData: any) => {
        const existingData = prevData || []
        return [...existingData, ...(newData.questions || [])]
      })

      setQuestionCount(newData.total_results)
      setHasMore(newData && newData.questions?.length === pageLimit)
    } catch (error) {
      console.error("Error fetching resources:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch subcategories for a selected category
  const fetchSubcategory = async (catID: number) => {
    try {
      const response = await getSubCategory(catID)
      setSubcategoryList(response.data)
    } catch (error) {
      console.error("Error fetching resources", error)
    }
  }

  // Handle tab selection (all, most supported, unanswered)
  const handleTabMenu = (menuID: string) => {
    setQuestionData([]) // Reset question data
    setQuestionParams((prevQuestionList: any) => ({
      ...prevQuestionList,
      pageNumber: 1,
      selectedTab: menuID,
    }))
    setActiveTab(menuID)
  }

  // Handle category selection and fetch related subcategories
  const handleSelectChange = (option: number) => {
    setQuestionData([]) // Reset question data
    setQuestionParams((prevQuestionList: any) => ({
      ...prevQuestionList,
      pageNumber: 1,
      category: option,
      subcategory: "", // Clear existing subcategory
    }))
    fetchSubcategory(option) // Fetch subcategories for the selected category
    setActiveSubcat("") // Reset active subcategory
  }

  // Debounced search input handler
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current) // Clear previous timeout
    }

    const searchValue = event.target.value
    searchTimeoutRef.current = setTimeout(() => {
      setQuestionData([]) // Reset question data
      setQuestionParams((prevQuestionList: any) => ({
        ...prevQuestionList,
        pageNumber: 1,
        searchParam: searchValue,
      }))
    }, 1000) // 1-second debounce delay
  }

  // Handle subcategory selection
  const handleSubCategory = (subcatID: string, subcatName: string) => {
    setQuestionData([]) // Reset question data
    setQuestionParams((prevQuestionList: any) => ({
      ...prevQuestionList,
      pageNumber: 1,
      subcategory: subcatID,
    }))
    setActiveSubcat(subcatName) // Set active subcategory
  }

  // Load more questions when the user clicks "View More"
  const loadMore = () => {
    if (loading) return <div> Loading... </div>
    setQuestionParams((prevParams: any) => ({
      ...prevParams,
      pageNumber: prevParams.pageNumber + 1,
    }))
  }

  // Fetch resources whenever question parameters change
  useEffect(() => {
    fetchResources(questionParams)
  }, [questionParams])

  return (
    <>
      {/* Community Page Header */}
      <div className="community-header sticky shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)] mb-10 top-0 z-20">
        <div className="container">
          <div className="search-and-category flex justify-start items-center flex-wrap py-6 gap-6">
            <h1 className={`heading ${laila.className}`}>
              {translations?.[locale]?.community_questions} {/* Title */}
            </h1>
            <Search handleInputChange={handleInputChange} />
            <CategoryDropdown onChange={handleSelectChange} />
          </div>

          {/* Tab Menu for Filtering Questions */}
          <div className="tabs inline-flex gap-8 overflow-x-auto">
            <div
              className={`tab leading-8 cursor-pointer ${activeTab === "all" ? "active border-b-2 border-primary" : ""}`}
              onClick={() => handleTabMenu("all")}
            >
              {translations?.[locale]?.all}
            </div>
            <div
              className={`tab leading-8 cursor-pointer ${activeTab === "supported" ? "active border-b-2 border-primary" : ""}`}
              onClick={() => handleTabMenu("supported")}
            >
              {translations?.[locale]?.most_supported}
            </div>
            <div
              className={`tab leading-8 cursor-pointer ${activeTab === "unanswered" ? "active border-b-2 border-primary" : ""}`}
              onClick={() => handleTabMenu("unanswered")}
            >
              {translations?.[locale]?.unanswered_questions}
            </div>
          </div>
        </div>
      </div>

      {/* Subcategory List */}
      {subcategoryList && subcategoryList.subcategory_data && (
        <>
          <div className="container">
            <div className="subcategory-list">
              {subcategoryList.category && (
                <div className="category-title py-2 px-4 inline-block rounded-[3rem] bg-gray-300">
                  {subcategoryList.category}
                </div>
              )}
              <div className="subcategory-items flex flex-nowrap overflow-x-auto items-stretch gap-3 self-stretch mt-3 mb-8 mx-0">
                {subcategoryList.subcategory_data.map((subcat: any) => (
                  <div
                    key={subcat.id}
                    className={
                      subcat.name === activeSubcat
                        ? "border-primary bg-color-secondary border lg:flex-[0_0_20%] flex items-center gap-2 cursor-pointer flex-[0_0_50%] m-1 px-3 py-2 rounded-[0.8rem]"
                        : "lg:flex-[0_0_20%] flex items-center bg-white hover:border-primary hover:border gap-2 cursor-pointer flex-[0_0_50%] m-1 px-3 py-2 rounded-[0.8rem] subcategory-item"
                    }
                    onClick={() => handleSubCategory(subcat.id, subcat.name)}
                  >
                    {subcat.icon_url && (
                      <div className="subcat-image flex-[0_0_2rem] lg:flex-[0_0_4rem]">
                        <Image
                          width={64}
                          height={64}
                          src={subcat.icon_url}
                          alt={subcat.name}
                        />
                      </div>
                    )}
                    <div className="subcat-name text-sm">{subcat.name}</div>
                  </div>
                ))}
              </div>
            </div>
            {questionCount > 0 && (
              <div className="result-count">
                {`${questionCount} questions under '${subcategoryList.category}' `}
                {activeSubcat && `topic ${activeSubcat}`}
              </div>
            )}
          </div>
        </>
      )}

      {/* Question List and Ask Question Sidebar */}
      <div className="question-list container flex flex-wrap">
        <div className="lg:flex-[0_0_66.66%] lg:max-w-[66.66%] lg:pr-8 tab-results-wrapper">
          <div className="tab-results">
            {loading && questionData.length === 0 ? (
              <ListingShimmer />
            ) : (
              <Questionlist
                questionlist={questionData} // Pass fetched questions to the list component
                currentUser={{ userName, userAvatarUrl, isUserLoggedIn }}
              />
            )}
          </div>
          {hasMore &&
            !loading &&
            translations?.[locale]?.view_all_conversations && (
              <button
                className="view-all-conversations mb-8 bg-primary p-4 rounded-xl hover:bg-red w-full text-center text-white"
                onClick={loadMore} // Load more questions on click
              >
                {translations?.[locale]?.view_all_conversations}
              </button>
            )}
        </div>

        <div className="lg:flex-[0_0_33.33%] lg:max-w-[33.33%] ask-question-wrapper max-h-max lg:sticky lg:top-[10rem] mb-8">
          <AskQuestion currentUser={{ userName, isUserLoggedIn, isAuthUser }} /> {/* Ask a new question */}
        </div>
      </div>
    </>
  )
}

export default CommunityPage
