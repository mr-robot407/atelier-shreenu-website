"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
}

const KIND_LABEL: Record<string, string> = {
  discovery_call: "Discovery Call",
  project_discussion: "Project Discussion",
  site_walkthrough: "Site & Vision Walkthrough",
};

export default function ThanksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-warm-ivory" />}>
      <ThanksPageInner />
    </Suspense>
  );
}

function ThanksPageInner() {
  const params = useSearchParams();
  const kind = params.get("kind") ?? "discovery_call";
  const slot = params.get("slot") ?? "";
  const label = KIND_LABEL[kind] ?? "Appointment";

  return (
    <main className="min-h-screen bg-warm-ivory font-sans text-charcoal">
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="font-serif text-micro uppercase tracking-wide text-warm-grey">
          Atelier Shreenu
        </p>
        <h1 className="font-serif text-4xl md:text-5xl mt-4 leading-tight">
          Your {label} is confirmed.
        </h1>

        {slot && (
          <p className="mt-6 text-lg">
            {formatDate(slot)} <span className="text-warm-grey">IST</span>
          </p>
        )}

        <p className="mt-8 text-warm-grey leading-relaxed">
          A confirmation email has been sent with a calendar invite. The studio
          looks forward to the conversation.
        </p>

        <div className="mt-12 space-x-4">
          <Link
            href="/"
            className="inline-block bg-charcoal text-warm-ivory px-8 py-3 text-micro uppercase tracking-wide"
          >
            Return to atelier
          </Link>
        </div>
      </div>
    </main>
  );
}
