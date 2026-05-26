import { prisma } from "@/lib/prisma";
import { checkAdminAccess } from "@/lib/actions/admin";
import NewBlogForm from "./new-blog-form";

export default async function NewBlogPage() {
  await checkAdminAccess();

  const categories = await prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
  });

  return <NewBlogForm categories={categories} />;
}
