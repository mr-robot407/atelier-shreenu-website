"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionLabel } from "@/components/ui/SectionHeading";
import { site } from "@/content/site";

type Tab = "project" | "vendor" | "careers";
type SubmitStatus = "idle" | "submitting" | "success" | "error" | "rate_limited";

const inputClass =
  "mt-3 w-full border-b border-bone/25 bg-transparent py-3 text-[15px] placeholder:text-bone/40 outline-none focus:border-burgundy";
const labelClass = "text-micro block text-bone/55";

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
      <label htmlFor={name} className={labelClass}>
        {label}
        {required && <span className="ml-1 text-burgundy">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        required={required}
        className={inputClass}
      />
    </div>
  );
}

function CheckGroup({
  legend,
  name,
  options,
}: {
  legend: string;
  name: string;
  options: string[];
}) {
  return (
    <fieldset>
      <legend className={`${labelClass} mb-3`}>{legend}</legend>
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        {options.map((opt) => (
          <label key={opt} className="flex cursor-pointer items-center gap-2 text-[15px] text-bone/80">
            <input
              type="checkbox"
              name={name}
              value={opt.toLowerCase().replace(/[\s/]+/g, "-")}
              className="h-4 w-4 cursor-pointer accent-burgundy"
            />
            {opt}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function RadioGroup({
  legend,
  name,
  options,
  required,
}: {
  legend: string;
  name: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <fieldset>
      <legend className={`${labelClass} mb-3`}>
        {legend}
        {required && <span className="ml-1 text-burgundy">*</span>}
      </legend>
      <div className="space-y-3">
        {options.map((opt) => (
          <label key={opt} className="flex cursor-pointer items-center gap-3 text-[15px] text-bone/80">
            <input
              type="radio"
              name={name}
              value={opt.toLowerCase().replace(/[\s()]+/g, "-")}
              required={required}
              className="h-4 w-4 cursor-pointer accent-burgundy"
            />
            {opt}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function SelectField({
  label,
  name,
  options,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  options: string[];
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
        {required && <span className="ml-1 text-burgundy">*</span>}
      </label>
      <div className="relative mt-3">
        <select
          id={name}
          name={name}
          required={required}
          defaultValue=""
          className="w-full cursor-pointer appearance-none border-b border-bone/25 bg-transparent py-3 pr-8 text-[15px] text-bone/80 outline-none transition-colors duration-200 focus:border-burgundy [&>option]:bg-[#1c140e] [&>option]:text-bone"
        >
          <option value="" disabled className="text-bone/40">
            {placeholder ?? "Select an option"}
          </option>
          {options.map((opt) => (
            <option
              key={opt}
              value={opt.toLowerCase().replace(/[\s()/]+/g, "-")}
            >
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-1 top-1/2 h-4 w-4 -translate-y-1/2 text-bone/45 transition-colors duration-200"
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
}

export function Contact() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("project");
  const [projectStatus, setProjectStatus] = useState<SubmitStatus>("idle");
  const [vendorStatus, setVendorStatus] = useState<SubmitStatus>("idle");
  const [careersStatus, setCareersStatus] = useState<SubmitStatus>("idle");

  const makeSubmitHandler =
    (setStatus: (s: SubmitStatus) => void, formType: Tab) =>
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      const body: Record<string, string> = { formType };
      formData.forEach((value, key) => {
        if (typeof value === "string") body[key] = value;
      });
      setStatus("submitting");
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.status === 429) { setStatus("rate_limited"); return; }
        if (!res.ok) throw new Error();
        router.push("/thank-you");
      } catch {
        setStatus("error");
      }
    };

  const tabs: { id: Tab; label: string }[] = [
    { id: "project", label: "Start a Project" },
    { id: "vendor", label: "Vendors" },
    { id: "careers", label: "Careers" },
  ];

  const tabDescriptions: Record<Tab, string> = {
    project:
      "Tell us about your project: its site, its nature, and the kind of life you want to live within it. We reply to all enquiries personally.",
    vendor:
      "Tell us what you offer: materials, craft, or specialist services. We review every submission and reach out when there's a fit.",
    careers:
      "Tell us who you are, what drives your practice, and the kind of work you want to be a part of. We read every application personally.",
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
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-8 max-w-md text-[15px] leading-relaxed text-bone/70"
                >
                  {tabDescriptions[activeTab]}
                </motion.p>
              </AnimatePresence>
            </FadeIn>

            <FadeIn delay={0.2} className="mt-14 space-y-5 border-t border-bone/15 pt-10">
              <div>
                <div className="text-micro text-bone/50">Studio</div>
                <div className="mt-2 font-serif text-xl italic">
                  Celebrity Homes, {site.contact.address.line1}
                </div>
                <div className="text-sm text-bone/75">
                  {site.contact.address.city}, {site.contact.address.postal}
                </div>
                <div className="text-sm text-bone/75">
                  By appointment only
                </div>
              </div>

              <div>
                <div className="text-micro text-bone/50">Contact</div>
                <div className="mt-2 text-sm">
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="block hover:text-burgundy"
                  >
                    {site.contact.email}
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
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ touchAction: "manipulation" }}
                  className={`-mb-px cursor-pointer pb-4 text-[15px] tracking-wide transition-all duration-200 focus:outline-none active:scale-[0.95] active:opacity-70 ${
                    activeTab === tab.id
                      ? "border-b-2 border-burgundy text-bone"
                      : "text-bone/45 hover:text-bone/70"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Tab 1: Start a Project ── */}
            {activeTab === "project" && (
              <form
                onSubmit={makeSubmitHandler(setProjectStatus, "project")}
                className="space-y-8"
              >
                {/* Honeypot — hidden from humans, bots fill it */}
                <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

                <FormField label="Name" name="name" placeholder="Your full name" autoComplete="name" required />
                <FormField label="Email" name="email" type="email" placeholder="your@email.com" autoComplete="email" required />
                <FormField label="Phone" name="phone" type="tel" placeholder="+91 98765 43210" autoComplete="tel" inputMode="tel" required />
                <FormField label="Project Location" name="location" placeholder="City, state" autoComplete="address-level2" />

                <SelectField
                  label="Project Type"
                  name="project_type"
                  placeholder="Select project type"
                  options={["Residential", "Commercial", "Hospitality", "Other"]}
                />

                <SelectField
                  label="Service Type"
                  name="service_type"
                  placeholder="Select service type"
                  options={[
                    "Architecture Design Consultancy",
                    "Interior Design Consultancy",
                    "Architecture + Design Consultancy",
                  ]}
                />

                <SelectField
                  label="Select Consultation Type"
                  name="consultation_type"
                  placeholder="Select consultation type"
                  required
                  options={[
                    "Free Discovery Phone Call (10 min)",
                    "Google Meet Discussion (30 min)",
                    "On Site Regional Visit (Within NCR)",
                    "On Site Overnight Visit (Outside NCR)",
                  ]}
                />

                <div>
                  <label htmlFor="message" className={labelClass}>
                    Message <span className="ml-1 text-burgundy">*</span>
                    <span className="ml-2 font-sans text-xs normal-case tracking-normal text-bone/40">Tell us about your project</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Tell us about your project, location, brief, timeline..."
                    required
                    className="mt-3 w-full resize-none border-b border-bone/25 bg-transparent py-3 text-[15px] placeholder:text-bone/40 outline-none focus:border-burgundy"
                  />
                </div>

                <SubmitButton status={projectStatus} label="Begin a conversation" />
                <FormFeedback status={projectStatus} email={site.contact.email}
                  successMsg="Thank you — your enquiry has been received. We'll reply personally." />
              </form>
            )}

            {/* ── Tab 2: Vendors ── */}
            {activeTab === "vendor" && (
              <form
                onSubmit={makeSubmitHandler(setVendorStatus, "vendor")}
                className="space-y-8"
              >
                <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

                <FormField label="Company Name" name="company_name" placeholder="Your company name" required />
                <FormField label="Contact Person" name="contact_person" placeholder="Your full name" autoComplete="name" required />
                <FormField label="Email" name="email" type="email" placeholder="your@company.com" autoComplete="email" required />
                <FormField label="Phone" name="phone" type="tel" placeholder="+91 98765 43210" autoComplete="tel" inputMode="tel" required />

                <SelectField
                  label="Category"
                  name="category"
                  placeholder="Select category"
                  options={[
                    "Materials Supplier",
                    "Furniture Manufacturer",
                    "Contractor / Builder",
                    "Artisan / Craftperson",
                    "Technology / Lighting",
                    "Other",
                  ]}
                />

                <div>
                  <label htmlFor="services" className={labelClass}>
                    Products / Services Offered <span className="ml-1 text-burgundy">*</span>
                  </label>
                  <textarea
                    id="services"
                    name="services"
                    rows={4}
                    placeholder="Describe what you offer..."
                    required
                    className="mt-3 w-full resize-none border-b border-bone/25 bg-transparent py-3 text-[15px] placeholder:text-bone/40 outline-none focus:border-burgundy"
                  />
                </div>

                <FormField label="Website" name="website_url" type="url" placeholder="https://yourcompany.com" />
                <FormField label="Showroom / Office Location" name="showroom_location" placeholder="City, state" />

                <SubmitButton status={vendorStatus} label="Submit vendor enquiry" />
                <FormFeedback status={vendorStatus} email={site.contact.email}
                  successMsg="Thank you — your details have been received. We'll be in touch if there's a fit." />
              </form>
            )}

            {/* ── Tab 3: Careers ── */}
            {activeTab === "careers" && (
              <form
                onSubmit={makeSubmitHandler(setCareersStatus, "careers")}
                className="space-y-8"
              >
                <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

                <FormField label="Name" name="name" placeholder="Your full name" autoComplete="name" required />
                <FormField label="Email" name="email" type="email" placeholder="your@email.com" autoComplete="email" required />
                <FormField label="Phone" name="phone" type="tel" placeholder="+91 98765 43210" autoComplete="tel" inputMode="tel" required />

                <SelectField
                  label="Career Type"
                  name="career_type"
                  placeholder="Select career type"
                  options={["Architect", "Interior Designer", "Specialist", "Intern"]}
                />

                <SelectField
                  label="Experience Level"
                  name="experience_level"
                  placeholder="Select experience level"
                  required
                  options={[
                    "Student",
                    "Early Career (0–2 Years)",
                    "Mid Level (2–5 Years)",
                    "Senior (5 Years+)",
                  ]}
                />

                <FormField label="Portfolio Link" name="portfolio_url" type="url" placeholder="https://yourportfolio.com" />

                <div>
                  <label htmlFor="portfolio_pdf" className={labelClass}>
                    Portfolio PDF Upload
                  </label>
                  <input
                    id="portfolio_pdf"
                    name="portfolio_pdf"
                    type="file"
                    accept=".pdf"
                    className="mt-3 w-full text-[15px] text-bone/70 file:mr-4 file:cursor-pointer file:border file:border-bone/30 file:bg-transparent file:px-4 file:py-2 file:text-xs file:text-bone/70 file:uppercase file:tracking-widest hover:file:border-burgundy hover:file:text-burgundy"
                  />
                </div>

                <div>
                  <label htmlFor="careers_message" className={labelClass}>
                    Message
                    <span className="ml-2 font-sans text-xs normal-case tracking-normal text-bone/40">Tell us who you are, what you do</span>
                  </label>
                  <textarea
                    id="careers_message"
                    name="message"
                    rows={4}
                    placeholder="Tell us who you are, what you do, and why Atelier Shreenu..."
                    className="mt-3 w-full resize-none border-b border-bone/25 bg-transparent py-3 text-[15px] placeholder:text-bone/40 outline-none focus:border-burgundy"
                  />
                </div>

                <SubmitButton status={careersStatus} label="Submit application" />
                <FormFeedback status={careersStatus} email={site.contact.email}
                  successMsg="Thank you — your application has been received. We'll be in touch." />
              </form>
            )}
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}

function SubmitButton({ status, label }: { status: SubmitStatus; label: string }) {
  return (
    <button
      type="submit"
      disabled={status === "submitting"}
      className="text-micro mt-4 inline-flex min-h-[44px] items-center border border-bone/60 px-8 transition-colors duration-200 hover:border-burgundy hover:bg-burgundy hover:text-bone disabled:cursor-not-allowed disabled:opacity-60"
    >
      {status === "submitting" ? "Sending…" : label}
    </button>
  );
}

function FormFeedback({
  status,
  email,
  successMsg,
}: {
  status: SubmitStatus;
  email: string;
  successMsg: string;
}) {
  if (status === "success") {
    return (
      <p role="status" className="text-sm text-bone/80">
        {successMsg}
      </p>
    );
  }
  if (status === "rate_limited") {
    return (
      <p role="alert" className="text-sm text-terracotta">
        You've submitted too many times. Please wait an hour or email us at{" "}
        <a href={`mailto:${email}`} className="underline">
          {email}
        </a>
        .
      </p>
    );
  }
  if (status === "error") {
    return (
      <p role="alert" className="text-sm text-terracotta">
        Something went wrong. Please email us at{" "}
        <a href={`mailto:${email}`} className="underline">
          {email}
        </a>
        .
      </p>
    );
  }
  return null;
}
