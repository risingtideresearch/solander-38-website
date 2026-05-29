import Link from "next/link";
import styles from "./footer.module.scss";
import Logo from "./Logo";
import NewsletterForm from "./NewsletterForm";
import LogoStacked from "./LogoStacked";

export default async function Footer({ hideLogo = false }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <Link
            className={styles.logo}
            target="_blank"
            href="https://risingtideresearch.org"
          >
            <LogoStacked />
          </Link>
        </div>
        <div>
          <h6>Rising Tide Research Foundation</h6>
          <p>
            is a not&#8209;for&#8209;profit society established to conduct open&#8209;source
            research advancing electric boat design and to raise public
            awareness and understanding of clean&#8209;marine technologies.
          </p>
        </div>
        <div>
          <h6>Solander 38</h6>
          <p>
            is a self-sufficient, solar-electric, coastal&nbsp;cruising power
            catamaran.
          </p>
        </div>
        <div>
          <h6>This website</h6>
          <p>
            is an effort to document and share designs, processes, and research
            from <em>Catalyst</em>, the first Solander 38 built by Rising&nbsp;Tide Research&nbsp;Foundation.
          </p>
        </div>

        <div>
          {process.env.BUILD_DATE && (
            <>
              <h6>Last updated</h6>
              <p>
                {new Date(process.env.BUILD_DATE).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </>
          )}
        </div>
        <div>
          <h6>Connect with us</h6>
          <p>info@risingtideresearch.org</p>
        </div>

        <div>
          <h6>License</h6>
          <p>
            <Link
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Creative Commons Attribution 4.0 International License
            </Link>
            , <br />
            [CC BY 4.0], except where otherwise noted.
          </p>
        </div>

        <div>
          <h6>Subscribe for updates</h6>
          <NewsletterForm />
        </div>
      </div>
    </footer>
  );
}
