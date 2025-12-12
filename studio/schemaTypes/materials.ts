import {defineField, defineType} from 'sanity'
import data from '../script_output/material_index_simple.json'

export const materials = defineType({
  name: 'materials',
  type: 'document',
  fields: [
    defineField({
      name: 'materials',
      type: 'array',
      options: {
        layout: 'list',
      },
      of: [
        {
          type: 'material',
        },
      ],
      // Initialize with one entry per system
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
})
