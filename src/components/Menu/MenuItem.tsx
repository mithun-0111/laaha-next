"use client"

import { DownArrow } from "@/src/lib/icons"
import useWindowSize from "@/src/lib/useWindowSize"
import { absoluteUrl } from "@/src/lib/utils"
import { DrupalMenuItem } from "next-drupal"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation" // Import usePathname
import { useValidUser } from "@/src/contexts/ValidCountryUser"

interface ExtendedDrupalMenuItem extends DrupalMenuItem {
  field_icon?: {
    resourceIdObjMeta: {
      width: number
      height: number
    }
    uri: {
      url: string
    }
  }
}

interface MenuItemWithChildren extends ExtendedDrupalMenuItem {
  children: ExtendedDrupalMenuItem[]
}

interface MenuItemProps {
  menuItems: ExtendedDrupalMenuItem[]
  handleHamburger: any
}

const MenuItem = ({ menuItems, handleHamburger }: MenuItemProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [parentActive, setParentActive] = useState(false);
  const menuRef = useRef<HTMLUListElement | null>(null)
  const { width } = useWindowSize()
  const pathname = usePathname() // Get the current URL path
  const { isValidUser } = useValidUser();

  const handleExpand = () => {
    setIsOpen(!isOpen)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const categorizedMenu: MenuItemWithChildren[] = menuItems.reduce<
    MenuItemWithChildren[]
  >((acc, item) => {
    if (!item.parent) {
      acc.push({ ...item, children: [] })
    } else {
      const parent = acc.find((menuItem) => menuItem.id === item.parent)
      if (parent) {
        parent.children.push(item)
      }
    }
    return acc
  }, [])

  const handleClickItem = () => {
    setParentActive(false);
    if (width < 1023) {
      handleHamburger()
    }
  }

  const handleClickSubmenuItem = () => {
    handleExpand();
    setParentActive(true);
    if (width < 1023) {
      handleHamburger()
    }
  }

  // Function to check if a menu item is active
  const isActive = (url: string) => {
    return pathname === url
  }

  return (
    <>
      <ul
        ref={menuRef}
        className="block lg:flex flex-wrap mt-8 ps-0 list-none lg:mt-0"
      >
        {categorizedMenu &&
          categorizedMenu.map((item) => (
            <li
              key={item.id}
              className={`me-0 lg:me-10 border-t px-4 lg:px-0 lg:border-0 border-shadow-dark-gray relative ${item.children.length > 0 && "lg:me-14"}`}
            >
              {item.title && item.children.length > 0 ? (
                <>
                  <div
                    onClick={handleExpand}
                    className="flex items-center"
                    aria-expanded={isOpen}
                    aria-controls={`submenu-${item.id}`}
                  >
                    {item.field_icon?.uri?.url && (
                      <div className="icon">
                        <Image
                          src={absoluteUrl(item.field_icon.uri.url)}
                          loading="lazy"
                          alt={""}
                          width={item?.field_icon?.resourceIdObjMeta.width}
                          height={item?.field_icon?.resourceIdObjMeta.height}
                        />
                      </div>
                    )}
                    <div className="menu-item">
                      <Link
                        onClick={() => handleClickItem()}
                        className={`px-3 pt-5 pb-3 block lg:text-m font-medium ${isActive(item.url) ? "text-primary" : ""} ${parentActive ? "text-primary" : ""}`} // Add active class
                        href={item.url}
                        aria-label={item.title}
                      >
                        {item.title}
                      </Link>
                      <span
                        className={
                          isOpen
                            ? "absolute right-0 lg:-end-4 top-3 lg:top-4 transform -rotate-180 cursor-pointer"
                            : "absolute top-3 lg:top-4 cursor-pointer end-0 lg:-end-4"
                        }
                        aria-hidden="true"
                      >
                        <DownArrow />
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                item.title && (
                  <div className="flex items-center">
                    <div className="icon">
                      {item.field_icon?.uri?.url && (
                        <Image
                          src={absoluteUrl(item.field_icon.uri.url)}
                          loading="lazy"
                          alt={""}
                          width={item?.field_icon?.resourceIdObjMeta.width}
                          height={item?.field_icon?.resourceIdObjMeta.height}
                        />
                      )}
                    </div>
                    <Link
                      onClick={() => handleClickItem()}
                      className={`px-3 pt-5 pb-3 block lg:text-m font-medium ${isActive(item.url) ? "text-primary" : ""}`} // Add active class
                      href={item.url}
                      aria-label={item.title}
                    >
                      {item.title}
                    </Link>
                  </div>
                )
              )}

              {item.children.length > 0 && isOpen && (
                <ul
                  id={`submenu-${item.id}`}
                  className="bg-white lg:absolute top-full ps-4 z-20 lg:min-w-60 lg:border lg:border-shadow-dark-gray"
                  role="menu"
                >
                  {item.children.map((childItem) => (
                    <li key={childItem.id} className="list-none" role="none">
                      <div className="flex items-center">
                        <div className="icon">
                          {childItem.field_icon?.uri?.url && (
                            <Image
                              src={absoluteUrl(childItem.field_icon.uri.url)}
                              loading="lazy"
                              alt={childItem.title || "Child menu icon"}
                              width={20}
                              height={20}
                            />
                          )}
                        </div>
                        <Link
                          onClick={() => handleClickSubmenuItem()}
                          className={`p-4 block font-medium ${isActive(childItem.url) ? "text-primary" : ""}`} // Add active class
                          href={childItem.url}
                          aria-label={childItem.title}
                        >
                          {childItem.title}
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
      </ul>
    </>
  )
}

export default MenuItem
