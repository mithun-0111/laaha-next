import React, { useState, useEffect, useRef, useContext } from "react"
// import './../scss/Replies.scss';
import ReactionsList from "./ReactionsList"
import ReactionButton from "./ReactionButton"
import { PostDelete, PostReaction, PostReport } from "@/src/lib/apis"
import { HtmlToText } from "./HtmlToText"
import { DefaultProfileIcon } from "@/src/lib/icons"
import Image from "next/image"
import { SignUpContext, useSignUp } from "@/src/contexts/SignUpProvider"
import { getReportReasons } from "./QuestionCard"
import ReportModal from "./ReportModal"
import { useLocale } from "next-intl"
import StatusChip from "./StatusChip"
import { getAccessToken } from "@/src/lib/protectedAuth"
import { useTranslations } from "@/src/contexts/TranslationsContext"

// Define types for reply and user
interface Reply {
  id: string
  user: {
    name: string
    avatar_url: string | null
    time: string
  }
  description: string
  reactions: string
  current_user?: {
    initialReaction: any
  }
}

interface User {
  userName: string
  isUserLoggedIn: boolean
  avatarUrl: string
}

interface RepliesProps {
  reply: Reply
  currentUser: User | null
}

const Replies = ({ reply, currentUser }: RepliesProps): JSX.Element => {
  // State hooks for managing reactions, report modal, etc.
  const [userReactions, setUserReactions] = useState<any>(reply.reactions || {})
  const [reaction, setReaction] = useState<string | null>(
    reply.current_user?.initialReaction || null
  )
  const [isActive, setActive] = useState<boolean>(false)
  const menuRef = useRef<any>(null)
  const signupContext = useContext(SignUpContext)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [reasons, setReasons] = useState([])
  const [message, setShowMessage] = useState("")
  const locale = useLocale()
  const { translations } = useTranslations()

  // Function to handle posting a reaction
  const handlePostReaction = async (
    reactionType: string,
    resourceId: string,
    resourceType: string
  ): Promise<void> => {
    try {
      await PostReaction(reactionType, resourceId, resourceType)
    } catch (error) {
      console.error("Error creating resource:", error)
    }
  }

  // Handle reaction change and update user reactions
  const handleReaction = (
    reactionType: string,
    resourceId: string,
    resourceType: string
  ): void => {
    setReaction((prevReaction) =>
      prevReaction === reactionType ? null : reactionType
    )

    setUserReactions((prev: any) => {
      const updatedReactions = { ...prev }

      // Decrease count of previous reaction and increase the new one
      if (reaction && updatedReactions[reaction] !== undefined) {
        updatedReactions[reaction] = Math.max(updatedReactions[reaction] - 1, 0)
      }
      if (updatedReactions[reactionType] !== undefined) {
        updatedReactions[reactionType] = updatedReactions[reactionType] + 1
      } else {
        updatedReactions[reactionType] = 1
      }

      return updatedReactions
    })

    handlePostReaction(reactionType, resourceId, resourceType)
  }

  // Handle signup modal for anonymous users
  const handleAnonymous = (e: any) => {
    e.preventDefault()
    signupContext?.setShowSignUpModal(true)
  }

  // Effect hook to initialize reactions based on incoming props
  useEffect(() => {
    if (reply.current_user?.initialReaction != null) {
      setReaction(reply.current_user?.initialReaction)
      setUserReactions(reply.reactions)
    }
  }, [reply.current_user?.initialReaction, reply.reactions])

  // Close user action menu if clicked outside
  const handleClickOutside = (event: MouseEvent): void => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setActive(false)
    }
  }

  // Function to handle deleting a comment
  const handleCommentDelete = (replyID: any) => {
    PostDelete(replyID, "comment", locale, setShowMessage)
  }

  // Handle opening the report modal
  const handleReport = () => {
    setIsReportModalOpen(true)
    let reasons = getReportReasons(locale)
    reasons.then((data) => {
      setReasons(data)
    })
  }

  // Function to handle the report submission
  const handleReportSubmit = (reason: string) => {
    PostReport(reply.id, reason, locale, "comment", setShowMessage)
  }

  // Add event listener for click outside the menu to close it
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [currentUser])

  return (
    <>
      {/* Render reply section */}
      <div className="replies flex items-start mb-6">
        {reply.user.avatar_url ? (
          <div className="user-avatar max-w-8">
            <Image
              alt={reply.user.name}
              width={32}
              height={32}
              src={reply.user.avatar_url}
              title={reply.user.name}
            />
          </div>
        ) : (
          <div className="user-avatar max-w-8">
            <DefaultProfileIcon />
          </div>
        )}
        <div className="user-reply w-full bg-gray-400 ms-2 p-3 rounded-xl">
          <div className="user-info-wrapper flex justify-between items-center">
            <div className="user-name">
              <strong>{reply.user.name}</strong>
              <span> | </span>
              <span className="post-time">{reply.user.time}</span>
            </div>
            {/* Display user action menu if logged in */}
            {currentUser?.isUserLoggedIn && (
              <div
                className="user-actions relative cursor-pointer"
                ref={menuRef}
              >
                <span
                  onClick={() => setActive(!isActive)}
                  className="user-action-button"
                >
                  ...
                </span>
                <ul
                  className={`user-action-links absolute right-0 py-2 ps-3 pe-6 rounded-md shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)] bg-white list-none ${isActive ? "active block" : "hidden"}`}
                >
                  {/* Report or delete options */}
                  {reply.user.name.toLowerCase() !==
                    currentUser?.userName.toLowerCase() && (
                    <li>
                      <span className="report pb-2" onClick={handleReport}>
                        {translations?.[locale]?.report}
                      </span>
                    </li>
                  )}
                  {reply.user.name.toLowerCase() ===
                    currentUser?.userName.toLowerCase() && (
                    <li>
                      <span
                        className="delete pb-2"
                        onClick={() => handleCommentDelete(reply.id)}
                      >
                        {translations?.[locale]?.delete}
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
          {/* Reply message */}
          <div className="reply-msg mt-1 mb-4">
            <HtmlToText html={reply.description} />
          </div>
          {/* Reactions section */}
          <div className="reactions inline-flex items-center">
            <button className="like-button relative text-m pe-2 me-2 after:absolute after:h-3.5 after:w-px after:bg-light-gray after:top-0.5 after:right-0">
              {/* Show like button or reaction button based on login state */}
              {!signupContext?.isUserLoggedIn ? (
                <span className="use-ajax block" onClick={handleAnonymous}>
                  {translations?.[locale]?.like}
                </span>
              ) : (
                <ReactionButton
                  reaction={reaction}
                  setReaction={setReaction}
                  handleReaction={handleReaction}
                  resId={reply.id}
                  resType="comment"
                  disableIcon={reply.user.name === currentUser?.userName}
                />
              )}
            </button>
            <div className="emotions">
              <ReactionsList reactions={userReactions} />
            </div>
          </div>
        </div>
      </div>
      {/* Report modal */}
      {isReportModalOpen && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          onSubmit={handleReportSubmit}
          reasonOptions={reasons}
          resourceId={reply.id}
          entityType="comment"
        />
      )}
      {/* Status message chip */}
      {message && <StatusChip message={message} />}
    </>
  )
}

export default Replies
