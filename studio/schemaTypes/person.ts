import {defineField, defineType} from 'sanity'
import { UserIcon } from '@sanity/icons';
import { link } from './shared/link';

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
    link,
  ],
})
