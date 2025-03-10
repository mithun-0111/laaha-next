"use client"

import React, { useRef, useState } from "react"
import "slick-carousel/slick/slick.css"
import { NextIcon, PrevIcon } from "@/src/lib/icons"
import Image from "next/image"
import { laila } from "@/src/lib/utils"
import { useLocale } from "next-intl"
import { rtlLocales } from "@/site.config"
import Link from "next/link"
import Slider from "react-slick"
import { BannerShimmer } from "../Shimmer"

function NextArrow(props: {
  className?: string
  style?: React.CSSProperties
  onClick: () => void
}) {
  const { className, style, onClick } = props
  return (
    <button
      className={`${className} p-2 w-11 h-11 cursor-pointer`}
      style={{ ...style }}
      onClick={onClick}
      aria-label="Next slide" // Descriptive label for screen readers
    >
      <NextIcon />
    </button>
  )
}

function PrevArrow(props: {
  className?: string
  style?: React.CSSProperties
  onClick: () => void
}) {
  const { className, style, onClick } = props
  return (
    <button
      className={`${className} p-2 w-11 h-11 cursor-pointer`}
      style={{ ...style }}
      onClick={onClick}
      aria-label="Previous slide" // Descriptive label for screen readers
    >
      <PrevIcon />
    </button>
  )
}

interface BannerProps {
  title: string
  subtitle: string
  description: string
  image_uri: string
  bg_image_uri: string
  cta_uri: string
  cta_title: string
}

const HomePageBannerSlider = ({
  loading,
  homepageBannerData,
}: {
  loading: boolean
  homepageBannerData: BannerProps[]
}) => {
  const sliderRef = useRef<Slider>(null)
  const [bannerData] = useState(homepageBannerData)
  const locale = useLocale()

  const next = () => sliderRef.current?.slickNext()
  const previous = () => sliderRef.current?.slickPrev()

  const settings = {
    rtl: rtlLocales.includes(locale),
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    nextArrow: <div></div>, // Hide the default arrows since custom ones are used
    prevArrow: <div></div>, // Same for previous arrow
    accessibility: true, // Enable keyboard navigation
  }

  if (loading) {
    return <BannerShimmer />
  }

  return (
    <div className="banner-slider" role="region" aria-label="Banner Slider">
      <Slider ref={sliderRef} {...settings}>
        {bannerData.map((item, index) => (
          <div
            key={index}
            className="banner-slide"
            aria-labelledby={`banner-slide-title-${index}`}
            tabIndex={0}
          >
            <div className="pt-8 md:pt-20 pb-10 banner-background relative">
              <Image
                src={item.bg_image_uri}
                alt={`Banner background for slide ${index + 1}`} // Descriptive alt text
                layout="fill"
                objectFit="cover"
                objectPosition="center center"
                priority={index === 0}
                className="absolute top-0 left-0 z-0"
              />

              <div
                className={`container flex flex-col-reverse font-univers flex-wrap ${rtlLocales.includes(locale) ? "md:flex-row-reverse text-right" : "md:flex-row text-left"}`}
              >
                <div className="text-content w-full md:w-1/2 flex flex-col justify-between relative z-10">
                  <div>
                    <h2
                      id={`banner-slide-title-${index}`} // ID used for accessibility
                      className={`title font-bold text-3xl md:text-[48px] ${laila.className} leading-tight`}
                      dangerouslySetInnerHTML={{ __html: item.title }}
                    />
                    <h3
                      className={`subtitle font-semibold mb-4 text-xxl md:text-4xl ${laila.className} leading-[48px]`}
                    >
                      {item.subtitle}
                    </h3>
                    <p className="text-m md:text-xl leading-6 mt-8 font-univers">
                      {item.description}
                    </p>
                    {item.cta_uri && (
                      <Link
                        href={`/${locale}${item.cta_uri}`}
                        className="cta-button bg-primary hover:bg-red text-white px-[24px] py-[10px] rounded-full text-l mt-8 inline-block"
                        aria-label={`Go to ${item.cta_title}`} // Descriptive link text
                      >
                        {item.cta_title}
                      </Link>
                    )}
                  </div>
                  <div
                    className={`cta flex gap-4 py-6 ${rtlLocales.includes(locale) ? "md:flex-row-reverse justify-start" : ""}`}
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
                <div className="image-content w-full md:w-1/2 flex justify-end pb-8 relative z-10">
                  <Image
                    src={item.image_uri}
                    width={500}
                    height={400}
                    alt={`Image for banner slide ${index + 1}`} // Descriptive alt text
                    layout="responsive"
                    priority={index === 0}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default HomePageBannerSlider
