import React from "react"
import Replies from "./Replies"

const RepliesList = ({ replies, currentUser }: any) => {
  return (
    <div className="replies-list">
      {replies?.map((reply: any, index: number) => {
        return <Replies key={index} reply={reply} currentUser={currentUser} />
      })}
    </div>
  )
}

export default RepliesList
