import { absoluteUrl, laila } from "@/src/lib/utils"
import { useContext, useEffect, useState } from "react"
import { ListingShimmer } from "../Shimmer"
import Image from "next/image"
import { fetchAskQuestionConfig, PostComment } from "@/src/lib/apis"
import PostConfirmation from "./PostConfirmation"
import { SignUpContext } from "@/src/contexts/SignUpProvider"
import { useLocale } from "next-intl"
import { getAccessToken } from "@/src/lib/protectedAuth"
import { useTranslations } from "@/src/contexts/TranslationsContext"

type askQuestionProps = {
  video_url: string
  title: string
  description: string
  accept_term_content: string
}

const AskQuestionModal = ({ isModalOpen, closeModal }: any) => {
  const [loading, setLoading] = useState(false) // State for loading indicator
  const [inputValue, setInputValue] = useState("") // State for the input value
  const [successMessage, setSuccessMessage] = useState("") // State for success message
  const signupContext = useContext(SignUpContext) // Access the sign-up context
  const locale = useLocale() // Get the current locale
  const [askQuesConfig, setAskQuesConfig] = useState<askQuestionProps>() // State to store question configuration
  const { translations } = useTranslations() // Get translations for different languages

  // Fetch the data needed for the question modal (video, title, description)
  const fetchData = async () => {
    let token = await getAccessToken();
    setLoading(true)
    try {
      let data = await fetchAskQuestionConfig(locale, token || "")
      setAskQuesConfig(data) // Set the configuration data
    } catch (error) {
      console.error("Failed to fetch the data") // Error handling
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData() // Fetch the data when the component mounts
  }, [])

  // Handle closing the modal when clicking outside of it
  const handleClickOutside = (e: React.MouseEvent) => {
    const modalElement = e.target as HTMLElement
    if (modalElement.closest(".icon-cards-modal")) {
      return // Don't close if clicked inside the modal
    }

    closeModal(true) // Close modal when clicked outside
  }

  // Handle the creation of a comment (post question)
  const handleCreateComment = async (
    data: any,
    resourceId: string,
    moderation_status: string
  ) => {
    try {
      let token = await getAccessToken();
      const response = await PostComment(
        resourceId,
        data,
        moderation_status,
        token || ""
      )

      if (response.status === 200) {
        setSuccessMessage(moderation_status) // Set success message based on moderation status
      }
    } catch (error) {
      console.error("Error creating resource:", error) // Error handling
    }
  }

  // Handle form submission for posting or saving as draft
  const onCommentSubmit = (
    event: React.FormEvent,
    resourceId: string,
    moderation_status: string
  ) => {
    event.preventDefault()
    if (inputValue.trim().length > 0) {
      handleCreateComment(inputValue, resourceId, moderation_status)
      setInputValue("")
    }
  }

  return (
    <>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 z-50"
          onClick={handleClickOutside} // Close modal on outside click
        >
          <div className="icon-cards-modal max-h-[80vh] overflow-y-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg max-w-[calc(100%-2rem)] mx-auto lg:max-w-[48rem] w-full z-60">
            {successMessage === "draft" ? (
              <>
                <div
                  className={`modal-heading text-primary text-xxl font-semibold -mx-6 -mt-6 mb-8 ${laila.className} py-4 px-6 bg-color-secondary`}
                >
                  <span> {translations?.[locale]?.thank_you} </span>
                </div>
                <div className="post-message text-xl">
                  {translations?.[locale]?.save_draft_success} {/* Display draft save success message */}
                </div>
              </>
            ) : successMessage === "review" ? (
              <>
                <div
                  className={`modal-heading text-primary text-xxl font-semibold -mx-6 -mt-6 mb-8 ${laila.className} py-4 px-6 bg-color-secondary`}
                >
                  {translations?.[locale]?.post_confirmation} {/* Display post confirmation message */}
                </div>
                <PostConfirmation closeModal={closeModal} />
              </>
            ) : (
              <>
                <div
                  className={`modal-heading text-primary text-xxl font-semibold -mx-6 -mt-6 mb-8 ${laila.className} py-4 px-6 bg-color-secondary`}
                >
                  {translations?.[locale]?.ask_question}
                </div>

                {loading && <ListingShimmer />}

                {/* Question input section */}
                <div className="question-field inline-flex gap-3 p-5 w-full rounded-xl border border-gray-500">
                  {signupContext?.userAvatarUrl && (
                    <Image
                      src={absoluteUrl("/" + signupContext?.userAvatarUrl)}
                      className=""
                      width={24}
                      height={24}
                      alt="User"
                    />
                  )}
                  <textarea
                    name="ask-question"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)} // Update input value on change
                    id="ask-question"
                    cols={60}
                    rows={1}
                    className="w-full p-2 bg-gray-400 border border-gray-500 rounded-md"
                    placeholder={`${translations?.[locale]?.ask_question}`}
                  ></textarea>
                </div>

                <div className="text-xl text-color-neutral pt-5 text-center mb-6 mt-6 border-t border-gray-500">
                  {askQuesConfig?.title}
                </div>

                {/* Video block */}
                <div className="video flex justify-center p-4 bg-gray-100 rounded-xl">
                  <video
                    id="video-term-question"
                    className="terms-video max-w-80"
                    controls
                  >
                    <source src={askQuesConfig?.video_url} type="video/mp4" />
                  </video>
                </div>

                {/* Action buttons (Save Draft / Post) */}
                <div className="action-buttons">
                  <div className="form-submit inline-flex items-center gap-x-2 mt-5 w-full justify-end">
                    <input
                      type="button"
                      onClick={(e) => onCommentSubmit(e, "node", "draft")}
                      value={"Save as Draft"} // Save as draft button
                      disabled={!inputValue.trim()} // Disable button if input is empty
                      className="draft-button px-4 py-2 text-primary cursor-pointer disabled:pointer-events-none disabled:opacity-80 hover:text-red"
                    />
                    <input
                      type="submit"
                      onClick={(e) => onCommentSubmit(e, "node", "review")}
                      value={"Post"} // Post button
                      className="px-4 py-2 bg-primary cursor-pointer disabled:pointer-events-none disabled:opacity-75 rounded-md text-white hover:bg-red-100"
                      disabled={!inputValue.trim()} // Disable button if input is empty
                    />
                  </div>
                </div>
              </>
            )}

            {/* Close modal button */}
            <button
              className="absolute top-2 right-4 text-2xl text-default-black hover:text-color-neutral"
              onClick={() => closeModal(true)} // Close modal on click
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default AskQuestionModal
