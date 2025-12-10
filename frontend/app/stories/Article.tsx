import { PortableText } from "next-sanity";
import { Canvas3D } from "../anatomy/three-d/Canvas3D";
import styles from "./article.module.scss";
import AnatomyPane from "./AnatomyPane/AnatomyPane";
import ImageSet from "../components/ImageSet";
import { Image } from "../components/Image";
import { formatDate } from "../utils";
import { contextualLayers } from "../anatomy/three-d/util";
import { useMemo } from "react";
import MaterialTable from "./MaterialTable";
import { dataAttr } from "@/sanity/lib/utils";

const components = {
  types: {
    imageSet: ({ value }) => (
      <figure>
        <ImageSet assets={value.imageSet} title={value.title} />
        {value.caption && <figcaption>{value.caption}</figcaption>}
      </figure>
    ),
    inlineImage: ({ value }) =>
      value.fullBleed ? (
        <figure
          className={styles.full_image}
          style={{
            aspectRatio: value.image.asset?.metadata?.dimensions?.aspectRatio,
          }}
        >
          <Image
            src={value.image}
            alt={value.altText || "todo: add alt text"}
          />
          {value.image?.asset?.title && (
            <figcaption>{value.image.asset.title}</figcaption>
          )}
        </figure>
      ) : (
        <figure className={styles.inline_image}>
          <Image
            src={value.image}
            alt={value.altText || "todo: add alt text"}
          />
          {value.image?.asset?.title && (
            <figcaption>{value.image.asset.title}</figcaption>
          )}
        </figure>
      ),
    models3D: ({ value }) => (
      <>
        <h2 style={{ maxWidth: "60rem" }}>Superstructure jig</h2>
        <AnatomyPane
          defaultSize={{
            height: "30rem",
            maxWidth: "60rem",
            margin: "1rem auto",
          }}
        >
          <div
            className="bg--grid"
            style={{
              border: "1px solid #eeeeee",
              borderLeft: "none",
              height: "100%",
              width: "100%",
            }}
          >
            <Canvas3D
              height={"100%"}
              filteredLayers={[
                "DECK JIG__TRANSV FRAMES.glb",
                "DECK JIG__DECK SKINS.glb",
              ]}
              interaction={'limited'}
            />
          </div>
        </AnatomyPane>
      </>
    ),
    person: ({ value }) => {
      return <span>{value?.name}</span>;
    },
  },
};

export default async function Article({ data, materials = [] }) {
  const updated = new Date(data._updatedAt);

  // hardcode jig 3d model
  const jigIndex = data.content.findIndex(
    (section) => section._key == "25f8a5680f6c",
  );
  if (jigIndex > -1) {
    data.content.splice(jigIndex + 1, 0, { _type: "models3D" });
  }

  const articleModels = [
    ...data.relatedModels.filter((layer) => !contextualLayers.includes(layer)),
    ...contextualLayers,
  ];

  return (
    <main className={`article ${styles.page}`}>
      <div className={`bg--grid ${styles.header}`}>
        <div>
          <div>
            <h6>{data.section}</h6>
            <h1>{data.title}</h1>
          </div>
          <AnatomyPane
            title={`Anatomy / ${data.title}`}
            url={`/anatomy/${data.slug.current}`}
            defaultSize={{
              width: "100%",
              aspectRatio: 1,
            }}
          >
            <div
              // className="bg--grid"
              style={{
                // border: "1px solid #eee",
                borderLeft: "none",
                height: "100%",
                width: "100%",
              }}
            >
              <Canvas3D
                height={"100%"}
                filteredLayers={articleModels || []}
                settings={{
                  transparent:
                    data.slug.current != "hull-and-deck" &&
                    data.section != "overview",
                }}
                interaction={'limited'}
              />
            </div>
          </AnatomyPane>
        </div>
      </div>
      <div className={`section--two-col ${styles.body}`}>
        <div>
          <div className={`${styles.metadata}`}>
            <h6>Title</h6>
            <h6>{data.title}</h6>
            {data.authors && (
              <>
                <h6>Author</h6>
                <h6 style={{ margin: "0 auto" }}>
                  {<>{data.authors.map((author) => author.name).join(",")}</>}
                </h6>
              </>
            )}
            <h6>Updated</h6>
            <h6>{formatDate(updated)}</h6>
          </div>
        </div>
        <div>
          <p>
            <em>{data.subtitle}</em>
          </p>
          <PortableText value={data.content} components={components} />
        </div>
      </div>
      <div className={`section--two-col ${styles.body}`}>
        <div>
          <MaterialTable materials={materials} />
        </div>
        <div></div>
      </div>
    </main>
  );
}
