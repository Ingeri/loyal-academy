"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

export type ContentBlock =
  | {
      type: "heading";
      text: string;
      level: 1 | 2 | 3 | 4 | 5 | 6;
    }
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "image";
      url: string;
      alt: string;
      caption?: string;
    }
  | {
      type: "list";
      items: string[];
      ordered: boolean;
    }
  | {
      type: "table";
      headers: string[];
      rows: string[][];
    }
  | {
      type: "video";
      url: string;
      title: string;
      duration: string;
    }
  | {
      type: "code";
      code: string;
      language: string;
    }
  | {
      type: "callout";
      text: string;
      intent: "warning" | "info";
    };

interface RichTextEditorProps {
  value: ContentBlock[];
  onChange: (value: ContentBlock[]) => void;
  label?: string;
  emptyMessage?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  label = "Content",
  emptyMessage = 'No content blocks yet. Click "Add Block" to start.',
}: RichTextEditorProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  const addBlock = (type: ContentBlock["type"]) => {
    const newBlock = createEmptyBlock(type);

    onChange([...value, newBlock]);

    setShowAddMenu(false);
  };

  const updateBlock = (
    index: number,
    updatedBlock: ContentBlock,
  ) => {
    const newBlocks = [...value];

    newBlocks[index] = updatedBlock;

    onChange(newBlocks);
  };

  const removeBlock = (index: number) => {
    const newBlocks = value.filter(
      (_, i) => i !== index,
    );

    onChange(newBlocks);
  };

  const moveBlock = (
    index: number,
    direction: "up" | "down",
  ) => {
    const newBlocks = [...value];

    const newIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      newIndex >= 0 &&
      newIndex < newBlocks.length
    ) {
      [
        newBlocks[index],
        newBlocks[newIndex],
      ] = [
        newBlocks[newIndex],
        newBlocks[index],
      ];

      onChange(newBlocks);
    }
  };

  return (
    <div className="space-y-4">
      {/* EDITOR HEADER */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background py-2">
        <Label>{label}</Label>

        <div className="relative">
          <Button
            type="button"
            size="sm"
            onClick={() =>
              setShowAddMenu(
                (previous) => !previous,
              )
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Block
          </Button>

          {showAddMenu && (
            <div className="absolute right-0 top-full z-20 mt-2 w-48 space-y-1 rounded-lg border bg-background p-2 shadow-lg">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() =>
                  addBlock("heading")
                }
              >
                <Type className="mr-2 h-4 w-4" />
                Heading
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() =>
                  addBlock("paragraph")
                }
              >
                <Type className="mr-2 h-4 w-4" />
                Paragraph
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() =>
                  addBlock("image")
                }
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Image
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() =>
                  addBlock("list")
                }
              >
                <List className="mr-2 h-4 w-4" />
                List
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() =>
                  addBlock("table")
                }
              >
                <Table className="mr-2 h-4 w-4" />
                Table
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() =>
                  addBlock("video")
                }
              >
                <Video className="mr-2 h-4 w-4" />
                Video
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() =>
                  addBlock("code")
                }
              >
                <Code className="mr-2 h-4 w-4" />
                Code Block
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() =>
                  addBlock("callout")
                }
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Callout
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT BLOCKS */}
      <div className="space-y-3">
        {value.length === 0 ? (
          <Card className="border-dashed bg-muted/5 p-8 text-center">
            <p className="text-muted-foreground">
              {emptyMessage}
            </p>
          </Card>
        ) : (
          value.map((block, index) => (
            <Card
              key={index}
              className="p-4"
            >
              <div className="flex items-start gap-3">
                {/* BLOCK CONTROLS */}
                <div className="flex flex-col gap-1 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() =>
                      moveBlock(
                        index,
                        "up",
                      )
                    }
                    disabled={index === 0}
                  >
                    <MoveUp className="h-3 w-3" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() =>
                      moveBlock(
                        index,
                        "down",
                      )
                    }
                    disabled={
                      index ===
                      value.length - 1
                    }
                  >
                    <MoveDown className="h-3 w-3" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={() =>
                      removeBlock(index)
                    }
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                {/* BLOCK EDITOR */}
                <div className="flex-1">
                  <BlockEditor
                    block={block}
                    onChange={(
                      updated,
                    ) =>
                      updateBlock(
                        index,
                        updated,
                      )
                    }
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

function createEmptyBlock(
  type: ContentBlock["type"],
): ContentBlock {
  switch (type) {
    case "heading":
      return {
        type: "heading",
        text: "",
        level: 2,
      };

    case "paragraph":
      return {
        type: "paragraph",
        text: "",
      };

    case "image":
      return {
        type: "image",
        url: "",
        alt: "",
      };

    case "list":
      return {
        type: "list",
        items: [""],
        ordered: false,
      };

    case "table":
      return {
        type: "table",
        headers: ["", ""],
        rows: [["", ""]],
      };

    case "video":
      return {
        type: "video",
        url: "",
        title: "",
        duration: "",
      };

    case "code":
      return {
        type: "code",
        code: "",
        language: "javascript",
      };

    case "callout":
      return {
        type: "callout",
        text: "",
        intent: "info",
      };
  }
}

function BlockEditor({
  block,
  onChange,
}: {
  block: ContentBlock;
  onChange: (
    block: ContentBlock,
  ) => void;
}) {
  switch (block.type) {
    case "heading":
      return (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Select
              value={block.level.toString()}
              onValueChange={(value) =>
                onChange({
                  ...block,
                  level: Number(
                    value,
                  ) as
                    | 1
                    | 2
                    | 3
                    | 4
                    | 5
                    | 6,
                })
              }
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="1">
                  H1
                </SelectItem>

                <SelectItem value="2">
                  H2
                </SelectItem>

                <SelectItem value="3">
                  H3
                </SelectItem>

                <SelectItem value="4">
                  H4
                </SelectItem>

                <SelectItem value="5">
                  H5
                </SelectItem>

                <SelectItem value="6">
                  H6
                </SelectItem>
              </SelectContent>
            </Select>

            <Input
              value={block.text}
              onChange={(e) =>
                onChange({
                  ...block,
                  text: e.target.value,
                })
              }
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
          onChange={(e) =>
            onChange({
              ...block,
              text: e.target.value,
            })
          }
          placeholder="Paragraph text"
          rows={3}
        />
      );

    case "image":
      return (
        <div className="space-y-2">
          <Input
            value={block.url}
            onChange={(e) =>
              onChange({
                ...block,
                url: e.target.value,
              })
            }
            placeholder="Image URL"
          />

          <Input
            value={block.alt}
            onChange={(e) =>
              onChange({
                ...block,
                alt: e.target.value,
              })
            }
            placeholder="Alt text"
          />

          <Input
            value={block.caption ?? ""}
            onChange={(e) =>
              onChange({
                ...block,
                caption:
                  e.target.value,
              })
            }
            placeholder="Caption (optional)"
          />
        </div>
      );

    case "list":
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Ordered:</Label>

            <Select
              value={block.ordered.toString()}
              onValueChange={(value) =>
                onChange({
                  ...block,
                  ordered:
                    value === "true",
                })
              }
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="false">
                  No
                </SelectItem>

                <SelectItem value="true">
                  Yes
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {block.items.map(
            (item, index) => (
              <div
                key={index}
                className="flex gap-2"
              >
                <Input
                  value={item}
                  onChange={(e) => {
                    const newItems = [
                      ...block.items,
                    ];

                    newItems[index] =
                      e.target.value;

                    onChange({
                      ...block,
                      items: newItems,
                    });
                  }}
                  placeholder={`Item ${
                    index + 1
                  }`}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const newItems =
                      block.items.filter(
                        (_, itemIndex) =>
                          itemIndex !==
                          index,
                      );

                    onChange({
                      ...block,
                      items: newItems,
                    });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ),
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onChange({
                ...block,
                items: [
                  ...block.items,
                  "",
                ],
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      );

    case "table":
      return (
        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Headers</Label>

            <div className="flex flex-wrap gap-2">
              {block.headers.map(
                (header, index) => (
                  <div
                    key={index}
                    className="flex min-w-40 flex-1 gap-2"
                  >
                    <Input
                      value={header}
                      onChange={(e) => {
                        const newHeaders =
                          [
                            ...block.headers,
                          ];

                        newHeaders[
                          index
                        ] =
                          e.target.value;

                        onChange({
                          ...block,
                          headers:
                            newHeaders,
                        });
                      }}
                      placeholder={`Header ${
                        index + 1
                      }`}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newHeaders =
                          block.headers.filter(
                            (
                              _,
                              headerIndex,
                            ) =>
                              headerIndex !==
                              index,
                          );

                        const newRows =
                          block.rows.map(
                            (row) =>
                              row.filter(
                                (
                                  _,
                                  cellIndex,
                                ) =>
                                  cellIndex !==
                                  index,
                              ),
                          );

                        onChange({
                          ...block,
                          headers:
                            newHeaders,
                          rows: newRows,
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Rows</Label>

            {block.rows.map(
              (row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex gap-2"
                >
                  {row.map(
                    (
                      cell,
                      cellIndex,
                    ) => (
                      <Input
                        key={
                          cellIndex
                        }
                        value={cell}
                        onChange={(
                          e,
                        ) => {
                          const newRows =
                            block.rows.map(
                              (
                                currentRow,
                              ) => [
                                ...currentRow,
                              ],
                            );

                          newRows[
                            rowIndex
                          ][
                            cellIndex
                          ] =
                            e.target.value;

                          onChange({
                            ...block,
                            rows: newRows,
                          });
                        }}
                        placeholder={`Row ${
                          rowIndex + 1
                        }, Col ${
                          cellIndex +
                          1
                        }`}
                        className="flex-1"
                      />
                    ),
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newRows =
                        block.rows.filter(
                          (
                            _,
                            index,
                          ) =>
                            index !==
                            rowIndex,
                        );

                      onChange({
                        ...block,
                        rows: newRows,
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ),
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                onChange({
                  ...block,
                  headers: [
                    ...block.headers,
                    "",
                  ],
                  rows:
                    block.rows.map(
                      (row) => [
                        ...row,
                        "",
                      ],
                    ),
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
                  rows: [
                    ...block.rows,
                    block.headers.map(
                      () => "",
                    ),
                  ],
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
            onChange={(e) =>
              onChange({
                ...block,
                url: e.target.value,
              })
            }
            placeholder="Video URL"
          />

          <Input
            value={block.title}
            onChange={(e) =>
              onChange({
                ...block,
                title: e.target.value,
              })
            }
            placeholder="Video title"
          />

          <Input
            value={block.duration}
            onChange={(e) =>
              onChange({
                ...block,
                duration:
                  e.target.value,
              })
            }
            placeholder="Duration (e.g., 7:55)"
          />
        </div>
      );

    case "code":
      return (
        <div className="space-y-2">
          <Select
            value={block.language}
            onValueChange={(value) =>
              onChange({
                ...block,
                language: value,
              })
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="javascript">
                JavaScript
              </SelectItem>

              <SelectItem value="typescript">
                TypeScript
              </SelectItem>

              <SelectItem value="python">
                Python
              </SelectItem>

              <SelectItem value="sql">
                SQL
              </SelectItem>

              <SelectItem value="json">
                JSON
              </SelectItem>

              <SelectItem value="bash">
                Bash
              </SelectItem>
            </SelectContent>
          </Select>

          <Textarea
            value={block.code}
            onChange={(e) =>
              onChange({
                ...block,
                code: e.target.value,
              })
            }
            placeholder="Code"
            rows={6}
            className="font-mono text-sm"
          />
        </div>
      );

    case "callout":
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Intent:</Label>

            <Select
              value={block.intent}
              onValueChange={(value) =>
                onChange({
                  ...block,
                  intent:
                    value as
                      | "warning"
                      | "info",
                })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="info">
                  Info
                </SelectItem>

                <SelectItem value="warning">
                  Warning
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            value={block.text}
            onChange={(e) =>
              onChange({
                ...block,
                text: e.target.value,
              })
            }
            placeholder="Callout text"
            rows={4}
          />
        </div>
      );
  }
}