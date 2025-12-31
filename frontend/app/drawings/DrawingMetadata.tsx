import styles from "./../stories/article.module.scss";
import { formatDate } from "../utils";
import { LiaDownloadSolid } from "react-icons/lia";
import { getSlugFromDrawingGroup } from "./util";
import { Drawing } from "./types";
import RelatedStories from "./RelatedStories";
import { Article } from "@/sanity/sanity.types";

export default function DrawingMetadata({ drawing, stories }: {drawing: Drawing, stories?: Array<Article>}) {
  return (
    <div className={`${styles.metadata}`}>
      <h6>Name</h6>
      <p className="font-sans" style={{ fontSize: '0.75rem', lineHeight: 1.2}}>{drawing.clean_filename}</p>
      <h6>ID</h6>
      <h6>{drawing.id}</h6>
      <h6>Date</h6>
      <h6>
        {drawing.date_info ? formatDate(drawing.date_info.date) : "<no date>"}
      </h6>
      <h6>System</h6>
      <h6><a href={`/drawings/${getSlugFromDrawingGroup(drawing.group).toLowerCase()}`}>{drawing.group}</a></h6>
      <h6>Download</h6>
      <h6>
        <a
          style={{ display: "grid", gridTemplateColumns: 'auto auto', gap: "0.125rem" }}
          download
          className="font-sans"
          href={
            "/drawings/" +
            encodeURIComponent(
              drawing.source_pdf_full_path.replace(
                "../frontend/public/drawings",
                "",
              ),
            )
          }
        >
          PDF
          <LiaDownloadSolid size={16} />
        </a>
      </h6>
      <RelatedStories stories={stories} />
    </div>
  );
}
