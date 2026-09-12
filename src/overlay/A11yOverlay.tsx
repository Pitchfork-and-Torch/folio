import { DESKS, RELATED } from "../data/desks";

export function A11yOverlay() {
  return (
    <div id="a11y-overlay" className="a11y-overlay">
      <a className="a11y-skip" href="#desks">
        Skip to desks
      </a>
      <nav aria-label="Research desks">
        <ul>
          {DESKS.map((d) => (
            <li key={d.id}>
              <a href={d.hash}>{d.title}</a>
            </li>
          ))}
          <li>
            <a href="/a11y">Accessibility statement</a>
          </li>
        </ul>
      </nav>
      <div id="desks">
        {DESKS.map((d) => (
          <section key={d.id} id={d.hash.slice(1)} aria-labelledby={`${d.id}-h`}>
            <h2 id={`${d.id}-h`}>{d.title}</h2>
            <p>{d.lede}</p>
            <ul>
              {d.facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            {d.href ? (
              <p>
                <a href={d.href}>{d.hrefLabel}</a>
              </p>
            ) : null}
          </section>
        ))}
        <section aria-labelledby="related-h">
          <h2 id="related-h">Related</h2>
          <ul>
            {RELATED.map((r) => (
              <li key={r.title}>
                <a href={r.href}>{r.title}</a> - {r.note}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
