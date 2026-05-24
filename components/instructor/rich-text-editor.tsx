"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Type,
  Image as ImageIcon,
  List,
  Table,
  Video,
  Code,
  AlertTriangle,
} from "lucide-react";

type ContentBlock =
  | { type: "heading"; text: string; level: 1 | 2 | 3 | 4 | 5 | 6 }
  | { type: "paragraph"; text: string }
  | { type: "image"; url: string; alt: string; caption?: string }
  | { type: "list"; items: string[]; ordered: boolean }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "video"; url: string; title: string; duration: string }
  | { type: "code"; code: string; language: string }
  | { type: "callout"; text: string; intent: "warning" | "info" };

interface RichTextEditorProps {
  value: ContentBlock[];
  onChange: (value: ContentBlock[]) => void;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  const addBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = createEmptyBlock(type);
    onChange([...value, newBlock]);
    setShowAddMenu(false);
  };

  const updateBlock = (index: number, updatedBlock: ContentBlock) => {
    const newBlocks = [...value];
    newBlocks[index] = updatedBlock;
    onChange(newBlocks);
  };

  const removeBlock = (index: number) => {
    const newBlocks = value.filter((_, i) => i !== index);
    onChange(newBlocks);
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const newBlocks = [...value];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newBlocks.length) {
      [newBlocks[index], newBlocks[newIndex]] = [
        newBlocks[newIndex],
        newBlocks[index],
      ];
      onChange(newBlocks);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between sticky top-0 bg-background z-10 py-2">
        <Label>Lesson Content</Label>
        <div className="relative">
          <Button type="button" size="sm" onClick={() => setShowAddMenu(!showAddMenu)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Block
          </Button>
          {showAddMenu && (
            <div className="absolute right-0 top-full mt-2 z-10 bg-white border rounded-lg shadow-lg p-2 w-48 space-y-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => addBlock("heading")}
              >
                <Type className="mr-2 h-4 w-4" />
                Heading
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => addBlock("paragraph")}
              >
                <Type className="mr-2 h-4 w-4" />
                Paragraph
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => addBlock("image")}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Image
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => addBlock("list")}
              >
                <List className="mr-2 h-4 w-4" />
                List
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => addBlock("table")}
              >
                <Table className="mr-2 h-4 w-4" />
                Table
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => addBlock("video")}
              >
                <Video className="mr-2 h-4 w-4" />
                Video
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => addBlock("code")}
              >
                <Code className="mr-2 h-4 w-4" />
                Code Block
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => addBlock("callout")}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Callout
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {value.length === 0 ? (
          <Card className="p-8 text-center border-dashed bg-muted/5">
            <p className="text-muted-foreground">
              No content blocks yet. Click "Add Block" to start.
            </p>
          </Card>
        ) : (
          value.map((block, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-1 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveBlock(index, "up")}
                    disabled={index === 0}
                  >
                    <MoveUp className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveBlock(index, "down")}
                    disabled={index === value.length - 1}
                  >
                    <MoveDown className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={() => removeBlock(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex-1">
                  <BlockEditor
                    block={block}
                    onChange={(updated) => updateBlock(index, updated)}
                  />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function createEmptyBlock(type: ContentBlock["type"]): ContentBlock {
  switch (type) {
    case "heading":
      return { type: "heading", text: "", level: 2 };
    case "paragraph":
      return { type: "paragraph", text: "" };
    case "image":
      return { type: "image", url: "", alt: "" };
    case "list":
      return { type: "list", items: [""], ordered: false };
    case "table":
      return { type: "table", headers: ["", ""], rows: [["", ""]] };
    case "video":
      return { type: "video", url: "", title: "", duration: "" };
    case "code":
      return { type: "code", code: "", language: "javascript" };
    case "callout":
      return { type: "callout", text: "", intent: "info" };
  }
}

function BlockEditor({
  block,
  onChange,
}: {
  block: ContentBlock;
  onChange: (block: ContentBlock) => void;
}) {
  switch (block.type) {
    case "heading":
      return (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Select
              value={block.level.toString()}
              onValueChange={(v) =>
                onChange({ ...block, level: parseInt(v) as 1 | 2 | 3 | 4 | 5 | 6 })
              }
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">H1</SelectItem>
                <SelectItem value="2">H2</SelectItem>
                <SelectItem value="3">H3</SelectItem>
                <SelectItem value="4">H4</SelectItem>
                <SelectItem value="5">H5</SelectItem>
                <SelectItem value="6">H6</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
              placeholder="Heading text"
              className="flex-1"
            />
          </div>
        </div>
      );

    case "paragraph":
      return (
        <Textarea
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          placeholder="Paragraph text"
          rows={3}
        />
      );

    case "image":
      return (
        <div className="space-y-2">
          <Input
            value={block.url}
            onChange={(e) => onChange({ ...block, url: e.target.value })}
            placeholder="Image URL"
          />
          <Input
            value={block.alt}
            onChange={(e) => onChange({ ...block, alt: e.target.value })}
            placeholder="Alt text"
          />
          <Input
            value={block.caption || ""}
            onChange={(e) =>
              onChange({ ...block, caption: e.target.value })
            }
            placeholder="Caption (optional)"
          />
        </div>
      );

    case "list":
      return (
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <Label>Ordered:</Label>
            <Select
              value={block.ordered.toString()}
              onValueChange={(v) => onChange({ ...block, ordered: v === "true" })}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">No</SelectItem>
                <SelectItem value="true">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {block.items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => {
                  const newItems = [...block.items];
                  newItems[i] = e.target.value;
                  onChange({ ...block, items: newItems });
                }}
                placeholder={`Item ${i + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newItems = block.items.filter((_, idx) => idx !== i);
                  onChange({ ...block, items: newItems });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange({ ...block, items: [...block.items, ""] })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      );

    case "table":
      return (
        <div className="space-y-2">
          <div className="space-y-1">
            <Label>Headers</Label>
            <div className="flex gap-2">
              {block.headers.map((header, i) => (
                <div key={i} className="flex-1 flex gap-2">
                  <Input
                    value={header}
                    onChange={(e) => {
                      const newHeaders = [...block.headers];
                      newHeaders[i] = e.target.value;
                      onChange({ ...block, headers: newHeaders });
                    }}
                    placeholder={`Header ${i + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newHeaders = block.headers.filter((_, idx) => idx !== i);
                      const newRows = block.rows.map((r) => r.filter((_, idx) => idx !== i));
                      onChange({ ...block, headers: newHeaders, rows: newRows });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <Label>Rows</Label>
            {block.rows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-2">
                {row.map((cell, cellIndex) => (
                  <Input
                    key={cellIndex}
                    value={cell}
                    onChange={(e) => {
                      const newRows = [...block.rows];
                      newRows[rowIndex][cellIndex] = e.target.value;
                      onChange({ ...block, rows: newRows });
                    }}
                    placeholder={`Row ${rowIndex + 1}, Col ${cellIndex + 1}`}
                    className="flex-1"
                  />
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const newRows = block.rows.filter((_, idx) => idx !== rowIndex);
                    onChange({ ...block, rows: newRows });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                onChange({
                  ...block,
                  headers: [...block.headers, ""],
                  rows: block.rows.map((r) => [...r, ""]),
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Column
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                onChange({
                  ...block,
                  rows: [...block.rows, block.headers.map(() => "")],
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Row
            </Button>
          </div>
        </div>
      );

    case "video":
      return (
        <div className="space-y-2">
          <Input
            value={block.url}
            onChange={(e) => onChange({ ...block, url: e.target.value })}
            placeholder="Video URL"
          />
          <Input
            value={block.title}
            onChange={(e) => onChange({ ...block, title: e.target.value })}
            placeholder="Video title"
          />
          <Input
            value={block.duration}
            onChange={(e) => onChange({ ...block, duration: e.target.value })}
            placeholder="Duration (e.g., 7:55)"
          />
        </div>
      );

    case "code":
      return (
        <div className="space-y-2">
          <Select
            value={block.language}
            onValueChange={(v) => onChange({ ...block, language: v })}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="sql">SQL</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="bash">Bash</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            value={block.code}
            onChange={(e) => onChange({ ...block, code: e.target.value })}
            placeholder="Code"
            rows={6}
            className="font-mono text-sm"
          />
        </div>
      );

    case "callout":
      return (
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <Label>Intent:</Label>
            <Select
              value={block.intent}
              onValueChange={(v) => onChange({ ...block, intent: v as "warning" | "info" })}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="Callout text"
            rows={4}
          />
        </div>
      );
  }
}
