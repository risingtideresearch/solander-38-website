import path from "path";
import { promises as fs } from "fs";
import Footer from "./components/Footer";
import { URLS } from "./components/Navigation/Navigation";
import styles from "./home.module.scss";
import articleStyles from "./stories/articles.module.scss";
import Logo from "./components/Logo";
import {
  fetchArticles,
  fetchHomepage,
  fetchPeople,
  fetchPhotos,
} from "@/sanity/lib/utils";
import Search from "./components/Search/Search";
import { Image } from "./components/Image";

export default async function Page() {
  const modelsManifestPath = path.join(
    process.cwd(),
    "public/models/export_manifest.json",
  );
  const modelsManifestData = await fs.readFile(modelsManifestPath, "utf8");
  const models_manifest = JSON.parse(modelsManifestData);

  const drawingsPath = path.join(
    process.cwd(),
    "public/drawings/output_images/conversion_manifest.json",
  );
  const drawingsData = await fs.readFile(drawingsPath, "utf8");
  const drawings = JSON.parse(drawingsData);

  const articles = await fetchArticles();
  const photos = await fetchPhotos();
  const people = await fetchPeople();
  const homepage = await fetchHomepage();

  return (
    <div className={styles.home}>
      <Search />

      <div>
        <div className="section--two-col">
          <div className={styles.leftColumn}>
            <div className={styles.title}>
              <h1>Solander 38</h1>
              <Logo />
            </div>
          </div>
          <div>
            <Image src={homepage.data.image} />
          </div>
        </div>
        <div className={styles.bordered}>
          <div className="section--two-col">
            <div className={styles.leftColumn}></div>
            <div className={`${styles.toc} ${styles.tocPadding}`}>
              <section>
                <a
                  href={URLS.STORIES}
                  className={articleStyles["article-title"]}
                >
                  <p>Stories</p>
                  <div></div>
                  <h6>{articles.data.length} stories</h6>
                </a>
                <p>Details from the build, organized by anatomical system.</p>
              </section>
              <section>
                <a
                  href={URLS.ANATOMY}
                  className={articleStyles["article-title"]}
                >
                  <p>Anatomy</p>
                  <div></div>
                  <h6>{models_manifest.exported_layers.length} parts</h6>
                </a>
                <p>Model of parts and systems.</p>
              </section>
              <section>
                <a
                  href={URLS.DRAWINGS}
                  className={articleStyles["article-title"]}
                >
                  <p>Drawings</p>
                  <div></div>
                  <h6>{drawings.files.length} drawings</h6>
                </a>
                <p>Library of fabrication plans.</p>
              </section>
              <section>
                <a
                  href={URLS.PHOTOS}
                  className={articleStyles["article-title"]}
                >
                  <p>Photos</p>
                  <div></div>
                  <h6>{photos.data.length} photos</h6>
                </a>
                <p>Library of photos.</p>
              </section>
              <section>
                <a
                  href={URLS.PEOPLE}
                  className={articleStyles["article-title"]}
                >
                  <p>People</p>
                  <div></div>
                  <h6>{people.data.length} people</h6>
                </a>
                <p>Builders, engineers, and researchers involved.</p>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Footer></Footer>
    </div>
  );
}
