import { PortableText } from "next-sanity";
import { Canvas3D } from "../anatomy/three-d/Canvas3D";
import styles from "./article.module.scss";
import AnatomyPane from "./AnatomyPane/AnatomyPane";
import { InlineModel } from "./InlineModel";
import ImageSet from "../components/ImageSet";
import { Image } from "../components/Image";
import { formatDate } from "../utils";
import { contextualLayers } from "../anatomy/three-d/util";
import MaterialsTable from "../components/MaterialsTable";
import { PhotoImage } from "../components/PhotoImage";
import { URLS } from "../components/Navigation/Navigation";
import RangeChart from "../components/RangeChart/RangeChart";

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
        <PhotoImage image={value.image} altText={value.altText} />
      </figure>
    ),
    inlineModel: ({ value }) => (
      <InlineModel title={value.title} models={value.models || []} />
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

  const isPreviewSite = process.env.NEXT_PUBLIC_PREVIEW_SITE === "true";

  return (
    <main
      className={`article ${styles.page} ${data.isLive ? "" : styles["article--in-progress"]}`}
    >
      <div className={`bg--grid ${styles.header}`}>
        <div>
          <div>
            <h6>
              {data.articleId} {data.system?.name}
            </h6>
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
                            width: "81px",
                            // borderRadius: "100%",
                            // overflow: "hidden",
                          }}
                          height={81}
                          width={81}
                          src={author.image}
                          alt={`Photo of ${author.name}`}
                        />
                      ) : (
                        <></>
                      )}
                      <span style={{ marginTop: "0.1875rem" }}>
                        {author.name}<br/>
                        <span style={{textTransform: 'none'}}>{author.role}</span> 
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
                <h6>
                  Story in progress
                  {isPreviewSite
                    ? " — written content below will not be visible on production site"
                    : ""}
                </h6>
              </div>
            ) : (
              <></>
            )}
            <div className={styles.metadata__table}>
              <h6>Title</h6>
              <h6>{data.title}</h6>
              <h6>System</h6>
              <h6>{data.system?.name}</h6>
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
              <h6>Published</h6>
              <h6>{formatDate(data.effectiveDate ?? data._updatedAt)}</h6>
            </div>
          </div>
        </div>
        <div>
          {data.isLive || isPreviewSite ? (
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
