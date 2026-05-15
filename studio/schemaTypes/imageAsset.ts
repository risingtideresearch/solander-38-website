import {defineField, defineType} from 'sanity'

export const imageAsset = defineType({
  name: 'sanity.imageAsset',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      description: 'Override when EXIF date is unavailable',
    }),
  ],
})
