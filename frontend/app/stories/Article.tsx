import { PortableText } from "next-sanity";
import { Canvas3D } from "../anatomy/three-d/Canvas3D";
import styles from "./article.module.scss";
import AnatomyPane from "./AnatomyPane/AnatomyPane";
import ImageSet from "../components/ImageSet";
import { Image } from "../components/Image";
import { formatDate } from "../utils";
import { contextualLayers } from "../anatomy/three-d/util";
import MaterialsTable from "../components/MaterialsTable";
import { getPhotoURL } from "../photos/util";
import { URLS } from "../components/Navigation/Navigation";
import RangeChart from "../components/RangeChart";

const components = {
  types: {
    imageSet: ({ value }) => (
      <figure>
        <ImageSet assets={value.imageSet} title={value.title} />
        {value.caption && <figcaption>{value.caption}</figcaption>}
      </figure>
    ),
    inlineImage: ({ value }) => (
      <figure className={styles.inline_image}>
        <a href={getPhotoURL(value.image.asset)}>
          <Image
            src={value.image}
            alt={value.altText || "todo: add alt text"}
          />
          {value.image?.asset?.title && (
            <figcaption>{value.image.asset.title}</figcaption>
          )}
        </a>
      </figure>
    ),
    inlineModel: ({ value }) => (
      <>
        <h2 style={{ maxWidth: "60rem" }}>{value.title}</h2>
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
              filteredLayers={value.models || []}
              interaction={"limited"}
            />
          </div>
        </AnatomyPane>
      </>
    ),
    chart: ({ value }) =>
      value.type == "range chart" ? <RangeChart title={value.title} /> : <></>,
    person: ({ value }) => {
      return (
        <a
          className={styles.person}
          href={`${URLS.PEOPLE}/#${value.slug?.current}`}
        >
          {value?.name}
          {/* {value.role || value.link ? (
            <span className={styles.person__label}>
              {value.link ? (
                <span>
                  {value?.link.label}
                  <br /> <br />
                </span>
              ) : (
                <></>
              )}
              <span>{value?.role}</span>
            </span>
          ) : (
            <></>
          )} */}
        </a>
      );
    },
  },
  marks: {
    internalLink: ({ value, children }) => {
      if (value.reference?.slug?.current) {
        return (
          <a href={`/stories/${value.reference.slug.current}`}>{children}</a>
        );
      }
      return children;
    },
    link: ({ value, children }) => {
      return (
        <a href={value.href} target="_blank">
          {children}
        </a>
      );
    },
  },
};

export default async function Article({ data, materials = [] }) {
  const articleModels = [
    ...data.relatedModels.filter((layer) => !contextualLayers.includes(layer)),
    ...contextualLayers,
  ];

  return (
    <main
      className={`article ${styles.page} ${data.isLive ? "" : styles["article--in-progress"]}`}
    >
      <div className={`bg--grid ${styles.header}`}>
        <div>
          <div style={{ marginTop: "0.625rem" }}>
            <h6>{data.system?.name}</h6>
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
              style={{
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
                    data.slug?.current != "hull-and-deck" &&
                    data.system?.slug?.current != "overview",
                }}
                interaction={"limited"}
              />
            </div>
          </AnatomyPane>
        </div>
      </div>
      <div className={`section--two-col ${styles.body}`}>
        <div>
          <div className={`${styles.metadata}`}>
            {!data.isLive ? (
              <div className={styles["in-progress-banner"]}>
                <h6>Story in progress</h6>
              </div>
            ) : (
              <></>
            )}
            <div className={styles.metadata__table}>
              <h6>Title</h6>
              <h6>{data.title}</h6>
              {data.authors && (
                <>
                  <h6>Author</h6>
                  <h6>
                    {data.authors.map((author) => (
                      <a
                        key={author._id}
                        href={`${URLS.PEOPLE}/#${author.slug?.current}`}
                      >
                        {author.name}
                      </a>
                    ))}
                  </h6>
                </>
              )}
              <h6>Updated</h6>
              <h6>{formatDate(data._updatedAt)}</h6>
            </div>
          </div>
        </div>
        <div>
          <p>
            <em>{data.subtitle}</em>
          </p>
          {data.isLive ? (
            <PortableText value={data.content} components={components} />
          ) : (
            <></>
          )}

          <MaterialsTable materials={materials} />
        </div>
      </div>
    </main>
  );
}
