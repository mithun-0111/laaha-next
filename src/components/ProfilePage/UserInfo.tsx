import {
  deleteSessionDetails,
  logout,
} from "@/src/app/[locale]/community-conversations/action"
import { getUserInfo } from "@/src/lib/apis"
import { DefaultProfileIcon } from "@/src/lib/icons"
import { absoluteUrl, laila } from "@/src/lib/utils"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import EditProfileModal from "./EditProfileModal"
import { useSignUp } from "@/src/contexts/SignUpProvider"
import { getAccessToken } from "@/src/lib/protectedAuth"
import { useTranslations } from "@/src/contexts/TranslationsContext"
import { useLocale } from "next-intl"

// Define types for the expected user data and current user
interface UserData {
  avatar_url?: string
  username: string
  edit_url?: string
  note?: string
}

interface UserInfoProps {
  currentUser: {
    userName: string | null
    userAvatarUrl: string | null
    userId: string | null
  } | null
}

const UserInfo: React.FC<UserInfoProps> = ({ currentUser }) => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [editActive, setEditActive] = useState<boolean>(false)
  const { userId } = useSignUp()
  const { translations } = useTranslations()
  const locale = useLocale()

  // Fetch user data from the API
  const fetchUserData = async () => {
    try {
      const response = await getUserInfo(userId)
      setUserData(response.data)
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const handleEditClick = () => {
    setEditActive(true)
  }

  const handleLogoutClick = async () => {
    await logout()
  }

  return (
    <>
      {currentUser && (
        <>
          <div className="user-info p-4 bg-color-secondary rounded-md mb-8 text-center">
            {currentUser.userAvatarUrl ? (
              <Image
                loading="lazy"
                width={48}
                height={48}
                src={absoluteUrl("/" + currentUser.userAvatarUrl)}
                className="user-image max-w-12 mx-auto"
                alt={currentUser.userName || "User"}
              />
            ) : (
              <DefaultProfileIcon />
            )}
            <div className="user-basic-info mt-2">
              <div
                className={`username font-semibold text-red-wine ${laila.className}`}
              >
                {translations?.[locale]?.hello} {" "} {currentUser.userName}
              </div>
              <div className="edit-profile" onClick={handleEditClick}>
                <span className="use-ajax inline-flex items-start lg:items-center text-primary text-m">
                  <span className="mr-1">
                    {translations?.[locale]?.edit_profile}
                  </span>
                  <svg
                    className="max-w-3"
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                  >
                    <path
                      d="M3.83301 7.99992H13.1663M13.1663 7.99992L8.49967 3.33325M13.1663 7.99992L8.49967 12.6666"
                      stroke="#F7265D"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <div className="user-logout inline-block mt-4">
                <span
                  className="p-2 rounded-2xl min-w-28 text-m bg-default-black text-white block cursor-pointer"
                  onClick={handleLogoutClick}
                >
                  {translations?.[locale]?.logout}
                </span>
              </div>
            </div>
          </div>

          {/* {userData.note && (
            <div className="note-block">
              <div dangerouslySetInnerHTML={{ __html: userData.note }} />
                <span>{'Learn more about Community Guidelines'}</span>
            </div>
          )} */}

          {editActive && <EditProfileModal modalActive={setEditActive} />}
        </>
      )}
    </>
  )
}

export default UserInfo
