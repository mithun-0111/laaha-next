import { useTranslations } from "@/src/contexts/TranslationsContext"
import { Cry, Heart, Hug, Pray, Sad, Smile } from "./ReactionIcons"
import { useLocale } from "use-intl"

interface ReactionsPopupProps {
  reactions: string
  onClose: () => void
}

export const ReactionsPopup: React.FC<ReactionsPopupProps> = ({
  reactions,
  onClose,
}) => {
  const totalReactions = Object.values(reactions).reduce(
    (total, count) => total + parseInt(count, 10),
    0
  )
  const { translations } = useTranslations()
  const locale = useLocale()

  const renderReactionIcon = (reaction: string) => {
    switch (reaction) {
      case "heart":
        return <Heart />
      case "sad":
        return <Sad />
      case "cry":
        return <Cry />
      case "smile":
        return <Smile />
      case "pray":
        return <Pray />
      case "hug":
        return <Hug />
      default:
        return null
    }
  }

  return (
    <>
      <div
        className="reaction-popup fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg w-full sm:w-1/3 max-w-lg p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-light-gray hover:text-gray-800"
            onClick={onClose}
          >
            <span className="text-m font-semibold underline">
              {translations?.[locale]?.close}
            </span>
          </button>

          <div className="text-left">
            <div className="text-l font-semibold mb-4">
              {translations?.[locale]?.reactions}
            </div>

            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <span>{translations?.[locale]?.all}</span>
                <span className="text-m font-semibold">{totalReactions}</span>
              </li>
              {Object.entries(reactions).map(([reaction, count]) => (
                <li
                  key={reaction}
                  className="flex justify-between items-center"
                >
                  <span className="flex items-center space-x-2">
                    <span className={reaction.toLowerCase()}>
                      {renderReactionIcon(reaction.toLowerCase())}
                    </span>
                  </span>
                  <span className="text-m font-semibold">
                    {parseInt(count, 10)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
