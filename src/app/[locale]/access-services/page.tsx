export const runtime = "edge";

import FindServices from "./find-services";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find Services',
  description: 'Discover and find the best services available.',
  keywords: ['services', 'find services', 'best services'],
};

export default async function FindServicesPage() {
  return (
    <FindServices />
  );
}
