import { LiaArrowLeftSolid, LiaArrowRightSolid } from "react-icons/lia";

export default function SubNav({ next, prev, urlPrefix }) {
  return (
    <div style={{ borderBottom: "1px solid", marginTop: "2rem" }}>
      <div
        style={{
          display: "flex",
          gap: "2.5rem",
          borderLeft: "1px solid",
          marginLeft: "auto",
          padding: "0.5rem 2rem 0.5rem 0.5rem",
          width: "max-content",
          justifyContent: "space-between",
        }}
      >
        {prev && (
          <div>
            <a
              href={`${urlPrefix}/${prev.uuid}`}
              style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
            >
              <LiaArrowLeftSolid size={18} />
              <h6>prev</h6>
            </a>
          </div>
        )}
        {next && (
          <div>
            <a
              href={`${urlPrefix}/${next.uuid}`}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <h6>next</h6>
              <LiaArrowRightSolid size={18} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
