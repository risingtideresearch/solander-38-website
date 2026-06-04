import {useState} from 'react'
import {definePlugin} from 'sanity'
import {LaunchIcon, RocketIcon} from '@sanity/icons'
import {Box, Button, Card, Stack, Text, Flex} from '@sanity/ui'

const HOOK_URL = process.env.SANITY_STUDIO_NETLIFY_BUILD_HOOK_URL
const PREVIEW_SITE_URL =
  process.env.SANITY_STUDIO_PREVIEW_SITE_URL || 'https://solander38-preview.netlify.app'

type Status = 'idle' | 'deploying' | 'success' | 'error'

function DeployTool() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleDeploy() {
    if (!HOOK_URL) {
      setStatus('error')
      return
    }
    setStatus('deploying')
    try {
      const res = await fetch(HOOK_URL, {method: 'POST'})
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <Box padding={4} style={{maxWidth: 700, margin: '0 auto'}}>
      <Card padding={4} radius={2} shadow={1}>
        <Stack padding={4}>
          <Stack space={3}>
            <Text size={2} weight="semibold">
              Deploy to Production
            </Text>
            <Text size={1} muted>
              Triggers a full rebuild and deploy of the production site with all{' '}
              <strong>published</strong> content.
            </Text>
          </Stack>
          <Flex gap={4} paddingTop={4}>
            <Button
              as="a"
              href={PREVIEW_SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              icon={LaunchIcon}
              text="Open preview site"
              mode="ghost"
            />
            <Button
              icon={RocketIcon}
              text={
                status === 'deploying'
                  ? 'Deploying…'
                  : status === 'success'
                    ? 'Deploy triggered'
                    : status === 'error'
                      ? 'Deploy failed'
                      : 'Deploy'
              }
              tone={status === 'error' ? 'critical' : status === 'success' ? 'positive' : 'primary'}
              disabled={status === 'deploying'}
              onClick={handleDeploy}
            />
            {!HOOK_URL && (
              <Text size={1} muted>
                SANITY_STUDIO_NETLIFY_BUILD_HOOK_URL is not set.
              </Text>
            )}
          </Flex>
        </Stack>
      </Card>
    </Box>
  )
}

export const netlifyDeploy = definePlugin(() => ({
  name: 'netlify-deploy',
  tools: [
    {
      name: 'deploy',
      title: 'Deploy',
      icon: RocketIcon,
      component: DeployTool,
    },
  ],
}))
