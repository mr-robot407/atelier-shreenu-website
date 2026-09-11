"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type Kind = "discovery_call" | "project_discussion" | "site_walkthrough";
type Variant = "any" | "ncr" | "outside_ncr";

const KIND_LABEL: Record<Kind, { title: string; sub: string; duration: string }> = {
  discovery_call: {
    title: "Discovery Call",
    sub: "A ten-minute conversation with the founding partner.",
    duration: "10 minutes",
  },
  project_discussion: {
    title: "Project Discussion",
    sub: "A thirty-minute review of an existing brief with the studio.",
    duration: "30 minutes",
  },
  site_walkthrough: {
    title: "Site & Vision Walkthrough",
    sub: "An on-site or virtual walkthrough with the studio.",
    duration: "60 minutes",
  },
};

const PRICE_LABEL = {
  discovery_call: "Complimentary",
  project_discussion: "₹1,770 (incl. 18% GST)",
  site_walkthrough_ncr: "₹3,540 · NCR (incl. 18% GST)",
  site_walkthrough_outside: "₹7,080 · Outside NCR (incl. 18% GST)",
};

function todayIsoInIst(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  return `${y}-${m}-${d}`;
}

function addDaysIso(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatSlot(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
}

function formatDateLabel(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Asia/Kolkata",
  });
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-warm-ivory" />}>
      <BookPageInner />
    </Suspense>
  );
}

function BookPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kind = (searchParams.get("kind") as Kind) || "discovery_call";
  const info = KIND_LABEL[kind] ?? KIND_LABEL.discovery_call;
  const isPaid = kind !== "discovery_call";

  const today = useMemo(() => todayIsoInIst(), []);
  const minDate = useMemo(() => addDaysIso(today, 1), [today]);
  const [date, setDate] = useState<string>(minDate);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [variant, setVariant] = useState<Variant>(
    kind === "site_walkthrough" ? "ncr" : "any",
  );
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errMsg, setErrMsg] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setSlots([]);
    setSelectedSlot("");
    fetch(`/api/booking/slots?date=${date}&kind=${kind}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setSlots(Array.isArray(data.slots) ? data.slots : []);
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [date, kind]);

  async function handleDiscoverySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) return;
    setStatus("submitting");
    setErrMsg("");
    try {
      const res = await fetch("/api/booking/confirm-discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          first_name: name,
          slot_iso: selectedSlot,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setErrMsg(data.error || "Could not confirm the booking.");
        return;
      }
      router.push(
        `/book/thanks?kind=${kind}&slot=${encodeURIComponent(selectedSlot)}`,
      );
    } catch {
      setStatus("error");
      setErrMsg("Network error — please try again.");
    }
  }

  async function handlePaidSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) return;
    setStatus("submitting");
    setErrMsg("");
    try {
      const res = await fetch("/api/booking/create-payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          first_name: name,
          slot_iso: selectedSlot,
          booking_kind: kind,
          variant,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setStatus("error");
        setErrMsg(data.error || "Could not create the payment link.");
        return;
      }
      // Redirect to Razorpay hosted checkout
      window.location.href = data.url as string;
    } catch {
      setStatus("error");
      setErrMsg("Network error — please try again.");
    }
  }

  const priceRow = () => {
    if (kind === "discovery_call") return PRICE_LABEL.discovery_call;
    if (kind === "project_discussion") return PRICE_LABEL.project_discussion;
    return variant === "ncr"
      ? PRICE_LABEL.site_walkthrough_ncr
      : PRICE_LABEL.site_walkthrough_outside;
  };

  return (
    <main className="min-h-screen bg-warm-ivory font-sans text-charcoal">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="text-micro text-warm-grey uppercase tracking-wide hover:text-charcoal transition-colors"
        >
          ← Return to atelier
        </Link>

        <header className="mt-8 border-b border-stone/60 pb-6">
          <p className="font-serif text-micro uppercase tracking-wide text-warm-grey">
            Atelier Shreenu
          </p>
          <h1 className="font-serif text-4xl md:text-5xl mt-2 leading-tight">
            Book · {info.title}
          </h1>
          <p className="mt-3 text-warm-grey">{info.sub}</p>
          <p className="mt-2 text-sm">
            {info.duration} · {priceRow()}
          </p>
        </header>

        {kind === "site_walkthrough" && (
          <section className="mt-8">
            <p className="text-micro uppercase tracking-wide text-warm-grey mb-3">
              Walkthrough location
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setVariant("ncr")}
                className={`border px-5 py-3 text-sm transition-colors ${
                  variant === "ncr"
                    ? "border-charcoal bg-charcoal text-warm-ivory"
                    : "border-stone bg-warm-ivory hover:border-charcoal"
                }`}
              >
                Delhi NCR · ₹3,540
              </button>
              <button
                type="button"
                onClick={() => setVariant("outside_ncr")}
                className={`border px-5 py-3 text-sm transition-colors ${
                  variant === "outside_ncr"
                    ? "border-charcoal bg-charcoal text-warm-ivory"
                    : "border-stone bg-warm-ivory hover:border-charcoal"
                }`}
              >
                Outside NCR · ₹7,080
              </button>
            </div>
          </section>
        )}

        <section className="mt-8">
          <label
            htmlFor="date"
            className="block text-micro uppercase tracking-wide text-warm-grey mb-2"
          >
            Choose a date
          </label>
          <input
            id="date"
            type="date"
            min={minDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-stone bg-warm-ivory px-4 py-3 font-sans w-full sm:w-auto focus:outline-none focus:border-charcoal"
          />
          <p className="mt-2 text-sm text-warm-grey">
            {formatDateLabel(date)} · IST · Mon–Sat only
          </p>
        </section>

        <section className="mt-8">
          <p className="text-micro uppercase tracking-wide text-warm-grey mb-3">
            Available times
          </p>
          {loading ? (
            <p className="text-warm-grey">Loading slots…</p>
          ) : slots.length === 0 ? (
            <p className="text-warm-grey">
              No slots available on this date. Please choose another.
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`border py-3 text-sm transition-colors ${
                    selectedSlot === slot
                      ? "border-charcoal bg-charcoal text-warm-ivory"
                      : "border-stone bg-warm-ivory hover:border-charcoal"
                  }`}
                >
                  {formatSlot(slot)}
                </button>
              ))}
            </div>
          )}
        </section>

        <form
          onSubmit={isPaid ? handlePaidSubmit : handleDiscoverySubmit}
          className="mt-10 space-y-5"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-micro uppercase tracking-wide text-warm-grey mb-2"
            >
              Your name
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-stone bg-warm-ivory px-4 py-3 w-full focus:outline-none focus:border-charcoal"
              placeholder="Full name"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-micro uppercase tracking-wide text-warm-grey mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-stone bg-warm-ivory px-4 py-3 w-full focus:outline-none focus:border-charcoal"
              placeholder="you@example.com"
            />
          </div>
          <div className="pt-4">
            <button
              type="submit"
              disabled={
                !selectedSlot ||
                !name ||
                !email ||
                status === "submitting"
              }
              className="bg-charcoal text-warm-ivory px-8 py-3 text-micro uppercase tracking-wide disabled:opacity-40"
            >
              {status === "submitting"
                ? isPaid
                  ? "Creating payment link…"
                  : "Confirming…"
                : isPaid
                ? "Proceed to payment →"
                : "Confirm discovery call →"}
            </button>
            {status === "error" && (
              <p className="mt-3 text-burgundy text-sm">{errMsg}</p>
            )}
            <p className="mt-3 text-xs text-warm-grey">
              {isPaid
                ? "You will be redirected to Razorpay to complete payment. The booking confirms once payment is captured; a receipt and calendar invite will be emailed to you."
                : "A confirmation email with a calendar invite will be sent to the address above."}
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
