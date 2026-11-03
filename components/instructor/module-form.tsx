"use client";

import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import RichTextEditor, {
  type ContentBlock,
} from "@/components/instructor/rich-text-editor";

// =========================================================
// PROPS
// =========================================================

interface ModuleFormProps {
  courseId: string;
  courseSlug: string;

  moduleId?: string;

  initialTitle?: string;
  initialDescription?: string;
}

// =========================================================
// MODULE FORM
// =========================================================

export default function ModuleForm({
  courseId,
  courseSlug,
  moduleId,
  initialTitle = "",
  initialDescription = "",
}: ModuleFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const isEditing = Boolean(moduleId);

  // =========================================================
  // CONVERT EXISTING DESCRIPTION TO EDITOR BLOCKS
  // =========================================================

  const initialDescriptionBlocks =
    useMemo<ContentBlock[]>(() => {
      if (!initialDescription.trim()) {
        return [];
      }

      return htmlToContentBlocks(
        initialDescription,
      );
    }, [initialDescription]);

  // =========================================================
  // STATE
  // =========================================================

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [title, setTitle] =
    useState(initialTitle);

  const [
    descriptionBlocks,
    setDescriptionBlocks,
  ] = useState<ContentBlock[]>(
    initialDescriptionBlocks,
  );

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError(null);

    // =======================================================
    // VALIDATE TITLE
    // =======================================================

    if (!title.trim()) {
      const message =
        "Module title is required.";

      setError(message);

      toast({
        title: "Error",
        description: message,
      });

      return;
    }

    // =======================================================
    // VALIDATE DESCRIPTION
    // =======================================================

    if (descriptionBlocks.length === 0) {
      const message =
        "Please add a module description.";

      setError(message);

      toast({
        title: "Error",
        description: message,
      });

      return;
    }

    setIsLoading(true);

    try {
      // =====================================================
      // CONVERT EDITOR BLOCKS TO HTML
      // =====================================================

      const description =
        contentBlocksToHtml(
          descriptionBlocks,
        );

      // =====================================================
      // CREATE OR UPDATE ENDPOINT
      // =====================================================

      const endpoint =
        isEditing && moduleId
          ? `/api/instructor/courses/${courseId}/modules/${moduleId}`
          : `/api/instructor/courses/${courseId}/modules`;

      // =====================================================
      // REQUEST
      // =====================================================

      const response = await fetch(
        endpoint,
        {
          method: isEditing
            ? "PATCH"
            : "POST",

          credentials: "same-origin",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title: title.trim(),
            description,
          }),
        },
      );

      let data: {
        error?: string;
        message?: string;
      } = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            (isEditing
              ? "Failed to update module"
              : "Failed to create module"),
        );
      }

      // =====================================================
      // SUCCESS
      // =====================================================

      toast({
        title: isEditing
          ? "Module updated successfully"
          : "Module created successfully",
      });

      router.push(
        `/instructor/courses/${courseSlug}/modules`,
      );

      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred";

      setError(message);

      toast({
        title: "Error",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* PAGE HEADER */}

      <div>
        <h1 className="text-3xl font-bold">
          {isEditing
            ? "Edit Module"
            : "Add Module"}
        </h1>

        <p className="mt-2 text-muted-foreground">
          {isEditing
            ? "Continue editing your existing module."
            : "Create a new module for your course."}
        </p>
      </div>

      {/* FORM */}

      <Card className="py-8">
        <CardHeader>
          <CardTitle>
            Module Information
          </CardTitle>

          <CardDescription>
            {isEditing
              ? "Update the module information below."
              : "Fill in the module details."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* ERROR */}

            {error && (
              <div className="rounded-md bg-destructive/10 p-4 text-destructive">
                {error}
              </div>
            )}

            {/* TITLE */}

            <div className="space-y-2">
              <Label htmlFor="title">
                Module Title *
              </Label>

              <Input
                id="title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value,
                  )
                }
                required
                disabled={isLoading}
                placeholder="Enter module title"
              />
            </div>

            {/* DESCRIPTION */}

            <div className="space-y-2">
              <RichTextEditor
                value={descriptionBlocks}
                onChange={
                  setDescriptionBlocks
                }
                label="Description *"
                emptyMessage='No description yet. Click "Add Block" to start writing the module description.'
              />
            </div>

            {/* BUTTONS */}

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                    {isEditing
                      ? "Saving..."
                      : "Creating..."}
                  </>
                ) : isEditing ? (
                  "Save Changes"
                ) : (
                  "Create Module"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() =>
                  router.back()
                }
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// =========================================================
// HTML -> CONTENT BLOCKS
//
// Existing module descriptions are stored in the database
// as HTML. This function converts that HTML back into the
// ContentBlock[] structure expected by RichTextEditor.
// =========================================================

