import { useRef, useState, useEffect } from "react"
import QuestionCard from "./QuestionCard"
import { ListingShimmer } from "../Shimmer"
import { getIndividualQuestion } from "@/src/lib/apis"
import CommentInput from "./CommentInput"
import RepliesList from "./RepliesList"
import "./QuestionDetails.scss"
import { getAccessToken } from "@/src/lib/protectedAuth"
import { useTranslations } from "@/src/contexts/TranslationsContext"
import { useLocale } from "use-intl"

// Define types for props
interface CurrentUser {
  userName: string | null
  isUserLoggedIn: boolean | null
  userAvatarUrl?: string | null
}

interface QuestionDetailsProps {
  currentUser: CurrentUser
  questionID: string | number | null
  onClose: (questionID: string | number | null) => void
}

const QuestionDetails: React.FC<QuestionDetailsProps> = ({
  currentUser,
  questionID,
  onClose,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [modalContent, setModalContent] = useState<any>(null)
  const { translations } = useTranslations()
  const locale = useLocale()

  const handleFocusButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const fetchIndividualQues = async (questionID: string | number) => {
    let token = await getAccessToken();
    setLoading(true)
    try {
      const response = await getIndividualQuestion(questionID, token)
      setModalContent(response.data)
    } catch (error: any) {
      console.error("Error fetching question:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (questionID == null) return
    // Fetch the data based on the dynamic question ID.
    fetchIndividualQues(questionID)
  }, [questionID])

  return (
    <>
      <div
        className="modal-overlay bg-[rgba(0,0,0,0.3)] community-overlay z-20 fixed w-screen h-screen top-0 bottom-0 right-0 left-0"
        onClick={() => onClose(questionID)}
      >
        <div
          className="modal-content bg-white rounded-xl py-8 px-4 fixed top-1/2 overflow-y-auto max-h-[70%] w-full max-w-[calc(100%-2rem)] lg:max-w-[50rem] -translate-x-1/2 -translate-y-1/2 left-1/2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="modal-close underline mb-4 text-m text-light-gray"
            onClick={() => onClose(questionID)}
          >
            {"Close"}
          </button>
          {isLoading ? (
            <ListingShimmer />
          ) : (
            modalContent && (
              <div className="modal-body relative">
                <QuestionCard
                  question={modalContent}
                  onClick={handleFocusButtonClick}
                  currentUser={currentUser}
                />
                <RepliesList
                  replies={modalContent.all_replies}
                  currentUser={currentUser}
                />
                {currentUser && currentUser.isUserLoggedIn && (
                  <CommentInput
                    placeholder={`${translations?.[locale]?.comment_as}`}
                    username={currentUser.userName}
                    currentUser={currentUser}
                    ref={inputRef}
                    resourceId="node"
                  />
                )}
              </div>
            )
          )}
        </div>
      </div>
    </>
  )
}

export default QuestionDetails
