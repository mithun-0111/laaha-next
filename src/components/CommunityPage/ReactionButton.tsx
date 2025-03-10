import { useState } from "react"
import { Hug, Cry, Heart, Pray, Sad, Smile } from "./ReactionIcons"
import { LikeHeart } from "@/src/lib/icons"
import "./Reactions.scss"
import { useTranslations } from "@/src/contexts/TranslationsContext"
import { useLocale } from "use-intl"

// Define types for the props
interface ReactionButtonProps {
  reaction: any
  setReaction: any
  handleReaction: (reaction: string, resId: string, resType: string) => void
  resId: string
  resType: string
  disableIcon: boolean
}

const ReactionButton: React.FC<ReactionButtonProps> = ({
  reaction,
  setReaction,
  handleReaction,
  resId,
  resType,
  disableIcon,
}) => {
  const [showReactions, setShowReactions] = useState<boolean>(false)
  const { translations } = useTranslations()
  const locale = useLocale()

  return (
    <div
      className={`reaction-container py-3 relative ${showReactions ? "hovering" : ""} ${disableIcon ? "pointer-events-none" : ""}`}
      onMouseEnter={() => setShowReactions(true)} // Show reactions on hover
      onMouseLeave={() => setShowReactions(false)} // Hide reactions when mouse leaves
    >
      {/* Reaction options displayed when hovering */}
      <div
        className={`reaction-options bg-white px-4 py-2 absolute left-1/2 -translate-x-2/4 -top-8 rounded-2xl shadow-lg items-center gap-2 ${showReactions ? "flex" : "hidden"} ${disableIcon ? "disabled" : ""}`}
      >
        {/* Buttons for each reaction type */}
        <button onClick={() => handleReaction("cry", resId, resType)}>
          {reaction === "cry" ? <Cry /> : <Cry />}
        </button>
        <button onClick={() => handleReaction("heart", resId, resType)}>
          {reaction === "heart" ? <Heart /> : <Heart />}
        </button>
        <button onClick={() => handleReaction("hug", resId, resType)}>
          {reaction === "hug" ? <Hug /> : <Hug />}
        </button>
        <button onClick={() => handleReaction("pray", resId, resType)}>
          {reaction === "pray" ? <Pray /> : <Pray />}
        </button>
        <button onClick={() => handleReaction("sad", resId, resType)}>
          {reaction === "sad" ? <Sad /> : <Sad />}
        </button>
        <button onClick={() => handleReaction("smile", resId, resType)}>
          {reaction === "smile" ? <Smile /> : <Smile />}
        </button>
      </div>

      {/* Display selected reaction */}
      <div
        className={`selected-reaction flex items-center gap-1.5 ${disableIcon ? "disabled pointer-events-none opacity-50" : ""}`}
      >
        {/* Conditionally render the selected reaction icon */}
        {reaction === "heart" ? (
          <Heart />
        ) : reaction === "sad" ? (
          <Sad />
        ) : reaction === "cry" ? (
          <Cry />
        ) : reaction === "smile" ? (
          <Smile />
        ) : reaction === "pray" ? (
          <Pray />
        ) : reaction === "hug" ? (
          <Hug />
        ) : (
          <>
            <LikeHeart />
            <span>{translations?.[locale]?.like}</span> {/* Show "Like" text */}
          </>
        )}
      </div>
    </div>
  )
}

export default ReactionButton
