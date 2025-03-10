import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from "react"
import { PostComment } from "@/src/lib/apis"
import StatusChip from "./StatusChip"
import { DefaultProfileIcon } from "@/src/lib/icons"
import Image from "next/image"
import { absoluteUrl } from "@/src/lib/utils"
import { useSignUp } from "@/src/contexts/SignUpProvider"
import { getAccessToken } from "@/src/lib/protectedAuth"
import { useTranslations } from "@/src/contexts/TranslationsContext"
import { useLocale } from "use-intl"

interface CommentInputProps {
  placeholder: string
  username: string | null
  resourceId: string
  currentUser: any
}

// Forward ref to allow focusing from parent component
const CommentInput = forwardRef<any, CommentInputProps>((props, ref) => {
  const [inputValue, setInputValue] = useState<string>("")
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const submitRef = useRef<HTMLDivElement | null>(null)
  const currentUser = props.currentUser
  const [showNotification, setNotifications] = useState<boolean>(false)
  const [notificationMessage, setNotificationMessage] = useState<string>("")
  // const token = getAccessToken()
  const { translations } = useTranslations()
  const locale = useLocale()

  // Expose focus method to parent component via ref
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus()
    },
  }))

  // Automatically hide notification after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(false)
      setNotificationMessage("")
    }, 3000)

    return () => clearTimeout(timer)
  }, [notificationMessage])

  // Handle clicks outside of the input to remove focus
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        submitRef.current &&
        !submitRef.current.contains(event.target)
      ) {
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Create a comment by calling API
  const handleCreateComment = async (
    data: string,
    resourceId: string,
    moderation_status: string
  ) => {
    let token = await getAccessToken();
    try {
      const response = await PostComment(
        resourceId,
        data,
        moderation_status,
        token
      )

      if (response.status === 200) {
        setNotifications(true)

        // Display success message based on comment status
        if (moderation_status === "review") {
          setNotificationMessage(translations?.[locale].posted_comments)
        } else {
          setNotificationMessage(translations?.[locale]?.draft_comments)
        }
      }
    } catch (error: any) {
      console.error("Error creating resource:", error)
    }
  }

  // Handle comment submission
  const onCommentSubmit = (
    event: React.FormEvent,
    resourceId: string,
    moderation_status: string
  ) => {
    event.preventDefault()
    if (inputValue.trim().length > 0) {
      handleCreateComment(inputValue, resourceId, moderation_status)
      setInputValue("") // Clear the input after submission
    }
  }

  return (
    <div className="comment-input flex gap-x-4">
      {/* Display user avatar or default icon if available */}
      {currentUser &&
        currentUser.isUserLoggedIn &&
        currentUser.userAvatarUrl && (
          <>
            {currentUser.userAvatarUrl ? (
              <div className="current-user">
                <Image
                  alt={currentUser.userName}
                  width={32}
                  height={32}
                  src={absoluteUrl("/" + currentUser.userAvatarUrl)}
                  title={currentUser.userName}
                />
              </div>
            ) : (
              <div className="current-user">
                <DefaultProfileIcon />
              </div>
            )}
          </>
        )}
      <form action="" className="w-full">
        <input
          ref={inputRef} // Focusable input
          type="text"
          className="w-full bg-gray-300 rounded-lg p-3"
          placeholder={`${props.placeholder} ${props.username}`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // Update input state
          onFocus={() => setIsFocused(true)} // Track input focus
        />
        {/* Show submit buttons if the input is focused */}
        {isFocused && (
          <div
            className="form-submit inline-flex items-center gap-x-2 mt-5 w-full justify-end"
            ref={submitRef}
          >
            <input
              type="button"
              onClick={(e) => onCommentSubmit(e, props.resourceId, "draft")}
              value={translations?.[locale]?.draft_button}
              disabled={!inputValue.trim()} // Disable if input is empty
              className="draft-button px-4 py-2 text-primary cursor-pointer disabled:opacity-80 disabled:pointer-events-none hover:text-red"
            />
            <input
              type="submit"
              onClick={(e) => onCommentSubmit(e, props.resourceId, "review")}
              value={translations?.[locale].post_button}
              className="px-4 py-2 bg-primary cursor-pointer disabled:opacity-75 disabled:pointer-events-none rounded-md text-white hover:bg-red-100"
              disabled={!inputValue.trim()} // Disable if input is empty
            />
          </div>
        )}
      </form>

      {/* Show notification when a comment is submitted */}
      {showNotification && <StatusChip message={notificationMessage} />}
    </div>
  )
})

CommentInput.displayName = "CommentInput" // Set the display name for the component

export default CommentInput
