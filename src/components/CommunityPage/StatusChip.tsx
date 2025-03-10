import React, { useEffect, useState } from "react"

interface StatusChipProps {
  message: string
  duration?: number
  onClose?: () => void
}

const StatusChip: React.FC<StatusChipProps> = ({
  message,
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState<boolean>(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      if (onClose) onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className={`status-message-chips fixed p-2 z-30 rounded-3xl text-white bg-primary right-4 top-8 ${visible ? "slide-in" : "slide-out"}`}
    >
      {message}
      <span className="close-button ms-3" onClick={() => setVisible(false)}>
        &times;
      </span>
    </div>
  )
}

export default StatusChip
