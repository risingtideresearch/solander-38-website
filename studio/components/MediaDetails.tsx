import {Box, Label, Stack, Text, TextInput} from '@sanity/ui'
import {type ReactElement, useCallback, useEffect, useState} from 'react'
import {useClient} from 'sanity'

type Props = {
  currentAsset: any
  formUpdating: boolean
  renderDefaultDetails: (props: any) => ReactElement
  [key: string]: any
}

export function MediaDetails({renderDefaultDetails, currentAsset, ...props}: Props) {
  const client = useClient({apiVersion: '2024-01-01'})
  const [date, setDate] = useState<string>((currentAsset as any).date ?? '')

  useEffect(() => {
    setDate((currentAsset as any).date ?? '')
  }, [currentAsset])

  const handleDateBlur = useCallback(async () => {
    if (!currentAsset?._id) return
    const patch = client.patch(currentAsset._id)
    if (date) {
      await patch.set({date}).commit()
    } else {
      await patch.unset(['date']).commit()
    }
  }, [client, currentAsset._id, date])

  return (
    <Stack space={3}>
      {renderDefaultDetails({currentAsset, ...props})}
      <Box>
        <Stack space={2} paddingTop={3}>
          <Text size={1} weight='semibold'>Date</Text>
          <Text size={1} muted>Overrides EXIF date</Text>
          <TextInput
            disabled={props.formUpdating}
            onChange={(e) => setDate(e.currentTarget.value)}
            onBlur={handleDateBlur}
            type="date"
            value={date}
          />
        </Stack>
      </Box>
    </Stack>
  )
}
