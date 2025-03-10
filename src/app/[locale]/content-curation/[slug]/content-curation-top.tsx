import { BasicShimmer } from "@/src/components/Shimmer";
import { useTranslations } from "@/src/contexts/TranslationsContext";
import { getContentCurationTopData } from "@/src/lib/apis";
import { laila } from "@/src/lib/utils";
import { useEffect, useState } from "react";
import { useLocale } from "use-intl";

type DataProps = {
  title: string;
  bgimage: string;
  description: string;
  resource_count?: number; // Added optional property
  video_url?: string; // Added optional property
};


const ContentCurationTop = ({ name }: { name: string }) => {
  const [data, setData] = useState<DataProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { translations } = useTranslations();
  const locale = useLocale();

  useEffect(() => {
    const fetchContentTop = async () => {
      const result = await getContentCurationTopData(name,locale);
      // Update the state with the fetched data
      setData(result?.data?.['taxonomy-block']);
      setLoading(false);
    };

    // Call the function
    fetchContentTop();
  }, [name]);

  if (loading) {
    return <BasicShimmer />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Destructure data with default values to avoid runtime errors
  const { title = "", bgimage = "", description = "", resource_count = 0, video_url = "" } = data || {};

  return (
    <div
      className="curation-block py-8 mb-6 flex flex-wrap gap-6 items-center"
      style={
        bgimage
          ? {
              background: `url(${bgimage}) no-repeat center center`,
              backgroundSize: "cover",
            }
          : undefined
      }
    >
      <div
        className={`curation-info ${
          video_url
            ? "flex-[0_0_100%] lg:flex-[0_0_50%] lg:max-w-[calc(50%-1rem)]"
            : "mx-auto text-center"
        }`}
      >
        <div className="resource-count mb-4">
          {resource_count} {translations?.[locale]?.resources_available}
        </div>
        <h1 className={`title mb-2 tracking-tight ${laila.className}`}>{title}</h1>
        <div className="subtitle text-color-neutral">{description}</div>
      </div>
      {video_url && (
        <div className="intro-video flex-[0_0_100%] lg:flex-[0_0_50%] lg:max-w-[calc(50%-1rem)]">
          <video
            className="max-w-full w-full"
            width={640}
            height={360}
            controls
            muted
            loop
            autoPlay
            playsInline
          >
            <source src={video_url} type="video/mp4" />
          </video>
        </div>
      )}
    </div>
  );
};

export default ContentCurationTop;
