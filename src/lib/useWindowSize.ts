import { useState, useEffect } from "react"

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0, // Start with 0 to avoid errors during SSR
    height: 0,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    if (typeof window !== "undefined") {
      handleResize()

      window.addEventListener("resize", handleResize)

      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  return windowSize
}

export default useWindowSize
