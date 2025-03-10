import { useState } from "react"
import { ReactionsPopup } from "./ReactionsPopup"
import { useTranslations } from "@/src/contexts/TranslationsContext"
import { useLocale } from "use-intl"

interface ReactionsListProps {
  reactions: string
}

const ReactionsList: React.FC<ReactionsListProps> = ({ reactions }) => {
  const totalReactions = Object.values(reactions).reduce(
    (total, count) => total + parseInt(count, 10),
    0
  )

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
  const { translations } = useTranslations()
  const locale = useLocale()

  const handleOpenPopup = () => setIsPopupOpen(true)
  const handleClosePopup = () => setIsPopupOpen(false)

  return (
    <>
      <div className="reactions">
        <div
          className="reaction-text text-m cursor-pointer text-color-neutral"
          onClick={handleOpenPopup}
        >
          {totalReactions} {translations?.[locale]?.reactions}
        </div>
        {isPopupOpen && (
          <ReactionsPopup reactions={reactions} onClose={handleClosePopup} />
        )}
      </div>
    </>
  )
}

export default ReactionsList
