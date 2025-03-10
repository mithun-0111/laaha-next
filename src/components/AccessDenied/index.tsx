import { Breadcrumbs } from "../Breadcrumb"
import { useTranslations } from "@/src/contexts/TranslationsContext"
import { useLocale } from "next-intl"

const AccessDenied = () => {
  // Using the translations context to fetch translations
  const { translations } = useTranslations()
  
  // Using the locale hook to get the current locale
  const locale = useLocale()

  return (
    <>
      <Breadcrumbs items={[{ title: `${translations?.[locale]?.access_denied_breadcrumb }`}]} />
      
      <div className="container py-6">
        {translations?.[locale]?.access_denied}
      </div>
    </>
  )
}

export default AccessDenied
