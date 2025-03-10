import dynamic from "next/dynamic"

const CategoryPage = dynamic(() => import("../CategoryPage"))
const SubCategoryPage = dynamic(() => import("../SubcategoryPage"))

const TaxonomyPage = ({ node }: any) => {
  let catName = node.field_category_short_name
  let catIcon = node?.field_icon?.image_style_uri?.thumbnail
  let catUrl = node?.path?.alias
  const subCatName = node.field_category_short_name
  const subCatIcon =
    node.field_sub_category_thumbnail?.image_style_uri?.thumbnail
  let breadcrumb = []

  breadcrumb = [
    {
      title: catName,
      icon: catIcon,
    },
  ]

  if (node.field_sub_category) {
    catName = node?.parent["0"]?.field_category_short_name
    catIcon = node?.parent["0"]?.field_icon?.image_style_uri?.thumbnail
    catUrl = node?.parent["0"]?.path?.alias

    breadcrumb = [
      {
        title: catName,
        url: catUrl,
        icon: catIcon,
      },
      {
        title: subCatName,
        icon: subCatIcon,
      },
    ]

    return (
      <SubCategoryPage
        tid={node.drupal_internal__tid}
        breadcrumb={breadcrumb}
      />
    )
  }

  return (
    <div>
      <CategoryPage tid={node.drupal_internal__tid} breadcrumb={breadcrumb} />
    </div>
  )
}

export default TaxonomyPage
