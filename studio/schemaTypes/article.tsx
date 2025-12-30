import {defineField, defineType} from 'sanity'
import {RiArticleLine} from 'react-icons/ri'
import {CubeIcon, InlineIcon} from '@sanity/icons'
import ModelDropdownInput from '../components/ModelDropdownInput'
import DrawingDropdownInput, {
  getDrawingId,
  getDrawingTitle,
} from '../components/DrawingDropdownInput'

export const article = defineType({
  name: 'article',
  type: 'document',
  title: 'Story',
  icon: RiArticleLine,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'isLive',
      type: 'boolean',
    }),
    defineField({
      name: 'subtitle',
      type: 'text',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'authors',
      type: 'array',
      of: [
        defineField({
          name: 'author',
          type: 'reference',
          to: [
            {
              type: 'person',
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'content',
      type: 'array',
      of: [
        defineField({
          type: 'block',
          name: 'child',
          styles: [{title: 'Heading 2', value: 'h2'}],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Underline', value: 'underline'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
              {
                name: 'internalLink',
                type: 'object',
                title: 'Link to another story',
                icon: RiArticleLine,
                fields: [
                  {
                    name: 'reference',
                    type: 'reference',
                    title: 'Reference',
                    to: [
                      {type: 'article'},
                    ],
                  },
                ],
              },
            ],
          },
          of: [{name: 'personRef', type: 'reference', to: [{type: 'person'}]}],
        }),

        defineField({
          name: 'imageSet',
          type: 'object',
          icon: InlineIcon,
          fields: [
            {
              type: 'string',
              name: 'title',
            },
            {
              type: 'string',
              name: 'caption',
            },
            defineField({
              name: 'imageSet',
              type: 'array',
              description: 'Set of drawings and/or images',
              validation: (rule) => rule.required().min(1),
              of: [
                {
                  type: 'object',
                  name: 'drawingImage',
                  title: 'Drawing',
                  fields: [
                    defineField({
                      name: 'drawing',
                      type: 'string',
                      components: {
                        input: DrawingDropdownInput,
                      },
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  preview: {
                    select: {
                      drawing: 'drawing',
                    },
                    prepare({drawing}) {
                      return {
                        title: getDrawingTitle(drawing),
                        subtitle: getDrawingId(drawing),
                      }
                    },
                  },
                },
                defineField({
                  type: 'image',
                  name: 'image',
                  options: {
                    hotspot: true,
                    metadata: ['blurhash', 'lqip', 'palette', 'exif', 'location'],
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: 'title',
              caption: 'caption',
              imageSet: 'imageSet',
            },
            prepare({title, caption, imageSet}) {
              const imageCount = imageSet?.length || 0
              const pluralSuffix = imageCount === 1 ? '' : 's'

              return {
                title: title || 'Image Set',
                subtitle: `${imageCount} image${pluralSuffix}`,
                description: caption || '',
              }
            },
          },
        }),
        defineField({
          type: 'object',
          name: 'inlineImage',
          fields: [
            defineField({
              type: 'boolean',
              name: 'fullBleed',
            }),
            defineField({
              name: 'image',
              type: 'image',
              options: {
                hotspot: true,
                metadata: ['blurhash', 'lqip', 'palette', 'exif', 'location'],
              },
            }),
          ],
          preview: {
            select: {
              url: 'image.asset.url',
              title: 'image.asset.title',
            },
            prepare({url, title}) {
              return {
                media: (
                  <img
                    src={url}
                    alt={title || ''}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ),
                title,
                subtitle: 'Edit title in Media tab',
              }
            },
          },
        }),

        defineField({
          name: 'inlineModel',
          type: 'object',
          icon: CubeIcon,
          fields: [
            {
              name: 'title',
              type: 'string',
            },
            {
              name: 'models',
              type: 'array',
              validation: (Rule) =>
                Rule.custom((models: string[] | undefined) => {
                  if (!models || models.length === 0) return true

                  // Check for empty values
                  const hasEmptyValues = models.some((model) => !model || model.trim() === '')
                  if (hasEmptyValues) {
                    return 'Empty values are not allowed'
                  }

                  // Check for duplicates
                  const seen = new Map<string, number>()
                  const duplicates: string[] = []

                  models.forEach((model) => {
                    const count = seen.get(model) || 0
                    seen.set(model, count + 1)
                    if (count === 1) {
                      duplicates.push(model)
                    }
                  })

                  if (duplicates.length > 0) {
                    return `Duplicate models found: ${duplicates.join(', ')}`
                  }

                  return true
                }),
              of: [
                defineField({
                  name: 'model',
                  type: 'string',
                  components: {
                    input: ModelDropdownInput,
                  },
                }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'relatedModels',
      type: 'array',
      title: 'Related 3D model layers',
      options: {
        layout: 'list',
      },
      description:
        'By default, entire section will be shown (e.g. Propulsion) or use this list to override models shown',
      validation: (Rule) =>
        Rule.custom((models: string[] | undefined) => {
          if (!models || models.length === 0) return true

          // Check for empty values
          const hasEmptyValues = models.some((model) => !model || model.trim() === '')
          if (hasEmptyValues) {
            return 'Empty values are not allowed'
          }

          // Check for duplicates
          const seen = new Map<string, number>()
          const duplicates: string[] = []

          models.forEach((model) => {
            const count = seen.get(model) || 0
            seen.set(model, count + 1)
            if (count === 1) {
              duplicates.push(model)
            }
          })

          if (duplicates.length > 0) {
            return `Duplicate models found: ${duplicates.join(', ')}`
          }

          return true
        }),
      of: [
        defineField({
          name: 'model',
          type: 'string',
          components: {
            input: ModelDropdownInput,
          },
        }),
      ],
    }),
  ],
})
