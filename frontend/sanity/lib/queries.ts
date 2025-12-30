/**
 *
 */
export const anatomyQuery = `
*[_type=="anatomy"]{
    _id,
    title,
    "slug": slug.current,
    parent->{
        _id,
        title,
        "slug": slug.current,
    },
    parts[]->{
        _id,
        title,
        _type,
        componentPart,
        "slug": slug.current,
        "connections":*[
          _type == "connection" &&
          (references(^._id))
        ]{
          _id,
          _type,
          description,
          componentFrom->{
            "slug": slug.current,
            title,
            "anatomy":*[
              _type == "anatomy" &&
              (references(^._id))
            ]{
              _id,
              title,  
              "slug": slug.current,
            },
            _id,
            _type
          },
          componentTo->{
            "slug": slug.current,
            title,
            "anatomy":*[
              _type == "anatomy" &&
              (references(^._id))
            ]{
              _id,
              title,  
              "slug": slug.current,
            },
            _id,
            _type
          }
        },
    },
    schematics[]->{
      ...,
      layers[]{
        ...,
        "image": photo.asset->{
          metadata,
          url
        },
        part->
      }
    }
}   
`;

/**
 *
 */
export const allPartsQuery = `
*[_type in ["component"]]{
  ...,
  "slug": slug.current,
  "image": image.asset->{
    metadata,
    url
  },
  "anatomy": *[
    _type == "anatomy" &&
    (references(^._id))
  ]{
    _id,
  },
  "connections": *[
    _type == "connection" &&
    (references(^._id))
  ]{
    _id,
    _type,
    description,
    componentFrom->{
      "slug": slug.current,
      title,
      _id,
      _type
    },
    componentTo->{
      "slug": slug.current,
      title,
      _id,
      _type
    }
  }
}
`;

/**
 *
 */
export const connectionsQuery = `
*[_type=="connection"] {
    title,
    description,
    componentFrom->{
        ...
    },
    componentTo->{
        ...
    },
}
`;

/**
 *
 */
export const schematicsQuery = `
*[_type=="schematic"]{
    _id,
    title,
    part->,
    layers[]{
        layerName,
        photo{
            asset->{...}
        }
    }
}   
`;

/**
 *
 */
export const annotationsQuery = `
*[_type=="annotation"]{
    _id,
    system,
    note,
    position,
    related[],
    relatedModels[]
}   
`;

/**
 *
 * 
    "articles": *[_type=="article" && references(^._id)]{
      _id,
      title,
      "slug": slug.current,
      isLive,
      "section": *[_type=="sections"][0].sections[references(^._id)][0] {
        name,
        "slug": slug.current
      }
    }
 */
export const peopleQuery = `
*[_type=="person"]{
    ...,
    "articlesAsAuthor": *[_type=="article" && isLive == true && ^._id in authors[]->_id]{
      _id,
      title,
      "slug": slug.current
    },
    "articlesMentioned": *[_type=="article" && isLive == true && references(^._id) && !defined(authors[_ref == ^.^._id][0])]{
      _id,
      title,
      "slug": slug.current
    }
}   
`;

/**
 *
 */
export const articlesQuery = (slug?: string) => {
  if (slug) {
    return `*[_type=="article" && slug.current == "${slug}"]{
      ...,
      isLive,
      "section": *[_type=="sections"][0].sections[references(^._id)][0],
      authors[]->{
        name
      },
      content[]{
        ...,
        children[]{
          ...,
          _type == 'personRef' => @->{
            ...
          }
        },
        markDefs[]{
          ...,
          _type == 'internalLink' => {
            ...,
            reference->{
              _type,
              _id,
              title,
              slug
            }
          }
        },
        _type == 'inlineImage' => {
          ...,
          image {
            ...,
            asset -> {
              ...,
              metadata {
                ...,
              }
            }
          }
        },
        _type == 'imageSet' => {
          ...,
          imageSet[]{
            ...,
            _type == 'image' => {
              ...,
              asset->{
                ...,
                metadata{
                  ...,
                  exif {
                    DateTimeOriginal,
                    DateTimeDigitized,
                  }
                }
              }
            },
            _type == 'drawingImage' => {
              ...,
              "drawingData": *[_type == 'media.tag' && name.current == ^.drawing][0]{
                ...,
                "asset": asset->
              }
            }
          }
        },
      }
    }`;
  }
  return `*[_type=="article"]{
    _id,
    title,
    relatedModels[],
    isLive,
    "slug": slug.current,
    "section": *[_type=="sections"][0].sections[references(^._id)][0] {
      name,
      "slug": slug.current
    },
    content[]{
      _type == 'imageSet' => {
        ...,
        imageSet[]{
          _type == 'drawingImage' => {
            ...,
          }
        }
      },
    }   
  }`;
};

