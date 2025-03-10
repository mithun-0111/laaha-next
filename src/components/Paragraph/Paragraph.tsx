import Text from "./Text"
import Layout from "./Layout"
import ImageComponent from "./Image"
import Accordion from "./Accordion"
import Video from "./Video"
import ExternalVideo from "./ExternalVideo"
import Audio from "./Audio"
import "./paragraph.scss"
import { useMemo } from "react"
import TextWithVideo from "./TextWithVideo"

const Paragraph = ({ data }: { data: any }) => {
  const layoutData = data.layout_structure
  const content = data.field_content

  const paragraphTypes: { [key: string]: React.ElementType } = {
    "paragraph--wysiwyg_editor": Text,
    "paragraph--image": ImageComponent,
    "paragraph--faq": Accordion,
    "paragraph--external_videos": ExternalVideo,
    "paragraph--video": Video,
    "paragraph--podcast_audio": Audio,
    "paragraph--text_and_video": TextWithVideo,
  }

  const renderLayout = useMemo(() => {
    if (!Array.isArray(layoutData)) {
      console.error("Expected 'layout_structure' to be an array.")
      return null
    }

    return layoutData.map((layout: any, index) => {
      const LayoutComponent = Layout
      if (
        layout.type !== "layout" ||
        Object.keys(layout.regions).length === 0
      ) {
        return null
      }

      return (
        <LayoutComponent key={index} layout_id={layout.layout_id}>
          {Object.keys(layout.regions).map((regionKey, index) => {
            const region = layout.regions[regionKey]
            return (
              region.length > 0 && (
                <div key={index} className={`region-${regionKey} w-full`}>
                  {region.map((component: any) => {
                    const matchedContent = content.find(
                      (item: any) => item.id === component.uuid
                    )
                    const Component = paragraphTypes[matchedContent?.type]
                    if (!Component) {
                      return (
                        <div key={component.uuid}>
                          Unknown component type: {component.paragraph_type}
                        </div>
                      )
                    }

                    if (matchedContent) {
                      return (
                        <Component key={component.uuid} {...matchedContent} />
                      )
                    }

                    return null
                  })}
                </div>
              )
            )
          })}
        </LayoutComponent>
      )
    })
  }, [layoutData, content])

  // Ensure memoization and rendering only once per change in `layoutData` and `content`
  return <>{renderLayout}</>
}

export default Paragraph
