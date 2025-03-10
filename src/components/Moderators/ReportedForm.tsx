import { defaultLocale } from "@/site.config"
import { useSignUp } from "@/src/contexts/SignUpProvider"
import { useTranslations } from "@/src/contexts/TranslationsContext"
import { PostIgnoreResource, PostUnPublishResource } from "@/src/lib/apis"
import { drupal } from "@/src/lib/drupal"
import { getParams } from "@/src/lib/getparams"
import { getAccessToken } from "@/src/lib/protectedAuth"
import { useLocale } from "next-intl"
import { useEffect, useState } from "react"

const ReportedForm = ({
  id,
  dataType,
}: {
  id: string | null
  dataType: string
}) => {
  const { userId } = useSignUp()
  const locale = useLocale()
  const [unpublishReasons, setUnpublishReasons] = useState<any>([])
  const [selectedReason, setSelectedReason] = useState<string | null>(null) // Store selected reason
  const [selectedReasonID, setSelectedReasonID] = useState<string | null>(null) // Store selected reason ID
  const [isUnPublishClicked, setIsUnPublishClicked] = useState(false) // Track if UnPublish was clicked
  let type = dataType === "reported-questions" ? "question" : "comment"
  const { translations } = useTranslations();

  // Function to handle Ignore action
  const handleIgnore = (id: string | null, dataType: string) => {
    if (id) {
      PostIgnoreResource(id, dataType, userId || "")
    }
  }

  // Function to handle Unpublish action
  const handleUnPublish = (
    id: string | null,
    dataType: string,
    reason: string | null
  ) => {
    if (id && reason) {
      PostUnPublishResource(id, dataType, reason, userId || "") // Pass selected reason
      setIsUnPublishClicked(false) // Close reason selection after submission
    }
  }

  // Function to fetch unpublish reasons from API
  const fetchUnpublishReasons = async () => {
    try {
      const data: any = await drupal.getResourceCollection(
        "taxonomy_term--canned_response",
        {
          locale: locale,
          defaultLocale: defaultLocale,
          params: getParams("unpublish-reasons"),
        }
      )
      setUnpublishReasons(data)
    } catch (error) {
      console.error("Failed to fetch unpublish reasons", error)
    }
  }

  // Fetch unpublish reasons when the component mounts or when the locale changes
  useEffect(() => {
    fetchUnpublishReasons()
  }, [locale])

  // Handle radio button change
  const handleReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedReason(e.target.value)
    setSelectedReasonID(e.target.id)
  }

  return (
    <div>
      {!isUnPublishClicked && (
        <div className="flex gap-x-4 justify-end mt-2 mb-4">
          <button
            className="py-2 px-4 bg-primary hover:bg-red text-white rounded-md"
            onClick={() => handleIgnore(id, type)}
          >
            { translations?.[locale]?.ignore }
          </button>
          <button
            className="py-2 px-4 bg-primary hover:bg-red text-white rounded-md"
            onClick={() => setIsUnPublishClicked(true)}
          >
            { translations?.[locale]?.unpublish }
          </button>
        </div>
      )}

      {isUnPublishClicked && unpublishReasons.length > 0 && (
        <div className="mt-4">
          <p className="block text-sm">{translations?.[locale]?.unpublish_reason}</p>
          <div className="flex flex-wrap justify-between">
            {unpublishReasons.map((reason: any) => (
              <div
                key={reason.id}
                className="lg:flex-[0_0_50%] lg:max-w-[calc(50%-1rem)] mb-2 flex items-center bg-color-secondary border-primary rounded-full ps-4"
              >
                <input
                  type="radio"
                  id={reason.drupal_internal__tid}
                  name="unpublishReason"
                  value={reason?.field_response_forum_user.processed}
                  checked={
                    selectedReason ===
                    reason?.field_response_forum_user.processed
                  }
                  onChange={handleReasonChange}
                  className="mr-2"
                />
                <label
                  className="w-full p-4"
                  htmlFor={reason?.drupal_internal__tid}
                  dangerouslySetInnerHTML={{
                    __html: reason?.field_response_forum_user.processed || "",
                  }}
                />
              </div>
            ))}
          </div>
          <button
            className="mt-2 py-2 px-4 bg-primary hover:bg-red text-white rounded-md"
            onClick={() => handleUnPublish(id, type, selectedReasonID)}
            disabled={!selectedReason}
          >
            {translations?.[locale]?.confirm_unpublish}
          </button>
        </div>
      )}
    </div>
  )
}

export default ReportedForm
