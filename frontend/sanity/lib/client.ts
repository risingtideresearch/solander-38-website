import { createClient } from "next-sanity";
import { token } from "./token";
import { projectId, dataset, apiVersion, studioUrl } from "./api";

const isDev = process.env.NODE_ENV === "development";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !isDev,
  perspective: isDev ? "previewDrafts" : "published",
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
