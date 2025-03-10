"use client"
import useWindowSize from "@/src/hooks/useWindowSize"
import { laila } from "@/src/lib/utils"
import { useLocale } from "next-intl"
import Image from "next/image"
import Link from "next/link"

interface Props {
  title: string
  description: string
  className?: string
  url: string
  image: string
  text: string
}

export const ExploreSpecialCards = ({
  title,
  description,
  image,
  url,
  text,
  className,
}: Props) => {
  let windowSize = useWindowSize() // Custom hook for window size
  let locale = useLocale() // Get the current locale

  return (
    <div
      className={`explore-special-card w-full p-6 ${className} rounded-xl min-h-max md:min-h-[450px] flex flex-col justify-between`}
    >
      <div className="text-wrapper">
        {/* Title of the card */}
        <h1 className={`mb-3 ${laila.className} text-xxl font-semibold`}>
          {title}
        </h1>
        {/* Description of the card */}
        <p className={`text-l`}>{description}</p>
      </div>
      <div className="cta-wrapper flex flex-col md:flex-row-reverse mt-6">
        {/* Image section with responsive size */}
        <div className="img-wrapper w-full md:w-1/2 overflow-hidden mb-6 md:mb-0">
          <Image
            width={windowSize[0] < 768 ? 160 : 500} // Adjust image size based on screen width
            height={windowSize[1] < 768 ? 160 : 500} 
            src={image}
            alt={"image"}
          />
        </div>
        <div className="w-full md:w-1/2 flex-end items-end relative">
          {/* Call to action button (only if URL is provided) */}
          {url && (
            <Link
              href={"/" + locale + url}
              className={
                "bg-primary text-white rounded-lg px-5 py-3 md:absolute bottom-0 hover:bg-red"
              }
            >
              {text}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
