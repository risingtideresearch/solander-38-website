import styles from "./footer.module.scss";
import Logo from "./Logo";
import { URLS } from "./Navigation/Navigation";

export default async function Footer({ children = <></>, hideLogo = false }) {
  return (
    <footer className={styles.footer}>
      <div className={`section--two-col ${styles.inner}`}>
        <div>
          <a href={URLS.ANATOMY}>
            <img
              src="/images/solander-38.png"
              width={1454 / 2}
              height={951 / 2}
              alt={"3D rendering of Solander 38"}
            />
          </a>
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
          {!hideLogo ? <Logo /> : <></>}
        </div>
        <div>{children}</div>
      </div>
    </footer>
  );
}
