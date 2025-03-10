import { useTranslations } from "@/src/contexts/TranslationsContext"
import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useLocale } from "next-intl"
import { laila } from "@/src/lib/utils"
import { getStepThreeFormDetails, getStepTwoFormDetails } from "./api"
import { EyeClosed, EyeOpened } from "@/src/lib/icons"
import { changePassword, validateSecurityQuestion } from "@/src/lib/apis"
import StatusChip from "@/src/components/CommunityPage/StatusChip"

const ForgotPasswordModal = ({
  setforgotPwdModal,
}: {
  setforgotPwdModal: Dispatch<SetStateAction<boolean>>
}) => {
  const [username, setUsername] = useState("")
  const [securityQues, setSecurityQues] = useState<any>(null)
  const [passwordDetails, setPasswordDetails] = useState<any>(null)
  const [securityAnswer, setSecurityAnswer] = useState("")
  const [selectedSecurityQuestion, setSelectedSecurityQues] = useState("")
  const [showPwdField, setShowPwdField] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [passLengthError, setPassLengthError] = useState(true)
  const [passStrongError, setPassStrongError] = useState(true)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [password, setPasswordValue] = useState("")
  const [errorMessage, setErrorMessage] = useState(false)
  const [uid, setuid] = useState("")
  const { translations } = useTranslations()
  const [message, setMessage] = useState("")
  const locale = useLocale()

  // Close modal if clicked outside
  const closeModal = (e: React.MouseEvent) => {
    const modalElement = e.target as HTMLElement
    if (modalElement.closest(".forgot-pwd-modal")) return
    setforgotPwdModal(false)
  }

  // Handle confirm password field input
  const handleConfirmPasswordChange = (e: any) => {
    let pass = e.target.value
    setConfirmPassword(pass)
  }

  // Handle password field input and validate length/strength
  const handlePasswordValidation = (event: any) => {
    let password = event.target.value
    setPasswordValue(password)

    // Check password length
    if (password.length < 4 || password.length > 16) {
      setPassLengthError(true)
    } else {
      setPassLengthError(false)
    }

    // Check password for at least one number
    if (!password.match(/[0-9]/g)) {
      setPassStrongError(true)
    } else {
      setPassStrongError(false)
    }
  }

  // Submit security question for validation
  const handleSecQuesSubmit = async (e: any) => {
    e.preventDefault()
    const requestData = {
      username: username,
      securityQuestion: selectedSecurityQuestion,
      answer: securityAnswer,
    }

    const result = await validateSecurityQuestion(requestData)

    if (result.success) {
      setShowPwdField(true) // Show password fields if validation succeeds
    } else {
      setErrorMessage(true) // Show error if validation fails
    }
  }

  // Submit new password to change it
  const handleChangePassword = async (e: any) => {
    e.preventDefault()
    const data = {
      password,
      uid,
    }

    const result = await changePassword(data)

    if (result.success) {
      setMessage(result.message) // Set success message
      setforgotPwdModal(false) // Close modal on success
    } else {
      setErrorMessage(result.message) // Set error message on failure
      console.error(result.message)
    }
  }

  // Fetch security questions and password policies on component mount
  useEffect(() => {
    getStepThreeFormDetails(locale).then((res) => {
      setSecurityQues(res)
    })

    getStepTwoFormDetails(locale).then((res) => {
      setPasswordDetails(res)
    })
  }, [])

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-50 z-50"
        onClick={closeModal}
      >
        <div className="forgot-pwd-modal max-h-[80vh] overflow-y-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg max-w-[calc(100%-2rem)] mx-auto lg:max-w-[48rem] w-full z-60">
          <div
            className={`modal-heading text-primary text-xl font-semibold -mx-6 -mt-6 mb-8 ${laila.className} py-4 px-6 bg-color-secondary`}
          >
            {translations?.[locale]?.forgot_passwd}
          </div>

          <div className="form">
            <div className="username mb-6">
              <label className="text-base mb-2 font-medium block">
                {translations?.[locale]?.username}
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            {!showPwdField && (
              <div className="w-full">
                <h2
                  className={`${laila.className} text-[#31020e] text-l font-semibold m-0`}
                >
                  {securityQues?.header}
                </h2>
                <h4 className="subtitle text-m m-0 text-neutral font-normal leading-5 font-univers">
                  {translations?.[locale]?.security_label}
                </h4>

                <div className="pt-6">
                  <div className="flex mb-4 flex-wrap">
                    <div className="w-full md:w-1/3">
                      <label className="text-m">{securityQues?.sq_label}</label>
                    </div>
                    <div className="w-full md:w-2/3">
                      <select
                        className="rounded-lg w-full"
                        onChange={(e) =>
                          setSelectedSecurityQues(e.target.value)
                        }
                        value={selectedSecurityQuestion || ""}
                      >
                        <option value={""}>
                          {translations?.[locale]?.select_question}
                        </option>
                        {securityQues &&
                          Object.entries(securityQues?.security_questions).map(
                            ([key, value]) => {
                              if (key !== "") {
                                return (
                                  <option value={key} key={key} id={key}>
                                    {value as string}
                                  </option>
                                )
                              }
                              return null
                            }
                          )}
                      </select>
                    </div>
                  </div>
                  {selectedSecurityQuestion !== "" && (
                    <div className="flex flex-wrap">
                      <div className="w-full md:w-1/3">
                        <label className="text-m">
                          {translations?.[locale]?.your_ans}
                        </label>
                      </div>
                      <div className="w-full md:w-2/3">
                        <input
                          value={securityAnswer}
                          onChange={(e) => setSecurityAnswer(e.target.value)}
                          placeholder={`${translations?.[locale]?.your_ans}`}
                          className="border rounded-lg w-full py-[6px] px-[12px]"
                        />
                        {errorMessage && (
                          <div className="error text-sm text-red-100 mt-2">
                            {translations?.[locale]?.security_error}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-4 pt-4 w-full">
                  <button
                    type="button"
                    className="px-4 py-2 text-light-gray hover:bg-gray-100 rounded-md transition duration-200"
                    onClick={() => setforgotPwdModal(false)}
                  >
                    {translations?.[locale]?.cancel}
                  </button>
                  <button
                    disabled={!username || !securityAnswer}
                    type="submit"
                    onClick={handleSecQuesSubmit}
                    className={`px-4 py-2 bg-primary hover:bg-red text-white rounded-md transition duration-200 ${!username || !securityAnswer ? "cursor-not-allowed opacity-70" : ""}`}
                  >
                    {translations?.[locale]?.confirm}
                  </button>
                </div>
              </div>
            )}
            {showPwdField && (
              <div className="step-2 set-password-wrapper flex flex-col justify-between">
                <div className="w-full">
                  <h2
                    className={`${laila.className} text-red-wine text-l font-semibold mb-0`}
                  >
                    {translations?.[locale]?.new_password}
                  </h2>
                  <h4 className="subtitle text-m m-0 text-color-neutral leading-5 font-univers">
                    {translations?.[locale]?.select_uname_pwd}
                  </h4>
                  <div className="mt-6 md:mt-4 block md:hidden mb-4">
                    <label className="text-m font-univers mb-2 block">
                      {translations?.[locale]?.new_password}
                    </label>
                    <div className="relative flex">
                      <input
                        onChange={handlePasswordValidation}
                        value={password}
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
                        className={`${passLengthError ? "text-primary" : "text-[#228161]"}`}
                      >
                        {passwordDetails.policy1}
                      </li>
                      <li
                        className={`${passStrongError ? "text-primary" : "text-[#228161]"}`}
                      >
                        {passwordDetails.policy2}
                      </li>
                    </ul>
                    <div className="border-t px-2 text-m leading-6 pt-2 mt-2 border-gray-500">
                      {passwordDetails.example_pass}
                    </div>
                  </div>

                  <div className="mt-4 hidden md:block">
                    <label className="text-m font-univers mb-2 block">
                      {translations?.[locale]?.password}
                    </label>
                    <div className="relative flex">
                      <input
                        onChange={handlePasswordValidation}
                        value={password}
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
                <div className="flex justify-end gap-4 pt-4 w-full">
                  <button
                    type="button"
                    className="px-4 py-2 text-light-gray hover:bg-gray-100 rounded-md transition duration-200"
                    onClick={() => setforgotPwdModal(false)}
                  >
                    {translations?.[locale]?.cancel}
                  </button>
                  <button
                    disabled={!(password === confirmPassword)}
                    type="submit"
                    onClick={handleChangePassword}
                    className={`px-4 py-2 bg-primary hover:bg-red text-white rounded-md transition duration-200 ${!(password === confirmPassword) ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {translations?.[locale]?.submit}
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            className="absolute top-2 right-4 text-2xl text-default-black hover:text-color-neutral"
            onClick={() => setforgotPwdModal(false)}
          >
            &times;
          </button>
        </div>
      </div>
      {message && <StatusChip message={message} />}
    </>
  )
}

export default ForgotPasswordModal
