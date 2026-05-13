import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="bg-warm-ivory py-16 md:py-20">
      <Container>
        <div className="grid grid-cols-12 gap-8 border-t border-charcoal/15 pt-14">
          <div className="col-span-12 md:col-span-5">
            <div className="font-serif text-3xl italic">Atelier Shreenu</div>
            <div className="text-micro mt-2 text-charcoal/55">Est. 2012</div>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-charcoal/60">
              Architecture and interior design studio based in Gurugram — working across
              India. All enquiries are handled personally by Ranjeet &amp; Shreenu
              Mukherjee.
            </p>
          </div>

          <div className="col-span-6 md:col-span-3">
            <div className="text-micro text-charcoal/50">Navigate</div>
            <ul className="mt-5 space-y-3 text-sm">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-burgundy">
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
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-burgundy"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-burgundy"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={site.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-burgundy"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href={site.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-burgundy"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-charcoal/10 pt-8 text-micro text-charcoal/55 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Atelier Shreenu</div>
          <div className="flex gap-6">
            <span>Gurugram, Haryana — India</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}