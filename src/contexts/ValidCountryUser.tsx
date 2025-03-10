"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { getCountryCode } from "../lib/utils"

// Define the types
type ValidCountryUserProviderProps = {
  children: React.ReactNode
}

type ValidUserContextProps = {
  isValidUser: boolean
  isAuthUser: boolean
  isLoading: boolean
  error: string | null
}

// Create the context
const ValidUserContext = createContext<ValidUserContextProps | undefined>(
  undefined
)

// Create the provider component
export const ValidCountryUserProvider = ({
  children,
}: ValidCountryUserProviderProps) => {
  const [isValidUser, setValidUser] = useState(false)
  const [isAuthUser, setIsAuthUser] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const currentCountry = getCountryCode()

  // Fetch data from the backend API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/check-user") // @Todo, add API for getting the valid country code
        // and country which are valid for write permission

        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const data = await response.json()

        if (data?.forum_countries?.includes(currentCountry)) {
          setValidUser(data.isValidUser)
        }
        if (data?.forum_country_readAccess.includes(currentCountry)) {
          setIsAuthUser(data.isAuthUser)
        }
      } catch (err) {
        console.error("Error fetching user data:", err)
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Provide the context values
  return (
    <ValidUserContext.Provider
      value={{ isValidUser, isAuthUser, isLoading, error }}
    >
      {children}
    </ValidUserContext.Provider>
  )
}

// Create a custom hook to consume the context
export const useValidUser = () => {
  const context = useContext(ValidUserContext)
  if (context === undefined) {
    throw new Error(
      "useValidUser must be used within a ValidCountryUserProvider"
    )
  }
  return context
}
