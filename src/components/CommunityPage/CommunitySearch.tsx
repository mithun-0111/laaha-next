import { useTranslations } from "@/src/contexts/TranslationsContext"
import { SearchIcon } from "@/src/lib/icons"
import { useLocale } from "next-intl"

const Search = ({ handleInputChange }: any) => {
  const locale = useLocale()
  const { translations } = useTranslations()

  return (
    <div className="search-bar max-w-full relative mb-6 flex-[0_0_100%] lg:flex-1 lg:mb-0 lg:max-w-[32rem]">
      {/* Search input field */}
      <input
        type="text"
        className="w-full rounded-[3rem] border-2 border-primary bg-white text-sm py-3 ps-10 pe-3 min-h-12"
        onChange={(e) => handleInputChange(e)}
        placeholder={translations?.[locale]?.community_search_placeholder}
      />
      {/* Search icon */}
      <span className="search-icon absolute top-0 left-3 translate-y-1/2">
        <SearchIcon fill={"#f7265d"} /> {/* Icon with specified fill color */}
      </span>
    </div>
  )
}

export default Search
