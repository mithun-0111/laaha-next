import LahaHelpCard from "@/src/components/Cards/LahaHelpCard"
// import { HowCanLaahaHelpYouShimmer } from "@/src/components/Shimmer"
import { useTranslations } from "@/src/contexts/TranslationsContext"
import { laila } from "@/src/lib/utils"
import dynamic from "next/dynamic"
import { useLocale } from "use-intl"

const HowCanLaahaHelpYouShimmer = dynamic(() => import("@/src/components/Shimmer").then((mod) => mod.HowCanLaahaHelpYouShimmer));
interface HelpData {
  title: string
  description: string
  image_url: any
}

export default function HowLaahaCanHelpYou({
  howLahaCanHelpDataStructured,
  loading
}: {
  howLahaCanHelpDataStructured: HelpData[],
  loading: boolean
}) {
  const { translations } = useTranslations()
  const locale = useLocale()

  if(loading) {
    return <HowCanLaahaHelpYouShimmer />
  }

  return (
    <div className="bg-[#d7f0fe]">
      <div className="container py-[42px] mb-20">
        <h2
          className={`${laila.className} text-[28px] md:text-2xl font-semibold pb-8 m-0`}
        >
          {translations?.[locale]?.how_laaha_help_you}
        </h2>
        <div className={"flex gap-[30px] flex-wrap md:flex-nowrap"}>
          {howLahaCanHelpDataStructured?.map((item, index) => (
            <LahaHelpCard
              key={index}
              title={item.title}
              description={item.description}
              image={item?.image_url?.image_style_uri?.scale_117w}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
