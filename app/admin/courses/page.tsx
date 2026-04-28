import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Search, Filter, Eye, EyeOff, MoreHorizontal } from 'lucide-react';

async function getCourses(searchQuery?: string) {
  const supabase = await createClient();
  let query = supabase
    .from('courses')
    .select('*, instructor:instructor_id(full_name)')
    .order('created_at', { ascending: false });

  if (searchQuery) {
    query = query.or(	itle.ilike.%%,description.ilike.%%);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching courses:', error);
    return [];
  }

  return data || [];
}

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const courses = await getCourses(params.q);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Courses</h1>
          <p className='mt-1 text-muted-foreground'>Manage all your courses from one place</p>
        </div>
        <Link href='/admin/courses/new'>
          <Button className='gap-2'>
            <Plus className='h-4 w-4' />
            New Course
          </Button>
        </Link>
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
                placeholder='Search courses...'
                defaultValue={params.q || ''}
                className='pl-9'
              />
            </div>
          </form>
          <Button variant='outline' className='gap-2'>
            <Filter className='h-4 w-4' />
            Filters
          </Button>
        </div>
      </Card>

      {/* Courses Grid */}
      {courses.length > 0 ? (
        <div className='grid gap-4'>
          {courses.map((course: any) => (
            <Card key={course.id} className='p-6 hover:shadow-md transition-shadow'>
              <div className='flex flex-col lg:flex-row lg:items-center gap-4'>
                {/* Course Info */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <h3 className='font-semibold text-foreground text-lg'>{course.title}</h3>
                      <p className='text-sm text-muted-foreground mt-1 line-clamp-2'>
                        {course.description}
                      </p>
                    </div>
                  </div>

                  <div className='flex flex-wrap items-center gap-3 mt-3'>
                    <Badge variant={course.is_published ? 'default' : 'secondary'}>
                      {course.is_published ? (
                        <><Eye className='h-3 w-3 mr-1' /> Published</>
                      ) : (
                        <><EyeOff className='h-3 w-3 mr-1' /> Draft</>
                      )}
                    </Badge>
                    {course.category && (
                      <Badge variant='outline'>{course.category}</Badge>
                    )}
                    {course.level && (
                      <Badge variant='outline' className='capitalize'>{course.level}</Badge>
                    )}
                    <span className='text-sm text-muted-foreground'>
                      
                    </span>
                    <span className='text-sm text-muted-foreground'>
                      {course.total_students || 0} students
                    </span>
                    {course.instructor?.full_name && (
                      <span className='text-sm text-muted-foreground'>
                        by {course.instructor.full_name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-2 lg:justify-end'>
                  <Link href={/courses/} target='_blank'>
                    <Button variant='outline' size='sm' className='gap-2'>
                      <Eye className='h-4 w-4' />
                      Preview
                    </Button>
                  </Link>
                  <Link href={/admin/courses//edit}>
                    <Button variant='outline' size='sm' className='gap-2'>
                      <Edit className='h-4 w-4' />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant='outline'
                    size='sm'
                    className='text-destructive hover:text-destructive hover:bg-destructive/10'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className='p-12 text-center'>
          <p className='text-muted-foreground mb-6'>
            {params.q ? 'No courses found matching your search.' : 'No courses yet. Create your first course to get started.'}
          </p>
          <Link href='/admin/courses/new'>
            <Button className='gap-2'>
              <Plus className='h-4 w-4' />
              Create Course
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

