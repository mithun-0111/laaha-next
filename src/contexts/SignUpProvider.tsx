"use client"
import { cookies } from "next/headers"
import React, { createContext, ReactNode, useState } from "react"
import { decrypt } from "../lib/session"

interface SignUpContextType {
  showSignUpModal: boolean
  setShowSignUpModal: React.Dispatch<React.SetStateAction<boolean>>
  isUserLoggedIn: boolean
  setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
  userName: string | null
  userId: string | null
  setUid: React.Dispatch<React.SetStateAction<string | null>>
  userAvatarUrl: string | null
  setUserAvatar: React.Dispatch<React.SetStateAction<string | null>>
  setUserName: React.Dispatch<React.SetStateAction<string | null>>
  role: string | null
  setRole: React.Dispatch<React.SetStateAction<string | null>>
}

export const SignUpContext = createContext<SignUpContextType | null>(null)

export const SignupProvider = ({
  children,
  avatarUrl,
  uName,
  uid,
  userRole,
}: {
  children: ReactNode
  avatarUrl: string
  uName: string
  uid: string
  userRole: string
}) => {
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(uName ? true : false)
  const [userName, setUserName] = useState<string | null>(uName || null)
  const [userAvatarUrl, setUserAvatar] = useState<string | null>(
    avatarUrl || null
  )
  const [userId, setUid] = useState<string | null>(uid || null)
  const [role, setRole] = useState<string | null>(userRole || null)

  return (
    <SignUpContext.Provider
      value={{
        showSignUpModal,
        setShowSignUpModal,
        isUserLoggedIn,
        setIsUserLoggedIn,
        userName,
        userId,
        setUid,
        userAvatarUrl,
        setUserAvatar,
        setUserName,
        role,
        setRole,
      }}
    >
      {children}
    </SignUpContext.Provider>
  )
}

export const useSignUp = (): SignUpContextType => {
  const context = React.useContext(SignUpContext)

  if (!context) {
    throw new Error("useSignUp must be used within a SignUpProvider")
  }

  return context
}
