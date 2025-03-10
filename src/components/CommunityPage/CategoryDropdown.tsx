import { useTranslations } from "@/src/contexts/TranslationsContext"
import { fetchCategoriesData } from "@/src/lib/apis"
import { useLocale } from "next-intl"
import { useEffect, useState } from "react"

const CategoryDropdown = ({ onChange }: any) => {
  const [categoriesArray, setCategories] = useState([])
  const locale = useLocale()
  const { translations } = useTranslations()

  // Handle the category selection change
  const handleChange = (event: any) => {
    onChange(event.target.value)
  }

  // Fetch categories when the component is mounted
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await fetchCategoriesData(locale)
      setCategories(data)
    }

    fetchCategories()
  }, [])

  return (
    <div className="category relative">
      <select
        className="py-3 ps-6 pe-9 text-m text-color-neutral border-2 rounded-[3rem] max-h-[3rem] appearance-none"
        onChange={handleChange}
        id="community-category"
      >
        <option value="">{translations?.[locale]?.choose_category}</option>
        {categoriesArray.map((category: any) => (
          <option key={category.tid} value={category.tid}>
            {category.name}
          </option>
        ))}
      </select>
      {/* Dropdown arrow icon */}
      <span className="dropdown-arrow absolute top-1/2 -translate-y-1/2 right-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="9"
          viewBox="0 0 14 9"
          fill="none"
        >
          <path
            d="M0.717557 2.99844L6.33588 8.61676C6.45801 8.7389 6.59033 8.82521 6.73282 8.87569C6.87532 8.92699 7.02799 8.95264 7.19084 8.95264C7.35369 8.95264 7.50636 8.92699 7.64885 8.87569C7.79135 8.82521 7.92366 8.7389 8.0458 8.61676L13.6641 2.99844C13.888 2.77452 14 2.48953 14 2.14348C14 1.79742 13.888 1.51243 13.6641 1.28852C13.4402 1.0646 13.1552 0.952637 12.8092 0.952637C12.4631 0.952637 12.1781 1.0646 11.9542 1.28852L7.19084 6.05187L2.42748 1.28851C2.20356 1.0646 1.91857 0.952637 1.57252 0.952637C1.22646 0.952637 0.941476 1.0646 0.717557 1.28851C0.493639 1.51243 0.381678 1.79742 0.381678 2.14348C0.381678 2.48953 0.493639 2.77452 0.717557 2.99844Z"
            fill="#5A6872"
          />
        </svg>
      </span>
    </div>
  )
}

export default CategoryDropdown
