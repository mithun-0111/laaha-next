export const HtmlToText = ({ html }: any) => {
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
