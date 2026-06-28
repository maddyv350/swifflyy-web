import { site } from '../config/site';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex flex-wrap items-center justify-between gap-6 border-t-[1.5px] border-ink2 bg-ink px-6 py-12 md:px-10">
      <div className="font-hand text-[30px] font-bold tracking-[-0.5px] text-accent">{site.name}</div>

      <nav aria-label="Footer">
        <ul className="flex flex-wrap gap-7">
          {site.footerLinks.map((l) => (
            <li key={l}>
              <a
                href="#"
                className="font-body text-sm text-paper/40 no-underline transition-colors hover:text-paper/80"
              >
                {l}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="font-body text-[13px] text-paper/25">
        © {year} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
