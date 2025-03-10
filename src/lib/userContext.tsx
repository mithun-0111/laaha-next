"use client"

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react"
import { useLocale } from "next-intl"
import { getGeneralData } from "./apis"

interface UserContextType {
  currentUser: any | null
  userLoading: boolean
}

interface UserProviderProps {
  children: ReactNode
}

// Create a Context for the user
const UserContext = createContext<UserContextType | undefined>(undefined)

// Create a Provider component
export const UserProvider = ({ children }: UserProviderProps) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null)
  const [userLoading, setUserLoading] = useState<boolean>(true)
  const [error, setError] = useState<any | null>(null)
  const locale = useLocale()

  const fetchGeneralData = async () => {
    try {
      const response = await getGeneralData()
      const current_user = await response.data.current_user
      // const lang_code = await response.data.lang_code;
      setCurrentUser(current_user)
      // i18n.changeLanguage(lang_code);
    } catch (error) {
      console.error("Error fetching resources:", error)
      setError(error) // Set error state if needed
    } finally {
      setUserLoading(false)
    }
  }

  useEffect(() => {
    fetchGeneralData()
  }, [])

  return (
    <UserContext.Provider value={{ currentUser, userLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }

  return context
}
