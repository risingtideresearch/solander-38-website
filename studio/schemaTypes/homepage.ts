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
