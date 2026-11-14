import { books } from "../lib/books.js";
import { getConfig } from "../lib/config.js";
import { getRegion } from "../lib/region.js";
import LoginPreview from "./login-preview.js";
import ThemeChooser from "./theme-chooser.js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function Logo() {
  return (
    <a className="brand" href="/" aria-label="Books home">
      <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
      <span>books<span className="brand-period">.</span></span>
    </a>
  );
}

export default async function Home() {
  const { enableAuth, reloadSeconds } = getConfig();
  const region = await getRegion();

  return (
    <>
      {reloadSeconds > 0 && <meta httpEquiv="refresh" content={String(reloadSeconds)} />}
      <header className="site-header">
        <div className="header-inner">
          <Logo />
          <ThemeChooser />
        </div>
      </header>

      <main>
        <section className="collection" id="collection" aria-labelledby="collection-title">
          <div className="collection-bar">
            <h1 id="collection-title">Books <span className="count">{books.length}</span></h1>
          </div>
          <div className="book-grid">
            {books.map((book, index) => (
              <article className="book-card" key={book.isbn}>
                <div className="cover-wrap">
                  <span className="book-number">{String(index + 1).padStart(2, "0")}</span>
                  <img src={`/covers/${book.isbn}`} alt={`Cover of ${book.title}`} loading={index < 5 ? "eager" : "lazy"} />
                  <span className="cover-corner" aria-hidden="true">↗</span>
                </div>
                <div className="book-info">
                  <p className="book-category">{book.category}</p>
                  <h3>{book.title}</h3>
                  <p className="book-author">{book.author}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div><span className="status-dot" /> <span className="footer-label">REGION</span> <strong>{region || "Not available"}</strong></div>
        </div>
      </footer>
      {enableAuth && <LoginPreview />}
    </>
  );
}
