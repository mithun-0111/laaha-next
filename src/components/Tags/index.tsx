import { useTranslations } from "@/src/contexts/TranslationsContext"
import { useLocale } from "next-intl"

const Tags = ({ tags }: any) => {
  const locale = useLocale()
  const { translations } = useTranslations()

  return (
    <>
      <div className="tags pb-8 border-b border-shadow-dark-gray mb-8">
        {translations?.[locale]?.tags}
        {tags.map((item: any, index: number) => (
          <span className="underline" key={index}>
            {item.name}
            {index + 1 != tags.length ? ", " : ""}
          </span>
        ))}
      </div>
    </>
  )
}

export default Tags
