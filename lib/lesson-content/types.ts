import type { JSONContent } from '@tiptap/core'

export type LessonContent = JSONContent

export type LegacyLessonBlock = {
  type: string
  text?: string
  level?: number
  url?: string
  title?: string
  caption?: string
  alt?: string
  items?: string[]
  ordered?: boolean
  style?: 'ordered' | 'unordered'
  headers?: string[]
  rows?: string[][]
  code?: string
  language?: string
  intent?: 'info' | 'success' | 'warning' | 'error'
}

export const EMPTY_LESSON_CONTENT: LessonContent = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
}
