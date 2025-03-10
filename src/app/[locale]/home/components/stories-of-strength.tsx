"use client"

import Image from "next/image"
import { absoluteUrl, laila } from "@/src/lib/utils"
import dynamic from "next/dynamic";

// Dynamically import StoriesShimmer
const StoriesShimmer = dynamic(() => import("@/src/components/Shimmer").then((mod) => mod.StoriesShimmer));

interface Story {
  description: string
  by: string
  icon: string
}

export default function StoriesOfStrength({
  title,
  desc,
  stories,
  loading
}: {
  title: string
  desc: string
  stories: Story[]
  loading: boolean
}) {
  if(loading) {
    return <StoriesShimmer />
  }
  return (
    <div
      className={`container stories-strength-support flex flex-wrap md:flex-nowrap py-10 mb-20`}
    >
      <div className={`left-content w-full md:w-[35%]`}>
        <h2
          className={`${laila.className} text-[28px] font-semibold pb-[18px] text-[#363e44] leading-9 m-0`}
        >
          {title}
        </h2>
        <p className={`text-[#5a6872] font-univers text-l`}>{desc}</p>
      </div>

      <div
        className={`right-content columns-2 w-full md:w-[65%] gap-4 md:gap-8 grid-flow-col`}
      >
        {stories?.map((item, index) => (
          <div
            key={index}
            className="card p-[28px] rounded-xl bg-white inline-block mt-4"
          >
            <div
              className="description"
              dangerouslySetInnerHTML={{ __html: item.description }}
            ></div>
            <div className="profile-details">
              <div className="profile-image flex items-center mt-6">
                <Image
                  src={absoluteUrl("/" + item.icon)}
                  width={32}
                  height={32}
                  alt="profile-image"
                />
                <div className="details ml-2">
                  <div className="user-age-location text-sm">{item.by}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
