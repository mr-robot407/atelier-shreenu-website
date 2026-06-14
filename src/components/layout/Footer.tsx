"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";
import { X } from "lucide-react";

const linkClass = "cursor-pointer transition-colors hover:text-burgundy focus:outline-none focus-visible:ring-1 focus-visible:ring-burgundy rounded-sm";

const PRIVACY_AND_TERMS_CONTENT = `
PRIVACY POLICY

Effective date: [date of publication]

Introduction

Atelier Shreenu — a trading name of Shreenu and Ranjeet Design LLP ("we," "our," "us") — is committed to protecting your personal information and your privacy. This policy describes how we collect, use, share, and safeguard your information when you interact with us through our website ateliershreenu.com (and any legacy redirect from thevrindavanproject.com), including form submissions, consultation bookings, and contact enquiries.

Information we collect

• Name
• Email address
• Phone number
• Company or organisation (if applicable)
• Project details or enquiry information
• Location and city

We may also collect technical website usage data — IP address, browser type, device type — for analytics and security purposes.

How we use your information

• Responding to your enquiries and providing requested information
• Scheduling consultations and follow-ups
• Delivering services requested by you
• Processing consultation payments through our payment gateway partner

Sharing of information

We do not sell, trade, or rent your personal information. We share information only with the service providers necessary to deliver our services to you — our payment gateway partner, our calendar provider, and our email delivery service — under appropriate data-protection commitments.

Data security

We employ industry-standard security measures to protect your data from unauthorised access, alteration, or disclosure. Access to your data is restricted to relevant team members for necessary purposes only. Atelier Shreenu (Shreenu and Ranjeet Design LLP) complies with applicable Indian data-protection laws.

Your rights

You may request to:

• Access the personal data we hold about you
• Correct inaccurate information
• Withdraw consent or request deletion of your information (subject to legal retention requirements)
• Opt out of marketing communications at any time

To exercise your rights, email us at info@ateliershreenu.com

Cookies and analytics

Our website uses cookies and analytics services for functionality and performance tracking. By continuing to use our site, you consent to our use of cookies. You can disable cookies via your browser settings at any time.

Third-party links

Our site may link to third-party websites which are not under the control of Atelier Shreenu / Shreenu and Ranjeet Design LLP. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them. We are not responsible for their privacy practices; please refer to those sites' privacy policies.

Changes to this policy

We may update this privacy policy from time to time. All changes will be published on this page with an updated effective date.

Contact us

For any privacy-related questions or requests, contact:

Atelier Shreenu — by The Vrindavan Project · Shreenu and Ranjeet Design LLP · Palam Vihar, Gurugram — 122017, Haryana, India. Email: info@ateliershreenu.com · Phone: +91 95602 06195


─────────────────────────────────────────────


TERMS OF USE

Terms

By accessing this website, you agree to comply with and be bound by the terms and conditions of use outlined below. If you disagree with any part of these terms, please do not use our website. The content of the pages of this website is for your general information and use only and is subject to change without notice.

Copyright and intellectual property

All content, including text, images, illustrations, project data, graphics, and logos, is the exclusive property of Atelier Shreenu (Shreenu and Ranjeet Design LLP) unless otherwise stated. No part of this website may be reproduced, distributed, transmitted, or used in any form or by any means without our prior written permission. Unauthorised use may give rise to a claim for damages and/or be a criminal offence.

Disclaimer of liability and information accuracy

The information, images, and project descriptions on this website are provided for general information only. While we strive to keep content accurate and up to date, Atelier Shreenu (Shreenu and Ranjeet Design LLP) makes no warranties or representations of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is strictly at your own risk. Completed projects may vary from images or descriptions shown.

No advice

Information or materials provided do not constitute architectural, legal, or financial advice and should not be treated as such. For guidance regarding your specific situation, professional advice should always be sought.

Confidentiality

All project enquiries, communications, and personal details shared with Atelier Shreenu (Shreenu and Ranjeet Design LLP) will be treated with strict confidentiality and will not be disclosed to third parties without explicit consent, unless required by law.

Jurisdiction

This website is controlled and operated by Atelier Shreenu (Shreenu and Ranjeet Design LLP) from India. These terms and any dispute or claim arising from your use of this website shall be governed by the laws of India. All disputes shall be subject to the exclusive jurisdiction of courts in Gurugram, Haryana, India.

Accessibility statement

Atelier Shreenu aims to make its website accessible to all users. If you experience difficulty accessing any part of this website, please contact us at info@ateliershreenu.com so we can assist you. We target WCAG 2.1 AA compliance at launch.

Testimonial disclosure

Some testimonials, case studies, or press features may be based on actual client experiences, partnerships, or sponsorships. Where relevant, such relationships will be disclosed. Images and descriptions are representative and may include renderings or conceptual visuals for inspiration.

Professional standards and licensing

Architect Ranjeet Mukherjee, Founding Partner at Atelier Shreenu (Shreenu and Ranjeet Design LLP), is registered with the Council of Architecture (CoA) under CA/2009/44099 in India and adheres to all applicable professional standards. He is also a Fellow Member of the Indian Institute of Architects (F26195) and adheres to their specified professional codes of conduct.

Limitation of liability

In no event shall Atelier Shreenu (Shreenu and Ranjeet Design LLP) or its agents be liable for any indirect, incidental, special, or consequential damages arising from use of this site or reliance on information herein.

Indemnity

By using this website, you agree to indemnify and hold harmless Atelier Shreenu (Shreenu and Ranjeet Design LLP) from any claims, damages, costs, or liabilities arising out of your use of the site. If you have any questions regarding these legal statements, please contact us at info@ateliershreenu.com
`;

