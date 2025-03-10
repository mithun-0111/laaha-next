"use client"

import { useState } from "react"
import Container from "../Container"
import LanguageSwitcher from "../LanguageSwitcher"
import ExitButton from "./ExitButton"
import Logo from "./Logo"
import Link from "next/link"
import ConfigPopup from "./ConfigPopup"
import { CloseIcon, Hamburger, SearchIcon } from "@/src/lib/icons"
import { Menu } from "../Menu"
import { useSignUp } from "@/src/contexts/SignUpProvider"
import Image from "next/image"
import { absoluteUrl } from "@/src/lib/utils"
import { useLocale } from "next-intl"

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(false)
  const [closeButton, setShowClosebutton] = useState(false)
  const { userAvatarUrl, userName, isUserLoggedIn } = useSignUp()
  const locale = useLocale()
  const { role } = useSignUp()

  // Handle the hamburger menu.
  const handleHamburger = () => {
    setActiveMenu(!activeMenu)
    setShowClosebutton(!closeButton)
  }

  return (
    <header className="header">
      <div className="header-container-top bg-shadow-gray border-b border-shadow-dark-gray">
        <Container className="container flex justify-between items-center gap-2 header-top">
          <ExitButton />
          <LanguageSwitcher />
        </Container>
      </div>
      <Container className="header-container container flex justify-between items-center">
        <div className="site-info flex items-center">
          <button
            aria-label="Toggle menu"
            className="hamburger lg:hidden p-2"
            onClick={handleHamburger}
            aria-expanded={activeMenu}
          >
            <Hamburger />
          </button>
          <Logo />
        </div>
        <div className="menu-items flex">
          <div
            className={
              activeMenu
                ? "menu-active [&_nav]:block [&_nav]:w-[70%] [&_nav]:fixed [&_nav]:top-9 [&_nav]:p-4 [&_nav]:left-0 [&_nav]:transform [&_nav]:transition-transform [&_nav]:duration-300 [&_nav]:ease-in-out [&_nav]:bg-white [&_nav]:shadow-lg [&_nav]:z-50"
                : ""
            }
          >
            <Menu handleHamburger={handleHamburger} />
            {closeButton && (
              <button
                className="close-hamburger fixed left-4 top-11 z-50"
                onClick={handleHamburger}
                aria-label="Close menu"
              >
                <CloseIcon />
              </button>
            )}
          </div>
          <div className="global-items flex items-center">
            <Link
              className="me-10 cursor-pointer"
              href={`/${locale}/search-form`}
              aria-label="Search"
            >
              <SearchIcon />
            </Link>
            <ConfigPopup />
            {isUserLoggedIn && (
              <Link
                href={`/${locale}/${role === "moderator" ? "moderator-user-dashboard" : role === "forum_user" ? "forum-user-dashboard" : ""}`}
                aria-label="Go to user dashboard"
              >
                <Image
                  loading="lazy"
                  className="rounded-full ms-6 object-contain"
                  src={absoluteUrl("/" + userAvatarUrl)}
                  width={32}
                  height={32}
                  alt={userName || "User profile image"}
                />
              </Link>
            )}
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Header
