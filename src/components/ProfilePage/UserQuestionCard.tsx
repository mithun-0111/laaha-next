import { useState, useEffect, useRef } from "react"
import { HtmlToText } from "../CommunityPage/HtmlToText"
import ReactionsList from "../CommunityPage/ReactionsList"
import {
  DefaultProfileIcon,
  Draft,
  Published,
  Rejected,
  Review,
  UnPublished,
} from "@/src/lib/icons"
import { PostDelete, updateQuestion } from "@/src/lib/apis"
import "./StatusChips.scss"
import { absoluteUrl, laila } from "@/src/lib/utils"
import Image from "next/image"
import { getAccessToken } from "@/src/lib/protectedAuth"
import UserGuidelineModal from "../CommunityPage/UserGuidelineModal"
import { useTranslations } from "@/src/contexts/TranslationsContext"
import { useLocale } from "next-intl"
import StatusChip from "../CommunityPage/StatusChip"

// Define types for the question and user objects
interface User {
  userAvatarUrl?: string
  name: string
  time: string
}

interface Question {
  id: string
  status: string
  question_detail: string
  canned_response?: string
  actions: { delete_link: string }
  reactions?: string
  comment_count: number
  category?: string
  user: User
  last_edited?: string
}

interface UserQuestionCardProps {
  question: Question
  user: User
}

