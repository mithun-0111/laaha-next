import { useTranslations } from "@/src/contexts/TranslationsContext"
import { useLocale } from "next-intl"
import React, { useState } from "react"

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
  reasonOptions: string[]
  resourceId: string
  entityType: string
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  reasonOptions,
  resourceId,
  entityType,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>("")
  const { translations } = useTranslations()
  const locale = useLocale()

  // Handle report submission
  const handleSubmit = () => {
    if (selectedReason) {
      onSubmit(selectedReason) // Submit selected reason
      onClose() // Close modal after submission
    } else {
      alert("Please select a reason for reporting.") // Alert if no reason selected
    }
  }

  return (
    <div
      className={`fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 ${isOpen ? "block" : "hidden"}`} // Modal visibility control
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        className="bg-white p-6 rounded-xl shadow-xl w-96"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
      >
        <h2 className="text-xl font-semibold mb-4">
          {translations?.[locale]?.report_questions} {/* Modal title */}
        </h2>
        <ul className="space-y-2 ps-0 list-none">
          {/* Loop through the reason options */}
          {reasonOptions &&
            Object.entries(reasonOptions).map((reason, index) => (
              <li
                key={index}
                id={reason[0]}
                onClick={(e) => setSelectedReason(reason[0])}
                className={`cursor-pointer p-2 rounded-md hover:bg-color-secondary ${selectedReason === reason[0] ? "bg-primary text-white hover:text-default-black" : ""}`}
              >
                {reason[1]}
              </li>
            ))}
        </ul>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            className="px-4 py-2 text-primary hover:text-red rounded-md"
            onClick={onClose}
          >
            {translations?.[locale]?.cancel}
          </button>
          <button
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-red"
            onClick={handleSubmit}
          >
            {translations?.[locale]?.submit}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReportModal
