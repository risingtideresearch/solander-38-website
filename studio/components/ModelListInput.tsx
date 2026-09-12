import React, {useCallback, useMemo, useState} from 'react'
import {Autocomplete, Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {TrashIcon} from '@sanity/icons'
import {set, unset} from 'sanity'
import type {ArrayOfPrimitivesInputProps} from 'sanity'

import {
  MODEL_GROUPS,
  groupForPrefix,
  isGroup,
  modelTitle,
  parentPath,
  rhinoModels,
} from './modelSets'

type Option = {value: string; title: string; subtitle: string}

const groupSubtitle = (path: string[], count: number) =>
  `Complete set — all ${count} models under ${path.join(' / ')}`

const options: Option[] = [
  ...MODEL_GROUPS.map((group) => ({
    value: group.prefix,
    title: group.title,
    subtitle: groupSubtitle(group.path, group.count),
  })),
  ...rhinoModels.map((filename) => ({
    value: filename,
    title: modelTitle(filename),
    subtitle: parentPath(filename),
  })),
]

/** A stored entry: a set prefix, or one Rhino layer linked by exact filename. */
type Row = {key: string; title: string; subtitle: string}

function toRow(entry: string): Row {
  if (isGroup(entry)) {
    const group = groupForPrefix(entry)
    const path = entry.slice(0, -2).split('__')
    return {
      key: entry,
      title: group?.title ?? path[path.length - 1],
      subtitle: group
        ? groupSubtitle(group.path, group.count)
        : `${path.join(' / ')} — no models under this path`,
    }
  }
  return {key: entry, title: modelTitle(entry), subtitle: parentPath(entry) || entry}
}

export default function ModelListInput(props: ArrayOfPrimitivesInputProps<string>) {
  const {value, onChange, readOnly} = props
  const [query, setQuery] = useState('')

  const entries = useMemo(
    () => (value || []).filter((v): v is string => typeof v === 'string'),
    [value],
  )
  const rows = useMemo(() => entries.map(toRow), [entries])

  const commit = useCallback(
    (next: string[]) => onChange(next.length ? set(next) : unset()),
    [onChange],
  )

  const handleAdd = useCallback(
    (selected: string) => {
      if (!entries.includes(selected)) commit([...entries, selected])
      setQuery('')
    },
    [entries, commit],
  )

  const filtered = options.filter((option) =>
    (option.title + ' ' + option.subtitle).toLowerCase().includes(query.toLowerCase()),
  )

  const renderOption = useCallback(
    (option: Option) => (
      <Card as="button" padding={3} border>
        <Stack space={2}>
          <Text size={1} muted>
            <em>{option.subtitle}</em>
          </Text>
          <Text size={1}>{option.title}</Text>
        </Stack>
      </Card>
    ),
    [],
  )

  return (
    <Stack space={3}>
      {rows.length > 0 && (
        <Stack space={2}>
          {rows.map((row) => (
            <Card key={row.key} padding={2} radius={2} border>
              <Flex align="center" gap={2}>
                <Stack space={2} flex={1}>
                  <Text size={1}>{row.title}</Text>
                  <Text size={1} muted>
                    {row.subtitle}
                  </Text>
                </Stack>
                <Button
                  mode="bleed"
                  icon={TrashIcon}
                  tone="critical"
                  disabled={readOnly}
                  title={`Remove ${row.title}`}
                  onClick={() => commit(entries.filter((e) => e !== row.key))}
                />
              </Flex>
            </Card>
          ))}
        </Stack>
      )}

      <Autocomplete
        id={props.id}
        options={filtered}
        value=""
        readOnly={readOnly}
        onChange={handleAdd}
        onQueryChange={(q) => setQuery(q || '')}
        renderOption={renderOption}
        filterOption={() => true}
        placeholder="Add a set or model…"
        openButton
      />
    </Stack>
  )
}
