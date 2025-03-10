import { absoluteUrl, laila } from "@/src/lib/utils";
import { Module, Podcast, Video } from "@/src/lib/icons";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "@/src/contexts/TranslationsContext";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

// Define types for the category and child terms
type ChildTerm = {
  tid: string;
};

type CategoryData = {
  tid: string;
  child_terms: Record<string, ChildTerm>;
};

type Category = Record<string, CategoryData>;

// Define props for the GridCard component
type GridProps = {
  className?: string;
  item: {
    title: string;
    url: string;
    type: string;
    field_sub_category: string;
    field_thumbnail_image: string;
  };
  category: Category;
};

const GridCard = ({ className, item, category }: GridProps) => {
  const { translations } = useTranslations(); // Get translations
  const locale = useLocale(); // Get the current locale
  const [categoryList, setCategoryList] = useState<string[]>([]);

  // Function to find matching categories
  const findMatchingCategories = (data: Category, subcategory: string[]): string[] => {
    const result: string[] = [];

    // Iterate through each category
    for (const [categoryName, categoryData] of Object.entries(data)) {
      // Check if the main category tid matches any subcategory
      if (subcategory.includes(categoryData.tid)) {
        result.push(categoryName);
      } else {
        // Check if any child term tid matches any subcategory
        for (const childTerm of Object.values(categoryData.child_terms)) {
          if (subcategory.includes(childTerm.tid)) {
            result.push(categoryName);
            break; // Exit the loop once a match is found
          }
        }
      }
    }

    return result;
  };

  // Curate categories based on subcategory
  const curateCategory = () => {
    if (item.field_sub_category) {
      const subcategoryList = String(item.field_sub_category).split(",");
      const categoryArray = findMatchingCategories(category, subcategoryList);
      setCategoryList(categoryArray);
    }
  };

  useEffect(() => {
    curateCategory();
  }, [item.field_sub_category, category]);

  return (
    <div className={`bg-gray-100 grid-card ${className}`}>
      <div className="relative">
        {/* Card type icon and label */}
        <div className="absolute top-4 left-4 bg-default-black bg-opacity-60 py-1 px-2 rounded-full flex items-center shadow">
          <span className="icon w-3 h-3">
            {/* Display different icons based on item type */}
            {item.type === "scorm" ? (
              <Module />
            ) : item.type === "video" ? (
              <Video />
            ) : (
              <Podcast />
            )}
          </span>
          <span className="ms-1 text-white text-sm">
            {/* Display label based on item type */}
            {item.type.toLowerCase() === "scorm"
              ? `${translations?.[locale]?.module}`
              : item.type.toLowerCase() === "video"
              ? `${translations?.[locale]?.video}`
              : `${translations?.[locale]?.podcast}`}
          </span>
        </div>

        {/* Thumbnail image */}
        {item.field_thumbnail_image.length > 0 && (
          <Image
            src={absoluteUrl("/" + item.field_thumbnail_image)}
            alt={""}
            width={280}
            height={140}
            className="w-full rounded-t-lg"
          />
        )}
      </div>

      {/* Card content */}
      <div className="p-4">
        {/* Title with link */}
        <div
          className={`text-lg text-gray-950 mb-3 font-semibold transition-colors duration-200 hover:text-primary ${laila.className}`}
        >
          <Link href={item.url}>
            <span>{item.title}</span>
          </Link>
        </div>

        {/* Display sub-categories as tags */}
        <div className="inline-flex flex-wrap gap-2">
          {categoryList.map((chip, index) => (
            <span
              key={index}
              className={`bg-color-secondary text-sm text-primary px-2 py-1 rounded-md ${laila.className}`}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GridCard;