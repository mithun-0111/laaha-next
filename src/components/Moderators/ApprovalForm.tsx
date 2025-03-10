import { defaultLocale } from "@/site.config"
import { drupal } from "@/src/lib/drupal"
import { getParams } from "@/src/lib/getparams"
import { useLocale } from "next-intl"
import { useState, useEffect } from "react"
import {
  fetchCategoriesModeratorData,
  PostModeratorAction,
} from "@/src/lib/apis"
import { useSignUp } from "@/src/contexts/SignUpProvider"
import { getAccessToken } from "@/src/lib/protectedAuth"
import { useTranslations } from "@/src/contexts/TranslationsContext"

const ApprovalForm = ({ ID, dataType }: any) => {
  const [approveWithReason, setApproveWithReason] = useState(false)
  const [approvalReason, setApprovalReason] = useState<any>("")
  const [approvalID, setApprovalID] = useState<any>("")
  const [rejectID, setRejectID] = useState<any>("")
  const [rejectReason, setRejectReason] = useState("")
  const [showRejectReasons, setShowRejectReasons] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [categoriesArray, setCategories] = useState<any>([])
  const [approvalReasons, setApprovalReasons] = useState<any>([])
  const [rejectReasons, setRejectReasons] = useState<string[]>([])
  const [category, setCategory] = useState("")
  const locale = useLocale()
  const { userId } = useSignUp()
  const { translations } = useTranslations()
  let dataCategory = dataType === "moderate-question" ? "question" : "comment"

  // Simulate API call to fetch approval reasons
  const fetchApprovalReasons = async () => {
    try {
      const data: any = await drupal.getResourceCollection(
        "taxonomy_term--canned_response",
        {
          locale: locale,
          defaultLocale: defaultLocale,
          params: getParams("canned-response"),
        }
      )
      setApprovalReasons(data)
    } catch (error) {
      console.error("Failed to fetch approval reasons", error)
    }
  }

  const fetchRejectReasons = async () => {
    try {
      const data: any = await drupal.getResourceCollection(
        "taxonomy_term--canned_response",
        {
          locale: locale,
          defaultLocale: defaultLocale,
          params: getParams("reject-reasons"),
        }
      )
      setRejectReasons(data)
    } catch (error) {
      console.error("Failed to fetch reject reasons", error)
    }
  }

  const fetchCategories = async () => {
    let token = await getAccessToken()

    let data = await fetchCategoriesModeratorData(locale, token)
    setCategories(data)
  }

  useEffect(() => {
    fetchCategories()
    fetchApprovalReasons()
    fetchRejectReasons()
  }, [])

  const handleApproveWithReasonChange = () => {
    setApproveWithReason(!approveWithReason)
    setApprovalReason("")
  }

  const handleApprovalReasonChange = (e: any) => {
    setApprovalReason(e.target.value)
    setApprovalID(e.target.id)
  }

  const handleRejectReasonChange = (e: any) => {
    setRejectReason(e.target.value)
    setRejectID(e.target.id)
  }

  const handleChange = (e: any) => {
    setCategory(e.target.value)
  }

  const handleSubmit = (status: any) => {
    if (status === "approve") {
      if (approveWithReason && approvalReason === "") {
        alert("Please select an approval reason.")
      } else {
        PostModeratorAction(
          approvalID,
          category,
          dataCategory,
          "approve",
          ID,
          locale,
          userId || "",
        )
      }
    } else if (status === "reject") {
      if (rejectReason === "") {
        alert("Please select a reject reason before rejecting.")
      } else {
        PostModeratorAction(
          rejectID,
          category,
          dataCategory,
          "reject",
          ID,
          locale,
          userId || "",
        )
        setRejecting(false)
        setShowRejectReasons(false)
      }
    }
  }

  const handleRejectClick = () => {
    setRejecting(true)
    setShowRejectReasons(true)
  }

  const handleCancelReject = () => {
    setRejecting(false)
    setRejectReason("")
    setShowRejectReasons(false)
  }

  return (
    <div className="mt-6">
      <div className="category relative">
        <label htmlFor="" className="font-semibold mb-2">
          {translations?.[locale]?.choose_sub_category}
        </label>
        <select
          className="py-2 ps-6 pe-9 w-full block text-m text-default-black border-2 rounded-[3rem] max-h-[3rem] appearance-none"
          id="community-category"
          value={category}
          onChange={handleChange}
        >
          <option value="">{"Choose Sub category"}</option>
          {categoriesArray.map((category: any) => (
            <option
              className={`${category.depth > 0 ? "text-default-black" : "text-color-neutral"}`}
              key={category.id}
              value={category.id}
              disabled={category.depth > 0 ? false : true}
            >
              {category.name}
            </option>
          ))}
        </select>
        <span className="dropdown-arrow absolute bottom-4 right-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="9"
            viewBox="0 0 14 9"
            fill="none"
          >
            <path
              d="M0.717557 2.99844L6.33588 8.61676C6.45801 8.7389 6.59033 8.82521 6.73282 8.87569C6.87532 8.92699 7.02799 8.95264 7.19084 8.95264C7.35369 8.95264 7.50636 8.92699 7.64885 8.87569C7.79135 8.82521 7.92366 8.7389 8.0458 8.61676L13.6641 2.99844C13.888 2.77452 14 2.48953 14 2.14348C14 1.79742 13.888 1.51243 13.6641 1.28852C13.4402 1.0646 13.1552 0.952637 12.8092 0.952637C12.4631 0.952637 12.1781 1.0646 11.9542 1.28852L7.19084 6.05187L2.42748 1.28851C2.20356 1.0646 1.91857 0.952637 1.57252 0.952637C1.22646 0.952637 0.941476 1.0646 0.717557 1.28851C0.493639 1.51243 0.381678 1.79742 0.381678 2.14348C0.381678 2.48953 0.493639 2.77452 0.717557 2.99844Z"
              fill="#5A6872"
            />
          </svg>
        </span>
      </div>
      <div className="flex justify-end gap-2 mt-2 mb-4">
        <input
          type="checkbox"
          id="approveWithReason"
          checked={approveWithReason}
          onChange={handleApproveWithReasonChange}
        />
        <label htmlFor="approveWithReason">{translations?.[locale]?.approve_response}</label>
      </div>
      {approveWithReason && (
        <div className="p-6 rounded-lg border border-gray-500">
          <h3 className="mb-2">
            { translations?.[locale]?.approve_question_with_reason }
          </h3>
          <div className="flex flex-wrap justify-between">
            {approvalReasons.map((reason: any) => (
              <div
                key={reason.id}
                className="lg:flex-[0_0_50%] lg:max-w-[calc(50%-1rem)] mb-2 flex items-center bg-color-secondary border-primary rounded-full ps-4"
              >
                <input
                  type="radio"
                  id={reason.drupal_internal__tid}
                  name="approveReason"
                  value={reason?.field_response_forum_user.processed}
                  checked={
                    approvalReason ===
                    reason?.field_response_forum_user.processed
                  }
                  onChange={handleApprovalReasonChange}
                />
                <label
                  className="w-full p-4"
                  htmlFor={reason.drupal_internal__tid}
                  dangerouslySetInnerHTML={{
                    __html: reason?.field_response_forum_user.processed || "",
                  }}
                ></label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading state for reject reasons */}
      {showRejectReasons && rejecting && (
        <div className="p-6 rounded-lg border border-gray-500">
          <h3 className="mb-2">
            {translations?.[locale]?.reject_question_with_reason}
          </h3>
          <div className="flex flex-wrap justify-between">
            {rejectReasons.map((reason: any) => (
              <div
                key={reason.id}
                className="lg:flex-[0_0_50%] lg:max-w-[calc(50%-1rem)] mb-2 flex items-center bg-color-secondary border-primary rounded-full ps-4"
              >
                <input
                  type="radio"
                  id={reason.drupal_internal__tid}
                  name="rejectReason"
                  value={reason?.field_response_forum_user.processed}
                  checked={
                    rejectReason === reason?.field_response_forum_user.processed
                  }
                  onChange={handleRejectReasonChange}
                />
                <label
                  className="w-full p-4"
                  htmlFor={reason.drupal_internal__tid}
                  dangerouslySetInnerHTML={{
                    __html: reason?.field_response_forum_user.processed || "",
                  }}
                ></label>
              </div>
            ))}
          </div>
        </div>
      )}

      {!rejecting && (
        <div className="flex gap-x-4 justify-end mt-2 mb-4">
          <button
            className="py-2 px-4 bg-primary hover:bg-red text-white rounded-md"
            onClick={() => handleSubmit("approve")}
          >
            {translations?.[locale]?.approve}
          </button>
          <button
            className="py-2 px-4 bg-primary hover:bg-red text-white rounded-md"
            onClick={handleRejectClick}
          >
            {translations?.[locale]?.reject}
          </button>
        </div>
      )}

      {rejecting && (
        <div className="flex gap-x-4 justify-end mt-2 mb-4">
          <button
            className="py-2 px-4 text-primary hover:text-red rounded-md"
            onClick={handleCancelReject}
          >
            {translations?.[locale]?.cancel}
          </button>
          <button
            className="py-2 px-4 bg-primary hover:bg-red text-white rounded-md"
            onClick={() => handleSubmit("reject")}
          >
            {translations?.[locale]?.reject}
          </button>
        </div>
      )}
    </div>
  )
}

export default ApprovalForm
