import { getBlogCategories, deleteBlogCategory } from '@/lib/actions/admin/categories';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, FolderTree } from 'lucide-react';
import CreateCategoryDialog from '@/components/admin/create-category-dialog';
import EditCategoryDialog from '@/components/admin/edit-category-dialog';

async function BlogCategoriesPage() {
  const categories = await getBlogCategories();

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Blog Categories</h1>
          <p className='mt-1 text-muted-foreground'>Manage blog categories</p>
        </div>
        <CreateCategoryDialog />
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {categories.map((category) => (
            <Card key={category.id} className='p-6 hover:shadow-md transition-shadow'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex items-center gap-3'>
                  <div className='h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                    <FolderTree className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-foreground'>{category.name}</h3>
                    <p className='text-sm text-muted-foreground'>{category.slug}</p>
                  </div>
                </div>
                <Badge variant='outline'>{category._count.blogs} blogs</Badge>
              </div>
              <div className='flex items-center gap-2 mt-4 pt-4 border-t'>
                <EditCategoryDialog
                  categoryId={category.id}
                  categoryName={category.name}
                  categorySlug={category.slug}
                />
                <form action={async () => {
                  'use server';
                  await deleteBlogCategory(category.id);
                }}>
                  <Button variant='outline' size='sm' className='text-destructive hover:text-destructive hover:bg-destructive/10'>
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className='p-12 text-center'>
          <FolderTree className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <p className='text-muted-foreground mb-6'>No blog categories yet. Create your first category.</p>
        </Card>
      )}
    </div>
  );
}

export default BlogCategoriesPage;
