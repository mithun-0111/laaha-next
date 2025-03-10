"use client"
// Site desc. in the footer.
const SiteDesc = ({ siteDesc }: any) => {
  return <div dangerouslySetInnerHTML={{ __html: siteDesc?.body?.value }} />
}

export default SiteDesc
