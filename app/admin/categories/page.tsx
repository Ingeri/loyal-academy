import { getCourseCategories, createCourseCategory, updateCourseCategory, deleteCourseCategory } from '@/lib/actions/admin/categories';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

async function CategoriesPage() {
  const categories = await getCourseCategories();

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Course Categories</h1>
          <p className='mt-1 text-muted-foreground'>Manage course categories</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className='gap-2'>
              <Plus className='h-4 w-4' />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Category</DialogTitle>
              <DialogDescription>Add a new course category to your platform.</DialogDescription>
            </DialogHeader>
            <form action={async (formData) => {
              'use server';
              const name = formData.get('name') as string;
              const slug = formData.get('slug') as string;
              await createCourseCategory({ name, slug });
            }}>
              <div className='space-y-4 py-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Name</Label>
                  <Input id='name' name='name' placeholder='Category name' required />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='slug'>Slug</Label>
                  <Input id='slug' name='slug' placeholder='category-slug' required />
                </div>
              </div>
              <DialogFooter>
                <Button type='submit'>Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
                <Badge variant='outline'>{category._count.courses} courses</Badge>
              </div>
              <div className='flex items-center gap-2 mt-4 pt-4 border-t'>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant='outline' size='sm' className='flex-1 gap-2'>
                      <Edit className='h-4 w-4' />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Category</DialogTitle>
                      <DialogDescription>Update category details.</DialogDescription>
                    </DialogHeader>
                    <form action={async (formData) => {
                      'use server';
                      const name = formData.get('name') as string;
                      const slug = formData.get('slug') as string;
                      await updateCourseCategory(category.id, { name, slug });
                    }}>
                      <div className='space-y-4 py-4'>
                        <div className='space-y-2'>
                          <Label htmlFor='edit-name'>Name</Label>
                          <Input id='edit-name' name='name' defaultValue={category.name} required />
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='edit-slug'>Slug</Label>
                          <Input id='edit-slug' name='slug' defaultValue={category.slug} required />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type='submit'>Update</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <form action={async () => {
                  'use server';
                  await deleteCourseCategory(category.id);
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
          <p className='text-muted-foreground mb-6'>No categories yet. Create your first category.</p>
        </Card>
      )}
    </div>
  );
}

export default CategoriesPage;
