import { redirect } from "next/navigation";
import { bookingRequests } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function OldTrackingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  try {
    const result = await bookingRequests.getByToken(token);
    redirect(`/b/${result.business_slug}/booking-requests/${token}`);
  } catch {
    redirect("/");
  }
}