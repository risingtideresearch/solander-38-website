import { LiaArrowLeftSolid, LiaArrowRightSolid } from "react-icons/lia";
import styles from "./subnav.module.scss";

export default function SubNav({ next, prev, urlPrefix }) {
  return (
    <div className={styles["sub-nav"]}>
      <div className={styles["sub-nav__container"]}>
        {prev && (
          <div>
            <a href={`${urlPrefix}/${prev.uuid}`}>
              <LiaArrowLeftSolid size={18} />
              <h6>prev</h6>
            </a>
          </div>
        )}
        {next && (
          <div>
            <a href={`${urlPrefix}/${next.uuid}`}>
              <h6>next</h6>
              <LiaArrowRightSolid size={18} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
