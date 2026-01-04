

import VerifyOtpContent from "@/app/components/VerifyOtpContent"; // We'll create this separately

export default function Page({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = searchParams.email || "";

  return <VerifyOtpContent email={email} />;
}


export const dynamic = "force-dynamic";