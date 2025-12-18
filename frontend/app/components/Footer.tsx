import styles from "./footer.module.scss";
import Logo from "./Logo";

export default async function Footer({ children = <></> }) {
  return (
    <footer className={styles.footer}>
      <div>
        <div>
          <h6>
            Solander 38
            <br />
            <span style={{ textTransform: "none" }}>
              is a self-sufficient, solar-electric, coastal&nbsp;cruising power
              catamaran.
            </span>
          </h6>
          <h6>
            Rising Tide Research Foundation
            <br />
            <span style={{ textTransform: "none" }}>
              is a not-for-profit society established to conduct open-source
              research advancing electric boat design and to raise public
              awareness and understanding of clean-marine technologies.
            </span>
          </h6>
          <h6>
            This website
            <br />
            <span style={{ textTransform: "none" }}>
              is an effort to document and share designs, processes, and
              research from building <em>Catalyst</em>, the first Solander 38.
            </span>
          </h6>
          <h6>
            Get in touch
            <br />
            <span className={styles.email}> info@risingtideresearch.org</span>
          </h6>
          <br />
          <Logo />
        </div>
        <div>{children}</div>
      </div>
    </footer>
  );
}
