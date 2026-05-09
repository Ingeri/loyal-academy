import React from 'react';

interface ContentBlock {
  type: 'heading' | 'paragraph' | 'video' | 'list' | 'image' | 'callout' | 'table' | 'code';
  text?: string;
  level?: number;
  url?: string;
  caption?: string;
  items?: string[];
  style?: 'ordered' | 'unordered';
  alt?: string;
  intent?: 'warning' | 'info';
  headers?: string[];
  rows?: string[][];
  code?: string;
  language?: string;
}

export default function ContentRenderer({ content }: { content: any }) {
  if (!content || !Array.isArray(content)) return null;

  const blocks = content as ContentBlock[];

  return (
    <div className="w-full">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading': {
            const Tag = (block.level === 1 ? 'h1' : block.level === 2 ? 'h2' : 'h3') as keyof React.JSX.IntrinsicElements;
            const sizeClass = block.level === 1 ? 'text-4xl' : block.level === 2 ? 'text-3xl' : 'text-2xl';
            return (
              <Tag key={index} className={`font-bold mt-10 mb-4 text-foreground ${sizeClass}`}>
                {block.text}
              </Tag>
            );
          }

          case 'paragraph':
            return (
              <p key={index} className="text-muted-foreground mb-6 text-lg leading-relaxed">
                {block.text}
              </p>
            );

          case 'video':
            return (
              <div key={index} className="my-10 aspect-video rounded-2xl overflow-hidden shadow-2xl border border-primary/10">
                <iframe src={block.url} className="w-full h-full" allowFullScreen title={block.caption} />
                {block.caption && <p className="text-center text-sm text-muted-foreground mt-3 italic">{block.caption}</p>}
              </div>
            );

          case 'list': {
            const ListTag = block.style === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag key={index} className={`mb-8 ml-8 space-y-3 ${block.style === 'ordered' ? 'list-decimal' : 'list-disc'}`}>
                {block.items?.map((item: string, i: number) => (
                  <li key={i} className="text-muted-foreground text-lg pl-2">{item}</li>
                ))}
              </ListTag>
            );
          }

          case 'image':
            return (
              <figure key={index} className="my-10 group">
                <img src={block.url} alt={block.alt} className="rounded-2xl w-full object-cover shadow-lg group-hover:shadow-xl transition-shadow" />
                {block.alt && <figcaption className="text-center text-sm text-muted-foreground mt-3 uppercase tracking-wider">{block.alt}</figcaption>}
              </figure>
            );

          case 'table':
            return (
              <div key={index} className="my-8 overflow-hidden rounded-xl border border-muted bg-card">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-primary/5">
                    <tr>
                      {block.headers?.map((header, i) => (
                        <th key={i} className="p-4 font-bold text-sm border-b border-muted uppercase tracking-wider">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows?.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-muted/50 transition-colors">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="p-4 text-sm border-b border-muted text-muted-foreground">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case 'code':
            return (
              <div key={index} className="my-8 rounded-xl bg-slate-950 p-6 overflow-x-auto border border-white/10">
                <code className="text-sm font-mono text-blue-400">
                  <pre className="text-white">{block.code}</pre>
                </code>
                {block.language && <span className="text-[10px] text-white/30 uppercase mt-2 block">{block.language}</span>}
              </div>
            );

          case 'callout': {
            const isWarning = block.intent === 'warning';
            return (
              <div key={index} className={`p-6 border-l-4 my-8 rounded-r-2xl flex gap-4 ${isWarning ? 'bg-orange-500/10 border-orange-500' : 'bg-primary/10 border-primary'}`}>
                <div className="flex-1">
                    <p className={`font-bold text-sm uppercase mb-1 ${isWarning ? 'text-orange-500' : 'text-primary'}`}>{isWarning ? 'Attention' : 'Insight'}</p>
                    <p className="text-foreground leading-relaxed font-medium">{block.text}</p>
                </div>
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}