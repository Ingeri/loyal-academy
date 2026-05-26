import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { checkAdminAccess } from "@/lib/actions/admin";
import { createBlogFaq, updateBlogFaq, deleteBlogFaq } from "@/lib/actions/admin/blogs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Edit, Trash2, HelpCircle } from "lucide-react";

async function createFaqAction(formData: FormData) {
  "use server";

  await checkAdminAccess();

  const blogId = formData.get("blogId") as string;
  const question = formData.get("question") as string;
  const answer = formData.get("answer") as string;

  if (!question || !answer || !blogId) {
    throw new Error("Missing required fields");
  }

  await createBlogFaq({ question, answer, blogId });

  redirect(`/admin/blogs/${blogId}/faqs`);
}

async function updateFaqAction(formData: FormData) {
  "use server";

  await checkAdminAccess();

  const faqId = formData.get("faqId") as string;
  const blogId = formData.get("blogId") as string;
  const question = formData.get("question") as string;
  const answer = formData.get("answer") as string;

  if (!question || !answer || !faqId) {
    throw new Error("Missing required fields");
  }

  await updateBlogFaq(faqId, { question, answer });

  redirect(`/admin/blogs/${blogId}/faqs`);
}

async function deleteFaqAction(formData: FormData) {
  "use server";

  await checkAdminAccess();

  const faqId = formData.get("faqId") as string;
  const blogId = formData.get("blogId") as string;

  if (!faqId || !blogId) {
    throw new Error("Missing required fields");
  }

  await deleteBlogFaq(faqId);

  redirect(`/admin/blogs/${blogId}/faqs`);
}

type Props = { params: Promise<{ id?: string }> };

export default async function BlogFaqsPage({ params }: Props) {
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

  const faqs = await prisma.blogFaq.findMany({
    where: { blogId: id },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">FAQs</h1>
          <p className="mt-1 text-muted-foreground">
            Manage FAQs for: {blog.title}
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
          <h2 className="text-xl font-semibold">FAQs ({faqs.length})</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add FAQ
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New FAQ</DialogTitle>
                <DialogDescription>Add a new FAQ to this blog.</DialogDescription>
              </DialogHeader>
              <form action={createFaqAction}>
                <input type="hidden" name="blogId" value={id} />
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="question">Question</Label>
                    <Input id="question" name="question" placeholder="FAQ question" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="answer">Answer</Label>
                    <Textarea id="answer" name="answer" placeholder="FAQ answer" required rows={3} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {faqs.length > 0 ? (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{faq.answer}</p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit FAQ</DialogTitle>
                          <DialogDescription>Update FAQ details.</DialogDescription>
                        </DialogHeader>
                        <form action={updateFaqAction}>
                          <input type="hidden" name="faqId" value={faq.id} />
                          <input type="hidden" name="blogId" value={id} />
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-question">Question</Label>
                              <Input id="edit-question" name="question" defaultValue={faq.question} required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-answer">Answer</Label>
                              <Textarea id="edit-answer" name="answer" defaultValue={faq.answer} required rows={3} />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Update</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <form action={deleteFaqAction}>
                      <input type="hidden" name="faqId" value={faq.id} />
                      <input type="hidden" name="blogId" value={id} />
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-dashed border-2">
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-6">No FAQs yet. Add your first FAQ.</p>
          </Card>
        )}
      </Card>
    </div>
  );
}
