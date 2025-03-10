import { laila } from "@/src/lib/utils"
import Image from "next/image"

const IconCard = ({ IconCardData }: any) => {
  return (
    <>
      {IconCardData.map((item: any, index: number) => (
        <div
          key={index}
          className="icon-card p-6 rounded-xl lg:max-w-[calc(50%-0.75rem)]"
        >
          <Image
            src={item.field_icon.field_media_image.image_style_uri.thumbnail}
            alt=""
            width={58}
            height={58}
            className="mb-8 mx-auto"
          />
          <div
            className={`${laila.className} text-xl mb-2 font-medium text-center`}
          >
            {item.field_title}
          </div>
          <div className="text-color-neutral text-center">
            {item.field_card_description}
          </div>
        </div>
      ))}
    </>
  )
}

export default IconCard
