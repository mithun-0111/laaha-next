export const runtime = "edge"

import Profile from "@/src/components/ProfilePage/Profile"

const ForumUserDashboard = () => {
  return (
    <div className="bg-gray-600">
      <div className="container">
        <Profile />
      </div>
    </div>
  )
}

export default ForumUserDashboard
