"use client"

import CommunityPage from "@/src/components/CommunityPage/CommunityPage";
import CommunityBanner from "./CommunityBanner";
import SignUpForm from "./SignUpForm";
import { useValidUser } from "@/src/contexts/ValidCountryUser";
import AccessDenied from "@/src/components/AccessDenied";

// Server-side rendered page component
const CommunityConversation = () => {
  const { isValidUser } = useValidUser();
  return (
    isValidUser ?
    <div className="bg-gray-400">
      <CommunityBanner />
      <CommunityPage />
      <SignUpForm />
    </div> : 
    <AccessDenied />
  );
};

export default CommunityConversation;