function htmlToContentBlocks(
  html: string,
): ContentBlock[] {
  if (
    typeof window === "undefined" ||
    !html.trim()
  ) {
    return [];
  }

  const parser = new DOMParser();

  const document = parser.parseFromString(
    html,
    "text/html",
  );

  const blocks: ContentBlock[] = [];

  const elements = Array.from(
    document.body.children,
  );

  for (const element of elements) {
    const tag =
      element.tagName.toLowerCase();

    // =======================================================
    // HEADINGS H1-H6
    // =======================================================

    if (/^h[1-6]$/.test(tag)) {
      const level = Number(
        tag.substring(1),
      ) as 1 | 2 | 3 | 4 | 5 | 6;

      blocks.push({
        type: "heading",
        text:
          element.textContent?.trim() ??
          "",
        level,
      });

      continue;
    }

    // =======================================================
    // PARAGRAPH
    // =======================================================

    if (tag === "p") {
      blocks.push({
        type: "paragraph",
        text:
          element.textContent?.trim() ??
          "",
      });

      continue;
    }

    // =======================================================
    // LIST
    // =======================================================

    if (
      tag === "ul" ||
      tag === "ol"
    ) {
      const items = Array.from(
        element.children,
      )
        .filter(
          (child) =>
            child.tagName.toLowerCase() ===
            "li",
        )
        .map(
          (item) =>
            item.textContent?.trim() ??
            "",
        );

      blocks.push({
        type: "list",
        items,
        ordered: tag === "ol",
      });

      continue;
    }

    // =======================================================
    // FIGURE / IMAGE
    // =======================================================

    if (tag === "figure") {
      const image =
        element.querySelector("img");

      if (image) {
        const caption =
          element.querySelector(
            "figcaption",
          );

        blocks.push({
          type: "image",
          url:
            image.getAttribute("src") ??
            "",
          alt:
            image.getAttribute("alt") ??
            "",
          caption:
            caption?.textContent?.trim() ||
            undefined,
        });
      }

      continue;
    }

    // =======================================================
    // STANDALONE IMAGE
    // =======================================================

    if (tag === "img") {
      blocks.push({
        type: "image",
        url:
          element.getAttribute("src") ??
          "",
        alt:
          element.getAttribute("alt") ??
          "",
      });

      continue;
    }

    // =======================================================
    // TABLE
    // =======================================================

    if (tag === "table") {
      const headers = Array.from(
        element.querySelectorAll(
          "thead th",
        ),
      ).map(
        (header) =>
          header.textContent?.trim() ??
          "",
      );

      let rows = Array.from(
        element.querySelectorAll(
          "tbody tr",
        ),
      ).map((row) =>
        Array.from(
          row.querySelectorAll("td"),
        ).map(
          (cell) =>
            cell.textContent?.trim() ??
            "",
        ),
      );

      // Support tables without explicit tbody.
      if (rows.length === 0) {
        const allRows = Array.from(
          element.querySelectorAll("tr"),
        );

        rows = allRows
          .filter(
            (row) =>
              row.querySelectorAll("td")
                .length > 0,
          )
          .map((row) =>
            Array.from(
              row.querySelectorAll("td"),
            ).map(
              (cell) =>
                cell.textContent?.trim() ??
                "",
            ),
          );
      }

      blocks.push({
        type: "table",
        headers,
        rows,
      });

      continue;
    }

    // =======================================================
    // CODE
    // =======================================================

    if (tag === "pre") {
      const codeElement =
        element.querySelector("code");

      blocks.push({
        type: "code",
        code:
          codeElement?.textContent ??
          element.textContent ??
          "",
        language:
          codeElement?.getAttribute(
            "data-language",
          ) || "javascript",
      });

      continue;
    }

    // =======================================================
    // DIV
    //
    // This can represent:
    // - callout
    // - video block
    // - older generic content
    // =======================================================

    if (tag === "div") {
      const calloutIntent =
        element.getAttribute(
          "data-callout",
        );

      // -----------------------------------------------------
      // CALLOUT
      // -----------------------------------------------------

      if (
        calloutIntent === "warning" ||
        calloutIntent === "info"
      ) {
        blocks.push({
          type: "callout",
          text:
            element.textContent?.trim() ??
            "",
          intent: calloutIntent,
        });

        continue;
      }

      // -----------------------------------------------------
      // VIDEO
      // -----------------------------------------------------

      const link =
        element.querySelector("a");

      const strong =
        element.querySelector("strong");

      if (
        link &&
        link.textContent
          ?.toLowerCase()
          .includes("watch video")
      ) {
        const paragraphs =
          Array.from(
            element.querySelectorAll(
              "p",
            ),
          );

        const durationParagraph =
          paragraphs.find((paragraph) =>
            paragraph.textContent
              ?.trim()
              .toLowerCase()
              .startsWith("duration:"),
          );

        const duration =
          durationParagraph?.textContent
            ?.replace(
              /^duration:\s*/i,
              "",
            )
            .trim() ?? "";

        blocks.push({
          type: "video",
          url:
            link.getAttribute("href") ??
            "",
          title:
            strong?.textContent?.trim() ??
            "",
          duration,
        });

        continue;
      }

      // -----------------------------------------------------
      // GENERIC DIV FALLBACK
      // -----------------------------------------------------

      const text =
        element.textContent?.trim();

      if (text) {
        blocks.push({
          type: "paragraph",
          text,
        });
      }

      continue;
    }

    // =======================================================
    // BLOCKQUOTE FALLBACK
    // =======================================================

    if (tag === "blockquote") {
      blocks.push({
        type: "paragraph",
        text:
          element.textContent?.trim() ??
          "",
      });

      continue;
    }

    // =======================================================
    // UNKNOWN ELEMENT FALLBACK
    // =======================================================

    const text =
      element.textContent?.trim();

    if (text) {
      blocks.push({
        type: "paragraph",
        text,
      });
    }
  }

  // =========================================================
  // OLD PLAIN-TEXT DESCRIPTION FALLBACK
  // =========================================================

  if (
    blocks.length === 0 &&
    document.body.textContent?.trim()
  ) {
    blocks.push({
      type: "paragraph",
      text:
        document.body.textContent.trim(),
    });
  }

  return blocks;
}

