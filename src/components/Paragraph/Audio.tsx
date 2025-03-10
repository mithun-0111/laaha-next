"use client"

import { useTranslations } from "@/src/contexts/TranslationsContext"
import {
  absoluteUrl,
  getCountryCode,
  getLangCode,
  getLocaleValue,
} from "@/src/lib/utils"
import { useLocale } from "next-intl"
import { useEffect, useState } from "react"

const Audio = (data: any) => {
  const [transcriptText, setTranscriptText] = useState([])
  const [showTranscript, setShowTranscript] = useState(false)
  const countryCode = getCountryCode()
  const langCode = getLangCode()
  const localeValue = getLocaleValue()
  const { translations} = useTranslations();

  const locale = useLocale()
  useEffect(() => {
    const getTranscriptText = async function (node_id: number) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/${locale}/api/v1/transcript/${node_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "country-code": countryCode || "US",
            "lang-code": langCode || "en",
            locale: localeValue || "en",
          },
        }
      )
      const text = await response.json()
      setTranscriptText(text)
    }
    if (data.field_vtt_file.uri.value) {
      getTranscriptText(data.parent_id)
    }
  }, [])

  return (
    <>
      <audio className="mb-8 w-full" controls>
        <source
          src={absoluteUrl(data?.field_audio?.uri?.url)}
          type={data?.field_audio?.filemime || "audio/mp3"}
        />
      </audio>
      {transcriptText.length > 0 && (
        <>
          <button
            className="show-transcript btn-primary mb-2 flex justify-self-end"
            onClick={() => setShowTranscript(!showTranscript)}
          >
            {showTranscript ? `${ translations?.[locale]?.hide }` : `${ translations?.[locale]?.show }`} { translations?.[locale]?.transcript }
          </button>
          {showTranscript && (
            <div className="transcripts border w-full max-h-40 bg-color-secondary overflow-y-auto border-primary rounded-2xl p-3">
              {transcriptText?.map((item: any, index) => (
                <div className="flex pb-4" key={index}>
                  <span className="time mr-6"> {item?.time}</span>
                  <span className="text"> {item?.text}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  )
}

export default Audio
