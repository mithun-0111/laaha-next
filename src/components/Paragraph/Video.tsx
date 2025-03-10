import { absoluteUrl } from "@/src/lib/utils"

const Video = ({ data }: any) => {
  const videoUrl =
    data?.field_video_file?.uri?.url || data?.field_media_video_file?.uri?.url

  return (
    <>
      {videoUrl && (
        <video
          className="mb-8 w-full"
          src={absoluteUrl(videoUrl)}
          controls
          autoPlay
          muted
        />
      )}
    </>
  )
}

export default Video
