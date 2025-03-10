import React from "react"
import UserCommentCard from "./UserCommentCard"
import { useTranslations } from "@/src/contexts/TranslationsContext"
import { useLocale } from "next-intl"

const UserCommentList = ({ commentList, currentUser }: any) => {
  const { translations } = useTranslations()
  const locale = useLocale()

  return (
    <>
      {commentList.length > 0 ? (
        <>
          {commentList.map((comment: any, index: any) => (
            <UserCommentCard key={index} comment={comment} user={currentUser} />
          ))}
        </>
      ) : (
        <p className="empty-content">{translations?.[locale]?.no_comments}</p>
      )}
    </>
  )
}

export default UserCommentList
