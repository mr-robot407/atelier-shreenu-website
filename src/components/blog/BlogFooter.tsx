export function BlogFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-charcoal/10 bg-parchment py-12 mt-24">
      <div className="container-editorial flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="font-serif text-[20px] text-charcoal">The Blog</p>
          <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-warm-grey mt-1">
            by Atelier Shreenu
          </p>
        </div>
        <p className="font-sans text-[11px] text-charcoal/40 tracking-wide">
          © {year} Shreenu and Ranjeet Design LLP. All rights reserved.
        </p>
        <a
          href="/"
          className="font-sans text-[11px] uppercase tracking-[0.12em] text-burgundy hover:underline underline-offset-2"
        >
          ateliershreenu.com →
        </a>
      </div>
    </footer>
  );
}
