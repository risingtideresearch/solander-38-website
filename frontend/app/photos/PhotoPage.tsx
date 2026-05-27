import { Image } from "../components/Image";
import PhotoMetadata from "./PhotoMetadata";
import SubNav from "../components/Navigation/SubNav";
import { URLS } from "../components/Navigation/Navigation";
import { SwipeNavigation } from "../components/SwipeNavigation";

export function PhotoPage({ asset, next, prev }) {
  if (!asset) {
    return <></>;
  }

  const prevUrl = prev ? `${URLS.PHOTOS}/image/${prev.uuid}` : null;
  const nextUrl = next ? `${URLS.PHOTOS}/image/${next.uuid}` : null;

  return (
    <>
      <SwipeNavigation prevUrl={prevUrl} nextUrl={nextUrl} />
      <SubNav prev={prev} next={next} urlPrefix={`${URLS.PHOTOS}/image`} />
      <div className="section--two-col detail-page">
        <div>
          <div style={{ position: "sticky", top: "3rem" }}>
            <PhotoMetadata asset={asset} stories={asset.usedInArticles} />
          </div>
        </div>
        <div>
          <div className="detail-page__image-container">
            <Image
              loading="eager"
              src={{ asset: asset }}
              alt={
                asset.altText ||
                asset.description ||
                asset.title ||
                asset.originalFilename
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
