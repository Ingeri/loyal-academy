"use client";

import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitBlogReview } from "@/app/blog/actions";
import { toast } from "sonner"; // or your preferred toast lib

export default function BlogReviewForm({ blogId }: { blogId: string }) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      blogId,
      rating,
      comment: formData.get("comment") as string,
      reviewerName: formData.get("name") as string,
      reviewerEmail: formData.get("email") as string,
    };

    const result = await submitBlogReview(data);

    if (result.success) {
      toast.success("Thank you for your review!");
      (e.target as HTMLFormElement).reset();
      setRating(5);
    } else {
      toast.error("Something went wrong.");
    }
    setIsSubmitting(false);
  }

  return (
    <section className="bg-card border border-primary/10 rounded-3xl p-8 mb-16 shadow-sm">
      <h3 className="text-2xl font-bold mb-2">Rate this Masterclass</h3>
      <p className="text-muted-foreground mb-6">
        Your feedback helps us improve our academy content.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform hover:scale-110"
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              <Star
                className={`h-8 w-8 ${
                  star <= (hover || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="name"
            placeholder="Your Name"
            required
            className="bg-background"
          />
          <Input
            name="email"
            type="email"
            placeholder="Your Email"
            required
            className="bg-background"
          />
        </div>

        <Textarea
          name="comment"
          placeholder="What did you learn? (Optional)"
          rows={4}
          className="bg-background"
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto gap-2"
        >
          {isSubmitting ? "Submitting..." : "Post Review"}
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </section>
  );
}
