import { absoluteUrl } from "@/src/lib/utils"
import Image from "next/image"

const ImageComponent = (data: any) => {
  const ImageURL = absoluteUrl(
    data.field_single_image?.field_media_image?.uri.url
  )
  const altValue = data.field_single_image?.name
  return (
    <Image
      className="my-4"
      src={ImageURL}
      loading="lazy"
      alt={altValue}
      width={500}
      height={300}
    />
  )
}

export default ImageComponent
