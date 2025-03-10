import React, { useState, useEffect, useRef } from "react"
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
import { PostDelete, updateComment } from "@/src/lib/apis"
import "./StatusChips.scss"
import Image from "next/image"
import { getAccessToken } from "@/src/lib/protectedAuth"
import { useLocale } from "next-intl"
import { useTranslations } from "@/src/contexts/TranslationsContext"
import UserGuidelineModal from "../CommunityPage/UserGuidelineModal"
import StatusChip from "../CommunityPage/StatusChip"

// Define types for comment and user structures
interface Comment {
  id: string
  status: "draft" | "published" | "unpublished" | "in review" | "rejected"
  comment_detail: string
  canned_response?: string
  guidelines?: string
  reactions?: string
  user: {
    name: string
    avatar_url: string
    time: string
    question_owner_name: string
  }
  question: {
    user: {
      name: string
      avatar_url: string
      time: string
    }
    question_detail: string
  }
  actions: {
    delete_link: string
  }
}

interface UserCommentCardProps {
  comment: Comment
  user: any
}

const UserCommentCard: React.FC<UserCommentCardProps> = ({ comment, user }) => {
  const [isActive, setActive] = useState<boolean>(false)
  const [draftComment, setDraftComment] = useState<string>("")
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const submitRef = useRef<HTMLDivElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const locale = useLocale()
  const { translations } = useTranslations()
  const [isModalOpen, setIsModalOpen] = useState<boolean>()
  const [message, setShowMessage] = useState<any>(null)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (comment.status.toLocaleLowerCase() === "draft") {
      const text = comment.comment_detail
      setDraftComment(text)
    }
  }, [comment])

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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraftComment(e.target.value)
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
    const response = await updateComment(
      draftComment,
      resourceId,
      moderation_status,
      token
    )
    if (response.status === 200) {
      location.reload()
    }
  }

  const onCommentSubmit = (
    event: React.FormEvent,
    resourceId: string,
    moderation_status: string
  ) => {
    event.preventDefault()
    handleSubmit(resourceId, moderation_status)
  }

  const handleCommentDelete = (replyID: any) => {
    PostDelete(replyID, "comment", locale, setShowMessage)
  }

  return (
    <div className="comment-card mb-8 px-6 py-5 rounded-md border bg-white border-gray-300">
      <div className="posted-question">
        <div className="comment-status-wrapper">
          <span
            className={`status-chip ${comment.status.toLocaleLowerCase() && comment.status.toLocaleLowerCase()}`}
          >
            {comment.status.toLocaleLowerCase() !== "draft" ? (
              <>
                {renderStatusIcon(
                  comment.status.toLocaleLowerCase() &&
                    comment.status.toLocaleLowerCase()
                )}
                {comment.status}
              </>
            ) : (
              <div
                className="draft-button inline-flex gap-x-2"
                onClick={handleButtonClick}
              >
                {renderStatusIcon(
                  comment.status.toLocaleLowerCase() &&
                    comment.status.toLocaleLowerCase()
                )}
                {comment.status}
              </div>
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
                <li className="use-ajax" onClick={handleCommentDelete}>
                  {translations?.[locale]?.delete}
                </li>
              </ul>
            </div>
          </span>
        </div>

        {(comment.status.toLocaleLowerCase() === "published" ||
          comment.status.toLocaleLowerCase() === "unpublished" ||
          comment.status.toLocaleLowerCase() === "rejected") &&
          comment.canned_response && (
            <div className="ques-feedbacks bg-gray-600 p-2 mb-2 rounded-lg">
              <HtmlToText html={comment.canned_response} />
            </div>
          )}

        {(comment.status.toLocaleLowerCase() === "unpublished" ||
          comment.status.toLocaleLowerCase() === "rejected") &&
          comment.guidelines && (
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

        {(comment.status.toLocaleLowerCase() === "published" ||
          comment.status.toLocaleLowerCase() === "in review" ||
          comment.status.toLocaleLowerCase() === "draft") && (
          <div className="question-details">
            <div className="user-details mb-4 inline-flex items-center text-m">
              <span className="user-avatar me-2 max-w-8">
                {comment.question.user.avatar_url ? (
                  <Image
                    loading="lazy"
                    width={32}
                    height={32}
                    src={comment.question.user.avatar_url}
                    className="rounded-[50%]"
                    alt={comment.question.user.name}
                  />
                ) : (
                  <DefaultProfileIcon />
                )}
              </span>
              <span className="username font-semibold me-2">
                {comment.question.user.name}
              </span>
              <span className="posted-date text-color-neutral">
                {comment.question.user.time}
              </span>
            </div>
            <div className="question">
              <HtmlToText html={comment.question.question_detail} />
            </div>
          </div>
        )}
      </div>

      <div className="posted-comment mt-2 text-m pt-4 border-t border-gray-300">
        {(comment.status.toLocaleLowerCase() === "published" ||
          comment.status.toLocaleLowerCase() === "in review" ||
          comment.status.toLocaleLowerCase() === "draft") && (
          <div className="user-comment p-3 bg-white rounded-md">
            <div className="user-details inline-flex items-center mb-4">
              <span className="user-avatar max-w-8 me-2">
                {comment.user.avatar_url ? (
                  <Image
                    loading="lazy"
                    width={32}
                    height={32}
                    src={comment.user.avatar_url}
                    className="rounded-[50%]"
                    alt={comment.user.name}
                  />
                ) : (
                  <DefaultProfileIcon />
                )}
              </span>
              <span className="username me-2 font-semibold">
                {comment.user.name}
              </span>
              {comment.status.toLocaleLowerCase() !== "draft" && (
                <span className="posted-date text-color-neutral">
                  {translations?.[locale]?.commentd_to}
                  {comment.user.question_owner_name} {comment.user.time}
                </span>
              )}
              {comment.status.toLocaleLowerCase() === "draft" && (
                <span className="posted-date text-color-neutral">
                  {translations?.[locale]?.commenting_to} {" "} {comment.user.question_owner_name}
                </span>
              )}
            </div>
            {comment.status.toLocaleLowerCase() !== "draft" && (
              <div className="comment">
                <HtmlToText html={comment.comment_detail} />
              </div>
            )}
            {comment.status.toLocaleLowerCase() === "draft" && (
              <>
                <div className="comment pb-2 mb-2 border-b border-gray-300">
                  <textarea
                    className={`w-full p-2 ${isEditing ? "active" : ""}`}
                    ref={textAreaRef}
                    value={draftComment}
                    onChange={handleChange}
                    readOnly={!isEditing}
                  />
                </div>
                {comment.reactions && (
                  <ReactionsList reactions={comment.reactions} />
                )}
              </>
            )}
            {isEditing && (
              <form action="">
                <div
                  className="form-submit inline-flex gap-x-4 mt-5 w-full justify-end"
                  ref={submitRef}
                >
                  <input
                    type="button"
                    onClick={(e) => onCommentSubmit(e, comment.id, "draft")}
                    value={translations?.[locale]?.draft_button}
                    disabled={!draftComment.trim()}
                    className="draft-button px-4 py-2 text-primary cursor-pointer disabled:opacity-80 disabled:pointer-events-none hover:text-red"
                  />
                  <input
                    type="submit"
                    onClick={(e) => onCommentSubmit(e, comment.id, "review")}
                    value={translations?.[locale]?.post_button}
                    className="px-4 py-2 bg-primary cursor-pointer disabled:opacity-75 disabled:pointer-events-none rounded-md text-white hover:bg-red-100"
                    disabled={!draftComment.trim()}
                  />
                </div>
              </form>
            )}
          </div>
        )}

        {(comment.status.toLocaleLowerCase() === "unpublished" ||
          comment.status.toLocaleLowerCase() === "rejected") && (
          <div className="user-details inline-flex gap-2 items-center">
            <span className="user-avatar">
              {comment.user.avatar_url ? (
                <Image
                  loading="lazy"
                  width={32}
                  height={32}
                  src={comment.user.avatar_url}
                  className="rounded-[50%]"
                  alt={comment.user.name}
                />
              ) : (
                <DefaultProfileIcon />
              )}
            </span>
            <span className="username font-semibold">{comment.user.name}</span>
            <span className="posted-date text-color-neutral">
              {comment.user.time}
            </span>
          </div>
        )}
      </div>
      {isModalOpen && (
        <UserGuidelineModal isModalOpen={isModalOpen} closeModal={closeModal} />
      )}
      {message && <StatusChip message={message} />}
    </div>
  )
}

export default UserCommentCard
