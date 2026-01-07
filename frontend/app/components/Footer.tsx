import styles from "./footer.module.scss";
import Logo from "./Logo";

export default async function Footer({ children = <></> }) {
  return (
    <footer className={styles.footer}>
      <div className={`section--two-col ${styles.inner}`}>
        <div>
          <h6>Solander 38</h6>
          <p>
            is a self-sufficient, solar-electric, coastal&nbsp;cruising power
            catamaran.
          </p>
          <h6>Rising Tide Research Foundation</h6>
          <p>
            is a not-for-profit society established to conduct open-source
            research advancing electric boat design and to raise public
            awareness and understanding of clean-marine technologies.
          </p>
          <h6>This website</h6>
          <p>
            is an effort to document and share designs, processes, and research
            from <em>Catalyst</em>, the first Solander 38.
          </p>
          <h6>Get in touch</h6>
          <p> info@risingtideresearch.org</p>
          <Logo />
        </div>
        <div>{children}</div>
      </div>
    </footer>
  );
}
