"use client";

import { useState, type FormEvent } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { Loader2, Plus, X } from "lucide-react";

import RichTextEditor, {
  type ContentBlock,
} from "@/components/instructor/rich-text-editor";

interface Category {
  id: string;
  name: string;
}

interface CourseFormProps {
  categories: Category[];
}

type RepeatableField =
  | "careerFields"
  | "hiringSectors"
  | "learningOutcomes";

export default function CourseForm({
  categories,
}: CourseFormProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * Course Overview now uses the same
   * rich content editor as your module form.
   */
  const [overviewBlocks, setOverviewBlocks] =
    useState<ContentBlock[]>([]);

  const [formData, setFormData] = useState({
    title: "",

    thumbnail: "",

    categoryId: "",

    price: "0",

    level: "BEGINNER",

    duration: "",

    hasCertificate: true,

    hasExam: false,

    conductingType: "Online",

    /*
     * We keep these internal field names
     * so your existing API is less likely
     * to break.
     *
     * careerFields =
     * Who Should Learn This Course
     *
     * hiringSectors =
     * Why This Course Matters
     */
    careerFields: [""],

    hiringSectors: [""],

    learningOutcomes: [""],
  });

  /*
   * Generic functions for all three
   * repeatable sections.
   */
  const addListItem = (
    field: RepeatableField,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [
        ...prev[field],
        "",
      ],
    }));
  };

  const removeListItem = (
    field: RepeatableField,
    index: number,
  ) => {
    setFormData((prev) => ({
      ...prev,

      [field]:
        prev[field].filter(
          (_, itemIndex) =>
            itemIndex !== index,
        ),
    }));
  };

  const updateListItem = (
    field: RepeatableField,
    index: number,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,

      [field]:
        prev[field].map(
          (item, itemIndex) =>
            itemIndex === index
              ? value
              : item,
        ),
    }));
  };

  /*
   * Existing image upload logic.
   */
  const uploadFile = async (
    file: File,
  ) => {
    const fd = new FormData();

    fd.append(
      "file",
      file,
      file.name,
    );

    const response = await fetch(
      "/api/uploads/image",
      {
        method: "POST",
        body: fd,
      },
    );

    if (!response.ok) {
      throw new Error(
        "Upload failed",
      );
    }

    const data =
      await response.json();

    return data.url as string;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError(null);

    /*
     * Basic validation
     */
    if (!formData.title.trim()) {
      setError(
        "Course title is required.",
      );

      return;
    }

    if (!formData.categoryId) {
      setError(
        "Please select a category.",
      );

      return;
    }

    if (
      overviewBlocks.length === 0
    ) {
      setError(
        "Please add a course overview.",
      );

      return;
    }

    setIsLoading(true);

    try {
      /*
       * Convert rich editor blocks to HTML.
       *
       * Your current overview field was
       * string[], so we place the generated
       * HTML inside that array.
       */
      const overviewHtml =
        contentBlocksToHtml(
          overviewBlocks,
        );

      /*
       * Because your API previously received
       * a required description field, we
       * generate one automatically from the
       * Course Overview instead of displaying
       * the old Short Description field.
       */
      const generatedDescription =
        contentBlocksToPlainText(
          overviewBlocks,
        ).slice(0, 500);

      const response = await fetch(
        "/api/instructor/courses",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            ...formData,

            description:
              generatedDescription,

            overview:
              overviewHtml.trim()
                ? [overviewHtml]
                : [],

            careerFields:
              formData.careerFields.filter(
                (item) =>
                  item.trim() !== "",
              ),

            hiringSectors:
              formData.hiringSectors.filter(
                (item) =>
                  item.trim() !== "",
              ),

            learningOutcomes:
              formData.learningOutcomes.filter(
                (item) =>
                  item.trim() !== "",
              ),
          }),
        },
      );

      let data: any = {};

      try {
        data =
          await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to create course",
        );
      }

      router.push(
        `/instructor/courses/${data.slug}`,
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* PAGE TITLE */}
      <div>
        <h1 className="text-3xl font-bold">
          Create New Course
        </h1>

        <p className="mt-2 text-muted-foreground">
          Fill in the details to create
          a new course
        </p>
      </div>

      <Card className="py-8">
        <CardHeader>
          <CardTitle>
            Course Information
          </CardTitle>

          <CardDescription>
            Basic information about your
            course
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* ERROR */}
            {error && (
              <div className="rounded-md bg-destructive/10 p-4 text-destructive">
                {error}
              </div>
            )}

            {/* COURSE TITLE + SLUG */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Course Title *
                </Label>

                <Input
                  id="title"
                  value={formData.title}
                  onChange={(event) =>
                    setFormData(
                      (prev) => ({
                        ...prev,

                        title:
                          event.target
                            .value,
                      }),
                    )
                  }
                  required
                  placeholder="Introduction to Web Development"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">
                  Slug (auto-generated)
                </Label>

                <Input
                  id="slug"
                  value={formData.title
                    .toLowerCase()
                    .replace(
                      /[^a-z0-9]+/g,
                      "-",
                    )
                    .replace(
                      /^-+|-+$/g,
                      "",
                    )}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            {/* COURSE OVERVIEW */}
            <div className="space-y-2">
              <RichTextEditor
                value={overviewBlocks}
                onChange={
                  setOverviewBlocks
                }
                label="Course Overview *"
                emptyMessage='No course overview yet. Click "Add Block" to start writing.'
              />
            </div>

            {/* THUMBNAIL + CATEGORY */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="thumbnail">
                  Thumbnail
                </Label>

                <input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  aria-label="Upload thumbnail image"
                  onChange={async (
                    event,
                  ) => {
                    const file =
                      event.target
                        .files?.[0];

                    if (!file) {
                      return;
                    }

                    setIsLoading(true);

                    try {
                      const url =
                        await uploadFile(
                          file,
                        );

                      setFormData(
                        (prev) => ({
                          ...prev,
                          thumbnail: url,
                        }),
                      );
                    } catch (err) {
                      setError(
                        err instanceof
                          Error
                          ? err.message
                          : "Upload failed",
                      );
                    } finally {
                      setIsLoading(
                        false,
                      );
                    }
                  }}
                />

                {formData.thumbnail && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Uploaded:{" "}
                    {
                      formData.thumbnail
                    }
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category *
                </Label>

                <Select
                  value={
                    formData.categoryId
                  }
                  onValueChange={(
                    value,
                  ) =>
                    setFormData(
                      (prev) => ({
                        ...prev,
                        categoryId:
                          value,
                      }),
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.length ===
                    0 ? (
                      <SelectItem
                        value="no-categories"
                        disabled
                      >
                        No categories
                        available
                      </SelectItem>
                    ) : (
                      categories.map(
                        (category) => (
                          <SelectItem
                            key={
                              category.id
                            }
                            value={
                              category.id
                            }
                          >
                            {
                              category.name
                            }
                          </SelectItem>
                        ),
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* PRICE + LEVEL + DURATION */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price ($)
                </Label>

                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(event) =>
                    setFormData(
                      (prev) => ({
                        ...prev,

                        price:
                          event.target
                            .value,
                      }),
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">
                  Level *
                </Label>

                <Select
                  value={formData.level}
                  onValueChange={(
                    value,
                  ) =>
                    setFormData(
                      (prev) => ({
                        ...prev,
                        level: value,
                      }),
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="BEGINNER">
                      Beginner
                    </SelectItem>

                    <SelectItem value="INTERMEDIATE">
                      Intermediate
                    </SelectItem>

                    <SelectItem value="ADVANCED">
                      Advanced
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">
                  Duration
                </Label>

                <Input
                  id="duration"
                  value={
                    formData.duration
                  }
                  onChange={(event) =>
                    setFormData(
                      (prev) => ({
                        ...prev,

                        duration:
                          event.target
                            .value,
                      }),
                    )
                  }
                  placeholder="e.g., 8 weeks"
                />
              </div>
            </div>

            {/* CONDUCTING TYPE + OPTIONS */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="conductingType">
                  Conducting Type
                </Label>

                <Select
                  value={
                    formData.conductingType
                  }
                  onValueChange={(
                    value,
                  ) =>
                    setFormData(
                      (prev) => ({
                        ...prev,

                        conductingType:
                          value,
                      }),
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Online">
                      Online
                    </SelectItem>

                    <SelectItem value="OnSite">
                      On Site
                    </SelectItem>

                    <SelectItem value="Hybrid">
                      Hybrid
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap items-center gap-5 pt-6">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="hasCertificate"
                    checked={
                      formData.hasCertificate
                    }
                    onCheckedChange={(
                      checked,
                    ) =>
                      setFormData(
                        (prev) => ({
                          ...prev,

                          hasCertificate:
                            checked ===
                            true,
                        }),
                      )
                    }
                  />

                  <Label htmlFor="hasCertificate">
                    Include Certificate
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="hasExam"
                    checked={
                      formData.hasExam
                    }
                    onCheckedChange={(
                      checked,
                    ) =>
                      setFormData(
                        (prev) => ({
                          ...prev,

                          hasExam:
                            checked ===
                            true,
                        }),
                      )
                    }
                  />

                  <Label htmlFor="hasExam">
                    Include Exam
                  </Label>
                </div>
              </div>
            </div>

            <div className="border-t pt-6" />

            {/* WHO SHOULD LEARN */}
            <div className="space-y-3">
              <div>
                <Label className="text-base font-semibold">
                  Who Should Learn This
                  Course?
                </Label>

                <p className="mt-1 text-sm text-muted-foreground">
                  Add the target learners
                  for this course
                </p>
              </div>

              {formData.careerFields.map(
                (learner, index) => (
                  <div
                    key={index}
                    className="flex gap-2"
                  >
                    <Input
                      value={learner}
                      onChange={(
                        event,
                      ) =>
                        updateListItem(
                          "careerFields",
                          index,
                          event.target
                            .value,
                        )
                      }
                      placeholder="e.g., University students, young professionals, managers"
                    />

                    {formData
                      .careerFields
                      .length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          removeListItem(
                            "careerFields",
                            index,
                          )
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ),
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  addListItem(
                    "careerFields",
                  )
                }
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Target Learner
              </Button>
            </div>

            {/* WHY THIS COURSE MATTERS */}
            <div className="space-y-3">
              <div>
                <Label className="text-base font-semibold">
                  Why This Course
                  Matters
                </Label>

                <p className="mt-1 text-sm text-muted-foreground">
                  Add the important
                  reasons and benefits of
                  this course
                </p>
              </div>

              {formData.hiringSectors.map(
                (reason, index) => (
                  <div
                    key={index}
                    className="flex gap-2"
                  >
                    <Input
                      value={reason}
                      onChange={(
                        event,
                      ) =>
                        updateListItem(
                          "hiringSectors",
                          index,
                          event.target
                            .value,
                        )
                      }
                      placeholder="e.g., Fundamental concepts, practical applications"
                    />

                    {formData
                      .hiringSectors
                      .length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          removeListItem(
                            "hiringSectors",
                            index,
                          )
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ),
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  addListItem(
                    "hiringSectors",
                  )
                }
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Reason
              </Button>
            </div>

            {/* LEARNING OUTCOMES */}
            <div className="space-y-3">
              <div>
                <Label className="text-base font-semibold">
                  Learning Outcomes
                </Label>

                <p className="mt-1 text-sm text-muted-foreground">
                  Add what learners
                  should achieve after
                  completing this course
                </p>
              </div>

              {formData.learningOutcomes.map(
                (
                  outcome,
                  index,
                ) => (
                  <div
                    key={index}
                    className="flex gap-2"
                  >
                    <Input
                      value={outcome}
                      onChange={(
                        event,
                      ) =>
                        updateListItem(
                          "learningOutcomes",
                          index,
                          event.target
                            .value,
                        )
                      }
                      placeholder="e.g., Build responsive websites"
                    />

                    {formData
                      .learningOutcomes
                      .length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          removeListItem(
                            "learningOutcomes",
                            index,
                          )
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ),
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  addListItem(
                    "learningOutcomes",
                  )
                }
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Learning Outcome
              </Button>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Course"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.back()
                }
                disabled={isLoading}
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

/*
 * Convert your ContentBlock[] rich editor
 * data to HTML.
 */
function contentBlocksToHtml(
  blocks: ContentBlock[],
): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
          return `<h${block.level}>${escapeHtml(
            block.text,
          )}</h${block.level}>`;

        case "paragraph":
          return `<p>${escapeHtml(
            block.text,
          )}</p>`;

        case "image":
          return `
            <figure>
              <img
                src="${escapeHtml(
                  block.url,
                )}"
                alt="${escapeHtml(
                  block.alt,
                )}"
              />

              ${
                block.caption
                  ? `<figcaption>${escapeHtml(
                      block.caption,
                    )}</figcaption>`
                  : ""
              }
            </figure>
          `;

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
                    .join(
                      "",
                    )}</tr>`,
              )
              .join("");

          return `
            <table>
              <thead>
                <tr>
                  ${headers}
                </tr>
              </thead>

              <tbody>
                ${rows}
              </tbody>
            </table>
          `;
        }

        case "video":
          return `
            <div>
              <strong>
                ${escapeHtml(
                  block.title,
                )}
              </strong>

              <p>
                <a
                  href="${escapeHtml(
                    block.url,
                  )}"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch video
                </a>
              </p>

              ${
                block.duration
                  ? `<p>Duration: ${escapeHtml(
                      block.duration,
                    )}</p>`
                  : ""
              }
            </div>
          `;

        case "code":
          return `
            <pre>
              <code data-language="${escapeHtml(
                block.language,
              )}">
${escapeHtml(block.code)}
              </code>
            </pre>
          `;

        case "callout":
          return `
            <div data-callout="${escapeHtml(
              block.intent,
            )}">
              ${escapeHtml(
                block.text,
              )}
            </div>
          `;

        default:
          return "";
      }
    })
    .join("\n");
}

/*
 * Generate a normal text version from the
 * overview. This lets your existing API
 * continue receiving "description" even
 * though the Short Description field is no
 * longer shown in the form.
 */
function contentBlocksToPlainText(
  blocks: ContentBlock[],
): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
        case "paragraph":
        case "callout":
          return block.text;

        case "image":
          return (
            block.caption ||
            block.alt ||
            ""
          );

        case "list":
          return block.items.join(
            ". ",
          );

        case "table":
          return [
            ...block.headers,
            ...block.rows.flat(),
          ].join(". ");

        case "video":
          return [
            block.title,
            block.duration,
          ]
            .filter(Boolean)
            .join(" ");

        case "code":
          return block.code;

        default:
          return "";
      }
    })
    .filter(Boolean)
    .join(" ")
    .trim();
}

function escapeHtml(
  value: string,
): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll(
      "'",
      "&#039;",
    );
}