export const runtime = "edge";

import { Metadata } from "next";
import ResourcePage from "./resources";

// Generate metadata for the page
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Resource Page",
    description: "Resources related to modules, podcast , video.",
    keywords: ["resources", "modules", "podcast", "videos"],
  };
}

// Server-side rendered page component
const Resources = () => {
  return (
    <ResourcePage />
  );
};

export default Resources;
