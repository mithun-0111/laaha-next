import { drupal } from "@/src/lib/drupal"
import { getParams } from "@/src/lib/getparams"
import { laila } from "@/src/lib/utils"
import { useEffect, useState } from "react"
import "./UserGuidelineModal.scss"
import { ListingShimmer } from "../Shimmer"
import IconCard from "../Paragraph/IconCard"
import { useLocale } from "next-intl"
import { defaultLocale } from "@/site.config"
import TextWithVideo from "../Paragraph/TextWithVideo"
import Text from "../Paragraph/Text"
import Video from "../Paragraph/Video"
import ImageComponent from "../Paragraph/Image"
import ExternalVideo from "../Paragraph/ExternalVideo"
import { useTranslations } from "@/src/contexts/TranslationsContext"

type ModalDataType = {
  type: string
  [key: string]: any
}

const UserGuidelineModal = ({ isModalOpen, closeModal }: any) => {
  const [modalData, setModalData] = useState<ModalDataType[]>([])
  const [loading, setLoading] = useState(false)
  const locale = useLocale()
  const { translations } = useTranslations()

  const paragraphTypes: { [key: string]: React.ElementType } = {
    "paragraph--wysiwyg_editor": Text,
    "paragraph--image": ImageComponent,
    "paragraph--external_videos": ExternalVideo,
    "paragraph--video": Video,
    "paragraph--text": Text,
    "paragraph--text_and_video": TextWithVideo,
    "paragraph--heading_with_card": IconCard,
  }

  // Fetch the data
  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await drupal.getResourceByPath("/user-guidelines", {
        locale: locale,
        defaultLocale: defaultLocale,
        params: getParams("user-guideline"),
      })

      setModalData(data?.field_content || [])
    } catch (error) {
      console.error("Failed to fetch the data", error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [locale])

  // Close the modal when clicking outside
  const handleClickOutside = (e: React.MouseEvent) => {
    const modalElement = e.target as HTMLElement
    if (modalElement.closest(".icon-cards-modal")) {
      return
    }
    closeModal(true)
  }

  return (
    <>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 z-50"
          onClick={handleClickOutside}
        >
          <div className="icon-cards-modal max-h-[80vh] overflow-y-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-lg max-w-[calc(100%-2rem)] mx-auto lg:max-w-[54rem] w-full z-60">
            <div
              className={`modal-heading text-primary text-xxl font-semibold -mx-6 -mt-6 mb-8 ${laila.className} py-4 px-6 bg-color-secondary`}
            >
              {translations?.[locale]?.user_guideline}
            </div>

            {loading && <ListingShimmer />}

            {modalData.length > 0 ? (
              modalData.map((item: ModalDataType, index: number) => {
                const Component = paragraphTypes[item.type] || Text

                if (item.type === "paragraph--heading_with_card") {
                  const IconCardData = item.field_card_full || []
                  return (
                    <div key={index}>
                      <div
                        className={`heading font-semibold text-xxl ${laila.className} mb-8`}
                      >
                        {item?.field_heading}
                      </div>
                      <div className="flex flex-wrap gap-6">
                        <IconCard IconCardData={IconCardData} />
                      </div>
                    </div>
                  )
                }

                return <Component key={index} {...item} />
              })
            ) : (
              <p>{translations?.[locale]?.no_content_available}</p>
            )}
            <button
              className="absolute top-2 right-2 text-2xl text-default-black hover:text-color-neutral"
              onClick={() => closeModal(true)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default UserGuidelineModal
