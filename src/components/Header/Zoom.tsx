import { useState, useEffect } from "react"

const ZoomButtons = () => {
  // State to track the zoom level (number of zoom in/out clicks)
  const [zoomCount, setZoomCount] = useState(0)

  // Base font size in percentage (default is 100%)
  const baseFontSize = 100

  // Handle Zoom In
  const handleZoomIn = () => {
    if (zoomCount < 3) {
      setZoomCount(zoomCount + 1)
    }
  }

  // Handle Zoom Out
  const handleZoomOut = () => {
    if (zoomCount > -3) {
      setZoomCount(zoomCount - 1)
    }
  }

  // Effect to apply the calculated font size to the document root
  useEffect(() => {
    // Calculate the font size based on zoom count (each zoom step increases or decreases by 5%)
    const fontSize = baseFontSize + zoomCount * 5

    // Apply the font size to the root element
    document.documentElement.style.fontSize = `${fontSize}%`
  }, [zoomCount]) // Only run when zoomCount changes

  // Display the current zoom level as a percentage
  const fontSize = baseFontSize + zoomCount * 15

  return (
    <div className="inline-flex items-center justify-between w-full">
      <p>Zoom: {fontSize}%</p>

      <div className="controls inline-flex gap-4">
        <button
          onClick={handleZoomIn}
          disabled={zoomCount >= 3}
          className="w-6 bg-color-secondary"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          disabled={zoomCount <= -3}
          className="w-6 bg-color-secondary"
        >
          -
        </button>
      </div>
    </div>
  )
}

export default ZoomButtons
