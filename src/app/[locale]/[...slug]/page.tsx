"use client"
export const runtime = "edge"

import { useQuery } from "@tanstack/react-query" // Import React Query
import { drupal } from "@/src/lib/drupal"
import { getParams } from "@/src/lib/getparams"
import { defaultLocale } from "@/site.config"
import NotFound from "@/src/components/NotFound"
import { Breadcrumbs } from "@/src/components/Breadcrumb"
import { BasicPageShimmer } from "@/src/components/Shimmer"
import dynamic from 'next/dynamic'

// Function to fetch node data based on the slug and locale
async function fetchNodeData(slug: string[], locale: string) {
  const path = `/${locale}/${slug.join("/")}`

  try {
    const pathInfo = await drupal.translatePath(path)
    const contentType = pathInfo?.jsonapi?.resourceName

    if (!contentType) {
      throw new Error("Content type could not be determined.")
    }

    // Fetch the resource data for the given path
    const node = await drupal.getResourceByPath(path, {
      locale,
      defaultLocale,
      params: getParams(contentType),
    })

    return { node, contentType }
  } catch (error) {
    throw new Error("Failed to fetch node data.")
  }
}

// Dynamic imports for components
const ScormComponent = dynamic(() => import('@/src/components/Scorm/ScormComponent'), {
  loading: () => <></>,
})

const VideoComponent = dynamic(() => import('@/src/components/Video/VideoComponent'), {
  loading: () => <></>,
})

const PodcastComponent = dynamic(() => import('@/src/components/Podcast/PodcastComponent'), {
  loading: () => <></>,
})

const BasicPage = dynamic(() => import('@/src/components/BasicPage/BasicPage'), {
  loading: () => <></>,
})

const TaxonomyPage = dynamic(() => import('@/src/components/TaxonomyPage'), {
  loading: () => <BasicPageShimmer />,
})

// Map of content types to corresponding components
const contentTypeMapping: Record<string, React.ComponentType<any>> = {
  "node--scorm": ScormComponent,
  "node--video": VideoComponent,
  "node--podcast": PodcastComponent,
  "node--page": BasicPage,
}

type NodePageParams = {
  locale: string
  slug: string[]
}

type NodePageProps = {
  params: NodePageParams
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function NodePage({ params: { locale, slug } }: NodePageProps) {
  // Use React Query to fetch and cache node data
  const {
    data: nodeData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["nodeData", locale, slug], // Unique key for caching
    queryFn: () => fetchNodeData(slug, locale), // Fetch function
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    retry: 2, // Retry failed requests twice
  })

  const { node, contentType } = nodeData || { node: null, contentType: null }

  if (isLoading) {
    return <BasicPageShimmer /> // Show loading skeleton while fetching data
  }

  if (isError) {
    return <div className="container"> Error: {error.message} </div> // Display error message if fetching fails
  }

  if (contentType === "taxonomy_term--categories") {
    return <TaxonomyPage node={node} /> // Render taxonomy page if content type is category
  }

  // Select the component based on content type or fallback to BasicPage
  const ContentComponent =
    contentTypeMapping[contentType || "node--page"] || BasicPage

  return (
    <>
      {contentType === "node--page" && (
        <Breadcrumbs items={[{ title: node?.title }]} /> // Show breadcrumbs for page nodes
      )}
      <div className="container">
        {/* Render dynamic content */}
        {node ? <ContentComponent data={node} /> : <NotFound />}
      </div>
    </>
  )
}
