import ExternalVideo from "./ExternalVideo"
import Video from "./Video"
import { laila } from "@/src/lib/utils"

const TextWithVideo = (data: any) => {
  const tempData = {
    field_external_video: data.field_video?.field_media_oembed_video,
  }
  return (
    <>
      {data && (
        <>
          <div className={`${laila.className} text-2xl mb-4 font-semibold`}>
            {data.field_heading}
          </div>
          {}
          <ExternalVideo {...tempData} />
        </>
      )}
    </>
  )
}

export default TextWithVideo
