"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { bookingTermsFor } from "@/content/booking-terms";

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};
type RazorpayInstance = {
  open: () => void;
  on: (event: string, callback: (payload: unknown) => void) => void;
};
declare global {
  interface Window {
    Razorpay?: new (options: {
      key: string;
      amount: number;
      currency: string;
      order_id: string;
      name: string;
      description?: string;
      image?: string;
      prefill?: { name?: string; email?: string; contact?: string };
      notes?: Record<string, string>;
      theme?: { color?: string };
      handler: (resp: RazorpayResponse) => void;
      modal?: { ondismiss?: () => void };
    }) => RazorpayInstance;
  }
}

const RAZORPAY_SRC = "https://checkout.razorpay.com/v1/checkout.js";

async function ensureRazorpayLoaded(): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.Razorpay) return;
  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("checkout.js failed to load")), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = RAZORPAY_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("checkout.js failed to load"));
    document.body.appendChild(s);
  });
}

type Kind = "discovery_call" | "project_discussion" | "site_walkthrough";
type Variant = "any" | "ncr" | "outside_ncr";
type Path =
  | "complimentary"
  | "online_meeting"
  | "site_visit_ncr"
  | "site_visit_outside";

const PATHS: {
  key: Path;
  kind: Kind;
  variant: Variant;
  title: string;
  sub: string;
  duration: string;
  price: string;
}[] = [
  {
    key: "complimentary",
    kind: "discovery_call",
    variant: "any",
    title: "Complimentary Discovery Call",
    sub: "A ten-minute introduction with the founding partner.",
    duration: "10 minutes",
    price: "Complimentary",
  },
  {
    key: "online_meeting",
    kind: "project_discussion",
    variant: "any",
    title: "Project Discussion · Online",
    sub: "A considered thirty-minute review of your brief, on Google Meet.",
    duration: "30 minutes",
    price: "₹1,770 (incl. 18% GST)",
  },
  {
    key: "site_visit_ncr",
    kind: "site_walkthrough",
    variant: "ncr",
    title: "Site Visit · Within NCR",
    sub: "On-site conversation and assessment across Delhi NCR.",
    duration: "60 minutes",
    price: "₹3,540 (incl. 18% GST)",
  },
  {
    key: "site_visit_outside",
    kind: "site_walkthrough",
    variant: "outside_ncr",
    title: "Site Visit · Outside NCR",
    sub: "On-site conversation and assessment beyond NCR.",
    duration: "2 hours on site",
    price: "₹7,080 (incl. 18% GST)",
  },
];

