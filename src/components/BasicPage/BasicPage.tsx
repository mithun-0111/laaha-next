import Paragraph from "../Paragraph/Paragraph"

const BasicPage = ({ data }: any) => {
  return (
    <div className="video-page">
      <Paragraph data={data} />
    </div>
  )
}

export default BasicPage
