import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Star } from "lucide-react";
import { approveQuote, rejectQuote, toggleFeaturedQuote } from "./actions";

export const dynamic = "force-dynamic";

// NOTE: This page assumes it sits behind your existing admin auth
// (e.g. checked in middleware.ts or a layout for /admin). Add a session/role
// check here too if your other /admin pages do so individually.

async function getQuotes() {
  const [pending, approved, rejected] = await Promise.all([
    prisma.quote.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
    }),
    prisma.quote.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.quote.findMany({
      where: { status: "REJECTED" },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { pending, approved, rejected };
}

export default async function AdminQuotesPage() {
  const { pending, approved, rejected } = await getQuotes();

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          Quote Submissions
        </h1>
        <p className="mb-10 text-muted-foreground">
          Review member-submitted quotes before they go live.
        </p>

        {/* PENDING */}
        <section className="mb-14">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Pending ({pending.length})
          </h2>

          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No pending submissions.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {pending.map((quote) => (
                <Card key={quote.id} className="p-6">
                  <p className="italic text-foreground">
                    &ldquo;{quote.content}&rdquo;
                  </p>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    {quote.authorName}
                    {quote.authorRole && (
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        &middot; {quote.authorRole}
                      </span>
                    )}
                  </p>

                  <div className="mt-5 flex gap-3">
                    <form action={approveQuote.bind(null, quote.id)}>
                      <Button
                        type="submit"
                        size="sm"
                        className="gap-1 bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4" /> Approve
                      </Button>
                    </form>

                    <form action={rejectQuote.bind(null, quote.id)}>
                      <Button
                        type="submit"
                        size="sm"
                        variant="outline"
                        className="gap-1 text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" /> Reject
                      </Button>
                    </form>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* APPROVED */}
        <section className="mb-14">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Approved ({approved.length})
          </h2>

          {approved.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No approved quotes yet.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {approved.map((quote) => (
                <Card key={quote.id} className="p-6">
                  <p className="italic text-foreground">
                    &ldquo;{quote.content}&rdquo;
                  </p>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    {quote.authorName}
                    {quote.authorRole && (
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        &middot; {quote.authorRole}
                      </span>
                    )}
                  </p>

                  <form
                    action={toggleFeaturedQuote.bind(
                      null,
                      quote.id,
                      !quote.featured
                    )}
                    className="mt-5"
                  >
                    <Button
                      type="submit"
                      size="sm"
                      variant={quote.featured ? "default" : "outline"}
                      className="gap-1"
                    >
                      <Star className="h-4 w-4" />
                      {quote.featured ? "Featured on Home" : "Feature on Home"}
                    </Button>
                  </form>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* REJECTED */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Rejected ({rejected.length})
          </h2>

          {rejected.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No rejected submissions.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {rejected.map((quote) => (
                <Card key={quote.id} className="p-6 opacity-60">
                  <p className="italic text-foreground">
                    &ldquo;{quote.content}&rdquo;
                  </p>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    {quote.authorName}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}