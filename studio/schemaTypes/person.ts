import {defineField, defineType} from 'sanity'
import {LinkIcon, ListIcon, UserIcon} from '@sanity/icons'
import {link} from './shared/link'

export const person = defineType({
  name: 'person',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'role',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'name',
        maxLength: 200,
        slugify: (input) => input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    }),
    defineField({
      name: 'affiliations',
      type: 'array',
      title: 'Affiliations and links',
      options: {
        layout: 'list',
        modal: {
          type: 'popover',
        },
      },
      of: [
        defineField({
          type: 'object',
          name: 'link',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) =>
                Rule.uri({
                  scheme: ['http', 'https'],
                }),
            }),
          ],
          preview: {
            select: {
              label: 'label',
              url: 'url'
            },
            prepare({ label, url}) {
              return {
                title: label || url,
                media: url ? LinkIcon : ListIcon,
              }
            },
          },
        }),
      ],
    }),
  ],
})
