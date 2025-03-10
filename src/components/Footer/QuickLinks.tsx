"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslations } from "@/src/contexts/TranslationsContext"
import { useLocale } from "next-intl"

const QuickLinks = (quickLinkData: any) => {
  const { translations } = useTranslations()
  const locale = useLocale()

  const [quickLinks, setQuickLinks] = useState<any[]>(quickLinkData.data)

  return (
    <>
      {quickLinks && quickLinks.length > 0 && (
        <div className="quick-links flex-[0_0_50%]">
          <div className="mb-6 text-m text-color-neutral">
            {translations?.[locale]?.quick_links}
          </div>
          <ul className="ps-0 list-none">
            {quickLinks.map((item) => (
              <li className="mb-2" key={item.id}>
                <Link href={item.url}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

export default QuickLinks
