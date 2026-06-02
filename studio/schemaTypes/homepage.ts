import {defineArrayMember, defineField, defineType} from 'sanity'
import {RiHome2Line} from 'react-icons/ri'
import DrawingDropdownInput from '../components/DrawingDropdownInput'

export const homepage = defineType({
  name: 'homepage',
  type: 'document',
  icon: RiHome2Line,
  fields: [
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      validation: (rule) => rule.required(),
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              defineArrayMember({
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (rule) => rule.required(),
                  }),
                ],
              }),
            ],
          },
        }),
      ],
    }),
    defineField({
      type: 'image',
      name: 'image',
      title: 'Featured photo',
      options: {
        hotspot: true,
        metadata: ['blurhash', 'lqip', 'palette', 'exif', 'location'],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'drawing',
      title: 'Featured drawing',
      type: 'string',
      components: {
        input: DrawingDropdownInput,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sectionDescriptions',
      title: 'Section descriptions',
      type: 'object',
      validation: (rule) => rule.required(),
      fields: [
        {
          name: 'stories',
          type: 'text',
          rows: 2,
          validation: (rule: any) => rule.required(),
        },
        {
          name: 'anatomy',
          type: 'text',
          rows: 2,
          validation: (rule: any) => rule.required(),
        },
        {
          name: 'drawings',
          type: 'text',
          rows: 2,
          validation: (rule: any) => rule.required(),
        },
        {
          name: 'photos',
          type: 'text',
          rows: 2,
          validation: (rule: any) => rule.required(),
        },
        {
          name: 'people',
          type: 'text',
          rows: 2,
          validation: (rule: any) => rule.required(),
        },
        {
          name: 'systems',
          type: 'text',
          rows: 2,
          validation: (rule: any) => rule.required(),
        }
      ],
    }),
    defineField({
      name: 'license',
      type: 'array',
      validation: (rule) => rule.required(),
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              defineArrayMember({
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (rule) => rule.required(),
                  }),
                ],
              }),
            ],
          },
        }),
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
