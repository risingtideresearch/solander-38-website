"use client";

import dynamic from "next/dynamic";

const NewsletterForm = dynamic(() => import("./NewsletterForm"), { ssr: false });

export default function NewsletterFormClient() {
  return <NewsletterForm />;
}
