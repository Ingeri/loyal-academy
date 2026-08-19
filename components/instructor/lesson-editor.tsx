'use client'

import { useEffect, useRef, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table'
import { Node, mergeAttributes } from '@tiptap/core'
import { AlertCircle, Bold, Code2, ImagePlus, Italic, List, ListOrdered, Quote, Redo2, Table2, Undo2, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { LessonContent } from '@/lib/lesson-content/types'
import { toLessonDocument } from '@/lib/lesson-content/conversion'

const safeVideoUrl = (value: string) => {
  try {
    const url = new URL(value)
    if (['youtube.com', 'www.youtube.com', 'youtu.be'].includes(url.hostname)) {
      const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v') ?? url.pathname.split('/').pop()
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
    }
    return url.protocol === 'https:' ? url.toString() : null
  } catch { return null }
}

const LessonImage = Node.create({
  name: 'lessonImage', group: 'block', atom: true, draggable: true,
  addAttributes: () => ({ src: { default: '' }, alt: { default: '' }, caption: { default: '' } }),
  parseHTML: () => [{ tag: 'figure[data-lesson-image]' }],
  renderHTML: ({ HTMLAttributes }) => ['figure', mergeAttributes({ 'data-lesson-image': '' }), ['img', { src: HTMLAttributes.src, alt: HTMLAttributes.alt }], HTMLAttributes.caption ? ['figcaption', {}, HTMLAttributes.caption] : ''],
})
const LessonVideo = Node.create({
  name: 'lessonVideo', group: 'block', atom: true, draggable: true,
  addAttributes: () => ({ url: { default: '' }, title: { default: '' }, caption: { default: '' } }),
  parseHTML: () => [{ tag: 'figure[data-lesson-video]' }],
  renderHTML: ({ HTMLAttributes }) => ['figure', mergeAttributes({ 'data-lesson-video': '' }), ['div', { class: 'aspect-video' }, ['iframe', { src: HTMLAttributes.url, title: HTMLAttributes.title || 'Lesson video', allowfullscreen: 'true' }],], HTMLAttributes.caption ? ['figcaption', {}, HTMLAttributes.caption] : ''],
})
const Callout = Node.create({
  name: 'callout', group: 'block', content: 'block+', defining: true,
  addAttributes: () => ({ intent: { default: 'info' } }),
  parseHTML: () => [{ tag: 'aside[data-callout]' }],
  renderHTML: ({ HTMLAttributes }) => ['aside', mergeAttributes({ 'data-callout': '', 'data-intent': HTMLAttributes.intent }), 0],
})
const Resource = Node.create({
  name: 'resource', group: 'block', atom: true, draggable: true,
  addAttributes: () => ({ title: { default: '' }, url: { default: '' }, label: { default: 'Download' } }),
  parseHTML: () => [{ tag: 'a[data-resource]' }],
  renderHTML: ({ HTMLAttributes }) => ['a', mergeAttributes({ 'data-resource': '', href: HTMLAttributes.url, target: '_blank', rel: 'noopener noreferrer' }), HTMLAttributes.label || HTMLAttributes.title],
})

type Dialog = 'image' | 'video' | 'callout' | 'resource' | null

export function LessonEditor({ value, onChange }: { value: LessonContent | unknown; onChange: (content: LessonContent) => void }) {
  const [dialog, setDialog] = useState<Dialog>(null)
  const [fields, setFields] = useState({ url: '', title: '', caption: '', alt: '', intent: 'info', label: 'Download' })
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit.configure({ heading: { levels: [1, 2, 3] }, link: { openOnClick: false } }), Table.configure({ resizable: true }), TableRow, TableHeader, TableCell, LessonImage, LessonVideo, Callout, Resource],
    content: toLessonDocument(value),
    editorProps: { attributes: { class: 'lesson-editor-content min-h-80 px-5 py-4 outline-none' } },
    onUpdate: ({ editor }) => onChangeRef.current(editor.getJSON()),
  })
  useEffect(() => { if (editor && JSON.stringify(editor.getJSON()) !== JSON.stringify(toLessonDocument(value))) editor.commands.setContent(toLessonDocument(value)) }, [editor, value])
  if (!editor) return <div className="min-h-80 animate-pulse rounded-lg border bg-muted/30" />
  const add = () => {
    if (dialog === 'image' && fields.url) editor.chain().focus().insertContent({ type: 'lessonImage', attrs: { src: fields.url, alt: fields.alt, caption: fields.caption } }).run()
    if (dialog === 'video') { const url = safeVideoUrl(fields.url); if (url) editor.chain().focus().insertContent({ type: 'lessonVideo', attrs: { url, title: fields.title, caption: fields.caption } }).run() }
    if (dialog === 'callout') editor.chain().focus().insertContent({ type: 'callout', attrs: { intent: fields.intent }, content: [{ type: 'paragraph' }] }).run()
    if (dialog === 'resource' && fields.url) editor.chain().focus().insertContent({ type: 'resource', attrs: { title: fields.title, url: fields.url, label: fields.label } }).run()
    setDialog(null); setFields({ url: '', title: '', caption: '', alt: '', intent: 'info', label: 'Download' })
  }
  const tool = (label: string, action: () => void, active = false) => <Button type="button" variant={active ? 'secondary' : 'ghost'} size="icon" title={label} onClick={action}>{label === 'Bold' ? <Bold /> : label === 'Italic' ? <Italic /> : label === 'Quote' ? <Quote /> : label === 'Bullet list' ? <List /> : label === 'Ordered list' ? <ListOrdered /> : label === 'Code' ? <Code2 /> : label === 'Undo' ? <Undo2 /> : <Redo2 />}</Button>
  return <div className="overflow-hidden rounded-xl border bg-background"><div className="flex flex-wrap gap-1 border-b bg-muted/30 p-2">{tool('Bold', () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}{tool('Italic', () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}<Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</Button><Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Button><Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</Button>{tool('Bullet list', () => editor.chain().focus().toggleBulletList().run())}{tool('Ordered list', () => editor.chain().focus().toggleOrderedList().run())}{tool('Quote', () => editor.chain().focus().toggleBlockquote().run())}{tool('Code', () => editor.chain().focus().toggleCodeBlock().run())}<Button type="button" variant="ghost" size="icon" title="Table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><Table2 /></Button><Button type="button" variant="ghost" size="icon" title="Image" onClick={() => setDialog('image')}><ImagePlus /></Button><Button type="button" variant="ghost" size="icon" title="Video" onClick={() => setDialog('video')}><Video /></Button><Button type="button" variant="ghost" size="icon" title="Callout" onClick={() => setDialog('callout')}><AlertCircle /></Button><Button type="button" variant="ghost" size="sm" onClick={() => setDialog('resource')}>Resource</Button>{tool('Undo', () => editor.chain().focus().undo().run())}{tool('Redo', () => editor.chain().focus().redo().run())}</div><EditorContent editor={editor} />{dialog && <div className="border-t bg-muted/20 p-4"><div className="grid gap-3 sm:grid-cols-2">{dialog !== 'callout' && <><div><Label>URL</Label><Input value={fields.url} onChange={(e) => setFields({ ...fields, url: e.target.value })} placeholder={dialog === 'video' ? 'YouTube or HTTPS video URL' : 'https://…'} /></div><div><Label>Title</Label><Input value={fields.title} onChange={(e) => setFields({ ...fields, title: e.target.value })} /></div></>}{dialog === 'image' && <><div><Label>Alt text</Label><Input value={fields.alt} onChange={(e) => setFields({ ...fields, alt: e.target.value })} /></div><div><Label>Caption</Label><Input value={fields.caption} onChange={(e) => setFields({ ...fields, caption: e.target.value })} /></div></>}{dialog === 'video' && <div><Label>Caption</Label><Input value={fields.caption} onChange={(e) => setFields({ ...fields, caption: e.target.value })} /></div>}{dialog === 'callout' && <div><Label>Callout type</Label><Select value={fields.intent} onValueChange={(intent) => setFields({ ...fields, intent })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="info">Info</SelectItem><SelectItem value="success">Success</SelectItem><SelectItem value="warning">Warning</SelectItem><SelectItem value="error">Error</SelectItem></SelectContent></Select></div>}{dialog === 'resource' && <div><Label>Button label</Label><Input value={fields.label} onChange={(e) => setFields({ ...fields, label: e.target.value })} /></div>}</div><div className="mt-3 flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setDialog(null)}>Cancel</Button><Button type="button" onClick={add}>Insert</Button></div></div>}</div>
}
