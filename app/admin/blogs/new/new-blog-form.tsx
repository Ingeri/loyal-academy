"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { createBlog } from "@/lib/actions/admin/blogs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import RichTextEditor from "@/components/instructor/rich-text-editor";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

type ContentBlock =
  | { type: "heading"; text: string; level: 1 | 2 | 3 | 4 | 5 | 6 }
  | { type: "paragraph"; text: string }
  | { type: "image"; url: string; alt: string; caption?: string }
  | { type: "list"; items: string[]; ordered: boolean }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "video"; url: string; title: string; duration: string }
  | { type: "code"; code: string; language: string }
  | { type: "callout"; text: string; intent: "warning" | "info" };

interface NewBlogFormProps {
  categories: Array<{ id: string; name: string; slug: string }>;
}

export default function NewBlogForm({ categories }: NewBlogFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState<ContentBlock[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [readTime, setReadTime] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [blogCategoryId, setBlogCategoryId] = useState("");
  const [published, setPublished] = useState(false);
  const [avgRating, setAvgRating] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createBlog({
        title,
        description,
        content,
        authorName,
        readTime: parseInt(readTime),
        thumbnail: thumbnail || undefined,
        blogCategoryId,
        published,
        avgRating: avgRating ? parseFloat(avgRating) : undefined,
      });
      toast({
        title: "Blog created successfully",
        description: `"${title}" has been created.`,
      });
      setTimeout(() => {
        redirect("/admin/blogs");
      }, 1000);
    } catch (error) {
      console.error("Error creating blog:", error);
      toast({
        title: "Error creating blog",
        description: "There was a problem creating the blog. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Create New Blog</h1>
            <p className="mt-1 text-muted-foreground">
              Create a new blog post for the platform
            </p>
          </div>
          <Link href="/admin/blogs">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Blogs
            </Button>
          </Link>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Blog post title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the blog post"
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Content *</Label>
              <RichTextEditor value={content} onChange={setContent} />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="authorName">Author Name *</Label>
                <Input
                  id="authorName"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Author name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="readTime">Read Time (minutes) *</Label>
                <Input
                  id="readTime"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  type="number"
                  placeholder="5"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL (optional)</Label>
              <Input
                id="thumbnail"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blogCategoryId">Category *</Label>
              <Select value={blogCategoryId} onValueChange={setBlogCategoryId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avgRating">Average Rating (optional)</Label>
              <Input
                id="avgRating"
                value={avgRating}
                onChange={(e) => setAvgRating(e.target.value)}
                type="number"
                step="0.1"
                min="0"
                max="5"
                placeholder="4.5"
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="published"
                checked={published}
                onCheckedChange={setPublished}
              />
              <Label htmlFor="published">Publish immediately</Label>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Blog"}
            </Button>
          </form>
        </Card>
      </div>
      <Toaster />
    </>
  );
}
