import { createUser } from "@/src/app/[locale]/community-conversations/api"
import { useSignUp } from "@/src/contexts/SignUpProvider"
import { useTranslations } from "@/src/contexts/TranslationsContext"
import { EyeClosed, EyeOpened, GreenTick } from "@/src/lib/icons"
import { refreshTheToken } from "@/src/lib/protectedAuth"
import { absoluteUrl, getCountryCode, laila } from "@/src/lib/utils"
import { useLocale } from "next-intl"
import Image from "next/image"
import { useState } from "react"

const EditProfile = ({
  loggedInUserDetails,
  editYourProfileSteps,
  currentProfileStep,
  editState,
  securityQuestions,
  handleUserDetails,
  handleProfileStep,
  dispatch,
  modalActive,
}: any) => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [passLengthError, setPassLengthError] = useState(true)
  const [passStrongError, setPassStrongError] = useState(true)
  const [confirmPassword, setConfirmPassword] = useState("")
  const locale = useLocale()
  const { userId } = useSignUp()
  const handleConfirmPasswordChange = (e: any) => {
    let pass = e.target.value
    setConfirmPassword(pass)
  }
  const { translations } = useTranslations()

  const handleSelectSecurityQuestion = (e: any) => {
    const selectedQuestion = e.target.value
    dispatch({
      type: "SET_SELECTED_SECURITY_QUESTION",
      selectedSecurityQuestion: selectedQuestion,
    })
  }

  const handleAnswerChange = (e: any) => {
    const answer = e.target.value
    dispatch({
      type: "SET_SECURITY_ANSWER",
      securityAnswer: answer,
    })
  }

  const handleProfileAvatar = (url: string) => {
    let tempUserDetails = { ...loggedInUserDetails }
    tempUserDetails.avatarUrl = url
    handleUserDetails(tempUserDetails)
  }

  const handlePasswordValidation = (event: any) => {
    let password = event.target.value

    let tempUserDetails = { ...loggedInUserDetails }
    tempUserDetails.password = password
    handleUserDetails(tempUserDetails)

    if (password.length < 4 || password.length > 16) {
      setPassLengthError(true)
    } else {
      setPassLengthError(false)
    }
    // check if password have at least one number
    if (!password.match(/[0-9]/g)) {
      setPassStrongError(true)
    } else {
      setPassStrongError(false)
    }
  }

  type EditUserDetails = {
    name: string
    pass?: string
    avatar_tid: string
    country: string
    security_question_tid: string | null
    answer: string
    uid: string | null
  }

  const handleUpdateUser = async () => {
    let securityQuestionTid = null
    Object.entries(editState.stepTwoFormDetails.security_questions).forEach(
      ([key, value]) => {
        if (editState.selectedSecurityQuestion === String(value)) {
          securityQuestionTid = key
        }
      }
    )

    let userDetails: EditUserDetails = {
      name: editState.loggedInUserDetails.nickname,
      avatar_tid: editState.loggedInUserDetails.avatarUrl,
      country: getCountryCode() ?? "",
      security_question_tid: securityQuestionTid,
      answer: editState.securityAnswer,
      uid: userId,
    }

    if (editState.loggedInUserDetails.password) {
      userDetails = {
        ...userDetails,
        pass: editState.loggedInUserDetails.password,
      }
    }

    let res = await createUser(userDetails, locale)

    await refreshTheToken();

    if (res.error === null) {
      location.reload()
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-[60px] py-12 max-h-[540px] overflow-auto">
        <div className="hidden md:block bg-gray-100 p-6 rounded-lg">
          <div className="flex items-center mb-8">
            <div className="flex bg-white items-center gap-2 p-4 rounded-full">
              <div className="w-24 h-24 bg-blue-200 rounded-full overflow-hidden flex items-center justify-center mb-2">
                {loggedInUserDetails?.avatarUrl ? (
                  <Image
                    src={absoluteUrl("/" + loggedInUserDetails?.avatarUrl)}
                    width={100}
                    height={100}
                    alt="user-icon"
                  />
                ) : (
                  <Image
                    src={"/assets/images/default-avatar.png"}
                    width={100}
                    height={100}
                    alt="user-icon"
                  />
                )}
              </div>
              <div className="">
                <p className="text-[#f7265d] font-medium font-univers text-base">
                  {loggedInUserDetails.nickname === ""
                    ? `${translations?.[locale]?.no_username}`
                    : loggedInUserDetails.nickname}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {Array.from(editYourProfileSteps).map(([k, v]: any, index) => (
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
        <div className="right-section">
          {currentProfileStep === "STEP_1" && (
            <div className="step-2 set-password-wrapper flex flex-col justify-between">
              <div className="w-full">
                <h2
                  className={`${laila.className} text-[#31020e] text-xl font-semibold mb-0`}
                >
                  {editState.stepOneFormDetails?.header}
                </h2>
                <h4 className="subtitle text-m m-0 text-[#5a6872] leading-5 font-univers">
                  {translations?.[locale]?.select_uname_pwd}
                </h4>
                <div className="mt-6 md:mt-4 block md:hidden mb-4">
                  <label className="text-m font-univers mb-2 block">
                    {translations?.[locale]?.new_password}
                  </label>
                  <div className="relative flex">
                    <input
                      onChange={handlePasswordValidation}
                      value={loggedInUserDetails.password}
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
                      {editState.stepOneFormDetails.policy1}
                    </li>
                    <li
                      className={`${passStrongError ? "text-[#f7265d]" : "text-[#228161]"}`}
                    >
                      {editState.stepOneFormDetails.policy2}
                    </li>
                  </ul>
                  <div className="border-t px-2 text-m leading-6 pt-2 mt-2 border-[#c2c8cc]">
                    {editState.stepOneFormDetails.example_pass}
                  </div>
                </div>

                <div className="mt-4 hidden md:block">
                  <label className="text-m font-univers mb-2 block">
                    {translations?.[locale]?.new_password}
                  </label>
                  <div className="relative flex">
                    <input
                      onChange={handlePasswordValidation}
                      value={loggedInUserDetails.password}
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
                  onClick={() => modalActive(false)}
                  className="px-4 py-2 text-light-gray hover:bg-red rounded-lg transition-colors"
                >
                  {translations?.[locale]?.cancel}
                </button>
                <button
                  disabled={
                    loggedInUserDetails?.password &&
                    loggedInUserDetails.password !== confirmPassword
                  }
                  onClick={() => handleProfileStep("STEP_2")}
                  className={` ${loggedInUserDetails?.password && loggedInUserDetails?.password !== confirmPassword ? "cursor-not-allowed opacity-65" : "opacity-100"} ${`bg-primary hover:bg-red px-6 py-2 text-white rounded-lg transition-colors`}`}
                >
                  {translations?.[locale]?.continue}
                </button>
              </div>
            </div>
          )}
          {currentProfileStep === "STEP_2" && (
            <div className="step-2 security-question flex flex-col justify-between">
              <div className="w-full">
                <h2
                  className={`${laila.className} text-[#31020e] text-xl font-semibold m-0`}
                >
                  {editState.stepTwoFormDetails.header}
                </h2>
                <h4 className="subtitle text-m m-0 text-[#5a6872] leading-5 font-univers">
                  {editState.stepTwoFormDetails.sq_description_above}
                </h4>

                <div className="pt-6">
                  <div className="flex mb-4 flex-wrap">
                    <div className="w-full md:w-1/3">
                      <label className="text-m">
                        {editState?.stepTwoFormDetails?.sq_label}
                      </label>
                    </div>
                    <div className="w-full md:w-2/3">
                      <select
                        className="rounded-lg w-full"
                        onChange={handleSelectSecurityQuestion}
                        value={editState?.selectedSecurityQuestion || ""}
                      >
                        <option value={""}>
                          {translations?.[locale]?.select_question}
                        </option>
                        {securityQuestions.map((ques: any) => (
                          <option value={ques} key={ques}>
                            {ques}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {editState?.selectedSecurityQuestion !== "" && (
                    <div className="flex flex-wrap">
                      <div className="w-full md:w-1/3">
                        <label className="text-m">
                          {translations?.[locale]?.your_answer}
                        </label>
                      </div>
                      <div className="w-full md:w-2/3">
                        <input
                          value={editState?.securityAnswer}
                          onChange={handleAnswerChange}
                          placeholder="Your Answer"
                          className="border rounded-lg w-full py-[6px] px-[12px]"
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex font-univers text-[#5a6872] text-m py-2 px-3 mt-8 bg-[#f8f9f9] rounded-lg">
                    <p>{editState.stepTwoFormDetails.sq_description_below}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:px-6 flex justify-end gap-4 w-full">
                <button
                  onClick={() => handleProfileStep("STEP_1")}
                  className="px-4 py-2 text-light-gray hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {translations?.[locale]?.back}
                </button>
                <button
                  onClick={() => handleProfileStep("STEP_3")}
                  className={`
                  ${editState.securityAnswer === "" ? "cursor-not-allowed opacity-65" : "opacity-100"} 
                  ${`bg-primary hover:bg-red px-6 py-2 text-white rounded-lg transition-colors`}`}
                >
                  {translations?.[locale]?.continue}
                </button>
              </div>
            </div>
          )}
          {currentProfileStep === "STEP_3" && (
            <div className="step-4 choose-avatar flex flex-col justify-between">
              <div className="w-full flex flex-wrap">
                <div className="flex items-center mb-8 bg-[#FFF9EB] w-full flex-wrap p-8 md:hidden rounded-2xl">
                  <div className="w-full">
                    <h2
                      className={`text-[20px] font-semibold leading-relaxed  ${laila.className}`}
                    >
                      {editState.stepThreeAvatarFormDetails.description}
                    </h2>
                  </div>
                  <div className="w-full ">
                    <h4 className="leading-relaxed text-color-neutral font-normal text-base">
                      You can change your avatar and background also customise
                      it
                    </h4>
                  </div>
                  <div className="flex bg-white items-center gap-2 p-4 rounded-full m-auto">
                    <div className="w-24 h-24 bg-blue-200 rounded-full overflow-hidden flex items-center justify-center mb-2">
                      <Image
                        src={
                          loggedInUserDetails.avatarUrl === ""
                            ? `${absoluteUrl("/assets/images/default-avatar.png")}`
                            : absoluteUrl("/" + loggedInUserDetails.avatarUrl)
                        }
                        width={100}
                        height={100}
                        alt="user-icon"
                      />
                    </div>
                    <div className="">
                      <p className="text-primary font-medium font-univers text-base">
                        {loggedInUserDetails.nickname === ""
                          ? `${translations?.[locale]?.no_username}`
                          : loggedInUserDetails.nickname}
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
                    {editState.stepThreeAvatarFormDetails.header}
                  </h2>
                  <h4 className="subtitle text-m m-0 text-[#5a6872] leading-5 font-univers">
                    {editState?.stepThreeAvatarFormDetails.description}
                  </h4>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <h4
                    className={`${laila.className} font-semibold text-base w-full`}
                  >
                    {editState?.stepThreeAvatarFormDetails.header}
                  </h4>
                  <div className="flex gap-4 flex-wrap">
                    {editState?.stepThreeAvatarFormDetails.avatar_images.map(
                      (item: any, index: number) => (
                        <div key={index}>
                          <div
                            onClick={() => handleProfileAvatar(item.url)}
                            className={`${item.url === loggedInUserDetails.avatarUrl ? "border-2 border-primary" : ""} 'w-12 h-12 rounded-full overflow-hidden'`}
                          >
                            <Image
                              width={52}
                              height={52}
                              src={absoluteUrl("/" + item.url)}
                              alt={`avatar-${index}`}
                              className="w-full h-full object-cover rounded-[50%]"
                            />
                          </div>
                          <span className="text-primary text-sm">
                            {item.url === loggedInUserDetails.avatarUrl
                              ? "Selected"
                              : ""}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="px-6 flex justify-end gap-4 w-full mt-4">
                <button
                  onClick={() => handleProfileStep("STEP_2")}
                  className="px-4 py-2 text-light-gray hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {translations?.[locale]?.back}
                </button>
                <button
                  onClick={() => handleUpdateUser()}
                  className={`bg-primary hover:bg-red px-6 py-2 text-white rounded-lg transition-colors`}
                >
                  {translations?.[locale]?.submit}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default EditProfile
