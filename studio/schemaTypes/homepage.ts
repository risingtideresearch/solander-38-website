import {defineField, defineType} from 'sanity'
import {RiHome2Line} from 'react-icons/ri'

export const homepage = defineType({
  name: 'homepage',
  type: 'document',
  icon: RiHome2Line,
  fields: [
    defineField({
      type: 'image',
      name: 'image',
      options: {
        hotspot: true,
        metadata: ['blurhash', 'lqip', 'palette', 'exif', 'location'],
      },
    }),
    defineField({
      name: 'sectionDescriptions',
      type: 'object',
      fields: [
        {
          name: 'stories',
          type: 'text',
          rows: 2,
        },
        {
          name: 'anatomy',
          type: 'text',
          rows: 2,
        },
        {
          name: 'drawings',
          type: 'text',
          rows: 2,
        },
        {
          name: 'photos',
          type: 'text',
          rows: 2,
        },
        {
          name: 'people',
          type: 'text',
          rows: 2,
        },
      ],
    }),
  ],
  preview: {
    select: {},
    prepare({}) {
      return {
        title: 'Homepage',
      }
    },
  },
})
