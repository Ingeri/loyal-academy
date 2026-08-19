'use client'

import type { JSONContent } from '@tiptap/core'
import { Download, FileText } from 'lucide-react'

const intentClass: Record<string, string> = {
  info: 'border-blue-300 bg-blue-50 text-blue-950', success: 'border-green-300 bg-green-50 text-green-950',
  warning: 'border-amber-300 bg-amber-50 text-amber-950', error: 'border-red-300 bg-red-50 text-red-950',
}
const text = (node?: JSONContent) => node?.content?.map((child, index) => <LessonNode key={index} node={child} />)
function LessonNode({ node }: { node: JSONContent }) {
  if (node.type === 'text') {
    let result: React.ReactNode = node.text
    for (const mark of node.marks ?? []) {
      if (mark.type === 'bold') result = <strong>{result}</strong>
      if (mark.type === 'italic') result = <em>{result}</em>
      if (mark.type === 'underline') result = <u>{result}</u>
      if (mark.type === 'strike') result = <s>{result}</s>
      if (mark.type === 'code') result = <code className="rounded bg-muted px-1 py-0.5 text-sm">{result}</code>
      if (mark.type === 'link') result = <a className="text-primary underline underline-offset-4" href={String(mark.attrs?.href ?? '')} target="_blank" rel="noopener noreferrer">{result}</a>
    }
    return result
  }
  switch (node.type) {
    case 'paragraph': return <p className="my-4 leading-8 text-foreground">{text(node)}</p>
    case 'heading': { const Tag = `h${node.attrs?.level ?? 2}` as 'h1' | 'h2' | 'h3'; return <Tag className="mt-8 mb-4 font-serif font-bold text-primary">{text(node)}</Tag> }
    case 'bulletList': return <ul className="my-4 list-disc space-y-2 pl-6 marker:text-primary">{text(node)}</ul>
    case 'orderedList': return <ol className="my-4 list-decimal space-y-2 pl-6 marker:text-primary">{text(node)}</ol>
    case 'listItem': return <li>{text(node)}</li>
    case 'blockquote': return <blockquote className="my-6 border-l-4 border-primary pl-4 italic text-muted-foreground">{text(node)}</blockquote>
    case 'horizontalRule': return <hr className="my-8 border-border" />
    case 'codeBlock': return <pre className="my-6 overflow-x-auto rounded-xl bg-slate-950 p-5 text-sm text-slate-100"><code>{text(node)}</code></pre>
    case 'table': {
      const rows = node.content ?? []
      const headerRows = rows.filter((row) => row.content?.some((cell) => cell.type === 'tableHeader'))
      const bodyRows = rows.filter((row) => !headerRows.includes(row))
      return (
        <div className="my-6 overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[540px] border-collapse">
            {headerRows.length > 0 && <thead>{headerRows.map((row, index) => <LessonNode key={index} node={row} />)}</thead>}
            <tbody>{bodyRows.map((row, index) => <LessonNode key={index} node={row} />)}</tbody>
          </table>
        </div>
      )
    }
    case 'tableRow': return <tr className="even:bg-muted/30">{text(node)}</tr>
    case 'tableHeader': return <th className="border border-border bg-muted px-4 py-3 text-left font-semibold">{text(node)}</th>
    case 'tableCell': return <td className="border border-border px-4 py-3 align-top">{text(node)}</td>
    case 'lessonImage': return <figure className="my-7"><img className="max-h-[32rem] w-full rounded-xl object-contain" src={String(node.attrs?.src ?? '')} alt={String(node.attrs?.alt ?? '')} />{node.attrs?.caption && <figcaption className="mt-2 text-center text-sm text-muted-foreground">{String(node.attrs.caption)}</figcaption>}</figure>
    case 'lessonVideo': return <figure className="my-7"><div className="aspect-video overflow-hidden rounded-xl bg-black"><iframe className="h-full w-full" src={String(node.attrs?.url ?? '')} title={String(node.attrs?.title || 'Lesson video')} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>{node.attrs?.caption && <figcaption className="mt-2 text-center text-sm text-muted-foreground">{String(node.attrs.caption)}</figcaption>}</figure>
    case 'callout': return <aside className={`my-6 rounded-r-xl border-l-4 p-4 ${intentClass[String(node.attrs?.intent ?? 'info')] ?? intentClass.info}`}><p className="mb-1 text-xs font-bold uppercase">{String(node.attrs?.intent ?? 'info')}</p>{text(node)}</aside>
    case 'resource': return <a href={String(node.attrs?.url ?? '')} target="_blank" rel="noopener noreferrer" className="my-5 flex items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-muted"><FileText className="h-5 w-5 text-primary" /><span className="flex-1 font-medium">{String(node.attrs?.title ?? 'Resource')}</span><span className="inline-flex items-center gap-1 text-sm text-primary"><Download className="h-4 w-4" />{String(node.attrs?.label ?? 'Download')}</span></a>
    default: return <>{text(node)}</>
  }
}
export function TiptapLessonContentRenderer({ content }: { content: JSONContent }) {
  return <div className="lesson-content max-w-none">{text(content)}</div>
}
