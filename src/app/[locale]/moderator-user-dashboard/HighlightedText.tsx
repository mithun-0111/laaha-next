import { useTranslations } from "@/src/contexts/TranslationsContext"
import { highlightAndCountSensitiveWords } from "@/src/lib/utils"
import { useLocale } from "next-intl"

export const HighlightedText = ({
  text,
  sensitiveWords,
}: {
  text: string
  sensitiveWords: string[]
}) => {
  const { translations } = useTranslations()
  const locale = useLocale()

  const { highlightedText, wordCounts } = highlightAndCountSensitiveWords(
    text,
    sensitiveWords
  )

  let totalCount: any = Object.values(wordCounts).reduce(
    (total: any, count) => total + count,
    0
  )

  return (
    <div>
      {Object.keys(wordCounts).length > 0 && (
        <span className="block text-l mb-4">
          {totalCount} {translations?.[locale]?.sensitive_words}
        </span>
      )}
      <div
        className="font-semibold text-l"
        dangerouslySetInnerHTML={{ __html: highlightedText }}
      />
    </div>
  )
}
