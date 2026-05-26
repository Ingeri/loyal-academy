import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { checkAdminAccess } from "@/lib/actions/admin";
import { deleteBlogReview } from "@/lib/actions/admin/blogs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2, MessageSquare, Star, Calendar } from "lucide-react";

async function deleteReviewAction(formData: FormData) {
  "use server";

  await checkAdminAccess();

  const reviewId = formData.get("reviewId") as string;
  const blogId = formData.get("blogId") as string;

  if (!reviewId || !blogId) {
    throw new Error("Missing required fields");
  }

  await deleteBlogReview(reviewId);

  redirect(`/admin/blogs/${blogId}/reviews`);
}

type Props = { params: Promise<{ id?: string }> };

export default async function BlogReviewsPage({ params }: Props) {
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
    select: {
      id: true,
      title: true,
      avgRating: true,
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

  const reviews = await prisma.blogReview.findMany({
    where: { blogId: id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reviews</h1>
          <p className="mt-1 text-muted-foreground">
            Manage reviews for: {blog.title}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/blogs/${id}/preview`}>
            <Button variant="outline" className="gap-2">
              Preview Blog
            </Button>
          </Link>
          <Link href="/admin/blogs">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Blogs
            </Button>
          </Link>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Reviews ({reviews.length})</h2>
            <div className="flex items-center gap-2 mt-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-2xl font-bold">{blog.avgRating.toFixed(1)}</span>
              <span className="text-muted-foreground">average rating</span>
            </div>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <Badge variant="outline">
                        {review.reviewerName || "Anonymous"}
                      </Badge>
                      {review.reviewerEmail && (
                        <span className="text-sm text-muted-foreground">
                          {review.reviewerEmail}
                        </span>
                      )}
                    </div>
                    {review.comment && (
                      <p className="text-sm mt-2">{review.comment}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <form action={deleteReviewAction}>
                    <input type="hidden" name="reviewId" value={review.id} />
                    <input type="hidden" name="blogId" value={id} />
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-dashed border-2">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-6">No reviews yet for this blog.</p>
          </Card>
        )}
      </Card>
    </div>
  );
}
