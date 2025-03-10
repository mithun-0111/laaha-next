"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslations } from "@/src/contexts/TranslationsContext"
import { useLocale } from "next-intl"

const ExploreMenu = (exploreLinksData: any) => {
  const [exploreLinks, setExploreLinks] = useState<any[]>(exploreLinksData.data)
  const { translations } = useTranslations()
  const locale = useLocale()
  // Menu in the footer. It displays the quick links to the users.
  return (
    <>
      {exploreLinks && exploreLinks.length > 0 && (
        <div className="quick-links flex-[0_0_50%]">
          <div className="mb-6 text-m text-color-neutral">
            {translations?.[locale]?.quick_links}
          </div>
          <ul className="ps-0 list-none">
            {exploreLinks.map((item) => (
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

export default ExploreMenu
