import dynamic from "next/dynamic"
import { Breadcrumbs } from "../Breadcrumb"
import Paragraph from "../Paragraph/Paragraph"

// Dynamically import components with loading placeholders
const PageViewCount = dynamic(() => import("../PageViewCount"), {
  ssr: false,
});

const Tags = dynamic(() => import("../Tags"), {
  loading: () => <p>Loading Tags...</p>,
  ssr: false,
});

const RecommendedPosts = dynamic(() => import("../RecommendedPost"), {
  loading: () => <p>Loading RecommendedPosts...</p>,
  ssr: false,

});

const PodcastComponent = ({ data }: any) => {
  const { title, layout_structure, field_content, field_tags } = data
  const nid = data.drupal_internal__nid
  const uid = data.uid.resourceIdObjMeta.drupal_internal__target_id

  const getFirstValidSubCategory = (subCategories: any) => {
    return subCategories.find(
      (subCategory: any) => subCategory && subCategory.field_category_short_name
    )
  }

  const firstValidSubCategory = getFirstValidSubCategory(
    data?.field_sub_category || []
  )

  const thumbnail_image = data.field_thumbnail_image.image_style_uri.thumbnail
  const subCategory = firstValidSubCategory.field_category_short_name
  const subCatUrl = firstValidSubCategory.path.alias
  const subCatThumbanail =
    firstValidSubCategory.field_sub_category_thumbnail.image_style_uri.thumbnail
  const category = firstValidSubCategory.parent["0"].field_category_short_name
  const categoryUrl = firstValidSubCategory.parent["0"].path.alias
  const categoryThumbnail =
    firstValidSubCategory.parent["0"].field_image.image_style_uri.thumbnail

  const podacst_data = {
    layout_structure,
    field_content,
  }
  return (
    <div className="podcast-page">
      <Breadcrumbs
        items={[
          { title: category, url: categoryUrl, icon: categoryThumbnail },
          { title: subCategory, url: subCatUrl, icon: subCatThumbanail },
          { title: title, url: "#", icon: thumbnail_image },
        ]}
      />
      <PageViewCount nid={nid} uid={uid} />
      <h1 className="mt-5 mb-8 max-w-3xl pe-4">{title}</h1>
      <Paragraph data={podacst_data} />
      <Tags tags={field_tags} />
      <RecommendedPosts nid={nid} />
    </div>
  )
}

export default PodcastComponent
