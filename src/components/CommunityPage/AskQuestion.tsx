import { useContext, useState } from "react"
import AskQuestionModal from "./AskQuestionModal"
import { SignUpContext } from "@/src/contexts/SignUpProvider"
import { useTranslations } from "@/src/contexts/TranslationsContext"
import { useLocale } from "use-intl"

const AskQuestion = ({ currentUser }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false) // State to control modal visibility
  const signupContext = useContext(SignUpContext) // Accessing sign-up context
  const { translations } = useTranslations() // Access translations for different languages
  const locale = useLocale() // Get the current locale/language

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true)
  }

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="ask-question p-6 bg-gray-700 rounded-xl">
      {/* Title and description */}
      <div className="title text-blue font-semibold mb-1">
        {translations?.[locale]?.have_question}
      </div>
      <div className="text-color-neutral mb-4">
        {translations?.[locale].feel_free_to_ask}
      </div>

      {/* Conditionally render the button based on user login status */}
      {currentUser &&
      !signupContext?.isUserLoggedIn &&
      translations?.[locale]?.ask_question ? (
        <span
          className={`${currentUser.isAuthUser ? 'cursor-pointer': 'pointer-events-none opacity-50'} px-4 py-2 text-white inline-block bg-primary hover:bg-red-100 rounded-md cursor-pointer`}
          onClick={() => signupContext?.setShowSignUpModal(true)} // Open sign-up modal
        >
          {translations?.[locale]?.ask_question}
        </span>
      ) : (
        <a
          href="#"
          className="px-4 py-2 text-white inline-block bg-primary hover:bg-red-100 rounded-md cursor-pointer"
          onClick={() => openModal()} // Open the question modal
        >
          {translations?.[locale]?.ask_question}
        </a>
      )}

      {/* Render the AskQuestionModal when modal is open */}
      {isModalOpen && (
        <AskQuestionModal isModalOpen={isModalOpen} closeModal={closeModal} />
      )}
    </div>
  )
}

export default AskQuestion
