import siteConfig from "@/site.config"
import { getParams } from "./getparams"
import { drupal } from "./drupal"

const fetchMenuItems = async (menuName: string, locale: string) => {
  const defaultLocale = siteConfig.defaultLocale

  const menuOpts = {
    params: getParams("menu_link_content--menu_link_content").getQueryObject(),
    locale: locale,
    defaultLocale: defaultLocale,
  }

  try {
    const menuItems = await drupal.getMenu(menuName, menuOpts)
    return menuItems.items
  } catch (error) {
    console.error(`Error fetching menu items: ${error}`)
    return []
  }
}
export const getHeaderMenu = async (locale: string) => {
  const mainMenu = await fetchMenuItems("header-menu", locale)
  return {
    menus: {
      main: mainMenu,
    },
  }
}

export const getFooterMenuData = async (locale: string) => {
  const [quickLinks, exploreLinks, footerBottom] = await Promise.allSettled([
    fetchMenuItems("quick-links", locale),
    fetchMenuItems("explore-menu", locale),
    fetchMenuItems("footer-last-menu", locale),
  ])

  // Return the footer data with checks for fulfilled promises
  return {
    footer: {
      quickLinks: quickLinks.status === "fulfilled" ? quickLinks.value : null,
      exploreLinks:
        exploreLinks.status === "fulfilled" ? exploreLinks.value : null,
      footerBottom:
        footerBottom.status === "fulfilled" ? footerBottom.value : null,
    },
  }
}
