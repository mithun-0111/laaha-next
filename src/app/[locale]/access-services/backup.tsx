"use client"
export const runtime = 'edge'

import { ArrowRight, DownArrow, RightAngular } from "@/src/lib/icons"
import Image from "next/image"
import { getCountryCode, laila } from "@/src/lib/utils"
import { use, useEffect, useRef, useState } from "react"
import AccessServicesCard from "@/src/components/Cards/AccessServicesCard"
import { getConfigMessageData, getCountryNameData, getFacets, getServices } from "./api"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { translations } from "@/src/lib/translations"
import { useLocale } from "next-intl"
import useWindowSize from "@/src/lib/useWindowSize"

interface ServicesOffered {
  title: string
  selected: boolean
}

interface CardData {
  title: string
  location: string
  phoneNumber: string
  email: string
  tag: string
}

export default function AccessServices() {
  const [servicesOffered, setServicesOffered] = useState<ServicesOffered[]>([])
  const [cardData, setCardData] = useState<CardData[]>([])
  const [totalCardItems, setTotalCardItems] = useState(0)
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])

  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")

  const [currentPage, setCurrentPage] = useState(1)

  const PAGE_LIMIT = 10
  const accordionRef = useRef<HTMLDivElement>(null)
  const accordionButtonRef = useRef<HTMLButtonElement>(null)

  const router = useRouter()
  const searchParams = useSearchParams();
  const locale = useLocale();
  const currentCountryCode = getCountryCode();
  const countryCode = searchParams.get('countryCode');
  const [configMessage, setConfigMessage] = useState('');

  const toggleAccordion = (e: any) => {
    accordionRef.current?.classList.toggle("hidden")
    accordionButtonRef.current?.classList.toggle("rotate-180")
  }

  const updateStates = (queryCountry: string, queryState: string, queryCity: string, fetchFacetsPromises: any) => {
    setSelectedCountry(queryCountry);

    Promise.all(fetchFacetsPromises)
      .then((results) => {

        // First result is always country-level facets
        const countryData = results[0];
        setStates(countryData.data.field_state);

        // Initial services offered from country-level
        let servicesOfferedData = countryData.data.titles.map((title: string) => ({
          title,
          selected: false
        }));

        // If state was provided, update with state-level facets
        if (queryState !== '') {
          setSelectedState(queryState);
          const stateData = results[1];
          setCities(stateData.data.field_city);

          // Update services offered with state-level data
          servicesOfferedData = stateData.data.titles.map((title: string) => ({
            title,
            selected: false
          }));

          // If city was provided, update with city-level facets
          if (queryCity !== '') {
            setSelectedCity(queryCity);
            const cityData = results[2];

            // Final update of services offered with city-level data
            servicesOfferedData = cityData.data.titles.map((title: string) => ({
              title,
              selected: false
            }));
          }
        }

        // Set services offered with the most specific level of data
        setServicesOffered(servicesOfferedData);
        getServices(queryCountry, queryState, queryCity, [], PAGE_LIMIT, 0, locale).then(data => {
          setTotalCardItems(data.meta.count);
          setCardData(data.data.map((item: any) => ({
            title: item.attributes.field_service_provider_name,
            phoneNumber: item.attributes.field_telephone_number,
            email: item.attributes.field_email_id,
            location: item.attributes.field_city + ", " + item.attributes.field_state,
            tag: item.attributes.title,
          })));
        });
      })
      .catch((error) => {
        console.error('Error fetching facets:', error);
        // Optionally handle error state
      });
  }

  const handleServiceChange = async (e: any) => {
    const title = e.target.value
    let tempServicesOffered = [...servicesOffered]
    for (let service of tempServicesOffered) {
      if (service.title === title) {
        service.selected = !service.selected
      }
    }
    setServicesOffered(tempServicesOffered)
    let titlesArr = tempServicesOffered.filter((service) => service.selected === true).map(item => item.title)
    let servicesData = await getServices(
      selectedCountry,
      selectedState,
      selectedCity,
      titlesArr,
      PAGE_LIMIT,
      0,
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
    setCurrentPage(1)
    setCardData(tempCardData)

    let queryTitles = titlesArr
      .map(title => `[${encodeURIComponent(title.replace(/ /g, '+'))}]`)
      .join('');

    let queryCountry = searchParams.get('country') ?? '';
    let queryState = searchParams.get('state') ?? '';
    let queryCity = searchParams.get('city') ?? '';

    let fullQuery = ''
    if (queryCountry !== '') {
      fullQuery += `?country=${queryCountry}`
    }
    if (queryState !== '') {
      fullQuery += `&state=${queryState}`
    }
    if (queryCity !== '') {
      fullQuery += `&city=${queryCity}`
    }
    fullQuery += `&titles=${queryTitles}`

    router.push(fullQuery)
  }

  const handleCountryChange = async (e: any) => {

    let tempCountry = e.target.value
    setSelectedCountry(tempCountry)
    let data = await getFacets(tempCountry, '', '', locale)
    let tempServicesOffered = []
    for (let service of data.data.titles) {
      tempServicesOffered.push({ title: service, selected: false })
    }
    setServicesOffered(tempServicesOffered)
    setStates(data.data.field_state)
    setSelectedState("")
    setSelectedCity("")
    setCurrentPage(1)

    let servicesData = await getServices(tempCountry, '', '', [], PAGE_LIMIT, 0, locale)
    setTotalCardItems(servicesData.meta.count)
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
    setCardData(tempCardData)
    router.push('?country=' + tempCountry)
  }

  const handleStateChange = async (e: any) => {

    let tempState = e.target.value
    setSelectedState(tempState)
    let data = await getFacets(selectedCountry, tempState, '', locale)
    let tempServicesOffered = []
    for (let service of data.data.titles) {
      tempServicesOffered.push({ title: service, selected: false })
    }
    setServicesOffered(tempServicesOffered)
    setCities(data.data.field_city)
    setSelectedCity("")

    let servicesData = await getServices(
      selectedCountry,
      tempState,
      "",
      [],
      PAGE_LIMIT,
      0,
      locale
    )
    setTotalCardItems(servicesData.meta.count)
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
    setCardData(tempCardData)
    router.push('?country=' + selectedCountry + '&state=' + tempState)
  }

  const handleCityChange = async (e: any) => {
    let tempCity = e.target.value
    setSelectedCity(tempCity)
    let data = await getFacets(selectedCountry, selectedState, tempCity, locale)
    let tempServicesOffered = []
    for (let service of data.data.titles) {
      tempServicesOffered.push({ title: service, selected: false })
    }
    setServicesOffered(tempServicesOffered)

    let servicesData = await getServices(
      selectedCountry,
      selectedState,
      tempCity,
      [],
      PAGE_LIMIT,
      0,
      locale
    )
    setTotalCardItems(servicesData.meta.count)
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
    setCardData(tempCardData)
    router.push('?country=' + selectedCountry + '&state=' + selectedState + '&city=' + tempCity)
  }

  const getAllCountries = async () => {
    let data = await getCountryNameData();
    await redirectCountry(data, currentCountryCode);
    const tempCountryData = data.map((item: any) => item.name);
    setCountries(tempCountryData);
  }

  const getConfigMessage = async () => {
    let data = await getConfigMessageData(locale);
    setConfigMessage(data?.value)
  }

  const redirectCountry = async (country: any, cCode: string | null) => {
    const individualCountry = country?.find((item: any) => item.countrycode === cCode);
    const countryName = individualCountry?.name;
    if (countryName) {
      const newUrl = `/${locale}/access-services?country=${countryName}`;
      router.replace(newUrl);
      const promiseData = [getFacets(countryName, '', '', locale)];
      updateStates(countryName, '', '', promiseData);
    }
  }

  const checkURLParamsOnMount = async () => {
    let queryCountry = searchParams.get('country') ?? '';
    let queryState = searchParams.get('state') ?? '';
    let queryCity = searchParams.get('city') ?? '';
    let queryTitles = searchParams.get('titles') ?? '';
    let queryPage = searchParams.get('page') ?? '';

    if (queryPage !== '') {
      setCurrentPage(parseInt(queryPage));
    }

    if (queryCity !== '' && (queryState === '' || queryCountry === '')) {
      console.log('error :: city can not be selected without state or country');
    }
    if (queryState !== '' && queryCountry === '') {
      console.log('error :: state can not be selected without country');
    }

    if (queryCountry !== '') {
      const fetchFacetsPromises = [
        getFacets(queryCountry, '', '', locale)
      ];
      if (queryState !== '') {
        fetchFacetsPromises.push(getFacets(queryCountry, queryState, '', locale));
      }
      if (queryCity !== '') {
        fetchFacetsPromises.push(getFacets(queryCountry, queryState, queryCity, locale));
      }

      updateStates(queryCountry, queryState, queryCity, fetchFacetsPromises);
    }

  }

  useEffect(() => {
    getAllCountries();
    getConfigMessage();
  }, []);

  useEffect(() => {
    const getCountryName = async () => {
      const data = await getCountryNameData()
      redirectCountry(data, countryCode)
    }

    getCountryName();
  }, [countryCode]);


  useEffect(() => {
    if (countries.length > 0) {
      checkURLParamsOnMount();
    }
  }, [countries])

  useEffect(() => {
    // Extract titles from URL query parameter
    const queryTitles = searchParams.get('titles') ?? '';
    const queryCountry = searchParams.get('country') ?? '';
    const queryState = searchParams.get('state') ?? '';
    const queryCity = searchParams.get('city') ?? '';
    const queryPage = searchParams.get('page') ?? '1';

    setCurrentPage(parseInt(queryPage));

    const matches = queryTitles.match(/\[([^\]]+)\]/g) || [];

    // Decode and clean up titles
    const titlesArr = matches.map(match =>
      decodeURIComponent(match.slice(1, -1).replace(/\+/g, ' ').trim())
    );

    // Create a new array of services with updated selection
    const updatedServicesOffered = servicesOffered.map(service => ({
      ...service,
      // Mark as selected if the title is in the URL titles array
      selected: titlesArr.some(urlTitle =>
        service.title.replace(/\+/g, ' ').trim().toLowerCase() ===
        urlTitle.replace(/\+/g, ' ').trim().toLowerCase()
      )
    }));

    // Only update if there's a change to prevent unnecessary re-renders
    const hasChanges = updatedServicesOffered.some(
      (service, index) => service.selected !== servicesOffered[index].selected
    );
    if (hasChanges) {
      setServicesOffered(updatedServicesOffered);
      getServices(queryCountry, queryState, queryCity, titlesArr, PAGE_LIMIT, 0, locale).then(data => {
        setTotalCardItems(data.meta.count);
        setCardData(data.data.map((item: any) => ({
          title: item.attributes.field_service_provider_name,
          phoneNumber: item.attributes.field_telephone_number,
          email: item.attributes.field_email_id,
          location: item.attributes.field_city + ", " + item.attributes.field_state,
          tag: item.attributes.title,
        })));
      });
    }
  }, [searchParams, servicesOffered, currentPage]);

  useEffect(() => {
    let queryTitles = searchParams.get('titles') ?? '';
    let queryCountry = searchParams.get('country') ?? '';
    let queryState = searchParams.get('state') ?? '';
    let queryCity = searchParams.get('city') ?? '';

    const matches = queryTitles.match(/\[([^\]]+)\]/g) || [];

    // Decode and clean up titles
    const titlesArr = matches.map(match =>
      decodeURIComponent(match.slice(1, -1).replace(/\+/g, ' ').trim())
    );

    let pageOffset = (currentPage - 1) * PAGE_LIMIT;
    if (countries.length > 0 || queryCountry) {
      getServices(queryCountry, queryState, queryCity, titlesArr, PAGE_LIMIT, pageOffset, locale).then(data => {
        setTotalCardItems(data.meta.count);
        setCardData(data.data.map((item: any) => ({
          title: item.attributes.field_service_provider_name,
          phoneNumber: item.attributes.field_telephone_number,
          email: item.attributes.field_email_id,
          location: item.attributes.field_city + ", " + item.attributes.field_state,
          tag: item.attributes.title,
        })));
      });
    }
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    // Update the current page in the URL
    let queryTitles = searchParams.get('titles') ?? '';
    let queryCountry = searchParams.get('country') ?? '';
    let queryState = searchParams.get('state') ?? '';
    let queryCity = searchParams.get('city') ?? '';

    let queryParams = ''
    if (queryCountry !== '') {
      queryParams += `?country=${queryCountry}`
    }
    if (queryState !== '') {
      queryParams += `&state=${queryState}`
    }
    if (queryCity !== '') {
      queryParams += `&city=${queryCity}`
    }
    if (queryTitles !== '') {
      queryParams += `&titles=${queryTitles}`
    }
    queryParams += `&page=${page}`
    router.push(queryParams);
  }


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
              <span className="text-red-wine text-m pt-1">{translations.find_services}</span>
            </div>
            <h1
              className={`text-[#333] text-4xl font-semibold ${laila.className}`}
            >
              {translations.find_services}
            </h1>
            <h4 className={`text-color-neutral text-base font-normal`}>
              {translations.services_description}
            </h4>
          </div>
        </div>
        <div className="search-wrapper bg-color-secondary lg:bg-transparent pb-8 lg:pb-0">
          <div className="container flex flex-wrap lg:flex-nowrap gap-6">
            <div className="w-full lg:w-1/3 flex flex-wrap flex-col ">
              <label htmlFor="country" className="text-[#333] text-base">
                {translations.country}
              </label>
              <select
                name="country"
                id="country"
                className="py-[0.875rem] w-full lg:w-auto px-4 rounded-full appearance-none"
                onChange={handleCountryChange}
                value={selectedCountry}
              >
                <option value="">{translations.select_country}</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            {states.length > 0 &&
              <div className="w-full lg:w-1/3 flex flex-col">
                <label htmlFor="state" className="text-[#333] text-base">
                  {translations.state}
                </label>
                <select
                  name="state"
                  id="state"
                  className="py-[0.875rem] w-full lg:w-auto px-4 rounded-full appearance-none"
                  value={selectedState}
                  onChange={handleStateChange}
                >
                  <option value="">{translations.select_state}</option>
                  {states.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            }
            {Object.values(cities).length > 0 &&
              <div className=" w-full lg:w-1/3 flex flex-col">
                <label htmlFor="city" className="text-[#333] text-base">
                  {translations.city}
                </label>
                <select
                  name="city"
                  id="city"
                  className="py-[0.875rem] w-full lg:w-auto px-4 rounded-full appearance-none"
                  value={selectedCity}
                  onChange={handleCityChange}
                >
                  <option value="">{translations.select_city}</option>
                  {Object.entries(cities).map(([city, value], index) => (
                    <option key={index} value={city}>
                      {city} {' ( ' + value + ' )'}
                    </option>
                  ))}
                </select>
              </div>
            }
          </div>
        </div>
      </div>
      {
        configMessage && configMessage.length > 0 &&
        <div className="config-message -mt-16 lg:-mt-[5.75rem] mb-10 px-6 lg:px-16 pt-6 lg:pt-12 pb-6 bg-orange text-l">
          <div className="inline-flex">
          <svg xmlns="http://www.w3.org/2000/svg" width="37" height="36" viewBox="0 0 37 36" fill="none">
            <path d="M18.5 12V18M18.5 24H18.515M33.5 18C33.5 26.2843 26.7843 33 18.5 33C10.2157 33 3.5 26.2843 3.5 18C3.5 9.71573 10.2157 3 18.5 3C26.7843 3 33.5 9.71573 33.5 18Z" stroke="#68737D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          
          <span className="ms-4" dangerouslySetInnerHTML={{ __html: configMessage}}></span>
          </div>
        </div>
      }
      <div className="container services-offered lg:flex pb-24 gap-8">
        <aside className="w-full lg:w-3/12 mb-8 lg:mb-0">
          <div
            onClick={toggleAccordion}
            className="accordion-header cursor-pointer bg-[#f7265d] text-white px-4 py-[12px] text-l rounded-t-md flex justify-between items-center"
          >
            <span>{translations.services_offered}</span>
            <button className="rotate-180" ref={accordionButtonRef}>
              <DownArrow fill="white" width={16} height={16} />
            </button>
          </div>
          <div ref={accordionRef} className="accordion-body bg-[#feebf1]">
            {servicesOffered.map((item, index) => (
              <div className="py-2 px-4 flex justify-center gap-2" key={index}>
                <label htmlFor={item.title} className="text-color-neutral text-base">
                  {item.title}
                </label>
                <input
                  id={item.title}
                  type="checkbox"
                  checked={item.selected}
                  value={item.title}
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
                {translations.service_not_found_heading}
              </h1>
              <Image
                width={500}
                height={400}
                src="/assets/images/need-help-no-results.png"
                alt="banner-slider"
              />
              <p className="text-xl text-center text-[#68737d]">
                {translations.service_not_found}
              </p>
              <a
                href={`/${locale}/home`}
                className="py-[14px] px-5 bg-primary text-white rounded-md text-l mt-8 inline-block leading-[18px]"
              >
                {translations.redirect_homepage}
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

function CustomPagination({ currentPage, totalPages, setCurrentPage }: {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}) {

  let showStartEllipsis = false;
  let showEndEllipsis = false;
  const {width} = useWindowSize();

  if (totalPages < 2) {
    return null;
  }

  let totalPagesArr = Array.from(Array(totalPages).keys());

  if (totalPages > 9 && width > 992) {
    if (currentPage <= 5) {
      // Show the first 9 pages and the end ellipsis
      totalPagesArr = totalPagesArr.slice(0, 9);
      showEndEllipsis = true;
    } else if (currentPage + 4 >= totalPages) {
      // Show the last 9 pages and the start ellipsis
      totalPagesArr = totalPagesArr.slice(-9);
      showStartEllipsis = true;
    } else {
      // Show the current page in the middle with ellipses on both sides
      const start = currentPage - 5;
      const end = currentPage + 4;
      totalPagesArr = totalPagesArr.slice(start, end);
      showStartEllipsis = true;
      showEndEllipsis = true;
    }
  } else {
    if(totalPages > 3) {
      if (currentPage <= 2) {
        // Show the first 9 pages and the end ellipsis
        totalPagesArr = totalPagesArr.slice(0, 3);
        showEndEllipsis = true;
      } else if (currentPage + 2 >= totalPages) {
        // Show the last 9 pages and the start ellipsis
        totalPagesArr = totalPagesArr.slice(-3);
        showStartEllipsis = true;
      } else {
        // Show the current page in the middle with ellipses on both sides
        const start = currentPage - 2;
        const end = currentPage + 2;
        totalPagesArr = totalPagesArr.slice(start, end);
        showStartEllipsis = true;
        showEndEllipsis = true;
      }
    }
  }

  return (
    <div className="flex justify-between items-center gap-2 mt-8">
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        className={`${currentPage === 1 ? ' cursor-not-allowed border border-[#5a6872] text-[#5a6872]' : 'text-[#f7265d] border border-[#f7265d]'} flex  rounded-md text-m p-[13px] leading-[18px] gap-1 items-center`}
      >
        {<span className="rotate-180"><ArrowRight width={18} height={18} /></span>}
        <span className="pt-1">{width > 992 ? translations.previous : ''}</span>
      </button>

      <div className="flex overflow-x-auto justify-center w-full md:w-1/2">
        {showStartEllipsis && (<div className="border py-[6px] px-[12px] border-[#ddd] text-[#337ab7] rounded-l-md hover:bg-gray-200" >...</div>)}
        {
          totalPagesArr.map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page + 1)}
              className={`${currentPage === page + 1 ? 'bg-[#feebf1] text-[#f7265d] ' : ''} w-10 h-10 hover:bg-gray-200 rounded-full`}
            >
              {page + 1}
            </button>
          ))
        }
        {showEndEllipsis && (<div className="border py-[6px] px-[12px] border-[#ddd] text-[#337ab7] rounded-r-md hover:bg-gray-200" >...</div>)}
      </div>
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        className={`${currentPage === totalPages ? ' cursor-not-allowed border border-[#5a6872] text-[#5a6872]' : 'text-[#f7265d] border border-[#f7265d]'} flex  rounded-md text-m p-[13px] items-center leading-[18px] gap-1`}
      >
        <span className="pt-1">{width > 992 ? translations.next : ''}</span>
        {currentPage < totalPages && <ArrowRight width={18} height={18} />}
      </button>
    </div>
  )
}