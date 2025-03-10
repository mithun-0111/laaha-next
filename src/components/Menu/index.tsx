"use client"

import { useEffect, useState } from "react"
import { useLocale } from "next-intl"
import { getHeaderMenu } from "@/src/lib/globalElements"
import MenuItem from "./MenuItem"

const CACHE_KEY_PREFIX = "menu-data-"

export const Menu = ({ handleHamburger }: any) => {
  const [menuData, setMenuData] = useState<any>(null)
  const locale = useLocale()

  useEffect(() => {
    const fetchMenuData = async () => {
      const cacheKey = `${CACHE_KEY_PREFIX}${locale}`
      const cachedData = localStorage.getItem(cacheKey)

      if (cachedData) {
        // If data is cached, use it
        setMenuData(JSON.parse(cachedData))
        return
      }

      try {
        const mainMenu = await getHeaderMenu(locale)
        const { main } = mainMenu.menus
        setMenuData(main)
        // Cache the data
        localStorage.setItem(cacheKey, JSON.stringify(main))
      } catch (error) {
        console.error("Error fetching menu data:", error)
      }
    }

    fetchMenuData()
  }, [locale]) // Dependency array to re-fetch when the locale changes

  if (!menuData) {
    return <div>Loading...</div>
  }

  return (
    <nav className="hidden lg:block pt-10 lg:pt-0">
      <MenuItem menuItems={menuData} handleHamburger={handleHamburger} />
    </nav>
  )
}
