import Gallery from "../components/Gallery";
import { Image } from "../components/Image";

export default function PhotoGallery({ photos }) {
  return (
    <Gallery emptyMessage="No photos">
      {photos.map((photo) => {
        const url = photo._id.split("-");
        return (
          <div key={photo._id}>
            <a href={`/photos/image/${url[1]}`}>
              <Image src={{ asset: photo }} square={true} />
              <p
                style={{
                  fontSize: "0.75rem",
                  lineHeight: 1.2,
                }}
              >
                {photo.title}
              </p>
            </a>
          </div>
        );
      })}
    </Gallery>
  );
}
