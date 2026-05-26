"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, PenTool } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { approveBlog, deleteBlog } from "@/lib/actions/admin/blogs";
import { useRouter } from "next/navigation";
import BlogActionsDropdown from "./blog-actions-dropdown";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface Blog {
  id: string;
  title: string;
  slug: string;
  description: string;
  published: boolean;
  authorName: string;
  readTime: number;
  blogCategory: { id: string; name: string } | null;
  _count: { blogReviews: number };
}

interface BlogListProps {
  initialBlogs: Blog[];
}

export default function BlogList({ initialBlogs }: BlogListProps) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const router = useRouter();
  const { toast } = useToast();

  async function handlePublish(blogId: string) {
    // Optimistic update
    setBlogs((prev) =>
      prev.map((blog) =>
        blog.id === blogId ? { ...blog, published: true } : blog
      )
    );

    try {
      await approveBlog(blogId);
      toast({
        title: "Blog published successfully",
        description: "The blog is now visible to users.",
      });
    } catch (error) {
      console.error("Error publishing blog:", error);
      // Revert on error
      setBlogs((prev) =>
        prev.map((blog) =>
          blog.id === blogId ? { ...blog, published: false } : blog
        )
      );
      toast({
        title: "Error publishing blog",
        description: "There was a problem publishing the blog. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function handleDelete(blogId: string) {
    // Optimistic update
    setBlogs((prev) => prev.filter((blog) => blog.id !== blogId));

    try {
      await deleteBlog(blogId);
      toast({
        title: "Blog deleted successfully",
        description: "The blog has been removed.",
      });
    } catch (error) {
      console.error("Error deleting blog:", error);
      // Revert on error by refetching
      router.refresh();
      toast({
        title: "Error deleting blog",
        description: "There was a problem deleting the blog. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (blogs.length === 0) {
    return (
      <Card className="p-12 text-center">
        <PenTool className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-6">No blogs yet.</p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {blogs.map((blog) => (
          <Card key={blog.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Blog Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{blog.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {blog.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <Badge variant={blog.published ? "default" : "secondary"}>
                    {blog.published ? (
                      <>
                        <Eye className="h-3 w-3 mr-1" /> Published
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3 mr-1" /> Draft
                      </>
                    )}
                  </Badge>
                  {blog.blogCategory && (
                    <Badge variant="outline">{blog.blogCategory.name}</Badge>
                  )}
                  <span className="text-sm text-muted-foreground">
                    by {blog.authorName}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {blog.readTime} min read
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {blog._count.blogReviews} reviews
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 lg:justify-end">
                <Link href={`/blog/${blog.slug}`} target="_blank">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                </Link>
                {!blog.published && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handlePublish(blog.id)}
                  >
                    <Eye className="h-4 w-4" />
                    Publish
                  </Button>
                )}
                <BlogActionsDropdown
                  blogId={blog.id}
                  blogSlug={blog.slug}
                  onDelete={() => handleDelete(blog.id)}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Toaster />
    </>
  );
}