function PrivacyModal({ onClose }: { onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus trap and ESC key
  useEffect(() => {
    const prev = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const focusable = overlayRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Privacy Policy and Terms of Use"
      className="fixed inset-0 z-50 flex items-stretch md:items-center justify-center bg-charcoal/70 backdrop-blur-sm p-0 md:p-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full md:max-w-2xl bg-warm-ivory text-charcoal overflow-y-auto md:max-h-[80vh] flex flex-col">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-charcoal/10 bg-warm-ivory px-8 py-5">
          <span className="font-sans text-[13px] font-medium uppercase tracking-widest text-burgundy">
            Privacy &amp; Terms
          </span>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close privacy and terms"
            className="flex h-11 w-11 cursor-pointer items-center justify-center border border-charcoal/15 transition-colors hover:border-burgundy hover:text-burgundy focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-10">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-charcoal/75">
            {PRIVACY_AND_TERMS_CONTENT.trim()}
          </pre>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
      <footer className="bg-warm-ivory py-16 md:py-20">
        <Container>
          <div className="grid grid-cols-12 gap-8 border-t border-charcoal/15 pt-14">
            <div className="col-span-12 md:col-span-5">
              <div className="font-serif text-3xl italic">Atelier Shreenu</div>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-charcoal/60">
                Timeless architecture and thoughtful interiors
              </p>
            </div>

            <div className="col-span-6 md:col-span-3">
              <div className="text-micro text-charcoal/50">Navigate</div>
              <ul className="mt-5 space-y-3 text-sm">
                {site.nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-6 md:col-span-4">
              <div className="text-micro text-charcoal/50">Follow</div>
              <ul className="mt-5 space-y-3 text-sm">
                <li>
                  <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    Instagram
                  </a>
                </li>
                <li>
                  <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href={site.social.youtube} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    YouTube
                  </a>
                </li>
                <li>
                  <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer legal block */}
          <div className="mt-16 border-t border-charcoal/10 pt-8 text-micro text-charcoal/55">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div>© {new Date().getFullYear()} Atelier Shreenu · Shreenu and Ranjeet Design LLP</div>
                <div className="mt-1 text-charcoal/40">Atelier Shreenu is the trading name of Shreenu and Ranjeet Design LLP</div>
              </div>
              <button
                onClick={() => setShowPrivacy(true)}
                className="cursor-pointer text-left underline underline-offset-2 transition-colors hover:text-burgundy focus:outline-none focus-visible:ring-1 focus-visible:ring-burgundy rounded-sm"
              >
                Privacy and Terms
              </button>
            </div>
          </div>
        </Container>
      </footer>

      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
    </>
  );
}
