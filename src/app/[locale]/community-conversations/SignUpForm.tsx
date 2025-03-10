"use client"

import { useState, useEffect, useContext, useRef } from "react"
import { laila } from "@/src/lib/utils"
import { useReducer } from "react"
import signupReducer, { UserDetails } from "./signupReducer"
import RegistrationSteps from "./RegistrationSteps"
import { initialState } from "./signupReducer"
import { CloseIcon } from "@/src/lib/icons"
import { SignUpContext } from "@/src/contexts/SignUpProvider"
import { login } from "./action"
import {
  getAvatars,
  getCommunityGuidelines,
  getLoginFormDetails,
  getStepOneFormDetails,
  getStepThreeFormDetails,
  getStepTwoFormDetails,
} from "./api"
import Link from "next/link"
import { HtmlToText } from "@/src/components/CommunityPage/HtmlToText"
import { useLocale } from "next-intl"
import { useTranslations } from "@/src/contexts/TranslationsContext"
import ForgotPasswordModal from "./ForgotPasswordModal"

export default function SignUpForm() {
  const signupContext = useContext(SignUpContext)

  // Reducer to manage signup state
  const [signupState, dispatch] = useReducer(signupReducer, initialState)
  const [signInError, setSignInError] = useState<string | null>(null)
  let usernameRef = useRef<HTMLInputElement>(null)
  let passwordRef = useRef<HTMLInputElement>(null)
  const locale = useLocale()
  const { translations } = useTranslations()
  const [forgotPwdModal, setforgotPwdModal] = useState(false)

  // Close the signup modal and reset the state
  const handleCloseModal = () => {
    dispatch({ type: "RESET" })
    signupContext?.setShowSignUpModal(false)
  }

  // Set the current screen in the signup flow
  const handleSetScreen = (screen: string) => {
    dispatch({ type: "SET_SCREEN", screen })
  }

  // Update user details in the signup state
  const handleUserDetails = (userDetails: UserDetails) => {
    dispatch({ type: "SET_USER_DETAILS", userDetails })
  }

  // Handle user sign-in with username and password
  const handleSignIn = async (event: any) => {
    event.preventDefault()
    let username = usernameRef.current?.value
    let password = passwordRef.current?.value
    if (!username || !password) return

    let res = await login({ username, password }, locale)
    if (res.data == null || res.error) {
      setSignInError(res.error)
      return
    }

    // If login successful, update the context and reload
    if (res.data) {
      handleCloseModal()
      signupContext?.setIsUserLoggedIn(true)
      signupContext?.setUserAvatar(res.data.avatarUrl)
      signupContext?.setUserName(res.data.username)
      signupContext?.setUid(res.data.uid)
      signupContext?.setRole(res.data.userRole)
      location.reload()
    }
  }

  // Open the forgot password modal
  const handleForgotPassword = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setforgotPwdModal(true)
  }

  // Close the modal when the Escape key is pressed
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseModal()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  // Fetch initial data for the signup process
  useEffect(() => {
    getLoginFormDetails(locale).then((res) => {
      dispatch({ type: "SET_LOGIN_FORM_DETAILS", signInFormDetails: res })
    })
    getStepOneFormDetails(locale).then((res) => {
      dispatch({ type: "SET_STEP_ONE_FORM_DETAILS", stepOneFormDetails: res })
    })
    getStepTwoFormDetails(locale).then((res) => {
      dispatch({ type: "SET_STEP_TWO_FORM_DETAILS", stepTwoFormDetails: res })
    })

    getStepThreeFormDetails(locale).then((res) => {
      dispatch({
        type: "SET_STEP_THREE_FORM_DETAILS",
        stepThreeFormDetails: res,
      })
    })
    getAvatars(locale).then((res) => {
      dispatch({ type: "SET_AVATARS", avatars: res })
    })
    getCommunityGuidelines(locale).then((res) => {
      dispatch({ type: "SET_COMMUNITY_GUIDELINES", communityGuidelines: res })
    })
  }, [])

  // If the sign-up modal isn't visible, return null
  if (!signupContext?.showSignUpModal) return null

  // JSX code for rendering the sign-up form, modal.
  return (
    <div className="signup-form fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center md:justify-center md:p-4 z-20">
      {signupState.currentScreen === "signup-or-signin" && (
        <div className="bg-white w-full container rounded-xl shadow-xl p4 md:p-6 overflow-auto">
          <div
            className={`bg-[#FEEBF1] mx-[-16px] flex justify-between items-center md:hidden md:mx-0 p-4 font-semibold ${laila.className}`}
          >
            <span>{translations?.[locale]?.login_register}</span>
            <span onClick={handleCloseModal}>
              <CloseIcon stroke="red" />
            </span>
          </div>
          <div className="modal-body relative grid sm:grid-cols-2 gap-2 md:gap-36 md:px-8 ">
            {/* Left side - Welcome message */}

            <div className="welcome-message bg-pink-100 p-4 md:p-8 flex flex-col justify-start rounded-2xl text-[#31020e] mt-4">
              <h2
                className={`text-xxl md:text-4xl font-bold ${laila.className}`}
              >
                <HtmlToText
                  html={signupState.signInFormDetails.community_info_header}
                />
              </h2>
              <p className=" font-univers text-base md:text-xl">
                <HtmlToText
                  html={
                    signupState.signInFormDetails.community_info_description
                  }
                />
              </p>
            </div>

            {/* Right side - Form */}
            <div className="bg-white h-fit">
              <div className="hidden md:flex justify-end py-6 md:py-1">
                <button
                  className="z-10 text-primary hover:bg-pink-700/10 p-2 rounded-full w-fit self-end"
                  onClick={() => handleCloseModal()}
                >
                  <CloseIcon stroke="red" />
                </button>
              </div>
              <div className="">
                <button
                  className="w-full bg-amber-400 hover:bg-amber-500 text-black font-medium h-12 rounded-md transition duration-200 mt-4"
                  onClick={() => handleCloseModal()}
                >
                  {signupState.signInFormDetails.anonymous_button_text}
                </button>
                <div className="space-y-6 md:pr-8 bg-[#F8F9F9] md:bg-white p-4 rounded-2xl my-4">
                  <div className="space-y-4 flex flex-col">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#F8F9F9] px-2 text-gray-500">
                          {translations?.[locale]?.or}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-center text-color-neutral">
                      {signupState.signInFormDetails.login_instruction}
                    </p>
                    <button
                      className="w-full border border-pink-500 text-pink-500 hover:bg-pink-50 h-12 rounded-md transition duration-200"
                      onClick={() => handleSetScreen("register-a-user")}
                    >
                      {translations?.[locale]?.register_now}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-[#F8F9F9] px-2 text-gray-500">
                        {translations?.[locale]?.or}
                      </span>
                    </div>
                  </div>
                  <form className="space-y-4" onSubmit={handleSignIn}>
                    <h3 className="text-xl font-semibold text-center">
                      {translations?.[locale]?.sign_in}
                    </h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium block">
                        {translations?.[locale]?.username}
                      </label>
                      <input
                        ref={usernameRef}
                        type="text"
                        className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium block">
                        {translations?.[locale]?.password}
                      </label>
                      <input
                        ref={passwordRef}
                        type="password"
                        className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                      <Link
                        href="#"
                        onClick={handleForgotPassword}
                        className="text-pink-500 hover:text-pink-600 text-sm"
                      >
                        {translations?.[locale]?.forgot_passwd}
                      </Link>
                    </div>
                    <div className="flex flex-wrap">
                      <div className="text-primary w-full text-right">
                        {signInError !== null ? signInError : ""}
                      </div>
                      <div className="flex justify-end gap-4 pt-4 w-full">
                        <button
                          type="button"
                          className="px-4 py-2 text-light-gray hover:bg-gray-100 rounded-md transition duration-200"
                          onClick={handleCloseModal}
                        >
                          {translations?.[locale]?.cancel}
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-primary hover:bg-red focus:bg-red text-white rounded-md transition duration-200"
                        >
                          {translations?.[locale]?.sign_in}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {signupState.currentScreen === "register-a-user" && (
        <RegistrationSteps
          handleCloseModal={handleCloseModal}
          handleSetScreen={handleSetScreen}
          handleUserDetails={handleUserDetails}
          userDetails={signupState.userDetails}
          completeYourProfileSteps={signupState.completeYourProfileSteps}
          currentProfileStep={signupState.currentProfileStep}
          dispatch={dispatch}
          securityQuestions={signupState.securityQuestions}
          signupState={signupState}
        />
      )}
      {forgotPwdModal && (
        <ForgotPasswordModal setforgotPwdModal={setforgotPwdModal} />
      )}
    </div>
  )
}
