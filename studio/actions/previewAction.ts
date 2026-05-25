import {LaunchIcon} from '@sanity/icons'
import {type DocumentActionComponent} from 'sanity'

const PREVIEW_SITE_URL =
  process.env.SANITY_STUDIO_PREVIEW_SITE_URL || 'https://solander38-preview.netlify.app'

export const PreviewAction: DocumentActionComponent = ({draft, published}) => {
  const doc = draft || published
  const slug = (doc as {slug?: {current?: string}} | null)?.slug?.current

  return {
    label: 'Preview',
    icon: LaunchIcon,
    disabled: !slug,
    title: slug ? `Open preview for /stories/${slug}` : 'Add a slug to enable preview',
    onHandle: () => {
      window.open(`${PREVIEW_SITE_URL}/stories/${slug}`, '_blank', 'noopener,noreferrer')
    },
  }
}
