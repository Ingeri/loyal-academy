import { getBlogs } from '@/lib/actions/admin/blogs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import BlogFilters from '@/components/admin/blog-filters';
import BlogList from '@/components/admin/blog-list';

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; published?: string }>;
}) {
  const params = await searchParams;
  const publishedFilter = params.published === 'true' ? true : params.published === 'false' ? false : undefined;
  const blogs = await getBlogs(params.q, params.category, publishedFilter);

  const categories = await prisma.blogCategory.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Blogs</h1>
          <p className='mt-1 text-muted-foreground'>Manage all blog posts</p>
        </div>
        <Link href='/admin/blogs/new'>
          <Button className='gap-2'>
            <Plus className='h-4 w-4' /> Create Blog
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <Card className='p-4'>
        <BlogFilters categories={categories} />
      </Card>

      {/* Blogs Grid */}
      <BlogList initialBlogs={blogs} />
    </div>
  );
}
