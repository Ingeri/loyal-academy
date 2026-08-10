import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Quote as QuoteIcon } from "lucide-react";
import { submitQuote } from "./actions";

export const metadata = {
  title: "Submit a Quote | LOYAL Leadership Institute",
  description:
    "Share your leadership insight or reflection as a member of LOYAL Leadership Institute.",
};

export default function SubmitQuotePage() {
  return (
    <main className="min-h-screen bg-[#faf8f3] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <QuoteIcon className="mx-auto mb-4 h-10 w-10 text-accent" />
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-accent">
            Member Quotes
          </p>
          <h1 className="font-serif text-4xl font-bold text-primary md:text-5xl">
            Share Your <span className="italic text-accent">Insight</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-700">
            As a member of LOYAL Leadership Institute, share a quote,
            reflection, or piece of wisdom. Submissions are reviewed before
            they appear on the site.
          </p>
        </div>

        <Card className="rounded-3xl bg-white p-8 shadow-xl">
          <form
            action={submitQuote}
            className="space-y-6"
            encType="multipart/form-data"
          >
            <div>
              <Label htmlFor="authorName">Full Name</Label>
              <Input
                id="authorName"
                name="authorName"
                required
                maxLength={100}
                placeholder="e.g. Jane Uwase"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="authorRole">Role / Title (optional)</Label>
              <Input
                id="authorRole"
                name="authorRole"
                maxLength={100}
                placeholder="e.g. Alumni, Instructor, Student"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="image">Your Photo (optional)</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="mt-2"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Upload a photo of yourself. If left blank, your initials will
                be shown instead.
              </p>
            </div>

            <div>
              <Label htmlFor="content">Your Quote</Label>
              <Textarea
                id="content"
                name="content"
                required
                maxLength={600}
                rows={5}
                placeholder="Share your leadership insight..."
                className="mt-2"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Max 600 characters.
              </p>
            </div>

            <Button type="submit" className="w-full py-6 text-base font-semibold">
              Submit for Review
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}