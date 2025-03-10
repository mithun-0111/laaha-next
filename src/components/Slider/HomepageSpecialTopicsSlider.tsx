"use client"
// Note: Not Gettig used currently.
import React, { useEffect, useRef } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import CarouselCard from "@/src/components/Cards/CarouselCard"
import { laila } from "@/src/lib/utils"
import { NextIcon, PrevIcon } from "@/src/lib/icons"
import { ExploreSpecialCards } from "../Cards/ExploreSpecialCards"
import { rtlLocales } from "@/site.config"
import { useLocale } from "next-intl"

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

const HomepageSpecialTopicsSlider = ({ title = "Explore special topics " }) => {
  let sliderRef = useRef<Slider>(null)

  const next = () => {
    sliderRef.current?.slickNext()
  }
  const previous = () => {
    sliderRef.current?.slickPrev()
  }
  const locale = useLocale()

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // autoplay: true,
    nextArrow: <div></div>,
    prevArrow: <div></div>,
    rtl: rtlLocales.includes(locale),
  }

  return (
    <div className="slider-container relative">
      <Slider ref={sliderRef} {...settings}>
        <ExploreSpecialCards
          className="bg-yellow-200"
          title="All about technology"
          url=""
          text=""
          description="Learn about the internet, smartphones, and how to use them safely and responsibly."
          image={
            "https://laaha.org/sites/default/files/styles/scale_344w/public/2024-07/m_26%20illustration_01.png?itok=fu1U3r61"
          }
        />
        <ExploreSpecialCards
          className="bg-yellow-200"
          title="All about technology"
          url=""
          text=""
          description="Learn about the internet, smartphones, and how to use them safely and responsibly."
          image={
            "https://laaha.org/sites/default/files/styles/scale_344w/public/2024-07/m_26%20illustration_01.png?itok=fu1U3r61"
          }
        />
      </Slider>
      <div className="w-full flex justify-end gap-3 mt-8">
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
  )
}

export default HomepageSpecialTopicsSlider
