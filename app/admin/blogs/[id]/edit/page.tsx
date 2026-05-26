import { prisma } from "@/lib/prisma";
import { checkAdminAccess } from "@/lib/actions/admin";
import EditBlogForm from "./edit-blog-form";

type Props = { params: Promise<{ id?: string }> };

export default async function EditBlogPage({ params }: Props) {
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
      </div>
    );
  }

  const blog = await prisma.blog.findUnique({
    where: { id },
    include: {
      blogCategory: true,
    },
  });

  const categories = await prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
  });

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold">Blog not found</h1>
        <p className="mt-2 text-muted-foreground">
          The requested blog does not exist.
        </p>
      </div>
    );
  }

  return <EditBlogForm blog={blog} categories={categories} />;
}
