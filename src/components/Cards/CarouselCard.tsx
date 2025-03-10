import { laila } from "@/src/lib/utils"
import { ArrowRight } from "@/src/lib/icons"
import Image from "next/image"
import { rtlLocales } from "@/site.config"
import { useLocale } from "next-intl"
import { useTranslations } from "@/src/contexts/TranslationsContext"

interface Props {
  key?: string | number
  className?: string
  item: {
    name: string
    description: string
    topics: number
    resource: number | string
    cta: {
      url: string
    }
    image_uri: string
  }
}

const CarouselCard = ({ key, item, className }: Props) => {
  const locale = useLocale()
  const { translations } = useTranslations()

  return (
    <div
      className={`carousel-card-wrapper text-center p-7 ${className}`}
      key={key || item.name}
      // Set text direction based on locale (right-to-left or left-to-right)
      dir={rtlLocales.includes(locale) ? "rtl" : "ltr"}
    >
      <div className="text-left md:text-center flex gap-4 flex-nowrap md:flex-wrap ">
        {/* Image section */}
        <div className="image-wrapper inline-block w-[30%] md:w-full">
          <Image
            loading="lazy"
            width={180}
            height={180}
            className="m-auto"
            src={item.image_uri}
            alt={item.name}
          />
        </div>
        <div className="categories-content w-[70%] md:w-full">
          {/* Title with a link */}
          {item?.name && (
            <a href={item.cta.url}>
              <h2
                className={`${laila.className} name text-xxl font-semibold md:my-4 my-0 leading-7 pb-4`}
              >
                {item.name}
              </h2>
            </a>
          )}
          {/* Description */}
          {item?.description && (
            <p className="description univers text-light-gray mb-6 text-l leading-6">
              {item.description}
            </p>
          )}
          {/* Topics and resources count */}
          <div className="counts text-m text-light-gray">
            <span>
              {item.topics}
              {item.topics == 1
                ? ` ${translations?.[locale]?.topic}`
                : ` ${translations?.[locale]?.topics}`}
            </span>
            {" | "}
            <span>
              {item.resource}
              {item.resource == 1
                ? ` ${translations?.[locale]?.resource}`
                : ` ${translations?.[locale]?.resources}`}
            </span>
          </div>
          {/* Call to action button */}
          <a
            href={item.cta.url}
            className="cta__explore mt-4 text-primary inline-block "
          >
            <div className="flex gap-2">
              {translations?.[locale]?.explore_now}
              {/* Arrow icon */}
              <span className="text-sm top-[3px] relative">
                <ArrowRight width={16} height={16} />
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default CarouselCard
