"use client"

import { useEffect, useState } from "react"
import Logo from "../Header/Logo"
import Copyright from "./Copyright"
import ExploreMenu from "./ExploreMenu"
import FooterBottom from "./FooterBottom"
import QuickLinks from "./QuickLinks"
import SiteDesc from "./SiteDesc"
import { getFooterMenuData } from "@/src/lib/globalElements"
import { useLocale } from "next-intl"
import { drupal } from "@/src/lib/drupal"
import { getParams } from "@/src/lib/getparams"
import { defaultLocale } from "@/site.config"
import Image from "next/image"
import Link from "next/link"

const Footer = () => {
  const [footerMenuData, setFooterMenuData] = useState<any>(null)
  const [siteDesc, setSiteDesc] = useState<any>({ body: { value: "" } })
  const [copyright, setCopyright] = useState<any>({ body: { value: "" } })
  const locale = useLocale()

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const data = await getFooterMenuData(locale)

        setFooterMenuData(data.footer)
      } catch (error) {
        console.error("Error fetching footer menu data:", error)
      }
    }

    fetchFooterData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [siteDescResponse, copyrightResponse] = await Promise.allSettled([
          drupal.getResource(
            "block_content--footer_contact_information",
            "190696af-e4d3-43aa-a303-d207fdcd7f76",
            {
              params: getParams(
                "block-basic",
                "block_content--footer_contact_information"
              ).getQueryObject(),
              locale: locale,
              defaultLocale: defaultLocale,
            }
          ),
          drupal.getResource(
            "block_content--basic",
            "dbcfd0a8-aed6-4faf-a1c4-a2e52e37cbe7",
            {
              params: getParams(
                "block-basic",
                "block_content--basic"
              ).getQueryObject(),
              locale: locale,
              defaultLocale: defaultLocale,
            }
          ),
        ])

        // Check if the promises were fulfilled
        if (siteDescResponse.status === "fulfilled") {
          setSiteDesc(siteDescResponse.value)
        } else {
          console.error(
            "Error fetching site description:",
            siteDescResponse.reason
          )
          setSiteDesc({
            body: { value: "<p>Error loading site description.</p>" },
          })
        }

        if (copyrightResponse.status === "fulfilled") {
          setCopyright(copyrightResponse.value)
        } else {
          console.error(
            "Error fetching copyright info:",
            copyrightResponse.reason
          )
          setCopyright({
            body: { value: "<p>Error loading copyright information.</p>" },
          })
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setSiteDesc({
          body: { value: "<p>Error loading site description.</p>" },
        })
        setCopyright({
          body: { value: "<p>Error loading copyright information.</p>" },
        })
      }
    }

    fetchData()
  }, [locale])

  return (
    <div className="footer bg-color-secondary py-10 lg:py-16">
      <div className="container">
        <div className="footer-top lg:pb-16 flex flex-wrap items-start lg:border-b lg:border-color-pink-500 mb-10">
          <div className="footer-top-left order-1 mb-8 lg:mb-0 flex-[0_0_100%] lg:flex-[0_0_25%]">
            <Link href={`/${locale}`}>
              <Image
                loading="lazy"
                src={"/assets/images/laaha-logo_footer.png"}
                width={175}
                height={122}
                alt="Foooter Logo"
              />
            </Link>
          </div>
          {footerMenuData && (
            <div className="footer-link order-3 lg:order-2 flex flex-wrap flex-[0_0_100%] lg:flex-[0_0_40%]">
              <QuickLinks data={footerMenuData.quickLinks} />
              <ExploreMenu data={footerMenuData.exploreLinks} />
            </div>
          )}

          <div className="flex-[0_0_100%] lg:flex-[0_0_35%] pb-8 mb-8 border-b border-color-pink-500 lg:pb-0 lg:mb-0 lg:border-b-0 order-2 lg:order-3">
            <SiteDesc siteDesc={siteDesc} />
          </div>
        </div>
        <div className="footer-bottom block lg:flex justify-between mb-12 lg:mb-0">
          <div className="footer-bottom-menu">
            {footerMenuData && (
              <FooterBottom data={footerMenuData.footerBottom} />
            )}
          </div>
          <div className="copyrights">
            <Copyright copyright={copyright} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
