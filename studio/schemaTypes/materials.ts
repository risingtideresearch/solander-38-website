import {defineField, defineType} from 'sanity'
import data from '../script_output/material_index_simple.json'

export const materials = defineType({
  name: 'materials',
  type: 'document',
  fields: [
    defineField({
      name: 'materials',
      description: 'Descriptions to appear in Materials table at the end of each Story. If a description is left blank, it will be omitted from the table. Materials associated with model layers will always appear in Anatomy.',
      type: 'array',
      options: {
        layout: 'list',
      },
      of: [
        {
          type: 'material',
        },
      ],
      // Initialize with one entry per material
      initialValue: data.unique_materials.map((material) => ({
        _type: 'material',
        name: material,
        description: '',
      })),
    }),
  ],
  preview: {
    select: {},
    prepare({}) {
      return {
        title: 'Materials',
      }
    },
  },
})

export const material = defineType({
  name: 'material',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      options: {
        layout: 'dropdown',
        list: data.unique_materials,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description'
    }
  }
})
