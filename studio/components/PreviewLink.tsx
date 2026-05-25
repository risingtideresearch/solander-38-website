import {LaunchIcon} from '@sanity/icons'
import {Box, Button, Card, Stack, Text} from '@sanity/ui'

const PREVIEW_SITE_URL =
  process.env.SANITY_STUDIO_PREVIEW_SITE_URL || 'https://solander38-preview.netlify.app'

interface ArticleDocument {
  displayed: {
    slug?: {current?: string}
    title?: string
  }
}

export function PreviewLink({document}: {document: ArticleDocument}) {
  const slug = document.displayed?.slug?.current

  if (!slug) {
    return (
      <Box padding={5}>
        <Text size={1} muted>
          Add a slug to this article to enable preview.
        </Text>
      </Box>
    )
  }

  const url = `${PREVIEW_SITE_URL}/stories/${slug}`

  return (
    <Box padding={5}>
      <Card padding={4} radius={2} shadow={1}>
        <Stack gap={4}>
          <Text size={2} weight="semibold">
            Preview site
          </Text>
          <Text size={1} muted>
            {url}
          </Text>
          <Button
            as="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            icon={LaunchIcon}
            text="Open preview"
            tone="primary"
          />
        </Stack>
      </Card>
    </Box>
  )
}
