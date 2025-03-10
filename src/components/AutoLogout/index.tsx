"use client"

import { deleteSessionDetails } from "@/src/app/[locale]/community-conversations/action"
import { useEffect } from "react"

const AutoLogout = () => {
  const INACTIVITY_TIMEOUT = 10 * 60 * 1000 // 10 minutes

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout

    // Function to handle user inactivity
    const handleInactivity = async () => {
      console.log("User has been inactive for too long. Logging out...")
      await deleteSessionDetails() // Logout user
      window.location.href = "https://google.com" // Redirect to external page
    }

    // Reset inactivity timer when user is active
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer)
      inactivityTimer = setTimeout(handleInactivity, INACTIVITY_TIMEOUT)
    }

    // Events to track user activity
    const events = ["mousemove", "keydown", "scroll", "click"]
    events.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer)
    })

    inactivityTimer = setTimeout(handleInactivity, INACTIVITY_TIMEOUT) // Initial inactivity timer

    // Cleanup event listeners and timer on component unmount
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer)
      })
      clearTimeout(inactivityTimer)
    }
  }, [])

  return <></>
}

export default AutoLogout
