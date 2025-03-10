import dynamic from "next/dynamic";
import { Breadcrumbs } from "../Breadcrumb";

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

const ScormComponent = ({ data }: any) => {
  const nid = data.drupal_internal__nid;
  const uid = data.uid.resourceIdObjMeta.drupal_internal__target_id;
  const { title, field_tags } = data;
  const thumbnail_image = data.field_thumbnail_image.image_style_uri.thumbnail;

  const getFirstValidSubCategory = (subCategories: any) => {
    return subCategories.find(
      (subCategory: any) => subCategory && subCategory.field_category_short_name
    );
  };

  const firstValidSubCategory = getFirstValidSubCategory(
    data?.field_sub_category || []
  );

  const subCategory = firstValidSubCategory?.field_category_short_name || "";
  const subCatUrl = firstValidSubCategory?.path?.alias || "";
  const subCatThumbanail =
    firstValidSubCategory?.field_sub_category_thumbnail?.image_style_uri?.thumbnail || "";
  const category = firstValidSubCategory?.parent?.[0]?.field_category_short_name || "";
  const categoryUrl = firstValidSubCategory?.parent?.[0]?.path?.alias || "";
  const categoryThumbnail =
    firstValidSubCategory?.parent?.[0]?.field_image?.image_style_uri?.thumbnail || "";

  return (
    <div className="scorm-page">
      <Breadcrumbs
        items={[
          { title: category, url: categoryUrl, icon: categoryThumbnail },
          { title: subCategory, url: subCatUrl, icon: subCatThumbanail },
          { title: title, url: "#", icon: thumbnail_image },
        ]}
      />

      <PageViewCount nid={nid} uid={uid} />
      <h1 className="mt-5 mb-8 max-w-3xl pe-4">{title}</h1>
      <iframe
        width="100%"
        height="100%"
        className="mb-8 min-h-[40rem] lg:min-h-[50rem]"
        title={title}
        src={process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + "/scorm-player/" + nid}
      />
      <Tags tags={field_tags} />
      <RecommendedPosts nid={nid} />
    </div>
  );
};

export default ScormComponent;