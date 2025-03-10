import { useState } from "react"

const Notice = ({ data }: any) => {
  const description = data?.field_answer?.value
  const [showNotice, setShowNotice] = useState(true)

  const handleClick = () => {
    setShowNotice(!showNotice)
  }

  return (
    showNotice &&
    description && (
      <div className="notice p-4 bg-primary text-white">
        <div className="container pe-12 relative">
          <span dangerouslySetInnerHTML={{ __html: description }} />
          <span
            className="absolute right-2 top-0 w-8 text-center cursor-pointer"
            onClick={handleClick}
          >
            x
          </span>
        </div>
      </div>
    )
  )
}

export default Notice