function pathFromQuery(kind: string | null, variant: string | null): Path {
  if (kind === "project_discussion") return "online_meeting";
  if (kind === "site_walkthrough")
    return variant === "outside_ncr" ? "site_visit_outside" : "site_visit_ncr";
  return "complimentary";
}

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

  const initialPath = pathFromQuery(
    searchParams.get("kind"),
    searchParams.get("variant"),
  );
  const [pathKey, setPathKey] = useState<Path>(initialPath);
  const path = PATHS.find((p) => p.key === pathKey) ?? PATHS[0];
  const isPaid = path.kind !== "discovery_call";
  // Lock the format selection when the URL carries ?lock=1 (used from
  // deep-linked ack emails so the client can't change consultation type mid-flow).
  const locked = searchParams.get("lock") === "1";
  // ?test=<token> → create-order overrides amount to ₹1 when the token matches
  // BOOKING_TEST_TOKEN server-side. For end-to-end verification of the paid flow.
  const testToken = searchParams.get("test") ?? "";

  const today = useMemo(() => todayIsoInIst(), []);
  const minDate = useMemo(() => addDaysIso(today, 1), [today]);
  const [date, setDate] = useState<string>(minDate);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errMsg, setErrMsg] = useState<string>("");

  const [termsOpen, setTermsOpen] = useState(false);
  const [ackAll, setAckAll] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setSlots([]);
    setSelectedSlot("");
    fetch(`/api/booking/slots?date=${date}&kind=${path.kind}`)
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
  }, [date, path.kind]);

  function selectPath(next: Path) {
    if (locked) return;
    setPathKey(next);
    setStatus("idle");
    setErrMsg("");
    setAckAll(false);
    const params = new URLSearchParams();
    const p = PATHS.find((x) => x.key === next)!;
    params.set("kind", p.kind);
    if (p.kind === "site_walkthrough") params.set("variant", p.variant);
    router.replace(`/book?${params.toString()}`, { scroll: false });
  }

  async function confirmDiscovery(e: React.FormEvent) {
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
        `/book/thanks?kind=${path.kind}&slot=${encodeURIComponent(selectedSlot)}`,
      );
    } catch {
      setStatus("error");
      setErrMsg("Network error — please try again.");
    }
  }

  function openTerms(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot || !name || !email) return;
    setTermsOpen(true);
  }

  async function proceedToPayment() {
    if (!ackAll) return;
    setStatus("submitting");
    setErrMsg("");
    try {
      // 1. Ask the server for a Razorpay order — same validation as the old
      //    create-payment-link path, but returns an order_id for on-page
      //    checkout instead of a hosted redirect URL.
      const res = await fetch("/api/booking/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          first_name: name,
          slot_iso: selectedSlot,
          booking_kind: path.kind,
          variant: path.variant,
          terms_accepted_at: new Date().toISOString(),
          ...(testToken ? { test_token: testToken } : {}),
        }),
      });
      const order = await res.json().catch(() => ({}));
      if (!res.ok || !order.order_id) {
        setStatus("error");
        setErrMsg(order.error || "Could not initialise payment.");
        setTermsOpen(false);
        return;
      }

      // 2. Stash the booking spec so /book/thanks can fire the client
      //    confirmation + studio notify on load. Same safety-net semantics as
      //    the Payment Link flow.
      try {
        sessionStorage.setItem(
          "as_pending_booking",
          JSON.stringify({
            email,
            first_name: name,
            slot_iso: selectedSlot,
            booking_kind: path.kind,
            variant: path.variant,
          }),
        );
      } catch {
        // sessionStorage may be blocked (private mode); Lambda webhook is
        // the primary confirmation path either way.
      }

      // 3. Load checkout.js if not already present.
      await ensureRazorpayLoaded();
      if (!window.Razorpay) throw new Error("checkout.js unavailable");

      // 4. Open the modal.
      const razorpay = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "Atelier Shreenu",
        description: order.description ?? path.title,
        prefill: { name, email },
        notes: {
          booking_kind: path.kind,
          variant: path.variant,
          slot_iso: selectedSlot,
        },
        theme: { color: "#63272C" },
        handler: async (resp) => {
          // 5. Verify the signature server-side. If verification fails we do
          //    NOT send the client to thanks — surface the error instead.
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              }),
            });
            const verifyJson = await verifyRes.json().catch(() => ({}));
            if (!verifyRes.ok || !verifyJson.verified) {
              throw new Error(verifyJson.error ?? "Signature verification failed");
            }

            // 6. Send them to the thanks page. Thanks-page load calls
            //    /api/booking/confirm-paid which fires the client + studio
            //    email. The Lambda's payment.captured webhook remains the
            //    primary duplicate-suppressed source of truth.
            const params = new URLSearchParams({
              paid: "1",
              kind: path.kind,
              payment_id: resp.razorpay_payment_id,
            });
            if (path.kind === "site_walkthrough") {
              params.set("variant", path.variant);
            }
            router.push(`/book/thanks?${params.toString()}`);
          } catch (err) {
            setStatus("error");
            setErrMsg(
              (err as Error).message ||
                "We received a payment but could not verify it. Please contact us and we will sort it out.",
            );
            setTermsOpen(false);
          }
        },
        modal: {
          ondismiss: () => {
            setStatus("idle");
            setErrMsg("Payment cancelled — try again whenever you are ready.");
          },
        },
      });

      razorpay.on("payment.failed", (payload: unknown) => {
        const reason =
          (payload as { error?: { description?: string } })?.error?.description ??
          "Payment failed. Please try again or reach us at info@ateliershreenu.com.";
        setStatus("error");
        setErrMsg(reason);
      });

      razorpay.open();
    } catch (err) {
      setStatus("error");
      setErrMsg(
        (err as Error).message === "checkout.js failed to load"
          ? "Could not reach the payment provider — check your connection and try again."
          : "Network error — please try again.",
      );
      setTermsOpen(false);
    }
  }

  return (
    <main className="min-h-screen bg-warm-ivory font-sans text-charcoal">
      {testToken && (
        <div className="bg-amber-100 border-b border-amber-300 text-amber-900 text-center text-xs py-2 px-4 font-medium">
          TEST MODE — paid tiers will charge ₹1 (requires matching
          BOOKING_TEST_TOKEN server-side)
        </div>
      )}
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
            Book a Conversation
          </h1>
          <p className="mt-3 text-warm-grey">
            Choose the format that best suits your project.
          </p>
        </header>

        <section className="mt-8">
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-micro uppercase tracking-wide text-warm-grey">
              Format
            </p>
            {locked && (
              <p className="text-micro tracking-wide text-warm-grey">
                Locked from your enquiry — <a href="/book" className="underline hover:text-charcoal">change</a>
              </p>
            )}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {PATHS.map((p) => {
              const active = p.key === pathKey;
              const dimmed = locked && !active;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => selectPath(p.key)}
                  disabled={dimmed}
                  aria-disabled={dimmed}
                  className={`text-left border p-4 transition-colors ${
                    active
                      ? "border-charcoal bg-charcoal text-warm-ivory"
                      : dimmed
                      ? "border-stone/40 bg-warm-ivory grayscale opacity-40 cursor-not-allowed"
                      : "border-stone bg-warm-ivory hover:border-charcoal"
                  }`}
                >
                  <p
                    className={`font-serif text-lg leading-snug ${
                      active ? "text-warm-ivory" : "text-charcoal"
                    }`}
                  >
                    {p.title}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      active ? "text-warm-ivory/80" : "text-warm-grey"
                    }`}
                  >
                    {p.sub}
                  </p>
                  <p
                    className={`text-xs mt-3 uppercase tracking-wide ${
                      active ? "text-warm-ivory/80" : "text-warm-grey"
                    }`}
                  >
                    {p.duration} · {p.price}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

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
          onSubmit={isPaid ? openTerms : confirmDiscovery}
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
                ? "Review & accept terms →"
                : "Confirm discovery call →"}
            </button>
            {status === "error" && (
              <p className="mt-3 text-burgundy text-sm">{errMsg}</p>
            )}
            <p className="mt-3 text-xs text-warm-grey">
              {isPaid
                ? "You will be asked to accept the studio's pre-signing terms before being redirected to Razorpay. The booking confirms once payment is captured; a receipt and calendar invite will be emailed to you."
                : "A confirmation email with a calendar invite will be sent to the address above."}
            </p>
          </div>
        </form>
      </div>

      {termsOpen && isPaid && (
        <TermsModal
          path={path}
          ackAll={ackAll}
          setAckAll={setAckAll}
          submitting={status === "submitting"}
          onClose={() => {
            setTermsOpen(false);
            setStatus("idle");
          }}
          onProceed={proceedToPayment}
        />
      )}
    </main>
  );
}

function TermsModal(props: {
  path: (typeof PATHS)[number];
  ackAll: boolean;
  setAckAll: (v: boolean) => void;
  submitting: boolean;
  onClose: () => void;
  onProceed: () => void;
}) {
  const { path, ackAll, setAckAll, submitting, onClose, onProceed } = props;

  const blocks = bookingTermsFor(path.kind, path.variant);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 px-4"
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-warm-ivory border border-stone shadow-lg">
        <div className="px-6 pt-6 pb-4 border-b border-stone/60">
          <p className="font-serif text-micro uppercase tracking-wide text-warm-grey">
            Atelier Shreenu · Pre-Signing Terms
          </p>
          <h2
            id="terms-title"
            className="font-serif text-2xl md:text-3xl mt-2 leading-tight"
          >
            {path.title}
          </h2>
          <p className="mt-2 text-sm text-warm-grey">
            {path.duration} · {path.price}
          </p>
        </div>

        <div className="px-6 py-6 space-y-6">
          {blocks.map((block) => (
            <div key={block.title}>
              <p className="font-serif text-sm uppercase tracking-wide">
                {block.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed">{block.body}</p>
            </div>
          ))}

          <label className="flex items-start gap-3 cursor-pointer border-t border-stone/60 pt-5">
            <input
              type="checkbox"
              checked={ackAll}
              onChange={(e) => setAckAll(e.target.checked)}
              className="mt-1 h-4 w-4 accent-charcoal"
            />
            <span className="text-sm">
              I agree — I have read and accept the 90-day confirmation credit
              policy, the cancellation &amp; refund policy, and the terms set
              out above.
            </span>
          </label>
        </div>

        <div className="px-6 py-4 border-t border-stone/60 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="border border-stone px-6 py-3 text-micro uppercase tracking-wide hover:border-charcoal disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onProceed}
            disabled={!ackAll || submitting}
            className="bg-charcoal text-warm-ivory px-6 py-3 text-micro uppercase tracking-wide disabled:opacity-40"
          >
            {submitting ? "Creating payment link…" : "I Accept →"}
          </button>
        </div>
      </div>
    </div>
  );
}
