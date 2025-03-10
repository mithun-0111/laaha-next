"use client"

import React, { useEffect, useRef, useState } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import CarouselCard from "@/src/components/Cards/CarouselCard"
import {
  absoluteUrl,
  getCountryCode,
  getLangCode,
  getLocaleValue,
  laila,
} from "@/src/lib/utils"
import { NextIcon, PrevIcon } from "@/src/lib/icons"
import { useLocale } from "next-intl"
import { rtlLocales } from "@/site.config"
import useWindowSize from "@/src/lib/useWindowSize"

function NextArrow(props: {
  className?: string
  style?: React.CSSProperties
  onClick: () => void
}) {
  const { className, style, onClick } = props
  return (
    <div
      className={`${className}  p-2 w-11 h-11 cursor-pointer`}
      style={{ ...style }}
      onClick={onClick}
    >
      <NextIcon />
    </div>
  )
}

function PrevArrow(props: {
  className?: string
  style?: React.CSSProperties
  onClick: () => void
}) {
  const { className, style, onClick } = props
  return (
    <div
      className={`${className}  p-2 w-11 h-11 cursor-pointer`}
      style={{ ...style }}
      onClick={onClick}
    >
      <PrevIcon />
    </div>
  )
}

interface LearningPathProps {
  name: string
  description: string
  image_uri: string
  topics: number
  resource: string | number
  cta: {
    url: string
  }
}

const HomepageLearningPathSlider = () => {
  let locale = useLocale()
  const sliderRef = useRef<Slider>(null)
  let localeValue = getLocaleValue()
  let langCode = getLangCode()
  let countryCode = getCountryCode()
  let [title, setTitle] = useState("")
  let [rtlLang, setRtlLang] = useState(rtlLocales.includes(locale as string))
  let [data, setData] = useState<LearningPathProps[] | null>(null)
  const next = () => {
    sliderRef.current?.slickNext()
  }
  const previous = () => {
    sliderRef.current?.slickPrev()
  }
  const { width } = useWindowSize()

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    nextArrow: <div></div>,
    prevArrow: <div></div>,
    rtl: rtlLocales.includes(locale) ? true : false,
  }

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/${locale}/api/v1/home_dynamic`,
      {
        headers: {
          "country-code": countryCode || "US",
          "lang-code": langCode || "en",
          locale: localeValue || "en",
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setTitle(res?.data["categories-block"]["block_title"])
        setData(res?.data["categories-block"]["category"])
      })

    setRtlLang(rtlLocales.includes(locale))
  }, [locale])

  return (
    <div className="slider-container container relative mb-20">
      <div className={`${laila.className} text-xxxl font-semibold mb-8 flex`}>
        <h1 className={"w-full md:w-1/2 text-2xl"}>{title}</h1>
        <div
          className={`w-1/2 gap-3 hidden md:flex ${rtlLang ? "flex-row justify-end" : "flex-row justify-end"}`}
        >
          <PrevArrow
            className="prev-arrow bg-primary rounded-full"
            onClick={previous}
          />
          <NextArrow
            className="next-arrow bg-primary rounded-full"
            onClick={next}
          />
        </div>
      </div>
      {width > 767 ? (
        <div className="learning-path-slider hidden md:block">
          <Slider ref={sliderRef} {...settings}>
            {data?.map((item, index) => {
              return (
                <CarouselCard
                  key={index}
                  className={` mr-6 rounded-xl`}
                  item={{
                    name: item.name,
                    description: item.description,
                    topics: item.topics,
                    resource: item.resource,
                    cta: {
                      url: item.cta.url,
                    },
                    image_uri: absoluteUrl("/" + item.image_uri),
                  }}
                />
              )
            })}
          </Slider>
        </div>
      ) : (
        <div className="learning-path-mobile">
          {data?.map((item, index) => {
            return (
              <CarouselCard
                key={index}
                className={`mb-6 rounded-xl block`}
                item={{
                  name: item.name,
                  description: item.description,
                  topics: item.topics,
                  resource: item.resource,
                  cta: {
                    url: item.cta.url,
                  },
                  image_uri: absoluteUrl("/" + item.image_uri),
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default HomepageLearningPathSlider
