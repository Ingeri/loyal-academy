import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Quote as QuoteIcon, ArrowRight, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quotes | LOYAL Leadership Institute",
  description:
    "Insights and reflections shared by members of LOYAL Leadership Institute.",
};

async function getApprovedQuotes() {
  return prisma.quote.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
  });
}

export default async function QuotesPage() {
  const quotes = await getApprovedQuotes();

  return (
    <main className="min-h-screen bg-[#faf8f3] px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col items-center text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-accent">
            Member Voices
          </p>
          <h1 className="font-serif text-4xl font-bold text-primary md:text-5xl">
            Quotes from Our{" "}
            <span className="italic text-accent">Community</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-700">
            Reflections and insights shared by members, instructors, and
            alumni of LOYAL Leadership Institute.
          </p>

          <Button asChild className="mt-8 gap-2 rounded-xl px-8 py-6">
            <Link href="/quotes/submit">
              <Plus className="h-5 w-5" /> Share Your Quote
            </Link>
          </Button>
        </div>

        {quotes.length === 0 ? (
          <p className="text-center text-slate-600">
            No quotes have been published yet. Be the first to share one!
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {quotes.map((quote) => (
              <Card
                key={quote.id}
                className="flex flex-col rounded-3xl bg-white p-8 shadow-lg"
              >
                <QuoteIcon className="mb-5 h-8 w-8 text-accent" />
                <p className="flex-1 text-lg italic leading-8 text-slate-700">
                  &ldquo;{quote.content}&rdquo;
                </p>
                <div className="mt-6 border-t border-muted pt-4">
                  <p className="font-serif font-bold text-primary">
                    {quote.authorName}
                  </p>
                  {quote.authorRole && (
                    <p className="text-sm text-accent">{quote.authorRole}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-14 text-center">
          <Link
            href="/"
            className="inline-flex items-center font-semibold text-accent"
          >
            Back to Home <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}