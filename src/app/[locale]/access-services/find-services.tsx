"use client"

export const runtime = "edge"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import {
  getConfigMessageData,
  getCountryNameData,
  getFacets,
  getServices,
} from "../access-services/api"
import { useLocale } from "next-intl"
import Image from "next/image"
import { ArrowRight, DownArrow, RightAngular } from "@/src/lib/icons"
import { getCountryCode, laila } from "@/src/lib/utils"
import AccessServicesCard from "@/src/components/Cards/AccessServicesCard"
import useWindowSize from "@/src/lib/useWindowSize"
import { useTranslations } from "@/src/contexts/TranslationsContext"

// Define the interface for Card data which includes title, location, phone number, email, and a tag.
interface CardData {
  title: string
  location: string
  phoneNumber: string
  email: string
  tag: string
}

// FindSevices functional component handles the rendering of services search page.
export const FindSevices = () => {
  // Router and other hooks to handle navigation and state
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [cardData, setCardData] = useState<CardData[]>([])

  // Local state for country, state, city, title filters, and current page
  const [country, setCountry] = useState(searchParams.get("country") || "")
  const [state, setState] = useState(searchParams.get("state") || "")
  const [city, setCity] = useState(searchParams.get("city") || "")
  const [title, setTitle] = useState(
    searchParams.get("titles")?.split("+") || []
  )
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const page = searchParams.get("page")
    return page ? Number(page) : 1
  })

  // States to hold dynamic data like countries, states, cities, and titles
  const [totalCardItems, setTotalCardItems] = useState(0)
  const locale = useLocale()
  const PAGE_LIMIT = 10

  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [titles, setTitles] = useState([])

  // Selected country, state, and city for dropdowns
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")

  // Refs for accordion handling
  const accordionButtonRef = useRef<HTMLButtonElement>(null)
  const accordionRef = useRef<HTMLDivElement>(null)

  const currentCountryCode = getCountryCode()
  const [configMessage, setConfigMessage] = useState<string | null>("")
  const { translations } = useTranslations()

  // Fetch all countries, specifically checking the current country code.
  const getAllCountries = async () => {
    let data = await getCountryNameData()
    const individualCountry = data?.find(
      (item: any) => item.countrycode === currentCountryCode
    )
    const countryName = individualCountry?.name
    if (!state) {
      await redirectCountry(countryName)
    }
    const tempCountryData = data.map((item: any) => item.name)
    setCountries(tempCountryData)
    return countryName
  }

  // Fetch config message for the site.
  const getConfigMessage = async () => {
    let data = await getConfigMessageData(locale)
    setConfigMessage(data?.value)
  }

  // Redirect to the country page if no state is selected
  const redirectCountry = async (countryName: string | null) => {
    if (countryName) {
      const newUrl = `/${locale}/access-services?country=${countryName}`
      router.push(newUrl)
      setCountry(countryName)
    }
  }

  // Handle changes in country selection
  const handleCountryChange = (e: any) => {
    const newCountry = e.target.value
    setSelectedCountry(newCountry)
    setCountry(newCountry)
    setState("")
    setCity("")
    setTitle([])
    setCurrentPage(1)

    const params = new URLSearchParams()
    params.set("country", newCountry)
    router.push(`${pathname}?${params.toString()}`)
  }

  // Handle changes in state selection
  const handleStateChange = (e: any) => {
    const newState = e.target.value
    setSelectedState(newState)
    setState(newState)
    setCity("")
    setTitle([])
    setCurrentPage(1)

    const params = new URLSearchParams()
    params.set("country", country)
    params.set("state", newState)
    router.push(`${pathname}?${params.toString()}`)
  }

  // Handle changes in city selection
  const handleCityChange = (e: any) => {
    const newCity = e.target.value
    setSelectedCity(newCity)
    setCity(newCity)
    setTitle([])
    setCurrentPage(1)

    const params = new URLSearchParams()
    params.set("country", country)
    params.set("state", state)
    params.set("city", newCity)
    router.push(`${pathname}?${params.toString()}`)
  }

  // Toggle accordion visibility for services offered
  const toggleAccordion = (e: any) => {
    accordionRef.current?.classList.toggle("hidden")
    accordionButtonRef.current?.classList.toggle("rotate-180")
  }

  // Handle title (service type) change for filtering
  const handleServiceChange = (e: any) => {
    const newValue = e.target.value
    setCurrentPage(1)
    setTitle((prevTitle) => {
      let updatedTitle

      if (e.target.checked) {
        updatedTitle = [...prevTitle, newValue]
      } else {
        updatedTitle = prevTitle.filter((item) => item !== newValue)
      }

      const params = new URLSearchParams()
      country && params.set("country", country)
      state && params.set("state", state)
      city && params.set("city", city)

      params.set("titles", updatedTitle.join("+"))
      router.push(`${pathname}?${params.toString()}`)

      return updatedTitle
    })
  }

  // Fetch facets data (states, cities, titles)
  const getFacetsData = async () => {
    let data = await getFacets(country, state, city, locale)
    return data
  }

  let pageOffset = (currentPage - 1) * PAGE_LIMIT

  // Fetch card data (services)
  const getCardData = async () => {
    let servicesData = await getServices(
      country,
      state,
      city,
      title,
      PAGE_LIMIT,
      pageOffset,
      locale
    )

    let tempCardData = []
    for (let service of servicesData.data) {
      tempCardData.push({
        title: service.attributes.field_service_provider_name,
        phoneNumber: service.attributes.field_telephone_number,
        email: service.attributes.field_email_id,
        location:
          service.attributes.field_city + ", " + service.attributes.field_state,
        tag: service.attributes.title,
      })
    }
    setTotalCardItems(servicesData.meta.count)
    setCardData(tempCardData)
  }

  // Handle page change in pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const params = new URLSearchParams()
    country && params.set("country", country)
    state && params.set("state", state)
    city && params.set("city", city)
    title.length > 0 && params.set("titles", title.join("+"))

    page > 1 ? params.set("page", "" + page) : ""
    router.push(`${pathname}?${params.toString()}`)
  }

  // Fetch countries and facets data on component mount
  useEffect(() => {
    let countryPromise = getAllCountries()
    getConfigMessage()
    countryPromise.then((countryName) => {
      if (!countryName) {
        let data = getFacetsData()
        data.then((item) => {
          setStates(item.data.field_state)
          setCities(item.data.field_city)
          setTitles(item?.data?.titles)
        })
      }
    })
  }, [])

  // Fetch facets and services data based on selected filters (country, state, city, title, currentPage)
  useEffect(() => {
    let data = getFacetsData()
    if (country && !state && !city) {
      data.then((item) => {
        setStates(item.data.field_state)
        setCities(item.data.field_city)
        setTitles(item?.data?.titles)
      })
      getCardData()
    }

    if (state && !city) {
      data.then((item) => {
        setCities(item.data.field_city)
        setTitles(item?.data?.titles)
      })
      getCardData()
    }

    if (city) {
      data.then((item) => {
        setStates(item.data.field_state)
        setTitles(item?.data?.titles)
      })
      getCardData()
    }
  }, [country, state, city, title, currentPage])

  return (
    <div>
      <div className="flex flex-col pb-16">
        <div className="access-services-wrapper pt-24 bg-color-secondary text-white font-univers">
          <div className="container pb-4">
            <div className="breadcrumb flex items-center gap-3 pb-2">
              <Image
                width={24}
                height={24}
                src={"/assets/images/breadcrumb-home.png"}
                alt="breadcrumb"
              />
              <RightAngular stroke="#000" width={16} height={16} />
              <span className="text-red-wine text-m pt-1">
                {translations?.[locale]?.find_services}
              </span>
            </div>
            <h1
              className={`text-[#333] text-4xl font-semibold ${laila.className}`}
            >
              {translations?.[locale]?.find_services}
            </h1>
            <h4 className={`text-color-neutral text-base font-normal`}>
              {translations?.[locale]?.services_description}
            </h4>
          </div>
        </div>
        {configMessage && configMessage.length > 0 && (
          <div className="config-message -mt-16 lg:-mt-[5.75rem] mb-10 px-6 lg:px-16 pt-6 lg:pt-12 pb-6 bg-orange text-l">
            <div className="inline-flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="37"
                height="36"
                viewBox="0 0 37 36"
                fill="none"
              >
                <path
                  d="M18.5 12V18M18.5 24H18.515M33.5 18C33.5 26.2843 26.7843 33 18.5 33C10.2157 33 3.5 26.2843 3.5 18C3.5 9.71573 10.2157 3 18.5 3C26.7843 3 33.5 9.71573 33.5 18Z"
                  stroke="#68737D"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <span
                className="ms-4"
                dangerouslySetInnerHTML={{ __html: configMessage }}
              ></span>
            </div>
          </div>
        )}
        <div className="search-wrapper bg-color-secondary lg:bg-transparent pb-8 lg:pb-0">
          <div className="container flex flex-wrap lg:flex-nowrap gap-6">
            <div className="w-full lg:w-1/3 flex flex-wrap flex-col">
              <label htmlFor="country" className="text-[#333] text-base">
                {translations?.[locale]?.country}
              </label>
              <select
                name="country"
                id="country"
                className="py-[0.875rem] w-full lg:w-auto px-4 rounded-full appearance-none"
                onChange={handleCountryChange}
                value={selectedCountry || country}
              >
                <option value="">
                  {translations?.[locale]?.select_country}
                </option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            {states.length > 0 && (
              <div className="w-full lg:w-1/3 flex flex-col">
                <label htmlFor="state" className="text-[#333] text-base">
                  {translations?.[locale]?.state}
                </label>
                <select
                  name="state"
                  id="state"
                  className="py-[0.875rem] w-full lg:w-auto px-4 rounded-full appearance-none"
                  value={selectedState || state}
                  onChange={handleStateChange}
                >
                  <option value="">
                    {translations?.[locale]?.select_state}
                  </option>
                  {states.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {Object.values(cities).length > 0 && (
              <div className="w-full lg:w-1/3 flex flex-col">
                <label htmlFor="city" className="text-[#333] text-base">
                  {translations?.[locale]?.city}
                </label>
                <select
                  name="city"
                  id="city"
                  className="py-[0.875rem] w-full lg:w-auto px-4 rounded-full appearance-none"
                  value={selectedCity || city}
                  onChange={handleCityChange}
                >
                  <option value="">
                    {translations?.[locale]?.select_city}
                  </option>
                  {Object.entries(cities).map(([city, value], index) => (
                    <option key={index} value={city}>
                      {city} {" ( " + value + " )"}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="container services-offered lg:flex pb-24 gap-8">
        <aside className="w-full lg:w-3/12 mb-8 lg:mb-0">
          <div
            onClick={toggleAccordion}
            className="accordion-header cursor-pointer bg-[#f7265d] text-white px-4 py-[12px] text-l rounded-t-md flex justify-between items-center"
          >
            <span>{translations?.[locale]?.services_offered}</span>
            <button className="rotate-180" ref={accordionButtonRef}>
              <DownArrow fill="white" width={16} height={16} />
            </button>
          </div>
          <div ref={accordionRef} className="accordion-body bg-[#feebf1]">
            {titles.map((item, index) => (
              <div className="py-2 px-4 flex justify-between gap-2" key={index}>
                <label htmlFor={item} className="text-color-neutral text-base">
                  {item}
                </label>
                <input
                  id={item}
                  checked={title.includes(item)}
                  type="checkbox"
                  value={item}
                  onChange={handleServiceChange}
                />
              </div>
            ))}
          </div>
        </aside>
        <div className="w-full lg:w-9/12">
          {cardData.length === 0 && (
            <div className="flex flex-col items-center justify-center">
              <h1 className={`${laila.className} text-[48px] text-center`}>
                {translations?.[locale]?.service_not_found_heading}
              </h1>
              <Image
                width={500}
                height={400}
                src="/assets/images/need-help-no-results.png"
                alt="banner-slider"
              />
              <p className="text-xl text-center text-[#68737d]">
                {translations?.[locale]?.service_not_found}
              </p>
              <a
                href={`/${locale}/home`}
                className="py-[14px] px-5 bg-primary text-white rounded-md text-l mt-8 inline-block leading-[18px]"
              >
                {translations?.[locale]?.redirect_homepage}
              </a>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cardData.map((item, index) => {
              return (
                <AccessServicesCard
                  key={index}
                  className={
                    "border p-6 rounded-xl border-[#c2c8cc] hover:border-[#f7265d]"
                  }
                  phoneNumber={item.phoneNumber}
                  email={item.email}
                  title={item.title}
                  tag={item.tag}
                  location={item.location}
                />
              )
            })}
          </div>
          <CustomPagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalCardItems / PAGE_LIMIT)}
            setCurrentPage={handlePageChange}
          />
        </div>
      </div>
    </div>
  )
}

export default FindSevices

function CustomPagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: {
  currentPage: number
  totalPages: number
  setCurrentPage: (page: number) => void
}) {
  let showStartEllipsis = false
  let showEndEllipsis = false
  const { width } = useWindowSize()
  const { translations } = useTranslations()
  const locale = useLocale()

  // If there's only one page, don't render the pagination
  if (totalPages < 2) {
    return null
  }

  let totalPagesArr = Array.from(Array(totalPages).keys())

  // Handle pagination behavior for large screen sizes (greater than 992px)
  if (totalPages > 9 && width > 992) {
    if (currentPage <= 5) {
      // If current page is among the first 5, show the first 9 pages with an ellipsis at the end
      totalPagesArr = totalPagesArr.slice(0, 9)
      showEndEllipsis = true
    } else if (currentPage + 4 >= totalPages) {
      // If current page is among the last pages, show the last 9 pages with an ellipsis at the start
      totalPagesArr = totalPagesArr.slice(-9)
      showStartEllipsis = true
    } else {
      // Otherwise, show the current page in the middle with ellipses on both sides
      const start = currentPage - 5
      const end = currentPage + 4
      totalPagesArr = totalPagesArr.slice(start, end)
      showStartEllipsis = true
      showEndEllipsis = true
    }
  } else {
    // Handle pagination behavior for smaller screen sizes (less than or equal to 992px)
    if (totalPages > 3) {
      if (currentPage <= 2) {
        // If current page is among the first 2, show the first 3 pages with an ellipsis at the end
        totalPagesArr = totalPagesArr.slice(0, 3)
        showEndEllipsis = true
      } else if (currentPage + 2 >= totalPages) {
        // If current page is among the last pages, show the last 3 pages with an ellipsis at the start
        totalPagesArr = totalPagesArr.slice(-3)
        showStartEllipsis = true
      } else {
        // Otherwise, show the current page in the middle with ellipses on both sides
        const start = currentPage - 2
        const end = currentPage + 2
        totalPagesArr = totalPagesArr.slice(start, end)
        showStartEllipsis = true
        showEndEllipsis = true
      }
    }
  }

  return (
    <div className="flex justify-between items-center gap-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => setCurrentPage(currentPage - 1)} // Decrease page number when clicked
        className={`${currentPage === 1 ? " cursor-not-allowed border border-color-neutral text-color-neutral" : "text-primary border border-primary"} flex rounded-md text-m p-[13px] leading-[18px] gap-1 items-center`}
      >
        <span className="rotate-180">
          <ArrowRight width={18} height={18} />
        </span>
        <span className="pt-1">
          {width > 992 ? translations?.[locale]?.previous : ""}
        </span>
      </button>

      {/* Pagination Numbers */}
      <div className="flex overflow-x-auto justify-center w-full md:w-1/2">
        {showStartEllipsis && (
          <div className="border py-[6px] px-[12px] border-[#ddd] text-[#337ab7] rounded-l-md hover:bg-gray-200">
            ... {/* Show ellipsis at the start */}
          </div>
        )}
        {totalPagesArr.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page + 1)} // Set the page number when clicked
            className={`${currentPage === page + 1 ? "bg-[#feebf1] text-primary " : ""} w-10 h-10 hover:bg-gray-200 rounded-full`}
          >
            {page + 1}
          </button>
        ))}
        {showEndEllipsis && (
          <div className="border py-[6px] px-[12px] border-[#ddd] text-[#337ab7] rounded-r-md hover:bg-gray-200">
            ... {/* Show ellipsis at the end */}
          </div>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => setCurrentPage(currentPage + 1)} // Increase page number when clicked
        className={`${currentPage === totalPages ? " cursor-not-allowed border border-[#5a6872] text-[#5a6872]" : "text-[#f7265d] border border-[#f7265d]"} flex rounded-md text-m p-[13px] items-center leading-[18px] gap-1`}
      >
        <span className="pt-1">
          {width > 992 ? translations?.[locale]?.next : ""}
        </span>
        {currentPage < totalPages && <ArrowRight width={18} height={18} />}
      </button>
    </div>
  )
}
