import { laila } from "@/src/lib/utils"
import { ExploreSpecialCards } from "@/src/components/Cards/ExploreSpecialCards"
import { translations } from "@/src/lib/translations"
import useWindowSize from "@/src/lib/useWindowSize"
import Slider from "react-slick"
import { useRef, useState } from "react"
import { rtlLocales } from "@/site.config"
import { useLocale } from "next-intl"
import { NextIcon, PrevIcon } from "@/src/lib/icons"
import { useTranslations } from "@/src/contexts/TranslationsContext"

interface ExploreSpecialProps {
  title: string
  description: string
  image_uri: string
  url: string
  text: string
}

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

export default function ExploreSpecialTopics({
  exploreSpecialDataStructured,
}: {
  exploreSpecialDataStructured: ExploreSpecialProps[]
}) {
  const { width } = useWindowSize()
  const sliderRef = useRef<Slider>(null)
  const next = () => {
    sliderRef.current?.slickNext()
  }
  const previous = () => {
    sliderRef.current?.slickPrev()
  }
  const locale = useLocale()
  const { translations } = useTranslations()
  let [rtlLang, setRtlLang] = useState(rtlLocales.includes(locale as string))

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    nextArrow: <div></div>,
    prevArrow: <div></div>,
    rtl: rtlLocales.includes(locale) ? true : false,
  }

  return (
    <div className="container explore-special flex flex-col gap-10 mb-20">
      <h1 className={`${laila.className} font-semibold text-2xl`}>
        {translations?.[locale]?.explore_special_topics_title}
      </h1>
      {width > 767 ? (
        <div className={`gap-10 flex`}>
          {exploreSpecialDataStructured?.map(
            (data: ExploreSpecialProps, index: number) => {
              return (
                <ExploreSpecialCards
                  key={index}
                  title={data.title}
                  description={data.description}
                  image={data.image_uri}
                  url={data.url}
                  text={data.text}
                />
              )
            }
          )}
        </div>
      ) : (
        <>
          <Slider ref={sliderRef} {...settings}>
            {exploreSpecialDataStructured?.map(
              (data: ExploreSpecialProps, index: number) => {
                return (
                  <ExploreSpecialCards
                    key={index}
                    title={data.title}
                    description={data.description}
                    image={data.image_uri}
                    url={data.url}
                    text={data.text}
                  />
                )
              }
            )}
          </Slider>
          <div
            className={`w-full gap-3 flex ${rtlLang ? "flex-row justify-end" : "flex-row justify-end"}`}
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
        </>
      )}
    </div>
  )
}
