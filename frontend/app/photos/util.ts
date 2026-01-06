import { SanityAsset } from "@sanity/image-url/lib/types/types";
import { URLS } from "../components/Navigation/Navigation";

export const getPhotoURL = (asset: SanityAsset) => {
  const slug = asset?._id?.split("-")[1] || "";
  return `${URLS.PHOTOS}/image/${slug}`;
};
