export const runtime = "edge";

import { Metadata } from "next";
import CommunityConversation from "./CommunityConversation";

// Generate metadata for the page
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Community Conversations",
    description: "Join the community and engage in meaningful conversations.",
    keywords: ["community", "conversations", "discussions", "forum"],
  };
}

// Server-side rendered page component
const CommunityConversations = () => {
  return (
    <CommunityConversation />
  );
};

export default CommunityConversations;