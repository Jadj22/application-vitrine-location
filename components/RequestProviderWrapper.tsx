"use client";

import { useParams } from "next/navigation";
import { RequestProvider } from "@/lib/request-context";

export default function RequestProviderWrapper({ children }: { children: React.ReactNode }) {
  const params = useParams<{ slug?: string }>();
  const slug = params?.slug;
  return <RequestProvider slug={slug}>{children}</RequestProvider>;
}
