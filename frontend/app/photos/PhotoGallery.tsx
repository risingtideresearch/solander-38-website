import Gallery from "../components/Gallery";
import { Image } from "../components/Image";
import { formatMonthYear } from "../utils";

interface Photo {
  _id: string;
  url: string;
  title?: string;
  originalFilename?: string;
  photoDate?: string;
  metadata?: { dimensions?: { width: number; height: number } };
  [key: string]: unknown;
}

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
  return (
    <Gallery emptyMessage="No photos">
      {photos.map((photo) => {
        const url = photo._id.split("-");
        const monthYear = formatMonthYear(photo.photoDate);
        const basename = photo.originalFilename?.replace(/\.[^/.]+$/, '') ?? '';
        const displayTitle = photo.title && photo.title !== basename ? photo.title : null;
        return (
          <div key={photo._id}>
            <a href={`/photos/image/${url[1]}`}>
              <Image src={{ asset: photo }} square={true} alt={photo.title} />
              <p
                style={{
                  fontSize: "0.75rem",
                  lineHeight: 1.2,
                }}
              >
                {displayTitle}
                {monthYear && <span>{displayTitle ? ', ' : ''}{monthYear}</span>}
              </p>
            </a>
          </div>
        );
      })}
    </Gallery>
  );
}
