import { DESKS, RELATED } from "../data/desks";
import { scrollToHash } from "../scroll/useScroller";
import { useFolio } from "../store/folio";

function XFollow() {
  return (
    <a
      className="x-follow"
      href="https://x.com/suddenlyjon"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Follow @suddenlyjon on X"
      title="Follow @suddenlyjon on X"
    >
      <span className="x-follow-mark" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="11" height="11">
          <path
            fill="currentColor"
            d="M12.6.75h2.45l-5.35 6.11L16 15.25h-4.94L7.4 10.1l-4.5 5.15H.44l5.72-6.54L0 .75h5.06l3.4 4.49L12.6.75Zm-.86 13.03h1.36L4.34 2.13H2.88l8.86 11.65Z"
          />
        </svg>
      </span>
      <span className="x-follow-handle">@suddenlyjon</span>
    </a>
  );
}

export function Hud() {
  const deskId = useFolio((s) => s.desk);
  const booted = useFolio((s) => s.booted);
  const reduced = useFolio((s) => s.reduced);
  const desk = DESKS.find((d) => d.id === deskId) ?? DESKS[0];

  return (
    <div className="hud">
      <header className="brand-island">
        <XFollow />
        <a className="wordmark" href="#enter" onClick={() => scrollToHash("#enter")}>
          Folio
        </a>
        <nav className="island-nav" aria-label="Hall">
          {DESKS.map((d) => (
            <a
              key={d.id}
              href={d.hash}
              data-active={d.id === deskId ? "true" : "false"}
              onClick={(e) => {
                e.preventDefault();
                history.replaceState(null, "", d.hash);
                scrollToHash(d.hash);
              }}
            >
              {d.id === "threshold" ? "Enter" : d.title}
            </a>
          ))}
        </nav>
      </header>

      <div className={`boot ${booted ? "is-gone" : ""}`} aria-hidden={booted}>
        <p>Lighting the hall</p>
      </div>

      <article className="caption" data-desk={desk.id} key={desk.id}>
        <p className="kicker">
          {desk.kicker}
          <span>{desk.status}</span>
        </p>
        <h2>{desk.title}</h2>
        <p className="lede">{desk.lede}</p>
        {desk.href ? (
          <a className="desk-link" href={desk.href} target="_blank" rel="noopener noreferrer">
            {desk.hrefLabel}
          </a>
        ) : null}
      </article>

      {deskId === "instar" ? (
        <aside className="related">
          <a href="https://instar.jonbailey.xyz/workbench/" target="_blank" rel="noopener noreferrer">
            <strong>Workbench</strong>
            <span>Always open. No answers here.</span>
          </a>
        </aside>
      ) : null}

      {deskId === "catalog" ? (
        <aside className="related">
          {RELATED.map((r) => (
            <a key={r.title} href={r.href} target="_blank" rel="noopener noreferrer">
              <strong>{r.title}</strong>
              <span>{r.note}</span>
            </a>
          ))}
        </aside>
      ) : null}

      <footer className="hud-foot">
        <p className="hint">{reduced ? "Still rooms" : "Scroll"}</p>
        <ol className="ticks" aria-hidden="true">
          {DESKS.map((d) => (
            <li key={d.id} data-on={d.id === deskId ? "true" : "false"} />
          ))}
        </ol>
        <a className="plain-link" href="/a11y">
          Accessibility
        </a>
      </footer>
    </div>
  );
}
