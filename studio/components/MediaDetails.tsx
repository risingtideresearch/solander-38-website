import {Box, Button, Flex, Stack, Text, TextInput} from '@sanity/ui'
import {type ReactElement, useCallback, useEffect, useState} from 'react'
import {useClient} from 'sanity'

type Props = {
  currentAsset: any
  formUpdating: boolean
  renderDefaultDetails: (props: any) => ReactElement
  [key: string]: any
}

/** Normalise EXIF / ISO date strings to YYYY-MM-DD for the date input.
 *  Handles:
 *   - "YYYY:MM:DD HH:MM:SS"       (standard EXIF)
 *   - "2025-04-25T11-20-08.000Z"  (ISO-like with hyphens in time)
 *   - "YYYY-MM-DD"                (already normalised)
 */
function parseExifDate(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  if (raw.includes('T')) return raw.split('T')[0]                      // ISO-like
  if (raw.includes(' ')) return raw.split(' ')[0].replace(/:/g, '-')   // EXIF standard
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw                     // already YYYY-MM-DD
  return undefined
}

export function MediaDetails({renderDefaultDetails, currentAsset, ...props}: Props) {
  const client = useClient({apiVersion: '2024-01-01'})
  const [savedDate, setSavedDate] = useState<string>('')
  const [date, setDate] = useState<string>('')
  // undefined = not yet loaded, null = loaded but no EXIF, string = loaded with EXIF date
  const [exifDate, setExifDate] = useState<string | null | undefined>(undefined)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!currentAsset?._id) return
    client
      .fetch<{date?: string; exif?: {DateTimeOriginal?: string}}>(
        `*[_id == $id][0]{date, "exif": metadata.exif}`,
        {id: currentAsset._id},
      )
      .then((doc) => {
        const loaded = doc?.date ?? ''
        setSavedDate(loaded)
        setDate(loaded)
        setExifDate(parseExifDate(doc?.exif?.DateTimeOriginal) ?? null)
      })
  }, [currentAsset?._id])

  const isDirty = date !== savedDate

  const handleSave = useCallback(async () => {
    if (!currentAsset?._id) return
    setSaving(true)
    const patch = client.patch(currentAsset._id)
    if (date) {
      await patch.set({date}).commit()
    } else {
      await patch.unset(['date']).commit()
    }
    setSavedDate(date)
    setSaving(false)
  }, [client, currentAsset._id, date])

  const hint = date && exifDate
    ? 'Overrides EXIF date'
    : exifDate
      ? `EXIF date: ${exifDate}`
      : exifDate === null
        ? 'No EXIF date defined'
        : '' // still loading

  return (
    <Stack gap={3}>
      {renderDefaultDetails({currentAsset, ...props})}
      <Box>
        <Stack gap={2} paddingTop={3}>
          <Text size={1} weight='semibold'>Date</Text>
          <Text size={1} muted>{hint}</Text>
          <Flex gap={2} align="center">
            <Box flex={1}>
              <TextInput
                disabled={props.formUpdating || saving}
                onChange={(e) => setDate(e.currentTarget.value)}
                type="date"
                value={date}
                placeholder={exifDate ?? undefined}
              />
            </Box>
            <Button
              text="Save"
              tone="primary"
              onClick={handleSave}
              disabled={!isDirty || saving || props.formUpdating}
              loading={saving}
            />
          </Flex>
        </Stack>
      </Box>
    </Stack>
  )
}
