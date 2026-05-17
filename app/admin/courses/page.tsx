import { getCourses as getCoursesAction, updateCourse, deleteCourse, approveCourse } from '@/lib/actions/admin/courses';
import { Level } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Plus, Search, Filter, Eye, EyeOff, MoreVertical, BookOpen } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; published?: string; level?: Level }>;
}) {
  const params = await searchParams;
  const courses = await getCoursesAction(params.category, params.published === 'true', params.level as Level, params.q);

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
            <Select name='level' defaultValue={params.level || 'all'}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Level' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Levels</SelectItem>
                {Object.values(Level).map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type='submit' variant='outline'>
              Apply
            </Button>
          </form>
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
                    <Badge variant={course.published ? 'default' : 'secondary'}>
                      {course.published ? (
                        <><Eye className='h-3 w-3 mr-1' /> Published</>
                      ) : (
                        <><EyeOff className='h-3 w-3 mr-1' /> Draft</>
                      )}
                    </Badge>
                    {course.category && (
                      <Badge variant='outline'>{course.category.name}</Badge>
                    )}
                    <Badge variant='outline' className='capitalize'>{course.level}</Badge>
                    <span className='text-sm text-muted-foreground'>
                      {course._count.enrollments} students
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-2 lg:justify-end'>
                  <Link href={`/courses/${course.slug}`} target='_blank'>
                    <Button variant='outline' size='sm' className='gap-2'>
                      <Eye className='h-4 w-4' />
                      Preview
                    </Button>
                  </Link>
                  <Link href={`/admin/courses/${course.slug}/edit`}>
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
          <BookOpen className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <p className='text-muted-foreground mb-6'>
            {params.q || params.published || params.level ? 'No courses found matching your filters.' : 'No courses yet. Create your first course to get started.'}
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

