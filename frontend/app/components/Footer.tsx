import Link from "next/link";
import styles from "./footer.module.scss";
import Logo from "./Logo";

export default async function Footer({ hideLogo = false }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <h6>Solander 38</h6>
        <p>
          is a self-sufficient, solar-electric, coastal&nbsp;cruising power
          catamaran.
        </p>
        <h6>Rising Tide Research Foundation</h6>
        <p>
          is a not-for-profit society established to conduct open-source
          research advancing electric boat design and to raise public awareness
          and understanding of clean-marine technologies.
        </p>
        <h6>This website</h6>
        <p>
          is an effort to document and share designs, processes, and research
          from <em>Catalyst</em>, the first Solander 38 built by RTRF.
        </p>
        <h6>Connect with us</h6>
        <p>info@risingtideresearch.org</p>
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

        <Link
          className={styles.logo}
          target="_blank"
          href="https://risingtideresearch.org"
        >
          <Logo />
        </Link>
        <p className={styles.license}>
          Except where otherwise noted, content on this site is licensed under a{" "}
          <Link
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Creative Commons Attribution 4.0 International License
          </Link>
          , [CC BY 4.0].
        </p>
      </div>
    </footer>
  );
}
