"use client"

import { CommentIcon, DefaultProfileIcon, LikeHeart } from "@/src/lib/icons"
import React, { useState, useEffect, useRef, useContext } from "react"
import { HtmlToText } from "./HtmlToText"
import ReactionsList from "./ReactionsList"
import ReactionButton from "./ReactionButton"
import {
  getReportReasonsData,
  PostDelete,
  PostReaction,
  PostReport,
} from "@/src/lib/apis"
import ReportModal from "./ReportModal"
import Link from "next/link"
import { SignUpContext } from "@/src/contexts/SignUpProvider"
import Image from "next/image"
import { useLocale } from "next-intl"
import StatusChip from "./StatusChip"
import { getAccessToken } from "@/src/lib/protectedAuth"
import { useTranslations } from "@/src/contexts/TranslationsContext"
import { useValidUser } from "@/src/contexts/ValidCountryUser"

// Define interfaces for User, Actions, and Question
interface User {
  name: string
  avatar_url: string | null
  time: string
  username: string
}

interface Actions {
  report_link?: string
  delete_link?: string
}

interface Question {
  id: string
  user: User
  reactions: any
  actions: Actions
  current_user: { initialReaction: string | null }
  question_detail: string
  category?: string
  comment_count: number
}

// Define the component's props
interface QuestionCardProps {
  question: Question
  onClick: () => void
  currentUser: any
}

