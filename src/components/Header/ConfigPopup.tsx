import { SettingsIcon } from "@/src/lib/icons"
import { useState } from "react"
import ZoomButtons from "./Zoom"

const ConfigPopup = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative">
      <div onClick={handleClick} className="cursor-pointer">
        {" "}
        <SettingsIcon />{" "}
      </div>
      {isOpen && (
        <>
          <div className="absolute right-0 mt-2 bg-white border-color-gray border-px rounded-lg shadow-lg z-10">
            <div className="p-4 w-60">
              <ul className="space-y-2 ps-0 list-none">
                <li>
                  <div className="hover:underline w-full">
                    <ZoomButtons />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ConfigPopup
