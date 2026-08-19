import type { JSONContent } from '@tiptap/core'
import { EMPTY_LESSON_CONTENT, type LegacyLessonBlock, type LessonContent } from './types'

const text = (value?: string): JSONContent[] =>
  value ? [{ type: 'text', text: value }] : []

export function isTiptapDocument(value: unknown): value is LessonContent {
  return !!value && typeof value === 'object' && !Array.isArray(value) && (value as { type?: string }).type === 'doc'
}

export function toLessonDocument(value: unknown): LessonContent {
  if (isTiptapDocument(value)) return value
  if (!Array.isArray(value)) return EMPTY_LESSON_CONTENT

  const content = (value as LegacyLessonBlock[]).flatMap<JSONContent>((block) => {
    switch (block.type) {
      case 'heading': return [{ type: 'heading', attrs: { level: Math.min(Math.max(block.level ?? 2, 1), 3) }, content: text(block.text) }]
      case 'paragraph': return [{ type: 'paragraph', content: text(block.text) }]
      case 'image': return [{ type: 'lessonImage', attrs: { src: block.url ?? '', alt: block.alt ?? '', caption: block.caption ?? '' } }]
      case 'video': return [{ type: 'lessonVideo', attrs: { url: block.url ?? '', title: block.title ?? '', caption: block.caption ?? '' } }]
      case 'callout': return [{ type: 'callout', attrs: { intent: block.intent ?? 'info' }, content: [{ type: 'paragraph', content: text(block.text) }] }]
      case 'code': return [{ type: 'codeBlock', attrs: { language: block.language ?? 'plaintext' }, content: text(block.code) }]
      case 'list': return [{ type: block.ordered || block.style === 'ordered' ? 'orderedList' : 'bulletList', content: (block.items ?? []).map((item) => ({ type: 'listItem', content: [{ type: 'paragraph', content: text(item) }] })) }]
      default: return []
    }
  })
  return content.length ? { type: 'doc', content } : EMPTY_LESSON_CONTENT
}
