import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { checkAdminAccess } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  User,
  Calendar,
  Clock,
  Star,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

type Props = { params: Promise<{ id?: string }> };

type ContentBlock =
  | { type: "heading"; text: string; level: 1 | 2 | 3 | 4 | 5 | 6 }
  | { type: "paragraph"; text: string }
  | { type: "image"; url: string; alt: string; caption?: string }
  | { type: "list"; items: string[]; ordered: boolean }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "video"; url: string; title: string; duration: string }
  | { type: "code"; code: string; language: string }
  | { type: "callout"; text: string; intent: "warning" | "info" };

function renderContent(content: ContentBlock[] | any) {
  if (!content || !Array.isArray(content)) {
    return <p className="text-muted-foreground">No content available.</p>;
  }

  return content.map((block, index) => {
    switch (block.type) {
      case "heading":
        const level = block.level;
        if (level === 1) return <h1 key={index} className="font-bold mt-6 mb-3 text-3xl">{block.text}</h1>;
        if (level === 2) return <h2 key={index} className="font-bold mt-6 mb-3 text-2xl">{block.text}</h2>;
        if (level === 3) return <h3 key={index} className="font-bold mt-6 mb-3 text-xl">{block.text}</h3>;
        if (level === 4) return <h4 key={index} className="font-bold mt-6 mb-3 text-lg">{block.text}</h4>;
        if (level === 5) return <h5 key={index} className="font-bold mt-6 mb-3 text-base">{block.text}</h5>;
        return <h6 key={index} className="font-bold mt-6 mb-3 text-sm">{block.text}</h6>;
      case "paragraph":
        return <p key={index} className="mb-4">{block.text}</p>;
      case "image":
        return (
          <div key={index} className="my-6">
            <img src={block.url} alt={block.alt} className="w-full rounded-lg" />
            {block.caption && <p className="text-sm text-muted-foreground mt-2 text-center">{block.caption}</p>}
          </div>
        );
      case "list":
        if (block.ordered) {
          return (
            <ol key={index} className="list-decimal list-inside mb-4 space-y-1">
              {block.items.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          );
        }
        return (
          <ul key={index} className="list-disc list-inside mb-4 space-y-1">
            {block.items.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      case "table":
        return (
          <div key={index} className="my-6 overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr>
                  {block.headers.map((header: string, i: number) => (
                    <th key={i} className="border px-4 py-2 bg-muted">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex}>
                    {row.map((cell: string, cellIndex: number) => (
                      <td key={cellIndex} className="border px-4 py-2">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "video":
        return (
          <div key={index} className="my-6">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Video: {block.title} ({block.duration})</p>
            </div>
          </div>
        );
      case "code":
        return (
          <div key={index} className="my-6">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{block.code}</code>
            </pre>
            <p className="text-xs text-muted-foreground mt-1">Language: {block.language}</p>
          </div>
        );
      case "callout":
        return (
          <div key={index} className={`my-6 p-4 rounded-lg border ${block.intent === "warning" ? "bg-yellow-50 border-yellow-200" : "bg-blue-50 border-blue-200"}`}>
            <p className="font-semibold">{block.intent === "warning" ? "⚠️" : "ℹ️"} {block.text}</p>
          </div>
        );
      default:
        return null;
    }
  });
}

export default async function AdminBlogPreviewPage({ params }: Props) {
  await checkAdminAccess();

  const resolved = await params;
  const id = resolved?.id;

  if (!id) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold">Blog not found</h1>
        <p className="mt-2 text-muted-foreground">
          Blog ID is missing from the URL.
        </p>
        <Link href="/admin/blogs">
          <Button className="mt-6">Back to Blogs</Button>
        </Link>
      </div>
    );
  }

  const blog = await prisma.blog.findUnique({
    where: { id },
    include: {
      blogCategory: true,
      blogFaqs: {
        orderBy: { createdAt: "asc" },
      },
      blogReviews: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold">Blog not found</h1>
        <p className="mt-2 text-muted-foreground">
          The requested blog does not exist.
        </p>
        <Link href="/admin/blogs">
          <Button className="mt-6">Back to Blogs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{blog.title}</h1>
          <p className="mt-1 text-muted-foreground">
            Admin preview for this blog. This view bypasses public publish
            restrictions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/blog/${blog.slug}`} target="_blank">
            <Button variant="outline" className="gap-2">
              <Eye className="h-4 w-4" /> View Live
            </Button>
          </Link>
          <Link href="/admin/blogs">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to blogs
            </Button>
          </Link>
        </div>
      </div>

      {/* Blog Overview */}
      <Card className="p-6 space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant={blog.published ? "default" : "secondary"}>
              {blog.published ? (
                <>
                  <Eye className="inline h-4 w-4 mr-1" /> Published
                </>
              ) : (
                <>
                  <EyeOff className="inline h-4 w-4 mr-1" /> Draft
                </>
              )}
            </Badge>
            {blog.blogCategory && (
              <Badge variant="outline">{blog.blogCategory.name}</Badge>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{blog.authorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{blog.readTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{blog.avgRating.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-muted-foreground">{blog.description}</p>

          {blog.thumbnail && (
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Content</h2>
          <div className="prose prose-sm max-w-none">
            {renderContent(blog.content)}
          </div>
        </div>
      </Card>

      {/* FAQs */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <HelpCircle className="h-5 w-5" /> FAQs
        </h2>
        {blog.blogFaqs.length > 0 ? (
          <div className="space-y-3">
            {blog.blogFaqs.map((faq) => (
              <div key={faq.id} className="border border-muted rounded-lg p-4">
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="text-sm text-muted-foreground mt-1">{faq.answer}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No FAQs found for this blog.</p>
        )}
      </Card>

      {/* Reviews */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" /> Reviews
        </h2>
        {blog.blogReviews.length > 0 ? (
          <div className="space-y-4">
            {blog.blogReviews.map((review) => (
              <div key={review.id} className="border border-muted rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {review.reviewerName || "Anonymous"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && <p className="text-sm">{review.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No reviews found for this blog.</p>
        )}
      </Card>
    </div>
  );
}