// =========================================================
// CONTENT BLOCKS -> HTML
//
// Converts the RichTextEditor data back into HTML for the
// Module.description database field.
// =========================================================

function contentBlocksToHtml(
  blocks: ContentBlock[],
): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        // ===================================================
        // HEADING
        // ===================================================

        case "heading": {
          const level =
            block.level;

          return `<h${level}>${escapeHtml(
            block.text,
          )}</h${level}>`;
        }

        // ===================================================
        // PARAGRAPH
        // ===================================================

        case "paragraph":
          return `<p>${escapeHtml(
            block.text,
          )}</p>`;

        // ===================================================
        // IMAGE
        // ===================================================

        case "image": {
          const caption =
            block.caption
              ? `<figcaption>${escapeHtml(
                  block.caption,
                )}</figcaption>`
              : "";

          return `<figure><img src="${escapeHtml(
            block.url,
          )}" alt="${escapeHtml(
            block.alt,
          )}" />${caption}</figure>`;
        }

        // ===================================================
        // LIST
        // ===================================================

        case "list": {
          const tag =
            block.ordered
              ? "ol"
              : "ul";

          const items =
            block.items
              .map(
                (item) =>
                  `<li>${escapeHtml(
                    item,
                  )}</li>`,
              )
              .join("");

          return `<${tag}>${items}</${tag}>`;
        }

        // ===================================================
        // TABLE
        // ===================================================

        case "table": {
          const headers =
            block.headers
              .map(
                (header) =>
                  `<th>${escapeHtml(
                    header,
                  )}</th>`,
              )
              .join("");

          const rows =
            block.rows
              .map(
                (row) =>
                  `<tr>${row
                    .map(
                      (cell) =>
                        `<td>${escapeHtml(
                          cell,
                        )}</td>`,
                    )
                    .join("")}</tr>`,
              )
              .join("");

          return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
        }

        // ===================================================
        // VIDEO
        // ===================================================

        case "video": {
          const duration =
            block.duration
              ? `<p>Duration: ${escapeHtml(
                  block.duration,
                )}</p>`
              : "";

          return `<div><p><strong>${escapeHtml(
            block.title,
          )}</strong></p><p><a href="${escapeHtml(
            block.url,
          )}" target="_blank" rel="noopener noreferrer">Watch video</a></p>${duration}</div>`;
        }

        // ===================================================
        // CODE
        // ===================================================

        case "code":
          return `<pre><code data-language="${escapeHtml(
            block.language,
          )}">${escapeHtml(
            block.code,
          )}</code></pre>`;

        // ===================================================
        // CALLOUT
        // ===================================================

        case "callout":
          return `<div data-callout="${escapeHtml(
            block.intent,
          )}">${escapeHtml(
            block.text,
          )}</div>`;

        default:
          return "";
      }
    })
    .join("\n");
}

// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHtml(
  value: string,
): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}