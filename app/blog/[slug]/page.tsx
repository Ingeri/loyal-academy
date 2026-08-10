import { getBlogBySlug } from "../actions";
import { notFound } from "next/navigation";
import { Calendar, User, Clock, Star, HelpCircle } from "lucide-react";
import BlogReviewForm from "@/components/ui/blog-review-form";
import ContentRenderer from "@/components/ui/content-renderer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Next.js 15 requires params to be a Promise
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: PageProps) {
  // 1. Await params before using the slug (Required for Next.js 15)
  const { slug } = await params;

  // 2. Fetch data using the slug
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background pt-20">

      {/* Hero Header */}
      <header className="relative h-[60vh] min-h-[400px] w-full">
        <img
          src={blog.thumbnail || ""}
          alt={blog.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
          <div className="max-w-4xl px-4 text-center">
            <span className="text-primary font-bold uppercase tracking-widest text-sm bg-primary/10 px-4 py-2 rounded-full backdrop-blur-md border border-primary/20">
              {blog.blogCategory?.name}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-6 mb-6 leading-tight">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-300 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span>{blog.authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{blog.readTime} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-white font-bold">
                  {blog.avgRating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
          {/* Passing JSON content from DB to your renderer */}
          <ContentRenderer content={blog.content} />
        </div>

        <hr className="my-16 border-muted" />

        {/* NEW SECTION: REVIEW FORM */}
        <BlogReviewForm blogId={blog.id} />

        {/* FAQs Section - Using the data we imported via CSV */}
        {blog.blogFaqs && blog.blogFaqs.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {blog.blogFaqs.map((faq: any, index: number) => (
                <AccordionItem key={faq.id || index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        {/* Reviews Section */}
        {blog.blogReviews && blog.blogReviews.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8">Reader Reviews</h2>
            <div className="grid gap-6">
              {blog.blogReviews.map((review: any) => (
                <div
                  key={review.id}
                  className="p-6 rounded-2xl bg-muted/30 border border-muted"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary uppercase">
                        {review.reviewerName?.charAt(0) || "G"}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">
                          {review.reviewerName || "Guest Reader"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>

    </main>
  );
}
