import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {media} from 'sanity-plugin-media'
import {defaultDocumentNode} from './structure/defaultDocumentNode'
import {structure} from './structure'
import {MediaDetails} from './components/MediaDetails'
import {netlifyDeploy} from './plugins/netlifyDeploy'
import {PreviewAction} from './actions/previewAction'

export default defineConfig({
  name: 'default',
  title: 'Solander 38',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  dataset: 'production',

  plugins: [
    structureTool({structure, defaultDocumentNode}),
    visionTool(),
    media({components: {details: MediaDetails}}),
    netlifyDeploy(),
  ],

  mediaLibrary: {
    enabled: false,
  },

  form: {
    image: {
      assetSources: (previousAssetSources) => {
        return previousAssetSources.map((assetSource) => {
          if (assetSource.name === 'sanity-default') {
            return {
              ...assetSource,
              options: {
                ...assetSource.options,
                metadata: ['exif', 'location', 'lqip', 'palette'],
              },
            }
          }
          return assetSource
        })
      },
    },
  },

  document: {
    actions: (prev, {schemaType}) => {
      if (schemaType === 'article') {
        return [...prev, PreviewAction]
      }
      return prev
    },
  },

  schema: {
    types: schemaTypes,
  },
})
