"use client"

import React, { useEffect, useState } from "react"
import ReactPlayer from "react-player"

const ExternalVideo = (data: any) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div className="external-video mb-8">
      <ReactPlayer url={data.field_external_video} controls />
    </div>
  )
}

export default ExternalVideo
