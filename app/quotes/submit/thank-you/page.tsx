import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Thank You | LOYAL Leadership Institute",
};

export default function ThankYouPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf8f3] px-4 py-24">
      <Card className="max-w-lg rounded-3xl bg-white p-10 text-center shadow-xl">
        <CheckCircle2 className="mx-auto mb-5 h-14 w-14 text-accent" />
        <h1 className="font-serif text-3xl font-bold text-primary">
          Thank You!
        </h1>
        <p className="mt-4 text-slate-700">
          Your quote has been submitted and is awaiting review. Once
          approved, it may be featured on our Quotes page and homepage.
        </p>
        <Button asChild className="mt-8 rounded-xl px-8 py-6">
          <Link href="/">
            Back to Home <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </Card>
    </main>
  );
}