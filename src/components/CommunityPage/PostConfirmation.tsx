import { useTranslations } from "@/src/contexts/TranslationsContext"
import { laila } from "@/src/lib/utils"
import Image from "next/image"
import { useLocale } from "use-intl"

const PostConfirmation = ({ closeModal }: any) => {
  const { translations } = useTranslations()
  const locale = useLocale()

  return (
    <div className="post-confirmation">
      {/* Confirmation message with an icon */}
      <div
        className={`text-center text-xxl font-semibold text-red-wine mb-6 ${laila.className}`}
      >
        <Image
          src="/assets/images/icon-complete-large.png"
          className="mx-auto mb-2"
          width={48}
          height={48}
          alt="Post accepted" // Image indicating the post is accepted
        />
        {translations?.[locale]?.post_accepted}
      </div>

      {/* Description with an additional confirmation image */}
      <div className="description flex flex-wrap gap-x-4 bg-gray-100 rounded-xl p-4 text-red-wine">
        <div className="image">
          <Image
            src="/assets/images/confirmation-one.png"
            width={64}
            height={74}
            alt="confirmation" // Image for further confirmation
          />
        </div>
        <p className="lg:max-w-[80%]">
          {translations?.[locale]?.post_accepted_line_1}
          <strong>{translations?.[locale]?.post_accepted_line_2}</strong>
          {translations?.[locale]?.post_accepted_line_3}
        </p>
      </div>

      {/* Continue button */}
      <div className="continue inline-flex justify-center w-full">
        <div
          className="btn btn-primary bg-primary hover:bg-red text-white cursor-pointer mt-8"
          onClick={() => closeModal(true)} // Close the modal when clicked
        >
          {translations?.[locale]?.continue} {/* Translated continue button text */}
        </div>
      </div>
    </div>
  )
}

export default PostConfirmation
