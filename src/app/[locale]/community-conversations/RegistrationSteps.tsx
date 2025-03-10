"use client"

import { useState } from "react"
import { absoluteUrl, getCountryCode, laila } from "@/src/lib/utils"
import Image from "next/image"
import { EyeClosed, EyeOpened, GreenTick } from "@/src/lib/icons"
import { createUser } from "./api"
import { useLocale } from "next-intl"
import { useTranslations } from "@/src/contexts/TranslationsContext"

export default function RegistrationSteps({
  handleCloseModal,
  handleUserDetails,
  userDetails,
  completeYourProfileSteps,
  currentProfileStep,
  dispatch,
  securityQuestions,
  signupState,
}: {
  handleCloseModal: () => void
  handleSetScreen: (screen: string) => void
  handleUserDetails: (userDetails: any) => void
  userDetails: any
  completeYourProfileSteps: Map<string, string>
  currentProfileStep: string
  dispatch: any
  securityQuestions: string[]
  signupState: any
}) {
  const suggestedNames = signupState.stepOneFormDetails.usernames.map(
    (user: any) => user.name
  )
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [passLengthError, setPassLengthError] = useState(true)
  const [passStrongError, setPassStrongError] = useState(true)
  const [confirmPassword, setConfirmPassword] = useState("")
  const locale = useLocale()
  const { translations } = useTranslations()

  // Handle changes to the confirm password input
  const handleConfirmPasswordChange = (e: any) => {
    let pass = e.target.value
    setConfirmPassword(pass)
  }

  // Update user nickname in the user details
  const handleUserNickName = (nickname: string) => {
    let tempUserDetails = { ...userDetails }
    tempUserDetails.nickname = nickname
    handleUserDetails(tempUserDetails)
  }

  // Update the profile step when user moves to the next step
  const handleProfileStep = (currentProfileStep: string) => {
    if (userDetails.nickname === "") return
    dispatch({ type: "SET_CURRENT_PROFILE_STEP", currentProfileStep })
  }

  // Validate password length and strength (contains a number)
  const handlePasswordValidation = (event: any) => {
    let password = event.target.value

    let tempUserDetails = { ...userDetails }
    tempUserDetails.password = password
    handleUserDetails(tempUserDetails)

    if (password.length < 4 || password.length > 16) {
      setPassLengthError(true)
    } else {
      setPassLengthError(false)
    }
    if (!password.match(/[0-9]/g)) {
      setPassStrongError(true)
    } else {
      setPassStrongError(false)
    }
  }

  // Handle selection of security question
  const handleSelectSecurityQuestion = (e: any) => {
    const selectedQuestion = e.target.value
    dispatch({
      type: "SET_SELECTED_SECURITY_QUESTION",
      selectedSecurityQuestion: selectedQuestion,
    })
  }

  // Handle change of answer to the selected security question
  const handleAnswerChange = (e: any) => {
    const answer = e.target.value
    dispatch({
      type: "SET_SECURITY_ANSWER",
      securityAnswer: answer,
    })
  }

  // Update user avatar
  const handleProfileAvatar = (img: string) => {
    let tempUserDetails = { ...userDetails }
    tempUserDetails.avatarUrl = absoluteUrl("/" + img)
    handleUserDetails(tempUserDetails)
  }

  // Accept or reject the terms and conditions
  const handleAcceptTerms = (accept: boolean) => {
    dispatch({ type: "SET_ACCEPT_TERMS", acceptTerms: accept })
  }

  type RegisterUserDetails = {
    name: string
    pass: string
    avatar_tid: string
    country: string
    security_question_tid: string | null
    answer: string
    terms_check: boolean
  }

  // Create a new user after gathering all the details
  const handleCreateUser = async () => {
    let securityQuestionTid = null
    Object.entries(signupState.stepThreeFormDetails.security_questions).forEach(
      ([key, value]) => {
        if (signupState.selectedSecurityQuestion === String(value)) {
          securityQuestionTid = key
        }
      }
    )

    let userDetails: RegisterUserDetails = {
      name: signupState.userDetails.nickname,
      pass: signupState.userDetails.password,
      avatar_tid: signupState.userDetails.avatarUrl,
      country: getCountryCode() ?? "",
      security_question_tid: securityQuestionTid,
      answer: signupState.securityAnswer,
      terms_check: signupState.acceptTerms,
    }

    let res = await createUser(userDetails, locale)

    if (res.error === null) {
      location.reload() // Reload the page upon successful user creation
    }
  }

  return (
    <div className="bg-white container p-0 rounded-lg overflow-hidden h-fit">
      {/* Header */}
      <div className="bg-pink-100 w-full p-4 md:p-6  flex justify-between items-center">
        <h2
          className={` text-base md:text-xxl mb-0 font-bold text-[#31020e] ${laila.className}`}
        >
          {translations?.[locale]?.register_user}
        </h2>
        <button
          onClick={() => handleCloseModal()}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="red"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-[60px] py-8 max-h-[540px] overflow-auto">
        {/* Left Side - Steps */}
        <div className="hidden md:block bg-gray-100 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">
            Steps to complete your profile
          </h3>
          <div className="flex items-center mb-8">
            <div className="flex bg-white items-center gap-2 p-4 rounded-full">
              <div className="w-24 h-24 bg-blue-200 rounded-full overflow-hidden flex items-center justify-center mb-2">
                <Image
                  src={
                    userDetails.avatarUrl === ""
                      ? "/assets/images/default-avatar.png"
                      : userDetails.avatarUrl
                  }
                  width={100}
                  height={100}
                  alt="user-icon"
                />
              </div>
              <div className="">
                <p className="text-[#f7265d] font-medium font-univers text-base">
                  {userDetails.nickname === ""
                    ? "No User Name"
                    : userDetails.nickname}
                </p>
                <p className="text-light-gray font-univers text-m">
                  {translations?.[locale]?.unregistered_user}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {Array.from(completeYourProfileSteps).map(([k, v], index) => (
              <>
                <div key={index} className="flex items-start gap-3">
                  {parseInt(currentProfileStep.split("_")[1]) > index + 1 ? (
                    <GreenTick />
                  ) : (
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-sm pt-1
                      ${k === currentProfileStep ? "bg-[#f7265d] text-white" : "bg-gray-300 text-light-gray"}`}
                    >
                      {index + 1}
                    </div>
                  )}
                  <p className="text-light-gray">{v}</p>
                </div>
              </>
            ))}
          </div>
        </div>

        {/* Right Side - Username Selection */}
        {currentProfileStep === "STEP_1" && (
          <div className="space-y-2 flex flex-col justify-between">
            <div>
              <div>
                <h3
                  className={`text-xl font-semibold mb-4 ${laila.className} text-[#31020e]`}
                >
                  {signupState.stepOneFormDetails.header}
                </h3>
                <label className="block text-sm font-medium mb-2">
                  {signupState.stepOneFormDetails.title}
                </label>
                <input
                  type="text"
                  value={userDetails.nickname}
                  onChange={(e) => handleUserNickName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <p className="text-sm text-light-gray mt-2">
                  {signupState.stepOneFormDetails.help_text}
                </p>
              </div>

              <div>
                <div className="relative py-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[#87929d]" />
                  </div>
                  <div className="relative flex justify-center text-m">
                    <span className="bg-white px-2 text-[#87929d]">
                      {signupState.stepOneFormDetails.pick_one_text}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedNames.map((name: any) => (
                    <button
                      key={name}
                      onClick={() => handleUserNickName(name)}
                      className="px-4 py-2 bg-[#87929d] text-white rounded-full hover:bg-gray-600 transition-colors"
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 flex justify-end gap-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-light-gray hover:bg-gray-100 rounded-lg transition-colors"
              >
                {translations?.[locale]?.cancel}
              </button>
              <button
                disabled={userDetails.nickname === ""}
                onClick={() => handleProfileStep("STEP_2")}
                className={` ${userDetails.nickname === "" ? "cursor-not-allowed opacity-65" : "opacity-100"} ${`bg-primary hover:bg-red px-6 py-2 text-white rounded-lg transition-colors`}`}
              >
                {translations?.[locale]?.continue}
              </button>
            </div>
          </div>
        )}
        {currentProfileStep === "STEP_2" && (
          <div className="step-2 set-password-wrapper flex flex-col justify-between">
            <div className="w-full">
              <h2
                className={`${laila.className} text-[#31020e] text-xl font-semibold mb-0`}
              >
                {signupState.stepTwoFormDetails.header}
              </h2>
              <h4 className="subtitle text-m m-0 text-[#5a6872] leading-5 font-univers">
                {translations?.[locale]?.select_uname_pwd}
              </h4>
              <div className="mt-6 md:mt-4 block md:hidden mb-4">
                <label className="text-m font-univers mb-2 block">
                  {translations?.[locale]?.password}
                </label>
                <div className="relative flex">
                  <input
                    onChange={handlePasswordValidation}
                    value={userDetails.password}
                    minLength={4}
                    type={passwordVisible ? "text" : "password"}
                    className="w-full h-9 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <span
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  >
                    {passwordVisible ? <EyeOpened /> : <EyeClosed />}
                  </span>
                </div>
              </div>
              <div
                className={`bg-[#f8f9f9] py-2 px-3 text-[#363e44] rounded-xl`}
              >
                <ul className="text-m pl-4 font-univers leading-6">
                  <li
                    className={`${passLengthError ? "text-[#f7265d]" : "text-[#228161]"}`}
                  >
                    {signupState.stepTwoFormDetails.policy1}
                  </li>
                  <li
                    className={`${passStrongError ? "text-[#f7265d]" : "text-[#228161]"}`}
                  >
                    {signupState.stepTwoFormDetails.policy2}
                  </li>
                </ul>
                <div className="border-t px-2 text-m leading-6 pt-2 mt-2 border-[#c2c8cc]">
                  {signupState.stepTwoFormDetails.example_pass}
                </div>
              </div>

              <div className="mt-4 hidden md:block">
                <label className="text-m font-univers mb-2 block">
                  {translations?.[locale]?.password}
                </label>
                <div className="relative flex">
                  <input
                    onChange={handlePasswordValidation}
                    value={userDetails.password}
                    minLength={4}
                    type={passwordVisible ? "text" : "password"}
                    className="w-full h-9 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <span
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  >
                    {passwordVisible ? <EyeOpened /> : <EyeClosed />}
                  </span>
                </div>
              </div>
              {!passLengthError && !passStrongError && (
                <div className="mt-4">
                  <label className="text-m font-univers mb-2 block">
                    {translations?.[locale]?.confirm_pwd}
                  </label>
                  <div className="relative flex">
                    <input
                      onChange={handleConfirmPasswordChange}
                      value={confirmPassword}
                      minLength={4}
                      type={confirmPasswordVisible ? "text" : "password"}
                      className="w-full h-9 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <span
                      onClick={() =>
                        setConfirmPasswordVisible(!confirmPasswordVisible)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                    >
                      {passwordVisible ? <EyeOpened /> : <EyeClosed />}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="md:px-6 flex justify-end gap-4 w-full mt-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-light-gray hover:bg-gray-100 rounded-lg transition-colors"
              >
                {translations?.[locale]?.cancel}
              </button>
              <button
                disabled={userDetails.password !== confirmPassword}
                onClick={() => handleProfileStep("STEP_3")}
                className={` ${userDetails.password !== confirmPassword ? "cursor-not-allowed opacity-65" : "opacity-100"} ${`bg-primary hover:bg-red px-6 py-2 text-white rounded-lg transition-colors`}`}
              >
                {translations?.[locale]?.continue}
              </button>
            </div>
          </div>
        )}
        {currentProfileStep === "STEP_3" && (
          <div className="step-3 security-question flex flex-col justify-between">
            <div className="w-full">
              <h2
                className={`${laila.className} text-[#31020e] text-xl font-semibold m-0`}
              >
                {signupState.stepThreeFormDetails.header}
              </h2>
              <h4 className="subtitle text-m m-0 text-[#5a6872] leading-5 font-univers">
                {signupState.stepThreeFormDetails.sq_description_above}
              </h4>

              <div className="pt-6">
                <div className="flex mb-4 flex-wrap">
                  <div className="w-full md:w-1/3">
                    <label className="text-m">
                      {signupState.stepThreeFormDetails.sq_label}
                    </label>
                  </div>
                  <div className="w-full md:w-2/3">
                    <select
                      className="rounded-lg w-full"
                      onChange={handleSelectSecurityQuestion}
                      value={signupState?.selectedSecurityQuestion || ""}
                    >
                      <option value={""}>
                        {translations?.[locale]?.select_question}
                      </option>
                      {securityQuestions.map((ques) => (
                        <option value={ques} key={ques}>
                          {ques}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {signupState.selectedSecurityQuestion !== "" && (
                  <div className="flex flex-wrap">
                    <div className="w-full md:w-1/3">
                      <label className="text-m">
                        {translations?.[locale]?.your_ans}
                      </label>
                    </div>
                    <div className="w-full md:w-2/3">
                      <input
                        value={signupState.securityAnswer}
                        onChange={handleAnswerChange}
                        placeholder="Your Answer"
                        className="border rounded-lg w-full py-[6px] px-[12px]"
                      />
                    </div>
                  </div>
                )}
                <div className="flex font-univers text-[#5a6872] text-m py-2 px-3 mt-8 bg-[#f8f9f9] rounded-lg">
                  <p>
                    {`${signupState.stepThreeFormDetails.sq_description_below}`}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 md:px-6 flex justify-end gap-4 w-full">
              <button
                onClick={() => handleProfileStep("STEP_2")}
                className="px-4 py-2 text-light-gray hover:bg-gray-100 rounded-lg transition-colors"
              >
                {translations?.[locale]?.back}
              </button>
              <button
                disabled={signupState.securityAnswer === ""}
                onClick={() => handleProfileStep("STEP_4")}
                className={` 
                  ${signupState.securityAnswer === "" ? "cursor-not-allowed opacity-65" : "opacity-100"} 
                  ${`bg-primary hover:bg-red px-6 py-2 text-white rounded-l transition-colors`}`}
              >
                {translations?.[locale]?.continue}
              </button>
            </div>
          </div>
        )}

        {currentProfileStep === "STEP_4" && (
          <div className="step-4 choose-avatar flex flex-col justify-between">
            <div className="w-full flex flex-wrap">
              <div className="flex items-center mb-8 bg-[#FFF9EB] w-full flex-wrap p-8 md:hidden rounded-2xl">
                <div className="w-full">
                  <h2
                    className={`text-[20px] font-semibold leading-relaxed  ${laila.className}`}
                  >
                    Choose Your avatar and background
                  </h2>
                </div>
                <div className="w-full ">
                  <h4 className="leading-relaxed text-[#5A6872] font-normal text-base">
                    You can change your avatar and background also customise it
                  </h4>
                </div>
                <div className="flex bg-white items-center gap-2 p-4 rounded-full m-auto">
                  <div className="w-24 h-24 bg-blue-200 rounded-full overflow-hidden flex items-center justify-center mb-2">
                    <Image
                      src={
                        userDetails.avatarUrl === ""
                          ? "/assets/images/default-avatar.png"
                          : userDetails.avatarUrl
                      }
                      width={100}
                      height={100}
                      alt="user-icon"
                    />
                  </div>
                  <div className="">
                    <p className="text-primary font-medium font-univers text-base">
                      {userDetails.nickname === ""
                        ? `${translations?.[locale]?.no_username}`
                        : userDetails.nickname}
                    </p>
                    <p className="text-light-gray font-univers text-m">
                      {translations?.[locale]?.unregistered_user}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full pb-6 hidden md:block">
                <h2
                  className={`${laila.className} text-red-wine text-xl font-semibold m-0 w-full`}
                >
                  {signupState.stepFourAvatarFormDetails.header}
                </h2>
                <h4 className="subtitle text-m m-0 text-[#5a6872] leading-5 font-univers">
                  {signupState.stepFourAvatarFormDetails.description}
                </h4>
              </div>
              <div className="flex gap-2 flex-wrap">
                <h4
                  className={`${laila.className} font-semibold text-base w-full`}
                >
                  {signupState.stepFourAvatarFormDetails.header}
                </h4>
                <div className="flex gap-4 flex-wrap">
                  {signupState.stepFourAvatarFormDetails.avatar_images.map(
                    (item: any, index: number) => (
                      <div key={index}>
                        <div
                          onClick={() => handleProfileAvatar(item.url)}
                          className={`${item.url === userDetails.avatarUrl ? "border-2 border-primary" : ""} 'w-12 h-12 rounded-full overflow-hidden'`}
                        >
                          {item.alt}
                          <Image
                            width={52}
                            height={52}
                            src={absoluteUrl("/" + item.url)}
                            alt={`avatar-${index}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <span className="text-primary text-sm">
                          {item.url === userDetails.avatarUrl ? "Selected" : ""}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 flex justify-end gap-4 w-full mt-4">
              <button
                onClick={() => handleProfileStep("STEP_3")}
                className="px-4 py-2 text-light-gray hover:opacity-70 rounded-lg transition-colors"
              >
                {translations?.[locale]?.back}
              </button>
              <button
                onClick={() => handleProfileStep("STEP_5")}
                className={`bg-primary hover:bg-red px-6 py-2 text-white rounded-lg transition-colors`}
              >
                {userDetails.avatarUrl === ""
                  ? "Skip"
                  : `${translations?.[locale]?.continue}`}
              </button>
            </div>
          </div>
        )}

        {currentProfileStep === "STEP_5" && (
          <div className="step-5 choose-avatar flex flex-col justify-between">
            <div className="w-full flex flex-wrap">
              <div className="w-full pb-6">
                <h2
                  className={`${laila.className} text-[#31020e] text-xl font-semibold m-0 w-full`}
                >
                  {signupState.stepFiveCommunityGuidelines.header}
                </h2>
                <h4 className="subtitle text-m m-0 text-[#5a6872] leading-5 font-univers">
                  {signupState.stepFiveCommunityGuidelines.description}
                </h4>
              </div>
              <div className="bg-[#f8f9f9] rounded-2xl py-3 px-4">
                <div className="video-wrapper p-4 border rounded-2xl border-primary">
                  <video className="bg-slate-600" playsInline controls>
                    <source
                      src={signupState.stepFiveCommunityGuidelines.video_url}
                    />
                  </video>
                </div>
                <div>
                  <div className="pt-3 flex gap-2">
                    <input
                      onChange={() =>
                        handleAcceptTerms(!signupState.acceptTerms)
                      }
                      type="checkbox"
                      className="checkbox"
                      id="agree-guidelines"
                    />
                    <label
                      htmlFor="agree-guidelines"
                      className="cursor-pointer text-m font-univers pt-1"
                    >
                      {
                        signupState.stepFiveCommunityGuidelines
                          .accept_guidelines_check
                      }
                    </label>
                  </div>
                  <p className="text-sm font-univers pt-1 hidden md:block">
                    {
                      signupState.stepFiveCommunityGuidelines
                        .accept_guide_description
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 flex justify-end gap-4 w-full pt-20">
              <button
                onClick={() => handleProfileStep("STEP_4")}
                className="px-4 py-2 text-light-gray hover:bg-gray-100 rounded-lg transition-colors"
              >
                {translations?.[locale]?.back}
              </button>
              <button
                disabled={!signupState.acceptTerms}
                onClick={() => handleCreateUser()}
                className={`${!signupState.acceptTerms ? "cursor-not-allowed opacity-65" : "opacity-100"} 
                  ${`bg-primary hover:bg-red px-6 py-2 text-white rounded-lg transition-colors`}`}
              >
                {signupState.acceptTerms
                  ? `${translations?.[locale]?.finish}`
                  : `${translations?.[locale]?.continue}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
