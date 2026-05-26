import { createClient } from "next-sanity";
import { token } from "./token";
import { projectId, dataset, apiVersion, studioUrl } from "./api";

const isPreviewSite = process.env.NEXT_PUBLIC_PREVIEW_SITE === "true";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !isPreviewSite,
  perspective: "published",
  token,
  stega: {
    studioUrl,
    // Set logger to 'console' for more verbose logging
    // logger: console,
    filter: (props) => {
      if (props.sourcePath.at(-1) === "title") {
        return true;
      }

      return props.filterDefault(props);
    },
  },
});
