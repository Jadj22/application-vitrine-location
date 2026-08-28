"use client";

import { useEffect } from "react";
import { setStoredBusinessSlug } from "@/lib/business-slug-storage";

export default function StoreBusinessSlug({ slug }: { slug: string }) {
  useEffect(() => {
    setStoredBusinessSlug(slug);
  }, [slug]);

  return null;
}