import {RiBook2Line, RiHome2Line, RiStackLine} from 'react-icons/ri'
import type {ListItemBuilder, StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) => {
  const notBoat = ['person', 'location', 'timeline']
  const textDocs = ['article', 'annotation']
  const singletons = ['sections', 'materials', 'homepage']

  return S.list()
    .title('Content')
    .items([
      ...S.documentTypeListItems().filter((d: ListItemBuilder) =>
        textDocs.includes(d.getId() as string),
      ),
      // Singleton section
      S.listItem()
        .title('Homepage')
        .id('homepage')
        .icon(RiHome2Line)
        .child(S.document().schemaType('homepage').documentId('homepage')),
      S.listItem()
        .title('Sections')
        .id('sections')
        .icon(RiBook2Line)
        .child(S.document().schemaType('sections').documentId('sections')),
      S.listItem()
        .title('Materials')
        .id('materials')
        .icon(RiStackLine)
        .child(S.document().schemaType('materials').documentId('materials')),
      // S.divider(),
      ...S.documentTypeListItems().filter(
        (d: ListItemBuilder) =>
          !notBoat.includes(d.getId() as string) &&
          !textDocs.includes(d.getId() as string) &&
          !singletons.includes(d.getId() as string) && // Filter out singletons
          d.getId() != 'media.tag',
      ),
      S.divider(),
      ...S.documentTypeListItems().filter((d: ListItemBuilder) =>
        notBoat.includes(d.getId() as string),
      ),
    ])
}
