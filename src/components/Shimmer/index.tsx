import "./../../styles/shimmer.scss"

export const ListingShimmer = () => (
  <div className="shimmer-wrapper flex flex-col gap-3 container">
    <div className="shimmer-item"></div>
    <div className="content-items flex gap-4 flex-wrap my-10">
      <div className="shimmer-item lg:max-w-[calc(25%-1rem)]"></div>
      <div className="shimmer-item lg:max-w-[calc(25%-1rem)]"></div>
      <div className="shimmer-item lg:max-w-[calc(25%-1rem)]"></div>
      <div className="shimmer-item lg:max-w-[calc(25%-1rem)]"></div>
    </div>
  </div>
)

export const ResourceListingShimmer = () => {
  return (
    <div className="shimmer-wrapper flex flex-col gap-3 container">
      <div className="shimmer-item"></div>
      <div className="content flex gap-4 flex-wrap mt-10">
        <div className="sidebar w-full lg:max-w-[calc(25%-1rem)]">
          <div className="shimmer-item"></div>
        </div>
        <div className="content-items w-full flex gap-4 lg:max-w-[calc(75%-1rem)] flex-wrap mb-10">
          <div className="shimmer-item lg:max-w-[calc(25%-1rem)]"></div>
          <div className="shimmer-item lg:max-w-[calc(25%-1rem)]"></div>
          <div className="shimmer-item lg:max-w-[calc(25%-1rem)]"></div>
          <div className="shimmer-item lg:max-w-[calc(25%-1rem)]"></div>
        </div>
      </div>
    </div>
  )
}

export const ListingShimmer3col = () => {
  return (
    <div className="shimmer-wrapper flex flex-col gap-3 container">
      <div className="content-items w-full flex gap-4 flex-wrap mb-10">
        <div className="shimmer-item lg:max-w-[calc(33.33%-1rem)]"></div>
        <div className="shimmer-item lg:max-w-[calc(33.33%-1rem)]"></div>
        <div className="shimmer-item lg:max-w-[calc(33.33%-1rem)]"></div>
      </div>
    </div>
  )
}

export const ViewCountShimmer = () => {
  return (
    <div className="shimmer-wrapper flex flex-col gap-3 container">
      <div className="shimmer-effect bg-white overflow-hidden relative h-6 max-w-24"></div>
    </div>
  )
}

export const BasicPageShimmer = () => {
  return (
    <div className="shimmer-wrapper flex flex-col gap-3 container">
      <div className="shimmer-item"></div>
      <div className="shimmer-item"></div>
      <div className="shimmer-item"></div>
    </div>
  )
}


export const BasicShimmer = () => {
  return (
    <div className="shimmer-wrapper flex flex-col gap-3 container">
      <div className="shimmer-item"></div>
    </div>
  )
}

export const MenuItemsShimmer = () => {
  return (
    <div className="shimmer-wrapper flex flex-col gap-3 container max-w-full">
      <div className="shimmer-item"></div>
    </div>
  )
}

export const BannerShimmer = () => {
  return (
    <div className="shimmer-wrapper flex flex-col gap-3 container">
      <div className="shimmer-item lg:my-20 lg:!h-[600px] block"></div>
    </div>
  )
}

export const StoriesShimmer = () => {
  return (
    <div className="shimmer-wrapper flex flex-row flex-wrap gap-3 container">
      <div className="left-content w-full md:w-[35%]">
        <div className="shimmer-item"></div>
      </div>
      <div className="right-content columns-2 w-full md:w-[65%] gap-4 md:gap-8 grid-flow-col">
        <div className="shimmer-item p-[28px] rounded-xl bg-white inline-block mt-4"></div>
        <div className="shimmer-item p-[28px] rounded-xl bg-white inline-block mt-4"></div>
        <div className="shimmer-item p-[28px] rounded-xl bg-white inline-block mt-4"></div>
        <div className="shimmer-item p-[28px] rounded-xl bg-white inline-block mt-4"></div>
      </div>
    </div>
  )
}

export const HowCanLaahaHelpYouShimmer = () => {
  return (
    <div className="shimmer-wrapper flex flex-row flex-wrap gap-3 container">
      <div className="flex gap-[30px] flex-wrap md:flex-nowrap">
        <div className="flex flex-col gap-6 bg-white rounded-xl w-full md:w-1/3 items-center py-10 px-8">
          <div className="shimmer-item"></div>
        </div>
        <div className="flex flex-col gap-6 bg-white rounded-xl w-full md:w-1/3 items-center py-10 px-8">
          <div className="shimmer-item"></div>
        </div>
        <div className="flex flex-col gap-6 bg-white rounded-xl w-full md:w-1/3 items-center py-10 px-8">
          <div className="shimmer-item"></div>
        </div>
      </div>
    </div>
  )
}