import {defineField, defineType} from 'sanity'
import {ColorWheelIcon} from '@sanity/icons'
import ModelDropdownInput from '../components/ModelDropdownInput'

export const component = defineType({
  name: 'component',
  type: 'document',
  title: 'Component part',
  icon: ColorWheelIcon,
  fields: [
    defineField({
      name: 'relatedModel',
      title: 'Model layer',
      description: 'Corresponding 3D model/Rhino layer',
      type: 'string',
      components: {
        input: ModelDropdownInput,
      },
    }),
    defineField({
      type: 'string',
      name: 'title',
      description: 'Type of component, e.g. Motor',
    }),
    defineField({
      type: 'string',
      name: 'componentPart',
      title: 'Component part',
      description: 'Manufacturer and model name, e.g. BellMarine DriveMaster 20W Evo',
    }),
    // defineField({
    //   name: 'slug',
    //   type: 'slug',
    //   options: {
    //     source: 'title',
    //     maxLength: 200,
    //     slugify: (input) => input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
    //   },
    // }),
    defineField({
      type: 'image',
      name: 'image',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'componentPart',
      media: 'image',
    },
    prepare: ({title, subtitle, media}) => ({
      title,
      subtitle: `${subtitle}`,
      media,
    }),
  },
})
