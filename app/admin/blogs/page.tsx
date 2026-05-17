import { getBlogs, updateBlog, deleteBlog, approveBlog, deleteBlogReview } from '@/lib/actions/admin/blogs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Edit, Trash2, Eye, EyeOff, MoreVertical, PenTool } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; published?: string }>;
}) {
  const params = await searchParams;
  const blogs = await getBlogs(params.q, params.category, params.published === 'true');

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Blogs</h1>
          <p className='mt-1 text-muted-foreground'>Manage all blog posts</p>
        </div>
      </div>

      {/* Search & Filters */}
      <Card className='p-4'>
        <div className='flex flex-col sm:flex-row gap-4'>
          <form method='get' className='flex-1'>
            <div className='relative'>
              <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                name='q'
                placeholder='Search by title or slug...'
                defaultValue={params.q || ''}
                className='pl-9'
              />
            </div>
          </form>
          <form method='get' className='flex gap-2'>
            <Select name='published' defaultValue={params.published || 'all'}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='true'>Published</SelectItem>
                <SelectItem value='false'>Draft</SelectItem>
              </SelectContent>
            </Select>
            <Button type='submit' variant='outline'>
              Apply
            </Button>
          </form>
        </div>
      </Card>

      {/* Blogs Grid */}
      {blogs.length > 0 ? (
        <div className='grid gap-4'>
          {blogs.map((blog) => (
            <Card key={blog.id} className='p-6 hover:shadow-md transition-shadow'>
              <div className='flex flex-col lg:flex-row lg:items-center gap-4'>
                {/* Blog Info */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <h3 className='font-semibold text-foreground text-lg'>{blog.title}</h3>
                      <p className='text-sm text-muted-foreground mt-1 line-clamp-2'>
                        {blog.description}
                      </p>
                    </div>
                  </div>

                  <div className='flex flex-wrap items-center gap-3 mt-3'>
                    <Badge variant={blog.published ? 'default' : 'secondary'}>
                      {blog.published ? (
                        <><Eye className='h-3 w-3 mr-1' /> Published</>
                      ) : (
                        <><EyeOff className='h-3 w-3 mr-1' /> Draft</>
                      )}
                    </Badge>
                    {blog.blogCategory && (
                      <Badge variant='outline'>{blog.blogCategory.name}</Badge>
                    )}
                    <span className='text-sm text-muted-foreground'>
                      by {blog.authorName}
                    </span>
                    <span className='text-sm text-muted-foreground'>
                      {blog.readTime} min read
                    </span>
                    <span className='text-sm text-muted-foreground'>
                      {blog._count.blogReviews} reviews
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-2 lg:justify-end'>
                  <Link href={`/blog/${blog.slug}`} target='_blank'>
                    <Button variant='outline' size='sm' className='gap-2'>
                      <Eye className='h-4 w-4' />
                      Preview
                    </Button>
                  </Link>
                  {!blog.published && (
                    <form action={async () => {
                      'use server';
                      await approveBlog(blog.id);
                    }}>
                      <Button variant='outline' size='sm' className='gap-2'>
                        <Eye className='h-4 w-4' />
                        Publish
                      </Button>
                    </form>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon'>
                        <MoreVertical className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/blogs/${blog.id}/edit`}>
                          <Edit className='h-4 w-4 mr-2' />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <form action={async () => {
                          'use server';
                          await deleteBlog(blog.id);
                        }}>
                          <button type='submit' className='flex items-center text-destructive'>
                            <Trash2 className='h-4 w-4 mr-2' />
                            Delete
                          </button>
                        </form>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className='p-12 text-center'>
          <PenTool className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <p className='text-muted-foreground mb-6'>
            {params.q || params.published ? 'No blogs found matching your filters.' : 'No blogs yet.'}
          </p>
        </Card>
      )}
    </div>
  );
}
