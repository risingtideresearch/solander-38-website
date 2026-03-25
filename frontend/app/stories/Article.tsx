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
    inlineImage: ({ value }) => {
      const dims = value.image?.asset?.metadata?.dimensions;
      const crop = value.image?.crop;
      const aspectWidth = dims
        ? dims.width * (1 - (crop?.left ?? 0) - (crop?.right ?? 0))
        : undefined;
      const aspectHeight = dims
        ? dims.height * (1 - (crop?.top ?? 0) - (crop?.bottom ?? 0))
        : undefined;
      return (
        <figure className={styles.inline_image}>
          <a href={getPhotoURL(value.image.asset)}>
            <div
              style={
                aspectWidth && aspectHeight
                  ? { aspectRatio: `${aspectWidth} / ${aspectHeight}` }
                  : undefined
              }
            >
              <Image
                src={value.image}
                alt={value.altText || "todo: add alt text"}
              />
            </div>
            {value.image?.asset?.title && (
              <figcaption>{value.image.asset.title}</figcaption>
            )}
          </a>
        </figure>
      );
    },
    inlineModel: ({ value }) => (
      <>
        <h2>{value.title}</h2>
        <AnatomyPane
          defaultStyles={{
            height: "30rem",
            maxWidth: "45rem",
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
    internalLink: ({ value, children }: { value?: any; children?: any }) => {
      if (value.reference?.slug?.current) {
        return (
          <a href={`/stories/${value.reference.slug.current}`}>{children}</a>
        );
      }
      return children;
    },
    link: ({ value, children }: { value?: any; children?: any }) => {
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
          <div>
            <h6>{data.articleId}</h6>
            <h6>{data.system?.name}</h6>
            <h1>{data.title}</h1>

            {data.subtitle ? (
              <div className={styles.header_subtitle}>
                <p>{data.subtitle}</p>
              </div>
            ) : (
              <></>
            )}
            {data.authors ? (
              <div className={styles.header_author}>
                <h6>
                  {data.authors.map((author) => (
                    <a
                      key={author._id}
                      href={`${URLS.PEOPLE}/#${author.slug?.current}`}
                      style={{
                        display: "inline-flex",
                        gap: "0.5rem",
                        alignItems: "flex-start",
                      }}
                    >
                      {author.image ? (
                        <Image
                          square
                          style={{
                            width: "61px",
                            // borderRadius: "100%",
                            // overflow: "hidden",
                          }}
                          height={61}
                          width={61}
                          src={author.image}
                          alt={`Photo of ${author.name}`}
                        />
                      ) : (
                        <></>
                      )}
                      <span style={{ marginTop: "0.1875rem" }}>
                        {author.name}
                      </span>
                    </a>
                  ))}
                </h6>
              </div>
            ) : (
              <></>
            )}
          </div>
          <AnatomyPane
            title={`Anatomy / ${data.title}`}
            url={`/anatomy/${data.slug.current}`}
            defaultStyles={{
              // width: "100%",
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
                    data.slug?.current != "picking-a-hull" &&
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
                        style={{
                          display: "inline-flex",
                          gap: "0.5rem",
                          height: "1rem",
                          alignItems: "center",
                        }}
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
          {data.isLive ? (
            <PortableText value={data.content} components={components} />
          ) : (
            <></>
          )}

          {!data.hideMaterials ? (
            <MaterialsTable materials={materials} />
          ) : (
            <div style={{ margin: "2rem 0" }}></div>
          )}
        </div>
      </div>
    </main>
  );
}