const UserQuestionCard: React.FC<UserQuestionCardProps> = ({
  question,
  user,
}) => {
  const [isActive, setActive] = useState(false)
  const [draftQuestion, setDraftQuestion] = useState<string>("")
  const [isEditing, setIsEditing] = useState(false)

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const submitRef = useRef<HTMLDivElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>()
  const locale = useLocale()
  const { translations } = useTranslations()
  const [message, setShowMessage] = useState<any>(null)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (question.status === "Draft") {
      const text = question.question_detail
      setDraftQuestion(text)
    }
  }, [question])

  // Handle clicks outside of the input and submit buttons
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        textAreaRef.current &&
        !textAreaRef.current.contains(event.target as Node) &&
        submitRef.current &&
        !submitRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false)
      }

      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActive(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraftQuestion(e.target.value)
  }

  const handleButtonClick = () => {
    setIsEditing(!isEditing)

    if (textAreaRef.current) {
      textAreaRef.current.focus()
    }
  }

  const handleSubmit = async (
    resourceId: string,
    moderation_status: string
  ) => {
    let token = await getAccessToken();

    const response = await updateQuestion(
      draftQuestion,
      resourceId,
      moderation_status,
      token
    )
    if (response.status === 200) {
      location.reload()
    }
  }

  const handleDeleteQuestion = () => {
    PostDelete(question.id, "question", locale, setShowMessage)
  }

  const onCommentSubmit = (
    event: React.FormEvent,
    resourceId: string,
    moderation_status: string
  ) => {
    event.preventDefault()
    handleSubmit(resourceId, moderation_status)
  }

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <Draft />
      case "published":
        return <Published />
      case "unpublished":
        return <UnPublished />
      case "in review":
        return <Review />
      case "rejected":
        return <Rejected />
      default:
        return null
    }
  }

  return (
    <div className="user-ques-card bg-white py-6 px-4 border border-gray-300 rounded-md mb-6">
      <div className="ques-status-wrapper mb-4 inline-flex items-center">
        <span
          className={`status-chip ${question.status && question.status.toLowerCase()}`}
        >
          {question.status !== "Draft" ? (
            <>
              {renderStatusIcon(
                question.status && question.status.toLowerCase()
              )}
              {question.status}
            </>
          ) : (
            <>
              <div
                className="draft-button inline-flex gap-x-2"
                onClick={handleButtonClick}
              >
                {renderStatusIcon(
                  question.status && question.status.toLowerCase()
                )}
                {question.status}
              </div>
            </>
          )}
        </span>
        <span>
          <div className="user-actions relative cursor-pointer" ref={menuRef}>
            <span
              onClick={() => setActive(!isActive)}
              className="user-action-button"
            >
              ...
            </span>
            <ul
              className={`user-action-links absolute right-0 py-2 ps-3 pe-6 rounded-md shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)] bg-white list-none ${isActive ? "active block" : "hidden"}`}
            >
              <li>
                <a
                  className="use-ajax"
                  data-dialog-type="modal"
                  onClick={handleDeleteQuestion}
                >
                  {translations?.[locale]?.delete}
                </a>
              </li>
            </ul>
          </div>
        </span>
      </div>

      {(question.status === "Published" ||
        question.status === "Unpublished" ||
        question.status === "Rejected") &&
        question.canned_response && (
          <div className="ques-feedbacks bg-gray-600 p-2 mb-2 rounded-lg">
            <HtmlToText html={question.canned_response} />
          </div>
        )}

      {(question.status === "Unpublished" ||
        question.status === "Rejected") && (
        <div className="community-guide bg-orange p-2 mb-4 rounded-lg">
          <span className="warning-icon">
            {translations?.[locale]?.learn_more}
          </span>
          <span
            className="text-blue underline hover:opacity-70"
            onClick={() => openModal()}
          >
            {translations?.[locale]?.community_guidelines}
          </span>
        </div>
      )}

      {(question.status === "Published" || question.status === "In Review") && (
        <div className="question mb-4">
          <HtmlToText html={question.question_detail} />
        </div>
      )}

      {question.status === "Draft" && (
        <>
          <div className="question mb-4">
            <textarea
              className={`outline-none w-full bg-transparent ${isEditing ? "active border-2 p-2 rounded-md border-default-black" : "border-none"}`}
              ref={textAreaRef}
              value={draftQuestion}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>

          {isEditing && (
            <form action="">
              <div
                className="form-submit inline-flex items-center gap-x-4 mt-5 w-full justify-end"
                ref={submitRef}
              >
                <input
                  type="button"
                  onClick={(e) => onCommentSubmit(e, question.id, "draft")}
                  value={translations?.[locale]?.draft_button}
                  disabled={!draftQuestion.trim()}
                  className="draft-button px-4 py-2 text-primary cursor-pointer disabled:opacity-80 disabled:pointer-events-none hover:text-red"
                />
                <input
                  type="submit"
                  onClick={(e) => onCommentSubmit(e, question.id, "review")}
                  value={translations?.[locale]?.post_button}
                  className="px-4 py-2 bg-primary cursor-pointer disabled:opacity-75 disabled:pointer-events-none rounded-md text-white hover:bg-red-100"
                  disabled={!draftQuestion.trim()}
                />
              </div>
            </form>
          )}
        </>
      )}

      {question.category && (
        <div
          className={`category p-1.5 bg-color-secondary rounded-md text-sm ${laila.className} text-primary inline-block`}
        >
          {question.category}
        </div>
      )}

      {user && question.status !== "Draft" && (
        <div className="user-ques-card-bottom bg-white flex flex-wrap items-center justify-between pt-2 mt-4 border-t border-gray-300">
          <div className="user-details inline-flex flex-wrap items-center mb-4 lg:mb-0">
            {user.userAvatarUrl ? (
              <Image
                loading="lazy"
                width={32}
                height={32}
                src={absoluteUrl("/" + user?.userAvatarUrl)}
                alt={"User"}
              />
            ) : (
              <DefaultProfileIcon />
            )}
            <div
              className={`username text-sm font-semibold ${laila.className} mx-1`}
            >
              {question?.user?.name}
            </div>
            <div className="posted-date text-sm text-color-neutral uppercase">
              {question.user.time}
            </div>
          </div>

          {question.status === "Published" &&
            (question.reactions || question.comment_count) && (
              <div className="reactions inline-flex items-center gap-x-4 text-color-neutral">
                {question.reactions && (
                  <ReactionsList reactions={question.reactions} />
                )}
                <div className="comment-count text-sm">
                  {question.comment_count} {translations?.[locale]?.comments}
                </div>
              </div>
            )}
        </div>
      )}

      {question.status === "Draft" && (
        <div className="user-ques-card-bottom bg-white flex items-center justify-between pt-2 mt-4 border-t border-gray-300">
          <div className="posted-date text-m text-color-neutral">
            {translations?.[locale]?.last_edited} {question.last_edited}
          </div>
        </div>
      )}

      {isModalOpen && (
        <UserGuidelineModal isModalOpen={isModalOpen} closeModal={closeModal} />
      )}

      {message && <StatusChip message={message} />}
    </div>
  )
}

export default UserQuestionCard
