"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionLabel } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";

type Tab = "client" | "vendor";
type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function Contact() {
  const [activeTab, setActiveTab] = useState<Tab>("client");
  const [clientStatus, setClientStatus] = useState<SubmitStatus>("idle");
  const [vendorStatus, setVendorStatus] = useState<SubmitStatus>("idle");

  const makeSubmitHandler =
    (setStatus: (s: SubmitStatus) => void) =>
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      const body = new URLSearchParams();
      formData.forEach((value, key) =>
        body.append(key, typeof value === "string" ? value : "")
      );
      setStatus("submitting");
      try {
        const res = await fetch("/__forms.html", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        });
        if (!res.ok) throw new Error();
        form.reset();
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };

  return (
    <section id="contact" className="relative overflow-hidden bg-ink py-24 text-bone md:py-36">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
          style={{ backgroundImage: "url('/images/contact-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/40 to-ink/50" />
        <div className="absolute inset-0 bg-ink/20" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-12 gap-8 md:gap-12">
          {/* Left column */}
          <div className="col-span-12 md:col-span-5">
            <FadeIn>
              <SectionLabel className="mb-6 block text-terracotta">Start here</SectionLabel>
              <h2 className="font-serif text-[52px] leading-[1.05] md:text-[80px]">
                Begin a
                <br />
                <span className="italic text-sandstone">conversation.</span>
              </h2>
              <p className="mt-8 max-w-md text-[15px] leading-relaxed text-bone/70">
                Tell us about your project — its site, its nature, and the kind of life you
                want to live within it. We reply to all enquiries personally.
              </p>
            </FadeIn>

            <FadeIn delay={0.2} className="mt-14 space-y-5 border-t border-bone/15 pt-10">
              <div>
                <div className="text-micro text-bone/50">Studio</div>
                <div className="mt-2 font-serif text-xl italic">
                  {site.contact.address.line1}
                </div>
                <div className="text-sm text-bone/75">
                  {site.contact.address.city} — {site.contact.address.postal}
                </div>
              </div>

              <div>
                <div className="text-micro text-bone/50">Contact</div>
                <div className="mt-2 text-sm">
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="block hover:text-terracotta"
                  >
                    {site.contact.email}
                  </a>
                  <a
                    href={`tel:+${site.contact.phoneIntl}`}
                    className="mt-1 block hover:text-terracotta"
                  >
                    {site.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex gap-5 pt-2 text-micro">
                <a
                  href={site.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-bone/40 pb-0.5 hover:border-bone"
                >
                  Maps
                </a>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-bone/40 pb-0.5 hover:border-bone"
                >
                  Instagram
                </a>
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-bone/40 pb-0.5 hover:border-bone"
                >
                  LinkedIn
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Right column: tabbed forms */}
          <FadeIn delay={0.1} className="col-span-12 md:col-span-7">
            {/* Tab switcher */}
            <div className="mb-10 flex gap-6 border-b border-bone/15 md:gap-10">
              <button
                onClick={() => setActiveTab("client")}
                style={{ touchAction: "manipulation" }}
                className={`-mb-px cursor-pointer pb-4 text-[15px] tracking-wide transition-colors duration-200 focus:outline-none ${
                  activeTab === "client"
                    ? "border-b-2 border-burgundy text-bone"
                    : "text-bone/45 hover:text-bone/70"
                }`}
              >
                Work with us
              </button>
              <button
                onClick={() => setActiveTab("vendor")}
                style={{ touchAction: "manipulation" }}
                className={`-mb-px cursor-pointer pb-4 text-[15px] tracking-wide transition-colors duration-200 focus:outline-none ${
                  activeTab === "vendor"
                    ? "border-b-2 border-burgundy text-bone"
                    : "text-bone/45 hover:text-bone/70"
                }`}
              >
                Vendors
              </button>
            </div>

            {/* ── Work with us form ── */}
            {activeTab === "client" && (
              <form
                name="client-enquiry"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
                onSubmit={makeSubmitHandler(setClientStatus)}
                className="space-y-8"
              >
                <input type="hidden" name="form-name" value="client-enquiry" />
                <input type="hidden" name="enquiry_type" value="client" />
                {/* TODO: Route submissions based on enquiry_type field:
                    enquiry_type === "client" → Client folder/tag in CRM
                    enquiry_type === "vendor" → Vendor folder/tag in CRM */}
                <p className="hidden">
                  <label>
                    Don&apos;t fill this out: <input name="bot-field" />
                  </label>
                </p>

                <FormField label="Name" name="name" placeholder="Your full name" autoComplete="name" required />
                <FormField label="Email" name="email" type="email" placeholder="your@email.com" autoComplete="email" required />
                <FormField label="Phone" name="phone" type="tel" placeholder="+91 98765 43210" autoComplete="tel" inputMode="tel" />
                <FormField label="Project Location" name="location" placeholder="City, state" autoComplete="address-level2" />

                <div>
                  <label htmlFor="projectType" className="text-micro block text-bone/55">
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    className="mt-3 w-full border-b border-bone/25 bg-transparent py-3 text-[15px] outline-none focus:border-bone"
                    defaultValue=""
                  >
                    <option value="" disabled className="bg-ink">Select a type</option>
                    <option value="residential" className="bg-ink">Residential</option>
                    <option value="commercial" className="bg-ink">Commercial</option>
                    <option value="hospitality" className="bg-ink">Hospitality</option>
                    <option value="heritage" className="bg-ink">Heritage Restoration</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="consultationType" className="text-micro block text-bone/55">
                    Consultation Type <span className="ml-1 text-terracotta">*</span>
                  </label>
                  <select
                    id="consultationType"
                    name="consultationType"
                    required
                    className="mt-3 w-full border-b border-bone/25 bg-transparent py-3 text-[15px] outline-none focus:border-bone"
                    defaultValue=""
                  >
                    <option value="" disabled className="bg-ink">Select consultation type</option>
                    <option value="studio" className="bg-ink">Studio Consultation (Palam Vihar) — ₹3,000 | 45 min</option>
                    <option value="gurugram" className="bg-ink">On-Site Visit (Within Gurugram) — ₹4,500 | 1 hour</option>
                    <option value="ncr" className="bg-ink">On-Site Regional Visit (Within NCR) — ₹6,000 | 1.5 hours</option>
                    <option value="outstation" className="bg-ink">On-Site Overnight Visit (Outside NCR) — ₹9,000 | 3 hours over 2 days</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="text-micro block text-bone/55">
                    Message <span className="ml-1 text-terracotta">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Tell us about your project — location, brief, timeline..."
                    required
                    className="mt-3 w-full resize-none border-b border-bone/25 bg-transparent py-3 text-[15px] placeholder:text-bone/40 outline-none focus:border-bone"
                  />
                </div>

                <button
                  type="submit"
                  disabled={clientStatus === "submitting"}
                  className="text-micro mt-4 inline-flex min-h-[44px] items-center border border-bone/60 px-8 transition-colors duration-200 hover:border-burgundy hover:bg-burgundy hover:text-bone disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {clientStatus === "submitting" ? "Sending…" : "Begin a conversation"}
                </button>

                {clientStatus === "success" && (
                  <p role="status" className="text-sm text-bone/80">
                    Thank you — your enquiry has been received. We&apos;ll reply personally.
                  </p>
                )}
                {clientStatus === "error" && (
                  <p role="alert" className="text-sm text-terracotta">
                    Something went wrong. Please email us at{" "}
                    <a href={`mailto:${site.contact.email}`} className="underline">
                      {site.contact.email}
                    </a>
                    .
                  </p>
                )}
              </form>
            )}

            {/* ── Vendors form ── */}
            {activeTab === "vendor" && (
              <form
                name="vendor-enquiry"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
                onSubmit={makeSubmitHandler(setVendorStatus)}
                className="space-y-8"
              >
                <input type="hidden" name="form-name" value="vendor-enquiry" />
                <input type="hidden" name="enquiry_type" value="vendor" />
                <p className="hidden">
                  <label>
                    Don&apos;t fill this out: <input name="bot-field" />
                  </label>
                </p>

                <p className="text-sm italic text-bone/50">
                  This form is for vendors and suppliers only. For project enquiries, please
                  use the &ldquo;Work with us&rdquo; tab.
                </p>

                <FormField label="Company Name" name="company_name" placeholder="Your company name" required />
                <FormField label="Contact Person" name="contact_person" placeholder="Your full name" autoComplete="name" required />
                <FormField label="Email" name="email" type="email" placeholder="your@company.com" autoComplete="email" required />
                <FormField label="Phone" name="phone" type="tel" placeholder="+91 98765 43210" autoComplete="tel" inputMode="tel" required />

                <div>
                  <label htmlFor="vendorCategory" className="text-micro block text-bone/55">
                    Category <span className="ml-1 text-terracotta">*</span>
                  </label>
                  <select
                    id="vendorCategory"
                    name="category"
                    required
                    className="mt-3 w-full border-b border-bone/25 bg-transparent py-3 text-[15px] outline-none focus:border-bone"
                    defaultValue=""
                  >
                    <option value="" disabled className="bg-ink">Select a category</option>
                    <option value="materials" className="bg-ink">Materials Supplier</option>
                    <option value="furniture" className="bg-ink">Furniture Manufacturer</option>
                    <option value="contractor" className="bg-ink">Contractor / Builder</option>
                    <option value="artisan" className="bg-ink">Artisan / Craftsperson</option>
                    <option value="technology" className="bg-ink">Technology / Lighting</option>
                    <option value="other" className="bg-ink">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="services" className="text-micro block text-bone/55">
                    Products / Services Offered <span className="ml-1 text-terracotta">*</span>
                  </label>
                  <textarea
                    id="services"
                    name="services"
                    rows={4}
                    placeholder="Describe what you offer..."
                    required
                    className="mt-3 w-full resize-none border-b border-bone/25 bg-transparent py-3 text-[15px] placeholder:text-bone/40 outline-none focus:border-bone"
                  />
                </div>

                <FormField label="Website" name="website_url" type="url" placeholder="https://yourcompany.com" />
                <FormField label="Showroom / Office Location" name="showroom_location" placeholder="City, state" />

                <button
                  type="submit"
                  disabled={vendorStatus === "submitting"}
                  className="text-micro mt-4 inline-flex min-h-[44px] items-center border border-bone/60 px-8 transition-colors duration-200 hover:border-burgundy hover:bg-burgundy hover:text-bone disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {vendorStatus === "submitting" ? "Sending…" : "Submit vendor enquiry"}
                </button>

                {vendorStatus === "success" && (
                  <p role="status" className="text-sm text-bone/80">
                    Thank you — your details have been received. We&apos;ll be in touch if
                    there&apos;s a fit.
                  </p>
                )}
                {vendorStatus === "error" && (
                  <p role="alert" className="text-sm text-terracotta">
                    Something went wrong. Please email us at{" "}
                    <a href={`mailto:${site.contact.email}`} className="underline">
                      {site.contact.email}
                    </a>
                    .
                  </p>
                )}
              </form>
            )}
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}

function FormField({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-micro block text-bone/55">
        {label}
        {required && <span className="ml-1 text-terracotta">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        required={required}
        className="mt-3 w-full border-b border-bone/25 bg-transparent py-3 text-[15px] placeholder:text-bone/40 outline-none focus:border-bone focus-visible:ring-1 focus-visible:ring-bone"
      />
    </div>
  );
}
