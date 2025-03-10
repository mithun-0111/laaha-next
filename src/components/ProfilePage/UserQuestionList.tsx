import { useTranslations } from "@/src/contexts/TranslationsContext"
import UserQuestionCard from "./UserQuestionCard"
import { useLocale } from "next-intl"

const UserQuestionList = ({ questionList, currentUser }: any) => {
  const { translations } = useTranslations()
  const locale = useLocale()

  return (
    <>
      {questionList.length > 0 ? (
        <>
          {questionList.map((question: any, index: any) => (
            <UserQuestionCard
              key={index}
              question={question}
              user={currentUser}
            />
          ))}
        </>
      ) : (
        <p className="empty-content">
          {translations?.[locale]?.no_question_available}
        </p>
      )}
    </>
  )
}

export default UserQuestionList
