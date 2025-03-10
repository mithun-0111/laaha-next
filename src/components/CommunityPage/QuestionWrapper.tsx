"use client"

import React, { useRef, useState, useEffect } from "react"
import QuestionCard from "./QuestionCard"
import Replies from "./Replies"
import CommentInput from "./CommentInput"
import QuestionDetails from "./QuestionDetails"
import { getIndividualQuestionData } from "@/src/lib/apis"
import { getAccessToken } from "@/src/lib/protectedAuth"
import { useLocale } from "next-intl"
import { useTranslations } from "@/src/contexts/TranslationsContext"

const QuestionWrapper = ({ question, currentUser }: any) => {
  const [questionID, setQuestionID] = useState<string | number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [questionData, setQuestionData] = useState(question)
  const inputRef = useRef<any>(null)
  const locale = useLocale()
  const { translations } = useTranslations()

  const handleFocusButtonClick = () => {
    if (inputRef.current) {
      inputRef?.current?.focus() // Focus the input field
    }
  }

  const handleOpenModal = (id: string | number) => {
    setQuestionID(id) // Set the question ID when modal opens
    setIsModalOpen(true)
  }

  const getUpdatedQuestion = async (qID: string | number) => {
    let token = await getAccessToken();
    const response = await getIndividualQuestionData(qID, token) // Fetch updated question data
    setQuestionData(response.data)
  }

  const handleCloseModal = (questionID: string | number | null) => {
    setIsModalOpen(false)
    setQuestionID(null)
    if (questionID) {
      getUpdatedQuestion(questionID) // Fetch updated question data
    }
  }

  return (
    <div className="question-container p-6 border rounded-xl border-gray-500 bg-white mb-6">
      {/* Display QuestionCard with current question data */}
      <QuestionCard
        question={questionData}
        onClick={handleFocusButtonClick}
        currentUser={currentUser}
      />
      
      {/* Display recent replies if available */}
      {questionData.recent_replies && (
        <div className="replies-section">
          {/* Show "view more comments" link */}
          {translations?.[locale]?.view_more_comments && (
            <div
              className="view-replies font-bold cursor-pointer mb-4"
              onClick={() => handleOpenModal(questionData.id)}
            >
              {translations?.[locale]?.view_more_comments}
            </div>
          )}
          {/* Display replies */}
          <Replies
            reply={questionData.recent_replies}
            currentUser={currentUser}
          />
        </div>
      )}

      {/* Show CommentInput if user is logged in */}
      {currentUser && currentUser.isUserLoggedIn && (
        <CommentInput
          resourceId={questionData.id}
          ref={inputRef}
          placeholder={`${translations?.[locale]?.comment_as}`}
          currentUser={currentUser}
          username={currentUser.userName}
        />
      )}

      {/* Display QuestionDetails modal if open */}
      {isModalOpen && (
        <QuestionDetails
          currentUser={currentUser}
          questionID={questionID}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default QuestionWrapper
