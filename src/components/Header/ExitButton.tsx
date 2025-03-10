import { useTranslations } from "@/src/contexts/TranslationsContext"
import { useLocale } from "next-intl"

const handleExit = () => {
  window.location.href = "https://www.google.com"
}

const ExitButton = () => {
  const { translations } = useTranslations()
  const locale = useLocale()

  return (
    <button
      className="py-3 px-5 text-white font-bold btn-secondary rounded"
      onClick={handleExit}
      type="button"
      aria-label={
        translations?.[locale]?.exit_website || "Exit and go to Google"
      }
    >
      <span>{translations?.[locale]?.exit_website || "EXIT WEBSITE"}</span>
    </button>
  )
}

export default ExitButton