/**
 *
 */
export const sectionsQuery = (slug?: string) => {
  if (slug) {
    return `
    *[_type=="sections"][0]{
      ...,
      sections[slug.current == "${slug}"][0]{
        ...,
        "slug": slug.current,
        articles[]->{
          _id,
          title,
          subtitle,
          isLive,
          "slug": slug.current,
          relatedModels[],
          "section": ^.slug.current
        }
      }
    }`;
  }
  return `
  *[_type=="sections"][0]{
    ...,
    sections[]{
      ...,
      "slug": slug.current,
      articles[]->{
        _id,
        title,
        subtitle,
        isLive,
        "slug": slug.current,
        relatedModels[],
        "section": ^.slug.current
      }
    }
  }`;
};

/**
 *
 */
export const materialsQuery = () => {
  return `
  *[_type=="materials"][0]{
    ...,
    
  }`;
};

/**
 *
 */
export const componentPartQuery = () => `
 *[_type=="component" && defined(relatedModel)]{
    componentPart,
    title,
    relatedModel,
  }`;
// export const componentPartQuery = (slug: string) => `
// {
//   "component": *[(_type in ["customPart", "component"]) && slug.current == "${slug}"][0] {
//     ...,
//     "slug": slug.current,
//     "image": image.asset-> {
//         metadata,
//         url,
//     },
//     materials[]-> {
//       ...
//     }
//   },
//   "connections": *[
//     _type =="connection" &&
//     references(*[(_type in ["customPart", "component"]) && slug.current == "${slug}"][0]._id)
//   ] {
//     _type,
//     description,
//     componentFrom->{
//         "slug": slug.current,
//         title,
//         _type,
//         _id,
//     },
//     componentTo->{
//         "slug": slug.current,
//         title,
//         _type,
//         _id,
//     }
//   },
//   "anatomy": *[
//     _type =="anatomy" &&
//     references(*[(_type in ["customPart", "component"]) && slug.current == "${slug}"][0]._id)
//   ] {
//     _type,
//     title,
//     "slug": slug.current,
//   },
//   "powerBudget": *[
//     _type =="powerBudget" &&
//     references(*[(_type in ["customPart", "component"]) && slug.current == "${slug}"][0]._id)
//   ] {
//     ...
//   },
//   "timelines": *[
//     _type =="timeline" &&
//     references(*[(_type in ["customPart", "component"]) && slug.current == "${slug}"][0]._id)
//   ] {
//     ...,
//     timeline[] {
//       ...,
//       media[] {
//         asset->{
//           url,
//           metadata
//         }
//       }
//     }
//   }
// }

// `;

export const searchQuery = () => `
*[
  (_type == "article" || (_type == "sanity.imageAsset" && count(*[_type == "article" && references(^._id)]) > 0)) 
  && (
    title match $query + "*" ||
    name match $query + "*" ||
    description match $query + "*" ||
    content[].children[].text match $query + "*" ||
    content[].children[]->name match $query + "*" ||
    authors[]->.name match $query + "*"
  )
][0...30]{
  _id,
  _type,
  _type == "article" => {
    title,
    slug,
    authors[]->{
      name
    }
  },
  _type == "sanity.imageAsset" => {
    title,
    originalFilename,
    _id,
  }
}`;

/**
 *
 */
export const allPhotosQuery = (section?: string) => {
  const articleFilter = section
    ? `*[_type == "article" && references(^._id) && _id in *[_type == "sections"][0].sections[slug.current == "${section}"].articles[]._ref]`
    : `*[_type == "article" && references(^._id)]`;

  return `*[_type == "sanity.imageAsset" && count(${articleFilter}) > 0] {
  _id,
  url,
  originalFilename,
  metadata,
  title,
  "usedInArticles": ${articleFilter} {
    _id,
    title,
    "slug": slug.current,
    "section": *[_type == "sections"][0].sections[references(^._id)][0] {
      name,
      "slug": slug.current
    }
  }
}`;
};

/**
 *
 */
export const assetWithNavigationQuery = (idPrefix?: string) => {
  const articleFilter = `*[_type == "article" && references(^._id)]`;

  return `{
  "allImages": *[_type == "sanity.imageAsset" && count(*[_type == "article" && references(^._id)]) > 0] | order(_createdAt asc) {
    _id,
    url,
    originalFilename,
    "metadata": {
      "dimensions": {
        ...metadata.dimensions,
      },
      "date": metadata.exif.DateTimeOriginal
    },
    description,
    altText,
    title,
    "usedInArticles": ${articleFilter} {
      _id,
      title,
      "slug": slug.current,
      "section": *[_type == "sections"][0].sections[references(^._id)][0] {
        name,
        "slug": slug.current
      }
    }
  },
  "currentId": "${idPrefix}"
}`;
};
