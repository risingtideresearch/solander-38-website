import { LiaArrowLeftSolid, LiaArrowRightSolid } from "react-icons/lia";
import styles from "./subnav.module.scss";

export default function SubNav({ next, prev, urlPrefix, idKey = "uuid" }) {
  return (
    <div className={styles["sub-nav"]}>
      <div className={styles["sub-nav__container"]}>
        {prev && (
          <div>
            <a href={`${urlPrefix}/${prev[idKey]}`}>
              <LiaArrowLeftSolid size={18} />
              <span className={styles.label}>
                <span>{prev.title ?? "prev"}</span>
                <span>{prev.title ?? "prev"}</span>
              </span>
            </a>
          </div>
        )}
        {next && (
          <div>
            <a href={`${urlPrefix}/${next[idKey]}`}>
              <span className={styles.label}>
                <span>{next.title ?? "next"}</span>
                <span>{next.title ?? "next"}</span>
              </span>
              <LiaArrowRightSolid size={18} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