// Fetch report reasons from the API
export const getReportReasons = async (
  locale: string,
) => {
  let token = await getAccessToken();
  let data = await getReportReasonsData(locale, token)
  return data.report_step_1.report_category["#options"]
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onClick,
  currentUser,
}) => {
  const { user, reactions, actions, current_user } = question
  const [userReactions, setUserReactions] = useState<string>(reactions || {})
  const [reaction, setReaction] = useState<any>(
    current_user.initialReaction || null
  )
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const maxQuesLength = 200 // Max characters to show before truncating
  const [isActive, setActive] = useState<boolean>(false)
  const menuRef = useRef<HTMLDivElement | null>(null) // Reference to the menu for closing when clicked outside
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [reasonOptions, setReasonOptions] = useState([]) // Options for the report modal
  const [showMessage, setShowMessage] = useState("") // Display messages like success or error
  const token = getAccessToken() // Get access token
  const locale = useLocale() // Get the current locale
  const { translations } = useTranslations() // Translations for the UI
  const { isAuthUser } = useValidUser();

  // Open the report modal and fetch report reasons
  const handleReportClick = () => {
    setIsReportModalOpen(true)
    let reasons = getReportReasons(locale)

    reasons.then((data) => {
      setReasonOptions(data) // Set the report options once fetched
    })
  }

  // Submit the report
  const handleReportSubmit = (reason: string) => {
    PostReport(question.id, reason, locale, "node", setShowMessage)
  }

  // Handle question deletion
  const handleDeleteQuestion = () => {
    PostDelete(question.id, "question", locale, setShowMessage)
  }

  const signupContext = useContext(SignUpContext) // Context for managing sign-up state

  // Toggle the expanded state for displaying full question text
  const handleSeeMore = () => {
    setIsExpanded(!isExpanded)
  }

  // Handle the reaction to the question (like/dislike)
  const handlePostReaction = async (
    reactionType: string,
    resourceId: string,
    resourceType: string
  ) => {
    try {
      await PostReaction(reactionType, resourceId, resourceType)
    } catch (error) {
      console.error("Error creating resource:", error)
    }
  }

  // Handle user reaction (like/dislike button click)
  const handleReaction = (
    reactionType: string,
    resourceId: string,
    resourceType: string
  ) => {
    setReaction((prevReaction: any) =>
      prevReaction === reactionType ? null : reactionType
    )
    setUserReactions((prev: any) => {
      if (reaction !== null && reaction !== reactionType) {
        return {
          ...prev,
          [reaction]: Math.max(parseInt(prev[reaction], 10) - 1, 0),
          [reactionType]: parseInt(prev[reactionType], 10) + 1,
        }
      } else {
        return {
          ...prev,
          [reactionType]:
            reaction === reactionType
              ? Math.max(parseInt(prev[reactionType], 10) - 1, 0)
              : reaction != null
                ? parseInt(prev[reactionType], 10)
                : parseInt(prev[reactionType], 10) + 1,
        }
      }
    })

    handlePostReaction(reactionType, resourceId, resourceType)
  }

  // Close menu when clicked outside
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setActive(false)
    }
  }

  // Redirect user to sign up modal if they are not logged in
  const handleAnonymousLikeAndComment = (event: React.MouseEvent) => {
    event.preventDefault()
    signupContext?.setShowSignUpModal(true)
  }

  // Add event listener to close menu when clicking outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Set initial reaction state when available
  useEffect(() => {
    if (current_user?.initialReaction != null) {
      setReaction(current_user.initialReaction)
      setUserReactions(reactions)
    }
  }, [current_user?.initialReaction, reactions])

  // Display the question text, truncated if it exceeds max length
  const displayedQuestion = isExpanded
    ? question.question_detail
    : question.question_detail.length > maxQuesLength
      ? question.question_detail.slice(0, maxQuesLength) + "..."
      : question.question_detail

  return (
    <>
      <div className="question-content">
        {/* User info section */}
        <div className="user-content flex justify-between items-center">
          <div className="user-info flex items-center">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                width={32}
                height={32}
                alt="User"
                className="user-avatar max-w-8 me-4"
              />
            ) : (
              <div className="me-4">
                <DefaultProfileIcon />
              </div>
            )}
            <div className="user-name text-m">
              <strong>{user.name}</strong>
              <span> | </span>
              <span className="post-time">{user.time}</span>
            </div>
          </div>
          {currentUser && signupContext?.isUserLoggedIn && (
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
                <>
                  <li onClick={handleReportClick} className="flex items-center">
                    {translations?.[locale]?.report}
                  </li>
                  {user.name === currentUser.userName && (
                    <li
                      onClick={handleDeleteQuestion}
                      className="flex items-center"
                    >
                      {translations?.[locale]?.delete}
                    </li>
                  )}
                </>
              </ul>
            </div>
          )}
        </div>

        {/* Question content */}
        <div className="question-text mt-4">
          {question.category && (
            <div className="tags p-1.5 bg-color-secondary rounded-lg text-primary inline-block">
              {question.category}
            </div>
          )}
          {displayedQuestion && (
            <div className="question mt-2 mb-4">
              <HtmlToText html={displayedQuestion} />
            </div>
          )}

          {displayedQuestion.length > maxQuesLength && (
            <div className="showmore mb-2" onClick={() => handleSeeMore()}>
              {isExpanded
                ? `${translations?.[locale]?.see_less}`
                : `${translations?.[locale]?.see_more}`}
            </div>
          )}
        </div>

        {/* Reactions and comment count */}
        <div className="reactions flex justify-between items-center mb-4">
          <ReactionsList reactions={userReactions} />
          <span className="comment-count text-m">
            {question.comment_count} {translations?.[locale]?.comments}
          </span>
        </div>
      </div>

      {/* Like and comment buttons */}
      <div className="like-comment mb-6 flex justify-between">
        <button className={`${isAuthUser ? '': 'pointer-events-none opacity-50'} like-button border border-gray-300 rounded-md text-center flex-[0_0_50%] flex justify-center items-center`}>
          {!signupContext?.isUserLoggedIn ? (
            <Link
              href={"#"}
              onClick={handleAnonymousLikeAndComment}
              className="flex justify-center items-center gap-1.5"
            >
              <LikeHeart /> {translations?.[locale]?.like}
            </Link>
          ) : (
            <ReactionButton
              reaction={reaction}
              setReaction={setReaction}
              handleReaction={handleReaction}
              resId={question.id}
              resType="node"
              disableIcon={user.name === currentUser.userName}
            />
          )}
        </button>
        <button
          className={`${isAuthUser ? '': 'pointer-events-none opacity-50'} comment-button py-3 gap-1.5 border border-gray-300 rounded-md text-center flex-[0_0_50%] flex items-center justify-center`}
          onClick={onClick}
        >
          <span className="comment-icon">
            <CommentIcon />
          </span>
          {!signupContext?.isUserLoggedIn ? (
            <Link
              onClick={handleAnonymousLikeAndComment}
              className="use-ajax flex justify-center items-center"
              href={"#"}
            >
              {translations?.[locale]?.comment}
            </Link>
          ) : (
            <span>{translations?.[locale]?.comment}</span>
          )}
        </button>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
        reasonOptions={reasonOptions}
        resourceId={question.id}
        entityType="node"
      />
      
      {/* Status message */}
      {showMessage && <StatusChip message={showMessage} />}
    </>
  )
}

export default QuestionCard
