import { useTranslations } from "@/src/contexts/TranslationsContext"
import QuestionWrapper from "./QuestionWrapper"
import { useLocale } from "use-intl"

const Questionlist: React.FC<any> = ({ questionlist, currentUser }) => {
  const { translations } = useTranslations() // Fetch translations from context
  const locale = useLocale() // Get the current locale

  return (
    <>
      {/* Check if there are any questions */}
      {questionlist.length > 0
        ? questionlist.map((question: any, index: number) => (
            // Render each question using QuestionWrapper
            <QuestionWrapper
              key={index}
              question={question}
              currentUser={currentUser}
            />
          ))
        : translations?.[locale]?.no_question_available && (
            // Show a message if no questions are available
            <p className="empty-content">
              {translations[locale].no_question_available}
            </p>
          )}
    </>
  )
}

export default Questionlist
