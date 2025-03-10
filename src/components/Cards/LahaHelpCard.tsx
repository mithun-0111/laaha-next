import { laila } from "@/src/lib/utils"
import Image from "next/image"

interface Props {
  title: string
  description: string
  image: string
  className?: string
}

const LahaHelpCard = ({ title, description, image }: Props) => {
  return (
    <div className="flex flex-col gap-6 bg-white rounded-xl w-full md:w-1/3 items-center py-10 px-8">
      {/* Display image */}
      <Image
        src={image}
        width={100}
        height={100}
        alt="discover"
        className="max-w-20"
      />

      <div>
        {/* Title of the card */}
        <h2
          className={`text-xxl ${laila.className} font-semibold text-center pb-[18px] text-[#2f3941]`}
        >
          {title}
        </h2>

        {/* Description of the card */}
        <p className="text-center font-univers text-l text-[#5a6872] leading-[22px]">
          {description}
        </p>
      </div>
    </div>
  )
}

export default LahaHelpCard
